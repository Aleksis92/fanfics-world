import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { HomeComponent } from "./components/home/home.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { FanficComponent } from './components/profile/fanfic/fanfic.component';
import { UserInfoComponent } from './components/profile/user-info/user-info.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AdminSerfGuard } from './guards/admin-serf.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'login/:token',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Admin', 'User']},
    children: [
      {path: 'fanfic', component: FanficComponent, canActivate: [AuthGuard], data: {roles: ['Admin', 'User']}},
      {path: 'info', component: UserInfoComponent, canActivate: [AuthGuard], data: {roles: ['Admin', 'User']}},
      {path: 'fanfic/:_id', component: FanficComponent, canActivate: [AdminSerfGuard], data: {roles: ['Admin']}},
      {path: 'info/:_id', component: UserInfoComponent, canActivate: [AdminSerfGuard], data: {roles: ['Admin']}},
    ]
  },
  {
    path: 'upload',
    component: FileUploadComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Admin', 'User']},
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Admin']},
    children: [
      {path: 'dashboard', component: DashboardComponent},
    ]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }
