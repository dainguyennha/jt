import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { Video } from '../models/video.model';
declare var gapi;

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
    gapi.analytics.ready(function () {

      gapi.analytics.auth.authorize({
        container: 'embed-api-auth-container',
        clientid: '733840601926-vscu36kq5kvj17dsuiignkcvo4rb64qu.apps.googleusercontent.com'
      });


      var viewSelector = new gapi.analytics.ViewSelector({
        container: 'view-selector-container'
      });

      viewSelector.execute();

      var osChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:operatingSystem',
          'metrics': 'ga:sessions',
          'start-date': '7daysAgo',
          'end-date': 'today',
        },
        chart: {
          type: 'PIE',
          container: 'os-chart-container',
          options: {
            title:'Sessions by Operating System',
            width: 320
          }
        }
      });


      var countryChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:country',
          'metrics': 'ga:sessions',
          'start-date': '7daysAgo',
          'end-date': 'today',
        },
        chart: {
          type: 'PIE',
          container: 'country-chart-container',
          options: {
            title:'Sessions by Country',
            width: 320
          }
        }
      });


      var totalPlayGetChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:eventCategory',
          'metrics': 'ga:totalEvents',
          'start-date': '7daysAgo',
          'end-date': 'today',
          'filters': 'ga:eventCategory==Play but not get product info,ga:eventCategory==Get product info in video'
        },
        chart: {
          type: 'PIE',
          container: 'total-playget-chart-container',
          options: {
            title: 'Total event Play video and Get product infor ',
            width: 320
          }
        }
      });


      viewSelector.on('change', function (ids) {
        var options = { query: { ids: ids } };

        osChart.set(options).execute();
        countryChart.set(options).execute();
        totalPlayGetChart.set(options).execute()
      });
    });    
  }
}
