import { Component, NgZone, OnInit, OnDestroy, EventEmitter, Output } from "@angular/core";
import { Item } from "../models/item.model";
import { ShareButtons } from "@ngx-share/core";
import { Meta } from "@angular/platform-browser";
import { BookmarkService } from "../services/bookmark.service";
import { Bookmark } from "../models/bookmark.model";
import { Video } from "../models/video.model";
import { AuthService } from "../services/auth.service";

import { MatSnackBar, MatSnackBarConfig } from "@angular/material";
import { Router } from "@angular/router";
declare let gtag
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit, OnDestroy {
  visibility: Boolean = false;
  item: Item;
  video: Video;
  location: Number;
  isShowProductWebsite: boolean = false;

  @Output() isShowProductWebsiteOutput = new EventEmitter<any>()
  constructor(
    private meta: Meta,
    private bookmarkService: BookmarkService,
    private authService: AuthService,
    public share: ShareButtons,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() { }

  show(item, video, location) {
    this.item = item;
    this.video = video;
    this.location = location;
    this.meta.addTags([
      { property: "og:url", content: item.moreUrl },
      { property: "og:title", content: item.title },
      { property: "og:type", content: "website" },
      { property: "og:description", content: item.description },
      { property: "og:image", content: item.thumbnail }
    ]);
    this.visibility = true;
  }

  showProductWebsite() {
    this.isShowProductWebsite = true;
    this.isShowProductWebsiteOutput.emit(this.isShowProductWebsite)
    if (this.item.moreUrl == "") {
      this.router.navigate(["/post/" + this.item.id])
    } else {
      location.href = this.item.moreUrl;
    }
  }

  addBookmark() {
    this.hide()

    if (this.authService.isAuthenticated()) {
      let config = new MatSnackBarConfig;
      config.duration = 2000;
      let snackBarRef = this.snackBar.open("Bookmark Added", null, config);

      this.bookmarkService
        .addBookmark(
          new Bookmark(
            '',
            {
              id: this.video.id,
              title: this.video.title
            },
            {
              id: this.item.id,
              title: this.item.title,
              descriptrion: this.item.description,
              subtitle: null
            },
            this.location,
            AuthService.user.id,
            new Date(),
            null
          )
        )
        .subscribe(res => {

        }, console.error);
    } else {
      this.router.navigate(['/login'])
    }
  }

  hide() {
    this.visibility = false;
  }
  ngOnDestroy() {
    this.isShowProductWebsite = false;
  }
}

