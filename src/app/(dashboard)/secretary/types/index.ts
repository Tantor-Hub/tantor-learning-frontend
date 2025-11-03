export interface Schedule {
  time: string;
  title: string;
  location: string;
}

export interface SecDocData {
  id: string;
  name: string;
  date: string;
  action: string;
  sessionTitle: string;
  nbPlaces: number | undefined;
  availablePlaces: number | undefined;
}

export interface SecDocsData {
  refusedpayment: SecDocData[];
  notpaid: SecDocData[];
  pending: SecDocData[];
  in: SecDocData[];
  out: SecDocData[];
}
