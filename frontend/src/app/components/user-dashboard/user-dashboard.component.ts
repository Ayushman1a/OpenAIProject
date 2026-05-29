import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from '../../models/booking';
import { TravelPackage } from '../../models/travel-package';
import { BookingService } from '../../services/booking.service';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  packages: TravelPackage[] = [];
  bookings: Booking[] = [];
  loadingPackages = false;
  loadingBookings = false;
  errorMessage = '';

  constructor(
    private packageService: PackageService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPackages();
    this.loadBookings();
  }

  private loadPackages(): void {
    this.loadingPackages = true;
    this.packageService.findAll().subscribe({
      next: data => {
        this.packages = data;
        this.loadingPackages = false;
      },
      error: error => {
        this.errorMessage = 'Unable to load travel packages. Please ensure the backend is running.';
        console.error(error);
        this.loadingPackages = false;
      }
    });
  }

  private loadBookings(): void {
    this.loadingBookings = true;
    this.bookingService.getMyBookings().subscribe({
      next: data => {
        this.bookings = data;
        this.loadingBookings = false;
      },
      error: error => {
        this.errorMessage = 'Unable to load your bookings.';
        console.error(error);
        this.loadingBookings = false;
      }
    });
  }

  bookPackage(pkg: TravelPackage): void {
    if (pkg.id) {
      this.router.navigate(['/packages', pkg.id, 'book']);
    }
  }

  cancelBooking(bookingId: number): void {
    if (!confirm('Cancel this booking?')) {
      return;
    }
    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => this.loadBookings(),
      error: error => {
        this.errorMessage = 'Unable to cancel the booking.';
        console.error(error);
      }
    });
  }
}
