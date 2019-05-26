import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";

import { RedirectService } from "./services/redirect.service";
import { RestrictService } from "./services/restrict.service";
import { RoleGuard } from "./guards/role.guard";

import { BookmarkService } from "./services/bookmark.service";
import { VideoService } from "./services/video.service";
import { VideosComponent } from "./videos/videos.component";
import { VideoComponent } from "./video/video.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule, BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatSnackBarModule,
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatBadgeModule,
  MatTableModule,
  MatSortModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule
} from "@angular/material";
import { MatGridListModule } from "@angular/material/grid-list";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ShareModule } from "@ngx-share/core";
import { HomeComponent } from "./home/home.component";
import { BookmarksComponent } from "./bookmarks/bookmarks.component";
import { AuthService } from "./services/auth.service";
import { UserResolver } from "./services/user.resolver";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from "angularfire2/auth";
import { environment } from "../environments/environment";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from './register/register.component';
import { UnverifiedComponent } from './unverified/unverified.component';
import { VerifiedService } from "./services/verified.service";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireStorageModule } from "angularfire2/storage";
import { ItemsComponent } from './items/items.component';
import { ErrorComponent } from './error/error.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SidebarAddTagComponent } from './sidebar-add-tag/sidebar-add-tag.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [
  {
    path: "post/:itemid",
    component: PostComponent,
    // canActivate: [RestrictService, RoleGuard],
    resolve: { user: UserResolver }
  },
  {
    path: "items",
    component: ItemsComponent,
    canActivate: [RestrictService, RoleGuard],
    resolve: { user: UserResolver }
  }, 
  {
    path: "dashboard/:idvideo",
    component: DashboardComponent,
    canActivate: [RestrictService],
    resolve: { user: UserResolver }
  }, 
  {
    path: "unverified",
    component: UnverifiedComponent,
    canActivate: [VerifiedService],
    resolve: { user: UserResolver }
  },
  {
    path: "bookmarks",
    component: BookmarksComponent,
    canActivate: [RestrictService],
    resolve: { user: UserResolver }
  },
  { path: "login", component: LoginComponent, canActivate: [RedirectService], resolve: { user: UserResolver } },
  { path: "register", component: RegisterComponent, canActivate: [RedirectService], resolve: { user: UserResolver } },
  { path: "", component: HomeComponent, resolve: { user: UserResolver } },
  {
    path: "videos",
    component: VideosComponent,
    resolve: { user: UserResolver }
  },
  {
    path: "video/:id",
    component: VideoComponent,
    resolve: { user: UserResolver }
  },
  {
    path: "**",
    component: ErrorComponent,
    resolve: { user: UserResolver }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    BookmarksComponent,
    ErrorComponent,
    HomeComponent,
    ItemsComponent,
    LoginComponent,
    RegisterComponent,
    SidebarComponent,
    VideosComponent,
    VideoComponent,
    UnverifiedComponent,
    SidebarAddTagComponent,
    DashboardComponent,
    PostComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatBadgeModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    DragDropModule,
    RouterModule.forRoot(routes),
    ShareModule.forRoot({
      options: {
        include: ["facebook", "email", "google"],
        autoSetMeta: true
      }
    })
  ],
  providers: [
    AuthService,
    BookmarkService,
    RedirectService,
    RestrictService,
    RoleGuard,
    VerifiedService,
    VideoService,
    UserResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
