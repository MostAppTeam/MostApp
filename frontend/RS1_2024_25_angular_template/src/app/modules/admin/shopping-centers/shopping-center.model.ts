export interface ShoppingCenter {
  id: number;
  name: string;
  address: string;
  workingHours: string;
  openingTime: string;
  closingTime: string;
  cityID: number;
  city?: any; // Ostavljen kao `any` dok se ne definiše struktura
}
