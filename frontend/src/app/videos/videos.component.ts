import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { Video } from '../models/video.model';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  videos: Video[];
  constructor(private videoService: VideoService) { }

  ngOnInit() {
    this.videoService
      .getVideos()
      .subscribe(res => {
        this.videos = res;
      },
      console.error
      );
  }
}
