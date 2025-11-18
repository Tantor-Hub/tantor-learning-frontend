// CREATE A MESSAGE REQUEST

export interface ICreateMessageRequest {
  subject?: string;
  content: string;
  piece_jointe?: string[];
  id_user_receiver: string[]; /// pour quoi c'est id alors que tout le monde doit voir c'est msg
  is_replied_to?: string; // soit id of a replied msg
  thread?: string; // another unknown value
}

// UPDATE MESSAGE REQUEST

export interface IUpdateMessageRequest {
  id: string;
  subject: string;
  content: string;
  reader: string[];
  status: string;
  dontshowme: string[];
  piece_joint: string[];
}

//  CREATE MESSAGE RESPONSE

export interface ICreateMessageResponse {
  status: number;
  message: string;
  data: {
    id: number;
    subject: string;
    content: string;
    thread: string;
    status: number;
    is_replied_to: number;
    is_readed: number;
    date_d_envoie: string;
    date_de_lecture: string | null;
    id_user_sender: number;
    id_user_receiver: number;
    piece_jointe: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

// GET ALL MESSAGES RESPONSE

export interface IGetAllMessagesResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: IMessage[];
  };
}

// GET MESSAGE BY ID RESPONSE

export interface IGetMessageByIdResponse {
  status: number;
  message: string;
  data: {
    id: number;
    id_user_sender: number;
    id_user_receiver: number;
    subject: string;
    content: string;
    date_d_envoie: string;
    date_de_lecture: string | null;
    piece_jointe: any | null;
    piece_joint: string[];
    is_readed: number;
    is_replied_to: number;
    thread: string;
    status: number;
    is_deletedto: number[];
    is_archievedto: any[];
    createdAt: string;
    updatedAt: string;
    isTransferred: boolean;
    transferSender?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string | null;
    };
    transferId?: string;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string | null;
    };
    Receiver: {
      id: number;
      firstName: string;
      lastName: string;
      nick_name: string;
      email: string;
      phone: string;
      roles: Array<{
        role: string;
      }>;
      avatar: string | null;
    };
    Thread: Array<{
      id: number;
      id_user_sender: number;
      id_user_receiver: number;
      subject: string;
      content: string;
      date_d_envoie: string;
      date_de_lecture: string | null;
      piece_jointe: any | null;
      is_readed: number;
      is_replied_to: number;
      thread: string;
      status: number;
      is_deletedto: number[];
      is_archievedto: any[];
      createdAt: string;
      updatedAt: string;
      Sender: {
        id: number;
        firstName: string;
        lastName: string;
        nick_name: string;
        email: string;
        phone: string;
        roles: Array<{
          role: string;
        }>;
        avatar: string | null;
      };
      Receiver: {
        id: number;
        firstName: string;
        lastName: string;
        nick_name: string;
        email: string;
        phone: string;
        roles: Array<{
          role: string;
        }>;
        avatar: string | null;
      };
    }>;
  };
}

// SINGLE MESSAGE INTERFACE

export interface IMessageRequest {
  id?: string;
  group?: string;
}

export interface IMessage {
  id: string;
  id_user_sender: string;
  id_user_receiver: string[];
  subject: string;
  content: string;
  isOpened: boolean;
  role: string;
  status: string;
  dontshowme: string[];
  piece_joint: string[];
  createdAt: string;
  updatedAt: string;
  isTransferred: boolean;
  transferSender?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  transferId?: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  receivers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  }>;
}

// TREAD

export interface IListChatTreadResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: Array<{
      id: string;
      content: string;
      id_sender: string;
      id_chat: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      sender: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }>;
  };
}

// GET TRANSFER CHAT REPLIES RESPONSE

export interface IGetTransferChatRepliesResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: Array<{
      id: string;
      content: string;
      id_sender: string;
      id_chat: string | null;
      id_transferechat: string;
      status: string;
      is_public: boolean;
      createdAt: string;
      updatedAt: string;
      sender: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }>;
  };
}

// CREATE REPLY REQUEST

export interface ICreateReplyRequest {
  content: string;
  id_chat?: string;
  id_transferechat?: string;
  is_public: boolean;
}

// GET CHAT TRANSFER BY ID RESPONSE

export interface IGetChatTransferByIdResponse {
  status: number;
  message: string;
  data: {
    id: string;
    id_chat: string;
    sender: string;
    receivers: string[];
    reader: string[];
    dontshowme: string[];
    isOpened: boolean;
    chat: {
      subject: string;
      content: string;
      piece_joint: string[];
      sender: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string | null;
      };
      createdAt: string;
      updatedAt: string;
    };
    senderUser: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string | null;
    };
    createdAt: string;
    updatedAt: string;
  };
}
