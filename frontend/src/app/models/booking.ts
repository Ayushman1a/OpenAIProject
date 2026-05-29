import { TravelPackage } from './travel-package';

export interface Booking {
  id: number;
  travelPackage: TravelPackage;
  status: string;
  bookedOn: string;
  travelDate: string;
  travelerCount: number;
  contactPhone: string;
  totalPrice: number;
}
