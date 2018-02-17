import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule} from "./app-routing.module";
import { FlashMessagesModule } from 'angular2-flash-messages'
import { FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import { AngularFireModule} from 'angularfire2';
import { AngularFirestoreModule} from 'angularfire2/firestore';
import { AngularFireStorageModule} from 'angularfire2/storage';
import { AngularFireAuthModule} from 'angularfire2/auth';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { environment} from '../environments/environment';

import { UserService } from './services/user.service';
import { AuthService} from "./services/auth.service";
import { FanficService } from './services/fanfic.service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FanficComponent } from './components/profile/fanfic/fanfic.component';
import { UserInfoComponent } from './components/profile/user-info/user-info.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { NewFanficComponent } from './components/profile/fanfic/new-fanfic/new-fanfic.component';
import { EditFanficComponent } from './components/profile/fanfic/edit-fanfic/edit-fanfic.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';

import { DeleteUserDialogComponent } from './components/admin/dashboard/delete-user-dialog/delete-user-dialog.component';
import { BlockUserDialogComponent } from './components/admin/dashboard/block-user-dialog/block-user-dialog.component';
import { RoleUserDialogComponent } from './components/admin/dashboard/role-user-dialog/role-user-dialog.component';

import { DropZoneDirective } from './directives/drop-zone.directive';
import { FileSizePipe } from './directives/file-size.pipe';

import { AuthGuard} from './guards/auth.guard';
import { NotAuthGuard} from './guards/notAuth.guard';

import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule,
         MatPaginatorModule,
         MatSortModule,
         MatInputModule,
         MatFormFieldModule,
         MatCheckboxModule,
         MatSelectModule,
         MatIconModule,
         MatToolbarModule,
         MatButtonModule,
         MatDialogModule,
        } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    FanficComponent,
    UserInfoComponent,
    DropZoneDirective,
    FileUploadComponent,
    FileSizePipe,
    NewFanficComponent,
    EditFanficComponent,
    AdminComponent,
    DashboardComponent,
    DeleteUserDialogComponent,
    BlockUserDialogComponent,
    RoleUserDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    FlashMessagesModule.forRoot(),
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    CdkTableModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    ScrollToModule.forRoot()
  ],
  entryComponents: [
    DeleteUserDialogComponent,
    BlockUserDialogComponent,
    RoleUserDialogComponent,
  ],
  providers: [AuthService, FanficService, UserService, AuthGuard, NotAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
