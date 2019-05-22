import { Component, OnInit } from '@angular/core';
import { browser } from 'protractor';
declare var gapi;
declare var google;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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
      var mainChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:eventLabel',
          'metrics': 'ga:totalEvents',
          // 'sort': '-ga:sessions',
          // 'max-results': '6',
          'start-date': '30daysAgo',
          'end-date': 'today',
          'filters': 'ga:eventCategory==Play Video'
        },
        chart: {
          type: 'TABLE',
          container: 'main-chart-container',
          options: {
            // width: '100%'
          }
        }
      });


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
          // 'filters':'ga:eventAction==Play'
        },
        chart: {
          type: 'LINE',
          container: 'plays-chart-container',
          options: {
            // width: '100%'
          }
        }
      });




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
            // width: '100%'
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
            // width: '100%'
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
            title: 'Total event Play video and Get product infor '
            // width: '100%'
          }
        }
      });




      var playVsGetInforChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:eventCategory',
          'metrics': 'ga:totalEvents',
          'start-date': '7daysAgo',
          'end-date': 'today',
          // 'filters':'ga:eventAction==Play'
        },
        chart: {
          type: 'PIE',
          container: 'play-getinfo-chart-container',
          options: {
            // width: '100%'
          }
        }
      });




      var loadVsPlayChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:eventCategory',
          'metrics': 'ga:totalEvents',
          'start-date': '7daysAgo',
          'end-date': 'today',
          // 'filters':'ga:eventAction==Play'
        },
        chart: {
          type: 'PIE',
          container: 'load-play-chart-container',
          options: {
            // width: '100%'
          }
        }
      });




      var GetInforVsVisitWebsiteChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:eventCategory',
          'metrics': 'ga:totalEvents',
          'start-date': '7daysAgo',
          'end-date': 'today',
          // 'filters':'ga:eventAction==Play'
        },
        chart: {
          type: 'PIE',
          container: 'getinfor-visit-chart-container',
          options: {
            // width: '100%'
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

        mainChart.set(options).execute();
        playVsGetInforChart.set(options);
        loadVsPlayChart.set(options);
        GetInforVsVisitWebsiteChart.set(options);
        playsChart.set(options);
        osChart.set(options).execute();
        countryChart.set(options).execute();
        totalPlayGetChart.set(options).execute()


        // Only render the breakdown chart if a browser filter has been set.
        if (playVsGetInforChart.get().query.filters) playVsGetInforChart.execute();
        if (loadVsPlayChart.get().query.filters) loadVsPlayChart.execute();
        if (GetInforVsVisitWebsiteChart.get().query.filters) GetInforVsVisitWebsiteChart.execute();
        if (playsChart.get().query.filters) playsChart.execute();


      });


      /**
       * Each time the main chart is rendered, add an event listener to it so
       * that when the user clicks on a row, the line chart is updated with
       * the data from the browser in the clicked row.
       */
      mainChart.on('success', function (response) {

        var chart = response.chart;
        var dataTable = response.dataTable;

        // Store a reference to this listener so it can be cleaned up later.
        mainChartRowClickListener = google.visualization.events
          .addListener(chart, 'select', function (event) {

            // When you unselect a row, the "select" event still fires
            // but the selection is empty. Ignore that case.
            if (!chart.getSelection().length) return;

            var row = chart.getSelection()[0].row;
            var label = dataTable.getValue(row, 0);
            var optionPLayGetinfo = {
              query: {
                filters: 'ga:eventCategory==Play but not get product info,ga:eventCategory==Get product info in video;ga:eventLabel==' + label
              },
              chart: {
                options: {
                  title: 'Play video vs Get product infor ' + label
                }
              }
            };


            var optionLoadPlay = {
              query: {
                filters: 'ga:eventCategory==Play Video,ga:eventCategory==Load Video (But not click Play);ga:eventLabel==' + label
              },
              chart: {
                options: {
                  title: 'Load page vs Play video ' + label
                }
              }
            };


            var optionInforVisit = {
              query: {
                filters: 'ga:eventCategory==Visit product web,ga:eventCategory==Get product infor but not visit website;ga:eventLabel==' + label
              },
              chart: {
                options: {
                  title: 'Get product infor vs Visit product website video ' + label
                }
              }
            };


            var optionPlays = {
              query: {
                filters: 'ga:eventCategory==Play Video;ga:eventLabel==' + label
              },
              chart: {
                options: {
                  title: 'Total play video ' + label
                }
              }
            };


            playVsGetInforChart.set(optionPLayGetinfo).execute();
            loadVsPlayChart.set(optionLoadPlay).execute();
            GetInforVsVisitWebsiteChart.set(optionInforVisit).execute();
            playsChart.set(optionPlays).execute();
          });
      });

    });
  }
}
