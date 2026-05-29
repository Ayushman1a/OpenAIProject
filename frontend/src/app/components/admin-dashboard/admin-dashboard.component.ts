import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TravelPackage } from '../../models/travel-package';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  packages: TravelPackage[] = [];
  loading = false;
  errorMessage = '';

  constructor(private packageService: PackageService, private router: Router) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.loading = true;
    this.packageService.findAll().subscribe({
      next: data => {
        this.packages = data;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = 'Unable to load packages. Please ensure the backend is running.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  addPackage(): void {
    this.router.navigate(['/packages/new']);
  }

  editPackage(pkg: TravelPackage): void {
    if (pkg.id) {
      this.router.navigate(['/packages', pkg.id, 'edit']);
    }
  }

  deletePackage(pkg: TravelPackage): void {
    if (!pkg.id || !confirm('Delete this travel package?')) {
      return;
    }

    this.packageService.delete(pkg.id).subscribe({
      next: () => this.loadPackages(),
      error: error => {
        this.errorMessage = 'Failed to delete the travel package.';
        console.error(error);
      }
    });
  }
}
