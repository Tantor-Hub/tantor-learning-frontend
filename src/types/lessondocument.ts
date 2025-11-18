/*###############################################################################
######################### STUDENT ACCESS ########################################
#################################################################################*/

export interface ILessonDocument {
  id: string;
  file_name: string;
  piece_jointe: string;
  type: string;
  title: string;
  description: string;
  ispublish: boolean;
  id_lesson: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  download_url: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  lesson?: {
    id: string;
    title: string;
    description: string;
  };
}

export interface ILessonDocumentResponse {
  status: number;
  message: string;
  data: {
    lessondocuments: ILessonDocument[];
    total: number;
  };
}

export interface ILessonDocumentByIdResponse {
  status: number;
  message: string;
  data: ILessonDocument;
}
