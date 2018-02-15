import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule} from '@angular/forms';
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

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService} from "./services/auth.service";
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard} from './guards/auth.guard';
import { NotAuthGuard} from './guards/notAuth.guard';
import { FanficComponent } from './components/profile/fanfic/fanfic.component';
import { UserInfoComponent } from './components/profile/user-info/user-info.component';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileSizePipe } from './directives/file-size.pipe';
import { FanficService } from './services/fanfic.service';
import { NewFanficComponent } from './components/new-fanfic/new-fanfic.component';
import { EditFanficComponent } from './components/edit-fanfic/edit-fanfic.component';
import { AddFanficDialogComponent } from './components/profile/fanfic/add-fanfic-dialog/add-fanfic-dialog.component';

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
    AddFanficDialogComponent,
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
    AddFanficDialogComponent,
  ],
  providers: [AuthService, FanficService, AuthGuard, NotAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
