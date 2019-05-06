import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  NgZone
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { VideoService } from "../services/video.service";
import { ROI } from "../models/roi.model";
import { Video } from "../models/video.model";
import { Item } from "../models/item.model";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";
import { SidebarComponent } from "../sidebar/sidebar.component";

declare var videojs: any;

@Component({
  selector: "app-video",
  templateUrl: "./video.component.html",
  styleUrls: ["./video.component.css"]
})
export class VideoComponent implements OnInit, AfterViewInit {
  id;
  t;
  selectedItem;
  video: Video;
  rois: ROI[];
  items: Item[];
  vada: Boolean = false;
  isPause : boolean = false;
  headerDisplay: boolean = false;
  isTagDisplay: boolean = false;
  @ViewChild("videoContainer") videoContainer: ElementRef;
  @ViewChild("sideBarComponent") sideBarComponent: SidebarComponent;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    window.my = window.my || {};
    window.my.namespace = window.my.namespace || {};
    window.my.namespace.onShow = this.onShow.bind(this);
    window.my.namespace.onPlay = this.onPlay.bind(this);

    this.route.queryParams.filter(params => params.t).subscribe(params => {
      this.t = params.t;
      this.videoContainer.nativeElement.currentTime = this.t;      
    });

    this.route.params.subscribe(params => {
      this.id = params["id"];
      this.t = params["t"];

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
        });
        player.on("play", () => { 
          if(this.isPause) {
            this.toggleHeader();
            this.isPause = false;
          }
        });
        player.overlay({
          content: "",
          debug: false,
          overlays: processed
        });
        this.vada = true;
      }, 2000);
    });
  }

  ngOnDestroy() {
    window.my.namespace.onShow = null;
    window.my.namespace.onPlay = null;
  }
  onShow(id) {
    this.selectedItem = this.items.find(item => item.id == id);
    this.ngZone.run(() => this.onShowPrivate());
  }
  onShowPrivate() {
    this.videoContainer.nativeElement.pause();
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
  }

  onDragEnded(event) {
    console.log(event.source.dropped);
  }

  toggleHeader() {
    this.headerDisplay = !this.headerDisplay;
  }

  toggleTag() {
    this.isTagDisplay = !this.isTagDisplay;
  }

  ngAfterViewInit() {}
}
