export interface WebSocketUser {
  id: string;
  uuid: string;
  email: string;
  fs_name: string;
  ls_name: string;
}

export interface WebSocketChatMessage {
  id: string;
  id_user_sender: string;
  id_user_receiver: string[];
  subject?: string;
  content?: string;
  reader: string[];
  status: "alive" | "archive" | "deleted";
  dontshowme: string[];
  piece_joint?: string[];
  createdAt: string;
  updatedAt: string;
  sender?: WebSocketUser;
}

export interface WebSocketChatReply {
  id: string;
  id_sender: string;
  id_chat: string;
  content: string;
  is_public: boolean;
  status: "alive" | "archive" | "deleted";
  createdAt: string;
  updatedAt: string;
  sender?: WebSocketUser;
}

export interface WebSocketMessage {
  type: "chat" | "reply";
  data: WebSocketChatMessage | WebSocketChatReply;
  sender?: WebSocketUser;
  is_private?: boolean;
}

export interface WebSocketEvents {
  // Client → Server Events
  join_chat: { chatId: string };
  leave_chat: { chatId: string };
  send_message: {
    id_user_receiver: string[];
    subject?: string;
    content?: string;
    piece_joint?: string[];
  };
  send_reply: {
    id_chat: string;
    content: string;
    is_public?: boolean;
  };
  mark_as_read: { chatId: string };
  get_online_users: void;

  // Server → Client Events
  connected: { user: WebSocketUser };
  error: { message: string };
  new_message: { data: WebSocketChatMessage; sender: WebSocketUser };
  message_sent: { data: WebSocketChatMessage };
  reply_received: { data: WebSocketChatReply; sender: WebSocketUser };
  reply_sent: { data: WebSocketChatReply };
  joined_chat: { chatId: string };
  left_chat: { chatId: string };
  message_read: { chatId: string; readBy: WebSocketUser };
  marked_as_read: { chatId: string };
  online_users: { users: string[] };
}

export interface WebSocketState {
  isConnected: boolean;
  socket: any | null;
  onlineUsers: string[];
  currentChatId: string | null;
  messages: WebSocketChatMessage[];
  replies: WebSocketChatReply[];
}
