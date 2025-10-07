export interface Offer {
  id: number;
  offerName: string; // Promijenjeno iz 'name' u 'offerName'
  description: string;
  price: number;
  touristAgencyId: number;
  touristAgency?: any; // Ostavljen kao `any` dok se ne definiše struktura
  categoryID?: any;
  category?: any;
  status?: string;
  imageUrl?: string;
}
