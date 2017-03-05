export const DEFAULT_PICTURE_URL = '/assets/default-profile-pic.svg';

export interface Profile {
  name?: string;
  picture?: string;
}


export enum MessageType {
  TEXT = <any>'text'
}

export interface Idea {
  _id?: string;
  title?: string;
  picture?: string;
  lastMessage?: Message;
}

export interface Message {
  _id?: string;
  ideaId?: string;
  senderId?: string;
  content?: string;
  createdAt?: Date;
  ownership?: string;
  type?: MessageType
}
