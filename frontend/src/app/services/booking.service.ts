import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly baseUrl = '/api/bookings';

  constructor(private http: HttpClient) {}

  bookPackage(payload: { packageId: number; travelDate: string; travelerCount: number; contactPhone: string }): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, payload);
  }

  cancelBooking(bookingId: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/${bookingId}/cancel`, {});
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/my`);
  }
}
