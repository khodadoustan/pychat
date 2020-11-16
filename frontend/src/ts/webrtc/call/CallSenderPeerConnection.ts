import WsHandler from '@/ts/message_handlers/WsHandler';
import CallPeerConnection from '@/ts/webrtc/call/CallPeerConnection';
import { DefaultStore } from '@/ts/classes/DefaultStore';
import {
  HandlerType,
  HandlerTypes
} from "@/ts/types/messages/baseMessagesInterfaces";
import { ConnectToRemoteMessage } from "@/ts/types/messages/innerMessages";

export default class CallSenderPeerConnection extends CallPeerConnection {

  protected connectedToRemote: boolean = false;

  protected readonly handlers: HandlerTypes<keyof CallSenderPeerConnection, 'peerConnection:*'> = {
    destroy: this.destroy,
    streamChanged:  <HandlerType<'streamChanged', 'peerConnection:*'>>this.streamChanged,
    connectToRemote:  <HandlerType<'connectToRemote', 'peerConnection:*'>>this.connectToRemote,
    sendRtcData:  <HandlerType<'sendRtcData', 'peerConnection:*'>>this.sendRtcData
  };

  constructor(roomId: number, connId: string, opponentWsId: string, userId: number, wsHandler: WsHandler, store: DefaultStore) {
    super(roomId, connId, opponentWsId, userId, wsHandler, store);
    this.connectedToRemote = false;
    this.sdpConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      }
    };
  }

  public channelOpen () {
    this.logger.log('Opened a new chanel')();
  }

  public async connectToRemote(stream: ConnectToRemoteMessage) {
    this.logger.log('Connect to remote')();
    this.connectedToRemote = true;
    this.createPeerConnection(stream);
    await this.createOffer();
  }

  public ondatachannelclose(text: string): void {
  }

}
