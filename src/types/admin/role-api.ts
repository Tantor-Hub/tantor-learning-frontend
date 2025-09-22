export interface IRoleResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: {
      id: number;
      role: string;
      description: string;
    }[];
  };
}
