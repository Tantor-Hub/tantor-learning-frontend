export interface ModuleDeFormation {
  id: string;
  description: string;
  piece_jointe: string;
}

export interface GetModulesResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: ModuleDeFormation[];
  };
}
