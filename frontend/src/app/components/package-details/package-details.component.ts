import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelPackage } from '../../models/travel-package';
import { PackageService } from '../../services/package.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css']
})
export class PackageDetailsComponent implements OnInit {
  travelPackage?: TravelPackage;
  errorMessage = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPackage(id);
    }
  }

  private loadPackage(id: number): void {
    this.loading = true;
    this.packageService.findById(id).subscribe({
      next: pkg => {
        this.travelPackage = pkg;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = 'Could not load package details.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  bookNow(): void {
    if (!this.travelPackage?.id) {
      return;
    }
    this.router.navigate(['/packages', this.travelPackage.id, 'book']);
  }
}
