export interface ModuleDeFormation {
  id: string;
  description: string;
  piece_jointe: string;
}

export interface GetModulesResponse {
  length: number;
  rows: ModuleDeFormation[];
}
