/**
 * This file only contains messages that sent to backend api. FE -> BE by websockets
 */

import {
  DefaultMessage
} from '@/ts/types/messages/baseMessagesInterfaces';

export interface DefaultWsOutMessage<A extends string> extends DefaultMessage<A> {
  cbId?: number;
}