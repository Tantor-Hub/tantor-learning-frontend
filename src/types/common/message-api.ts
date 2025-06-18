// CREATE A MESSAGE REQUEST

export interface ICreateMessageRequest {
  subject: string;
  content: string;
  piece_jointe?: File;
  id_user_receiver: string; /// pour quoi c'est id alors que tout le monde doit voir c'est msg
  is_replied_to?: string; // soit id of a replied msg
  thread?: string; // another unknown value
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
    list: IMessage[];
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
    piece_jointe: string | null;
    is_readed: number;
    is_replied_to: number;
    thread: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    Sender: {
      id: number;
      fs_name: string;
      ls_name: string;
      nick_name: string;
      email: string;
      phone: string;
    };
    Receiver: {
      id: number;
      fs_name: string;
      ls_name: string;
      nick_name: string;
      email: string;
      phone: string;
    };
  };
}

// SINGLE MESSAGE INTERFACE

export interface IMessageRequest {
  id?: string;
  group?: string;
}

export interface IMessage {
  id: number;
  id_user_sender: number;
  id_user_receiver: number;
  subject: string;
  content: string;
  date_d_envoie: string;
  date_de_lecture: string | null;
  piece_jointe: string | null;
  is_readed: number;
  is_replied_to: number;
  thread: string;
  status: number;
  Sender: {
    id: number;
    fs_name: string;
    ls_name: string;
    nick_name: string;
    email: string;
    phone: string;
  };
  Receiver: {
    id: number;
    fs_name: string;
    ls_name: string;
    nick_name: string;
    email: string;
    phone: string;
  };
}
