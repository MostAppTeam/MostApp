export interface AttractionOption {
  optionType: string;
  optionValue: string;
}

export interface Attraction {
  id: number;
  name: string;
  description: string;
  cityID: number;
  virtualTourURL?: string;
  imageUrl? : string;
  isPaid: boolean;
  options?: AttractionOption[];
  city?: {
    id: number;
    name: string;
  };
  category?: string;

}
