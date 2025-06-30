export interface IAddMatiere {
  id_cours: number;
  content: {
    chapitre: string;
    paragraphes: string[];
  }[];
}
