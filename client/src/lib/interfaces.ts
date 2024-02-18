export interface MessageType {
  message: string;
  username: string;
  __createdtime__: Date;
}

export interface UserType {
  id: string;
  username: string;
  room: string;
}
