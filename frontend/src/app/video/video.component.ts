import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  NgZone,
  HostListener
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
declare var gtag
declare var videojs: any;

@Component({
  selector: "app-video",
  templateUrl: "./video.component.html",
  styleUrls: ["./video.component.css"]
})
export class VideoComponent implements OnInit, AfterViewInit {
  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    if (this.isPlayVideo) {
      gtag('event', 'video', {
        'event_category': 'Play Video',
        'event_label': this.video.id,
        'event_action': 'plays',
        'value': 'video-value'
      });
      if (this.isShowProductInfor) {
        gtag('event', 'product infor', {
          'event_category': 'Get product info in video',
          'event_label': this.video.id,
          'event_action': 'get_product_infor',
          'value': this.selectedItem.title
        });
        if (this.isShowProductWebsite) {
          gtag('event', 'visit_product_website', {
            'event_category': 'Visit product web',
            'event_label': this.video.id,
            'event_action': 'visit_product_website',
            'value': this.selectedItem.title
          });
        } else {
          gtag('event', 'product infor', {
            'event_category': 'Get product infor but not visit website',
            'event_label': this.video.id,
            'event_action': 'get_product_infor_but_not_visit_website',
            'value': this.selectedItem.title
          });
        }
      } else {
        gtag('event', 'video', {
          'event_category': 'Play but not get product info',
          'event_label': this.video.id,
          'event_action': 'play_but_not_get_infor',
          'value': 'video_value'
        });
      }
    } else {
      gtag('event', 'load_video', {
        'event_category': 'Load Video (But not click Play)',
        'event_label': this.video.id,
        'event_action': 'load_video_but_not_play',
        'value': 'load_video_value'
      });
    }
  }
  id;
  t;
  selectedItem;
  video: Video;
  widthVideo;
  heightVideo;
  rois: ROI[];

  items: Item[];
  time;
  vada: Boolean = false;
  isPause: boolean = false;
  headerDisplay: boolean = false;
  isTagDisplay: boolean = false;
  toggleSelect: boolean = false;
  toggleSideBarAdd: boolean = false;
  isPlayVideo: boolean = false;
  isShowProductInfor: boolean = false;
  isShowProductWebsite: boolean = false;

  @ViewChild("videoContainer") videoContainer: ElementRef;
  @ViewChild("sideBarComponent") sideBarComponent: SidebarComponent;
  @ViewChild('videoWrapper') videoWrapper: ElementRef
  @HostListener('window:resize') onresize() {
    this.widthVideo = this.videoWrapper.nativeElement.offsetWidth
    this.heightVideo = this.videoWrapper.nativeElement.offsetHeight
  }

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private ngZone: NgZone
  ) { }

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

  ngOnDestroy() {
    window.my.namespace.onShow = null;
    window.my.namespace.onPlay = null;
    if (this.isPlayVideo) {
      gtag('event', 'video', {
        'event_category': 'Play Video',
        'event_label': this.video.id,
        'event_action': 'plays',
        'value': 'video-value'
      });
      if (this.isShowProductInfor) {
        gtag('event', 'product infor', {
          'event_category': 'Get product info in video',
          'event_label': this.video.id,
          'event_action': 'get_product_infor',
          'value': this.selectedItem.title
        });
        if (this.isShowProductWebsite) {
          gtag('event', 'visit_product_website', {
            'event_category': 'Visit product web',
            'event_label': this.video.id,
            'event_action': 'visit_product_website',
            'value': this.selectedItem.title
          });
        } else {
          gtag('event', 'product infor', {
            'event_category': 'Get product infor but not visit website',
            'event_label': this.video.id,
            'event_action': 'get_product_infor_but_not_visit_website',
            'value': this.selectedItem.title
          });
        }
      } else {
        gtag('event', 'video', {
          'event_category': 'Play but not get product info',
          'event_label': this.video.id,
          'event_action': 'play_but_not_get_infor',
          'value': 'video_value'
        });
      }
    } else {
      gtag('event', 'load_video', {
        'event_category': 'Load Video (But not click Play)',
        'event_label': this.video.id,
        'event_action': 'load_video_but_not_play',
        'value': 'load_video_value'
      });
    }
  }

  onShow(id) {
    this.selectedItem = this.items.find(item => item.id == id);
    this.ngZone.run(() => { this.onShowPrivate(); this.toggleSideBarAdd = false });
  }

  onShowPrivate() {
    this.isShowProductInfor = true;
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
    this.toggleSideBarAdd = false;
  }

  onDragEnded(event) {
    console.log(event.source.dropped);
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

  showSideBarAdd() {
    this.toggleSideBarAdd = !this.toggleSideBarAdd;
  }

  ngAfterViewInit() { }

  getAddedRoiItem(value) {
    this.rois.push(value['added_roi'])
    this.items.push(value['added_item'])
  }

  deleteItem(id) {
    this.videoService.delRoiItem(id).subscribe(x => {
      let delRoiIndex = this.rois.findIndex(roi => roi.id === id)
      this.rois.splice(delRoiIndex, 1)
      let delItemIndex = this.items.findIndex(item => item.id === id)
      this.items.splice(delItemIndex, 1)
    })
  }
  detectClickMore(isShowProductWebsite) {
    this.isShowProductWebsite = isShowProductWebsite
  }
}