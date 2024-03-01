export interface MessageType {
  message: string;
  participants: [{ user: string }, { user: string }]
  room: string,
  parent: string,
  created_at: Date;
  modified_at: Date;
}

export interface NotificationType {
  user: string
  type: string,
  message: string,
}

export interface UserType {
  id: string;
  username: string;
  room: string;
}

export interface User {
  _id: string,
  email: string,
  name: string,
  username: string,
  followers_count: number,
  following_count: number,
  created_at: string,
  modified_at: string
}
