export interface Attraction {
  id: number;
  name: string;
  description: string;
  cityID: number;
  virtualTourURL?: string;
  imageUrl? : string;
  city?: {
    id: number;
    name: string; // Dodaj sve potrebne atribute iz klase City ako je potrebno
  };
}
