import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TravelPackage } from '../../models/travel-package';
import { PackageService } from '../../services/package.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {
  packages: TravelPackage[] = [];
  searchTerm = '';
  errorMessage = '';
  loading = false;

  constructor(
    private service: PackageService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  get filteredPackages(): TravelPackage[] {
    const filter = this.searchTerm.toLowerCase().trim();
    if (!filter) {
      return this.packages;
    }
    return this.packages.filter(pkg =>
      pkg.title.toLowerCase().includes(filter) ||
      pkg.destination.toLowerCase().includes(filter) ||
      pkg.description.toLowerCase().includes(filter)
    );
  }

  loadPackages(): void {
    this.loading = true;
    this.service.findAll().subscribe({
      next: packages => {
        this.packages = packages;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = 'Could not load travel packages. Please ensure the backend is running.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  createPackage(): void {
    this.router.navigate(['/packages/new']);
  }

  viewPackage(pkg: TravelPackage): void {
    if (pkg.id) {
      this.router.navigate(['/packages', pkg.id]);
    }
  }

  bookPackage(pkg: TravelPackage): void {
    if (pkg.id) {
      this.router.navigate(['/packages', pkg.id, 'book']);
    }
  }

  editPackage(pkg: TravelPackage): void {
    this.router.navigate(['/packages', pkg.id, 'edit']);
  }

  deletePackage(pkg: TravelPackage): void {
    if (!pkg.id || !confirm('Delete this travel package?')) {
      return;
    }
    this.service.delete(pkg.id).subscribe({
      next: () => this.loadPackages(),
      error: error => {
        this.errorMessage = 'Failed to delete the travel package.';
        console.error(error);
      }
    });
  }
}
