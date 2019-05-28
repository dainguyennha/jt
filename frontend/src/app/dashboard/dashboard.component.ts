import { Component, OnInit } from '@angular/core';
import { browser } from 'protractor';
import { ActivatedRoute } from '@angular/router';
declare var gapi;
declare var google;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private route :ActivatedRoute) { }

  ngOnInit() {
 var label = "";

  this.route.params.subscribe(params => {
   label=params["idvideo"]
  })

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
       * Create a timeline chart showing sessions over time for the browser the
       * user selected in the main chart.
       */
      var playsChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:date',
          'metrics': 'ga:totalEvents',
          'start-date': '7daysAgo',
          'end-date': 'today',
          'filters':'ga:eventCategory==Play Video;ga:eventLabel==' + label
        },
        chart: {
          type: 'LINE',
          container: 'plays-chart-container',
          options: {
            title: 'Total play video ' + label
          }
        }
      });















      var playVsGetInforChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:eventCategory',
          'metrics': 'ga:totalEvents',
          'start-date': '7daysAgo',
          'end-date': 'today',
          'filters':'ga:eventCategory==Play but not get product info,ga:eventCategory==Get product info in video;ga:eventLabel==' + label
        },
        chart: {
          type: 'PIE',
          container: 'play-getinfo-chart-container',
          options: {
            title: 'Play video vs Get product infor ' + label
          }
        }
      });




      var loadVsPlayChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:eventCategory',
          'metrics': 'ga:totalEvents',
          'start-date': '7daysAgo',
          'end-date': 'today',
          'filters':'ga:eventCategory==Play Video,ga:eventCategory==Load Video (But not click Play);ga:eventLabel==' + label
        },
        chart: {
          type: 'PIE',
          container: 'load-play-chart-container',
          options: {
            title: 'Load page vs Play video ' + label
          }
        }
      });




      var GetInforVsVisitWebsiteChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:eventCategory',
          'metrics': 'ga:totalEvents',
          'start-date': '7daysAgo',
          'end-date': 'today',
          'filters':'ga:eventCategory==Visit product web,ga:eventCategory==Get product infor but not visit website;ga:eventLabel==' + label
        },
        chart: {
          type: 'PIE',
          container: 'getinfor-visit-chart-container',
          options: {
            title: 'Get product infor vs Visit product website video ' + label
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
        if (mainChartRowClickListener) {
          google.visualization.events.removeListener(mainChartRowClickListener);
        }

        // mainChart.set(options).execute();
        playVsGetInforChart.set(options).execute();
        loadVsPlayChart.set(options).execute();
        GetInforVsVisitWebsiteChart.set(options).execute();
        playsChart.set(options).execute();



        // Only render the breakdown chart if a browser filter has been set.
        if (playVsGetInforChart.get().query.filters) playVsGetInforChart.execute();
        if (loadVsPlayChart.get().query.filters) loadVsPlayChart.execute();
        if (GetInforVsVisitWebsiteChart.get().query.filters) GetInforVsVisitWebsiteChart.execute();
        if (playsChart.get().query.filters) playsChart.execute();


      });

    });
  }
}
