import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { VideoService } from '../services/video.service';
import { Item } from '../models/item.model';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";
import { BookmarkService } from '../services/bookmark.service';
import { Bookmark } from '../models/bookmark.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-add-tag',
  templateUrl: './sidebar-add-tag.component.html',
  styleUrls: ['./sidebar-add-tag.component.css']
})
export class SidebarAddTagComponent implements OnInit {

  @ViewChild('videoWrapper') videoWrapper: ElementRef
  @Input() time   //s
  @Input() widthVideo
  @Input() heightVideo
  @Input() video
  @Output() addedRoiItem = new EventEmitter<any>()

  showAddSideBar: boolean
  relativeTagX;
  relativeTagY;
  title;
  description;

  constructor(private videoService: VideoService,
    private bookmarkService: BookmarkService,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.showAddSideBar = true
  }

  addBookmark() {
    let coordinatesArr = window.getComputedStyle(document.querySelector(".circle")).getPropertyValue("transform").match(/-?[\d\.]+/g)
    if (coordinatesArr) {

      this.relativeTagX = ((this.widthVideo / 2) + parseFloat(coordinatesArr[4])) / this.widthVideo
      this.relativeTagY = ((this.heightVideo / 2) + parseFloat(coordinatesArr[5])) / this.heightVideo
    } else {
      this.relativeTagX = 0.5;
      this.relativeTagY = 0.5;
    }

    let item: Item = {
      id: Math.floor(this.relativeTagX * 100) + "-" + Math.floor(this.relativeTagY * 100) + "-" + this.time,
      title: this.title,
      description: this.description,
      moreUrl: "",
      subtitle: "",
      thumbnail: ""
    }

    let roi = {
      item: Math.floor(this.relativeTagX * 100) + "-" + Math.floor(this.relativeTagY * 100) + "-" + this.time,
      data: {
        ix: this.relativeTagX,
        iy: this.relativeTagY,
        start: Math.floor(this.time * 1000),
        end: Math.floor((this.time + 2) * 1000)
      }
      , video: this.video.id
    }

    const formRoiItem = new FormData();
    formRoiItem.append("item_id", item.id)
    formRoiItem.append("item_title", item.title)
    formRoiItem.append("item_des", item.description)
    formRoiItem.append("item_subtitle", item.subtitle)
    formRoiItem.append("item_more_url", item.moreUrl)
    formRoiItem.append("user_id", AuthService.user.id)
    formRoiItem.append("time", this.time)
    


    formRoiItem.append("roi-data-ix", roi.data.ix)
    formRoiItem.append("roi-data-iy", roi.data.iy)
    formRoiItem.append("roi-data-start", roi.data.start.toString())
    formRoiItem.append("roi-data-end", roi.data.end.toString())
    formRoiItem.append("video_id", roi.video)

    if (this.authService.isAuthenticated()) {
      this.videoService.addRoiItem(formRoiItem).subscribe(res => {
        let config = new MatSnackBarConfig;
        config.duration = 2000;
        let snackBarRef = this.snackBar.open("Bookmark Added", null, config);
        this.addedRoiItem.emit(res);
        this.bookmarkService
          .addBookmark(
            new Bookmark(
              null,
              {
                id: roi.video,
                title: this.video.title
              },
              {
                id: item.id,
                title: item.title,
                descriptrion:item.description,
                subtitle:null
              },
              this.time,
              AuthService.user.id,
              new Date(),
              null
            )
          )
          .subscribe(res => {

            this.showAddSideBar = false;
          }, console.error);
      }, console.error);
    } else {
      this.router.navigate(['/login'])
    }
  }

  cancelAddBookmark() {
    this.showAddSideBar = false;
  }
}