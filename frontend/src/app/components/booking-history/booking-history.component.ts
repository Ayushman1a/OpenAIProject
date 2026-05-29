import { Component, OnInit } from '@angular/core';
import { Booking } from '../../models/booking';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  errorMessage = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getMyBookings().subscribe({
      next: bookings => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = 'Unable to load your bookings.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  cancelBooking(booking: Booking): void {
    if (!booking.id || booking.status === 'CANCELLED') {
      return;
    }

    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    this.bookingService.cancelBooking(booking.id).subscribe({
      next: updatedBooking => {
        const index = this.bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          this.bookings[index] = updatedBooking;
        }
      },
      error: error => {
        this.errorMessage = 'Could not cancel booking. Please try again.';
        console.error(error);
      }
    });
  }
}
