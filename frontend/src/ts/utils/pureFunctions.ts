import {
  CurrentUserInfoModel,
  EditingMessage,
  MessageModel
} from '@/ts/types/model';

export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes < 1) { return '0 Byte'; }
  const power: number = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${Math.round(bytes / Math.pow(1024, power))} ${sizes[power]}`;
}

export function getChromeVersion () {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

  return raw ? parseInt(raw[2], 10) : false;
}

export function getStreamLog(m: MediaStream|null): MediaStream | string | null{
  if (!m) {
    return null;
  }
  if (!m.id) {
    return m;
  }
  return `sream:${m.id};${m.active? 'active' : 'inactive'};audio=${m.getAudioTracks().length};video=${m.getVideoTracks().length}`;
}

export function getTrackLog(m: MediaStreamTrack|null): MediaStreamTrack | string | null{
  if (!m) {
    return null;
  }
  if (!m.id) {
    return m;
  }
  return `track:${m.id};${(m as any).active ? 'active' : 'inactive'}`;
}

export function  extractError (args: unknown |unknown[]| {name: string}) {
  try {
    let value: { name: string; message: string; rawError: string } = args as { name: string; message: string; rawError: string };
    if (typeof args === 'string') {
      return args;
    } else if ((<unknown[]>args).length > 1) {
      return Array.prototype.join.call(args, ' ');
    } else if ((<unknown[]>args).length === 1) {
      value = (<unknown[]>args)[0] as { name: string; message: string; rawError: string };
    }
    if (value && (value.name || value.message)) {
      return `${value.name}: ${value.message}`;
    } else if (value.rawError) {
      return value.rawError;
    } else {
      return JSON.stringify(value);
    }
  } catch (e) {
    return `Error during parsing error ${e}, :(`;
  }
}

const ONE_DAY = 24 * 60 * 60 * 1000;

export function sem(
    event: Event,
    message: MessageModel,
    isEditingNow: boolean,
    userInfo: CurrentUserInfoModel,
    setEditedMessage: (a: EditingMessage) => void
) {
  if (event.target
      && (<HTMLElement>event.target).tagName !== 'IMG'
      && message.userId === userInfo.userId
      && !message.deleted
      && message.time + ONE_DAY > Date.now()
  ) {
    event.preventDefault();
    event.stopPropagation();
    const newlet: EditingMessage = {
      messageId: message.id,
      isEditingNow,
      roomId: message.roomId
    };
    setEditedMessage(newlet);
  }
}

export function bounce(ms: number): (cb: Function) => void {
  let stack: number | null;
  let lastCall: Function;

  return function(cb) {
    lastCall = cb;
    if (!stack) {
      stack = window.setTimeout(() => {
        stack = null;
        lastCall();
      },ms);
    }
  };
}

export function getDay(dateObj: Date) {
  const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  return `${year}/${month}/${day}`;
}