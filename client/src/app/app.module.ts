import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from "./app-routing.module";
import { FlashMessagesModule } from 'angular2-flash-messages'
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { InlineEditorModule } from 'ng2-inline-editor';
import { MomentModule } from 'angular2-moment';
import { TagInputModule } from 'ngx-chips';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {BarRatingModule} from 'ngx-bar-rating';
import {TagCloudModule} from 'angular-tag-cloud-module';

import { environment} from '../environments/environment';

import { UserService } from './services/user.service';
import { AuthService} from "./services/auth.service";
import { FanficService } from './services/fanfic.service';
import { CommentService } from './services/comment.service';

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
import { FanficEditorComponent } from './components/profile/fanfic/fanfic-editor/fanfic-editor.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { EditFanficComponent } from './components/profile/fanfic/fanfic-editor/edit-fanfic/edit-fanfic.component';
import { EditChapterComponent } from './components/profile/fanfic/fanfic-editor/edit-chapter/edit-chapter.component';
import { AddChapterComponent } from './components/profile/fanfic/fanfic-editor/add-chapter/add-chapter.component';
import { FanficPreviewComponent } from './components/home/fanfic-preview/fanfic-preview.component';
import { ReaderComponent } from './components/reader/reader.component';
import { ChapterReaderComponent } from './components/reader/chapter-reader/chapter-reader.component';
import { ChapterCommentsComponent } from './components/reader/chapter-comments/chapter-comments.component';

import { DeleteUserDialogComponent } from './components/admin/dashboard/delete-user-dialog/delete-user-dialog.component';
import { BlockUserDialogComponent } from './components/admin/dashboard/block-user-dialog/block-user-dialog.component';
import { RoleUserDialogComponent } from './components/admin/dashboard/role-user-dialog/role-user-dialog.component';

import { DropZoneDirective } from './directives/drop-zone.directive';
import { FileSizePipe } from './directives/file-size.pipe';

import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { AdminSerfGuard } from './guards/admin-serf.guard';

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
         MatChipsModule
        } from '@angular/material';
import {CloudTagsComponent} from './components/home/cloud-tags/cloud-tags.component';
import {SearchComponent} from './components/search/search.component';
import {SearchTagComponent} from './components/search-tag/search-tag.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

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
    FanficEditorComponent,
    AdminComponent,
    DashboardComponent,
    DeleteUserDialogComponent,
    BlockUserDialogComponent,
    RoleUserDialogComponent,
    EditFanficComponent,
    EditChapterComponent,
    AddChapterComponent,
    FanficPreviewComponent,
    ReaderComponent,
    ChapterReaderComponent,
    ChapterCommentsComponent,
    CloudTagsComponent,
    SearchComponent,
    SearchTagComponent,
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
    MatChipsModule,
    ScrollToModule.forRoot(),
    InlineEditorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
        }
    }),
    MomentModule,
    TagInputModule,
    BarRatingModule,
    TagCloudModule
  ],
  entryComponents: [
    DeleteUserDialogComponent,
    BlockUserDialogComponent,
    RoleUserDialogComponent,
  ],
  providers: [AuthService, FanficService, UserService, CommentService, AuthGuard, NotAuthGuard, AdminSerfGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
