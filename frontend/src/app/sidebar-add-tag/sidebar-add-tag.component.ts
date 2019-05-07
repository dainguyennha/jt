import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';

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

  relativeTagX; 
  relativeTagY;

  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.showAddSideBar = true
  }

  addBookmark() {
    let coordinatesArr = window.getComputedStyle(document.querySelector(".circle")).getPropertyValue("transform").match(/-?[\d\.]+/g)
    this.relativeTagX = ((this.widthVideo / 2) + parseFloat(coordinatesArr[4])) / this.widthVideo
    this.relativeTagY = ((this.heightVideo / 2) + parseFloat(coordinatesArr[5])) / this.heightVideo
  }
  
  cancelAddBookmark() {
    this.showAddSideBar = false;
  }
}