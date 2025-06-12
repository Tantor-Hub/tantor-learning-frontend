export interface IAddSessionRequest {
  id_formation: string; // required
  descripiton: string;
  date_session_debut: string; //2025-04-23T08:00:00
  date_session_fin: string; // 2025-05-23T17:30:00
  prix: string;
  type_formation: string;
}

export interface IUpdateSessionRequest {
  id_formation: number; // required
  descripiton: string;
  date_session_debut: string; //2025-04-23T08:00:00
  date_session_fin: string; // 2025-05-23T17:30:00
  prix: number;
  type_formation: string;
}
