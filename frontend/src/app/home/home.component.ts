import { Component, OnInit, NgZone, ViewChild, ElementRef, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { VideoService } from "../services/video.service";
import { Observable } from "rxjs";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Video } from "../models/video.model";
import { ROI } from "../models/roi.model";
import { Item } from "../models/item.model";
declare var videojs: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})

export class HomeComponent implements OnInit{
  @HostListener('window:resize', ['$event'])
  resizeHandler(event) {
    this.videoItem.nativeElement.style.height = ((this.videoItem.nativeElement.offsetWidth) * 25 / 44) + 'px'
  }

  source: string
  @ViewChild("videoContainer") videoContainer: ElementRef;
  @ViewChild("sideBarComponent") sideBarComponent: SidebarComponent;
  @ViewChild('videoWrapper') videoWrapper: ElementRef
  @ViewChild('videoItem') videoItem: ElementRef

  id;
  selectedItem;
  video: Video;
  widthVideo;
  heightVideo;
  rois: ROI[];
  isPlayVideo: boolean = false;
  isShowProductInfor: boolean = false;
  isShowProductWebsite: boolean = false;
  items: Item[];
  time;
  vada: Boolean = false;
  isPause: boolean = false;
  headerDisplay: boolean = false;
  isTagDisplay: boolean = false;
  toggleSelect: boolean = false;
  toggleSideBarAdd: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private ngZone: NgZone
    ) { }

  ngOnInit() {
    this.videoItem.nativeElement.style.height = ((this.videoItem.nativeElement.offsetWidth) * 25 / 44) + 'px'
    this.source = "https://cdn.joytu.be/video/IVYmod/IVYmod-HoangA/IVYmod-HoangA.mp4"

    window.my = window.my || {};
    window.my.namespace = window.my.namespace || {};
    window.my.namespace.onShow = this.onShow.bind(this);
    window.my.namespace.onPlay = this.onPlay.bind(this);

    this.route.params.subscribe(params => {
      this.id = "IVYmod-HoangA";

      Observable.forkJoin(
        this.videoService.getVideo(this.id),
        this.videoService.getRois(this.id),
        this.videoService.getItems(this.id)
      ).subscribe(([res1, res2, res3]) => {
        this.video = res1;
        this.rois = res2;
        this.items = res3;
      });

      setTimeout(() => {
        var processed = [];
        for (let i = 0; i < this.rois.length; i++) {
          processed.push({
            id: this.rois[i]["item"],
            start: this.rois[i]["data"]["start"] / 1000,
            end: this.rois[i]["data"]["end"] / 1000,
            left: this.rois[i]["data"]["ix"],
            top: this.rois[i]["data"]["iy"]
          });
        }

        let player = videojs(this.videoContainer.nativeElement);
        player.on("pause", () => {
          this.isPause = true;
          this.toggleHeader();
          this.time = player.currentTime();
        });

        player.on("play", () => {
          this.isPlayVideo = true;
          if (this.isPause) {
            this.toggleHeader();
            if (this.isTagDisplay) {
              this.toggleTag();
            }
            this.isPause = false;
            this.toggleSelect = false;
          }
        });

        player.overlay({
          content: "",
          debug: false,
          overlays: processed,
        },
        );
        this.vada = true;
      }, 2000);
    });
  }

  toggleHeader() {
    this.headerDisplay = !this.headerDisplay;
  }

  toggleTag() {
    this.isTagDisplay = !this.isTagDisplay;
    this.toggleSelect = !this.toggleSelect;
    this.widthVideo = this.videoWrapper.nativeElement.offsetWidth
    this.heightVideo = this.videoWrapper.nativeElement.offsetHeight
  }

  onShow(id) {
    this.selectedItem = this.items.find(item => item.id == id);
    this.ngZone.run(() => { this.onShowPrivate(); this.toggleSideBarAdd = false });
  }

  onShowPrivate() {
    this.videoContainer.nativeElement.pause();
    this.isShowProductInfor = true
    this.sideBarComponent.show(
      this.selectedItem,
      this.video,
      this.videoContainer.nativeElement.currentTime
    );
  }

  onPlay() {
    this.ngZone.run(() => this.onPlayPrivate());
  }

  onPlayPrivate() {
    this.sideBarComponent.hide();
    this.toggleSideBarAdd = false;
  }

  onDragEnded(event) {
    console.log(event.source.dropped);
  }

  showSideBarAdd() {
    this.toggleSideBarAdd = !this.toggleSideBarAdd;
  }

}


