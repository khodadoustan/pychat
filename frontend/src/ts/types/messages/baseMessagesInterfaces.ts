/**
 * This file should only contain interfaces that is used in this package (messages) by other interfaces
 */
import {
  ChannelDto,
  RoomDto,
  UserDto
} from "@/ts/types/dto";


export interface ChangeUserOnlineBase extends UserDto {
  content: Record<number, string[]>;
  time: number;
}

// any means that every every registered subscriber will be called with this handler if it exists
// this means, that handler that registered this event will be called
// void means that no handlers should process this signal
export type HandlerName = 'router' | 'channels' | 'lan' | 'message' | 'webrtc' | 'ws'| 'void' |'this' | 'any' | 'call' | 'webrtcTransfer:*' | 'peerConnection:*';
export type CallHandlerName = HandlerName | 'dummyCall';

export type HandlerType<A extends string, H extends HandlerName> = (a: DefaultInMessage<A, H | 'any'>) => void|Promise<void>;

export type HandlerTypes<K extends string, H extends HandlerName> = {
  [Key in K]?: HandlerType<Key, H>
};

export interface AcceptFileContent {
  received: number;
}

export interface ReplyWebRtc extends WebRtcDefaultMessage, OpponentWsId {
  content: BrowserBase;
  userId: number;
}

export interface NewRoom {
  inviterUserId: number;
  time: number;
}

export interface RoomExistedBefore {
  inviteeUserId: number[];
}

export interface AddRoomBase extends NewRoom,  Omit<ChannelDto, 'channelId'>, RoomDto {
}

export interface OpponentWsId {
  opponentWsId: string;
}

export interface WebRtcDefaultMessage  {
  connId: string;
}

export interface OfferFileContent extends BrowserBase {
  size: number;
  name: string;
}

export interface BrowserBase {
  browser: string;
}

export interface DefaultMessage<A extends string> {
  action: A;
}

export interface DefaultInMessage<A extends string, H extends HandlerName> extends DefaultMessage <A> {
  handler: H;
}
export type CallStatus = 'not_inited'|'sent_offer'| 'received_offer' | 'accepted';