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
  download_url: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
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
