export interface ResponseWrapper<T> {
  data: T;
  messages: Message[];
}

export interface Message {
  message: string;
  messageType: string;
}