import { DefaultStore } from '@/ts/classes/DefaultStore';
import WebRtcApi from '@/ts/webrtc/WebRtcApi';
import {
  IStorage,
  MessageSender
} from '@/ts/types/types';
import ChannelsHandler from '@/ts/message_handlers/ChannelsHandler';

export class MessageSenderProxy {

  private readonly store: DefaultStore;
  private readonly webrtcApi: WebRtcApi;
  private readonly channelsHandler: ChannelsHandler;


  constructor(
      store: DefaultStore,
      webrtcApi: WebRtcApi,
      channelsHandler: ChannelsHandler
  ) {
    this.store = store;
    this.webrtcApi = webrtcApi;
    this.channelsHandler = channelsHandler;
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  // uniqueMessages is also used in abstract Processsor, but here it's negative numbers only
  // and in another place is positive, so they don't intersect
  getUniqueNegativeMessageId(): number {
    const ID_RANGE = 1_000_000_000;
    let myId: number = this.store.myId! ?? this.getRandomInt(1000);
    if (myId > 1000) {
      myId = myId % 1000;
    }
    return - (this.getRandomInt(ID_RANGE)  + myId * ID_RANGE);
  }


  getMessageSender(roomId: number): MessageSender {
    if (this.store.roomsDict[roomId].p2p) {
      return this.webrtcApi.getMessageHandler(roomId);
    } else {
      return this.channelsHandler;
    }
  }

}