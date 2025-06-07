export interface IListPlanning {
  status: number;
  message: string;
  data: {
    length: number;
    list: {
      id: number;
      titre: string;
      description: string;
      type: string;
      id_cibling: number | null;
      createdBy: number;
      timeline: string[];
      status: number;
      createdAt: string;
      updatedAt: string;
      Createdby: {
        id: number;
        fs_name: string;
        ls_name: string;
      };
    }[];
  };
}
