import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageListComponent } from './components/package-list/package-list.component';
import { PackageFormComponent } from './components/package-form/package-form.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PackageDetailsComponent } from './components/package-details/package-details.component';
import { PackageBookingComponent } from './components/package-booking/package-booking.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'packages/new', component: PackageFormComponent, canActivate: [AdminGuard] },
  { path: 'packages/:id/edit', component: PackageFormComponent, canActivate: [AdminGuard] },
  { path: 'packages/:id/book', component: PackageBookingComponent, canActivate: [UserGuard] },
  { path: 'packages/:id', component: PackageDetailsComponent },
  { path: 'bookings', component: BookingHistoryComponent, canActivate: [UserGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'dashboard', component: UserDashboardComponent, canActivate: [UserGuard] },
  { path: '', component: PackageListComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
