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
  content?: string;
  createdAt?: Date;
  type?: MessageType
}
