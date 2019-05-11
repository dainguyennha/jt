import { Component, NgZone, OnInit, OnDestroy } from "@angular/core";
import { Item } from "../models/item.model";
import { ShareButtons } from "@ngx-share/core";
import { Meta } from "@angular/platform-browser";
import { BookmarkService } from "../services/bookmark.service";
import { Bookmark } from "../models/bookmark.model";
import { Video } from "../models/video.model";
import { AuthService } from "../services/auth.service";

import { MatSnackBar } from "@angular/material";
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  visibility: Boolean = false;
  item: Item;
  video: Video;
  location: Number;
  constructor(
    private meta: Meta,
    private bookmarkService: BookmarkService,
    private authService: AuthService,
    public share: ShareButtons,
    public snackBar: MatSnackBar
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

  addBookmark() {
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
            title: this.item.title
          },
          this.location,
          AuthService.user.id,
          new Date(),
          null
        )
      )
      .subscribe(res => {
        let snackBarRef = this.snackBar.open("Bookmark Added");
      }, console.error);
  }

  hide() {
    this.visibility = false;
  }
}
