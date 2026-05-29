import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { PackageService } from '../../services/package.service';
import { TravelPackage } from '../../models/travel-package';

@Component({
  selector: 'app-package-booking',
  templateUrl: './package-booking.component.html',
  styleUrls: ['./package-booking.component.css']
})
export class PackageBookingComponent implements OnInit {
  travelPackage?: TravelPackage;
  bookingForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    private bookingService: BookingService
  ) {
    this.bookingForm = this.fb.group({
      travelDate: [null, Validators.required],
      travelerCount: [1, [Validators.required, Validators.min(1)]],
      contactPhone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPackage(id);
    }
  }

  private loadPackage(id: number): void {
    this.packageService.findById(id).subscribe({
      next: travelPackage => this.travelPackage = travelPackage,
      error: error => {
        this.errorMessage = 'Unable to load package. Please try again.';
        console.error(error);
      }
    });
  }

  get totalPrice(): number {
    return this.travelPackage ? this.travelPackage.price * this.bookingForm.value.travelerCount : 0;
  }

  onSubmit(): void {
    if (!this.travelPackage) {
      return;
    }

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      packageId: this.travelPackage.id as number,
      travelDate: this.bookingForm.value.travelDate,
      travelerCount: this.bookingForm.value.travelerCount,
      contactPhone: this.bookingForm.value.contactPhone
    };

    this.bookingService.bookPackage(payload).subscribe({
      next: () => {
        this.successMessage = 'Your booking is confirmed! A confirmation message has been sent to your account.';
        this.loading = false;
      },
      error: error => {
        this.errorMessage = 'Booking failed. Please review your details and try again.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/packages', this.travelPackage?.id]);
  }
}
