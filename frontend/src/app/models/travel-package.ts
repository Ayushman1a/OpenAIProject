export interface TravelPackage {
  id?: number;
  title: string;
  destination: string;
  price: number;
  description: string;
  imageUrl?: string;
  durationDays?: number;
  availableSeats?: number;
  highlights?: string;
}
