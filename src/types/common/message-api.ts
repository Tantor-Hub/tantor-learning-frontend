// CREATE A MESSAGE REQUEST

export interface ICreateMessageRequest {
  subject?: string;
  content: string;
  piece_jointe?: string[];
  id_user_receiver: string[]; /// pour quoi c'est id alors que tout le monde doit voir c'est msg
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
  reader: string[];
  status: string;
  dontshowme: string[];
  piece_joint: string[];
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// TREAD

export interface IListChatTreadResponse {
  status: number;
  message: string;
  data: {
    length: number;
    list: Array<{
      id: number;
      id_user_sender: number;
      id_user_receiver: number;
      subject: string;
      content: string;
      date_d_envoie: string;
      date_de_lecture: string | null;
      piece_jointe: any | null; // Replace 'any' with a more specific type if you know the structure of attachments
      is_readed: number;
      is_replied_to: number;
      thread: string;
      status: number;
      is_deletedto: any[]; // Replace 'any' with a more specific type if needed
      is_archievedto: any[]; // Replace 'any' with a more specific type if needed
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
      };
    }>;
  };
}
