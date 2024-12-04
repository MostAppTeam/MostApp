export interface Attraction {
  id: number;
  name: string;
  description: string;
  cityID: number;
  virtualTourURL?: string; // Ova stavka je opcionalna
  city?: {
    id: number;
    name: string; // Dodaj sve potrebne atribute iz klase City ako je potrebno
  };
}
