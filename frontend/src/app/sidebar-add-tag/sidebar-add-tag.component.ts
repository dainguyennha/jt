import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { VideoService } from '../services/video.service';
import { Item } from '../models/item.model';
import { ROI } from '../models/roi.model';

@Component({
  selector: 'app-sidebar-add-tag',
  templateUrl: './sidebar-add-tag.component.html',
  styleUrls: ['./sidebar-add-tag.component.css']
})
export class SidebarAddTagComponent implements OnInit {

  @ViewChild('videoWrapper') videoWrapper: ElementRef
  @Input() time   //s
  @Input() showAddSideBar: boolean
  @Input() widthVideo
  @Input() heightVideo
  @Input() video_id

  relativeTagX; 
  relativeTagY;

  constructor(private authService:AuthService,private videoService:VideoService) { }
  
  title
  description
  
  ngOnInit() {
    this.showAddSideBar = true
  }

  addBookmark() {
    let coordinatesArr = window.getComputedStyle(document.querySelector(".circle")).getPropertyValue("transform").match(/-?[\d\.]+/g)
    this.relativeTagX = ((this.widthVideo / 2) + parseFloat(coordinatesArr[4])) / this.widthVideo
    this.relativeTagY = ((this.heightVideo / 2) + parseFloat(coordinatesArr[5])) / this.heightVideo
   let item:Item={
      id:Math.floor(this.relativeTagX*100)+"-"+Math.floor(this.relativeTagY*100)+"-"+this.time,
      title:this.title,
      description:this.description,
      moreUrl:"",
      subtitle:"",
      thumbnail:""
      }
   let roi={
    
      item:Math.floor(this.relativeTagX*100)+"-"+Math.floor(this.relativeTagY*100)+"-"+this.time,
      data:{
        ix: this.relativeTagX,
        iy: this.relativeTagY,
        start:this.time,
        end:this.time+2
      }
      ,video:this.video_id
      
    }
    console.log(this.widthVideo)
    console.log(this.relativeTagY)
    this.videoService.addObjectItems(item)
    this.videoService.addRoi(roi)
    console.log(item)

  }
  
  cancelAddBookmark() {
    this.showAddSideBar = false;
  }
}