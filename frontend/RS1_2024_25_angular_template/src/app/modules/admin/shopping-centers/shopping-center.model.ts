export interface ShoppingCenter {
  id: number;
  name: string;
  address: string;
  workingHours: string;
  openingTime: string;   // ISO string (DateTime)
  closingTime: string;   // ISO string (DateTime)
  cityID: number;
  city?: any;
  imageUrl?: string;
}
