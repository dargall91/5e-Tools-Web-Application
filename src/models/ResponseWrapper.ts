export interface ResponseWrapper<T> {
  data: T | null;
  messages: Message[] | null;
}

export interface Message {
  message: string;
  messageType: string;
}