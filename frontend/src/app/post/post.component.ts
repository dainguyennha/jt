import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../services/video.service';
import { Item } from '../models/item.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
 item
 thumbnail_urls:string[]
  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(id=>{
        this.videoService.getItem(id['itemid']).subscribe(res=>{this.item=res;
          this.thumbnail_urls=res.thumbnail
      })
    })
  
    var PAGE_URL = 'http://' + window.location.host
    var PAGE_IDENTIFIER = window.location.pathname
    var disqus_config = function () {
      this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
      this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    var d = document, s = d.createElement('script');
    s.src = 'https://joytu-be-2.disqus.com/embed.js';
    s.setAttribute('data-timestamp', (+new Date()).toString());
    (d.head || d.body).appendChild(s);
    ;
  }
}
