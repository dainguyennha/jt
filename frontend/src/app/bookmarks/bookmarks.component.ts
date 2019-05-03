import { Component, OnInit, OnChanges, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";
import { Bookmark } from "../models/bookmark.model";
import { BookmarkService } from "../services/bookmark.service";
import { AuthService } from "../services/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-bookmarks",
  templateUrl: "./bookmarks.component.html",
  styleUrls: ["./bookmarks.component.css"]
})
export class BookmarksComponent implements OnInit, OnChanges {
  displayedColumns = ["item", "video", "location", "created"];
  bookmarks: Bookmark[];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private bookmarkService: BookmarkService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}
  ngOnChanges() {
    this.route.data.subscribe(routeData => {});
  }
  ngOnInit() {
    this.bookmarkService
      .getBookmarks(AuthService.user.id)
      .subscribe(res => {
        this.bookmarks = res;
        this.dataSource = new MatTableDataSource(this.bookmarks);
        this.dataSource.sort = this.sort;
      }, console.error);
  }
}
