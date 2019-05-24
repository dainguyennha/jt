import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { Video } from '../models/video.model';
import { browser } from 'protractor';
declare var gapi;
declare var google;

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

      /**
       * Authorize the user immediately if the user has already granted access.
       * If no access has been created, render an authorize button inside the
       * element with the ID "embed-api-auth-container".
       */
      gapi.analytics.auth.authorize({
        container: 'embed-api-auth-container',
        clientid: '733840601926-vscu36kq5kvj17dsuiignkcvo4rb64qu.apps.googleusercontent.com'
      });


      /**
       * Create a new ViewSelector instance to be rendered inside of an
       * element with the id "view-selector-container".
       */
      var viewSelector = new gapi.analytics.ViewSelector({
        container: 'view-selector-container'
      });

      // Render the view selector to the page.
      viewSelector.execute();

      /**
       * Create a table chart showing top browsers for users to interact with.
       * Clicking on a row in the table will update a second timeline chart with
       * data from the selected browser.
       */


      /**
       * Create a timeline chart showing sessions over time for the browser the
       * user selected in the main chart.
       */


      var osChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:operatingSystem',
          'metrics': 'ga:sessions',
          'start-date': '7daysAgo',
          'end-date': 'today',
          // 'filters':'ga:eventAction==Play'
        },
        chart: {
          type: 'PIE',
          container: 'os-chart-container',
          options: {
            title:'Sessions by Operating System',
            width: 350
          }
        }
      });


      var countryChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:country',
          'metrics': 'ga:sessions',
          'start-date': '7daysAgo',
          'end-date': 'today',
          // 'filters':'ga:eventAction==Play'
        },
        chart: {
          type: 'PIE',
          container: 'country-chart-container',
          options: {
            title:'Sessions by Country',
            width: 350
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
            width: 350
          }
        }
      });


      /**
       * Store a refernce to the row click listener variable so it can be
       * removed later to prevent leaking memory when the chart instance is
       * replaced.
       */
      var mainChartRowClickListener;


      /**
       * Update both charts whenever the selected view changes.
       */
      viewSelector.on('change', function (ids) {
        var options = { query: { ids: ids } };

        // Clean up any event listeners registered on the main chart before
        // rendering a new one.


        osChart.set(options).execute();
        countryChart.set(options).execute();
        totalPlayGetChart.set(options).execute()
      });
    });    
  }
}
