var timeline = angular.module('timeline', ['ngMaterial']);




timeline.controller('timelineCtrl', ['$scope', '$filter', '$http', '$mdDialog', '$mdMedia', function($scope, $filter, $http, $mdDialog, $mdMedia) {

    var thetimeline = this;
    
    // Client ID and API key from the Developer Console
      var CLIENT_ID = '825826093539-sc86q0mghugds3t9qpo7b2rni289g8oa.apps.googleusercontent.com';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = "https://www.googleapis.com/auth/spreadsheets";


      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
        function initClient() {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
       function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          getData();
        } else {
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      this.handleAuthClick = function (event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      this.handleSignoutClick = function (event) {
        gapi.auth2.getAuthInstance().signOut();
      }


     
      function getData  () {
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: '1kOA4RNBdGbcleiH8Q8yhc_YD8HHeIluH7opTzTPZYcw',
          range: 'Sheet1!A:F',
        }).then(function(response) {
          var range = response.result;
          if (range.values.length > 0) {
            //lets assume then the we can remove all the items in the existing timeline
               thetimeline.timelineEvents = [{
        'when': '',
        'whendate': null,
        'event': '',
        'who': '',
        'where': '',
        'category': '',
        'notes': ''
    }];
            for (i = 0; i < range.values.length; i++) {
              var row = range.values[i];
              var value ={when:""};  
                value.when = row[0];
                value.whendate = Date.parse(row[0]);
                value.event = row[1];
                value.where = row[2];
                value.who = row[3];
                value.category = row[4];
                value.notes = row[5];
                thetimeline.timelineEvents.push(value);
            }
            localStorage.setItem('events', JSON.stringify(thetimeline.timelineEvents));
            thetimeline.filteredEvents = $filter('orderBy')($filter('filter')(thetimeline.timelineEvents, this.thefilter), 'whendate');
            thetimeline.theselectedevent = thetimeline.filteredEvents[0];
          } else {
          }
        }, function(response) {
        });
      }

    
    //retrieve the events
    

    this.thefilter = '';
    this.title = 'Timeline';
    this.scale = 1;
    var scale = this.scale;
    this.divheight = function(date2, date1) {
        return (parseInt(10 * scale / 2, 10) + parseInt(scale / 16 * ((date2 / 1000) - (date1 / 1000)) / ((60 * 60 * 24)), 10)).toString() + 'px';
    }
    this.tileheight = function(date2, date1) {
        return parseInt(scale / 2, 10) + parseInt(scale / 16 * ((date2 / 1000) - (date1 / 1000)) / ((60 * 60 * 240)), 10);
    }

    this.timelineEvents = [{
        'when': '',
        'whendate': null,
        'event': '',
        'who': '',
        'where': '',
        'category': '',
        'notes': ''
    }];
    if (!!localStorage.getItem('events')) {
        thetimeline.timelineEvents = JSON.parse(localStorage.getItem('events'));
    }

    this.filteredEvents = $filter('orderBy')($filter('filter')(this.timelineEvents, this.thefilter), 'whendate');
    $scope.$watch('thetimeline.thefilter', function(newVal) {
        thetimeline.filteredEvents = $filter('orderBy')($filter('filter')(thetimeline.timelineEvents, thetimeline.thefilter), 'whendate');
        if (typeof(thetimeline.filteredEvents) != 'undefined') {
            thetimeline.theselectedevent = thetimeline.filteredEvents[0];
        }
    });
    this.setTheEvent = function($event, theEvent) {
        this.theselectedevent = theEvent;

        //if the right hand pane is not displayed the send the details to a modal
        if (!$mdMedia('gt-sm')) {
            this.showDialog($event, theEvent);
        }

    };

    this.showDialog = function($event, theevent) {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            targetEvent: $event,
            template: '<md-dialog aria-label="dialog">' +
                '  <md-dialog-title>' +
                '      ' +
                '  </md-dialog-title>' +
                '  <md-dialog-content>' +
                '<md-card>' +
                '  <md-card-content>' +
                '     <h2>{{theevent.event}}</h2>' +
                '     <div layout="column">' +
                '      <div layout="row">' +
                '          <span flex="25">When   </span>' +
                '          <span flex="75">{{theevent.whendate | date}}</span>' +
                '       </div>' +
                '      <div layout="row">' +
                '          <span flex="25">Who   </span>' +
                '          <span flex="75">{{theevent.who }}</span>' +
                '       </div>' +
                '      <div layout="row">' +
                '          <span flex="25">Where   </span>' +
                '          <span flex="75">{{theevent.where }}</span>' +
                '       </div>' +
                '      <div layout="row">' +
                '          <span flex="25">Details   </span>' +
                '          <span flex="75">{{theevent.notes}}</span>' +
                '       </div>' +
                '   </div>' +
                '   </md-card-content>' +
                ' </md-card>     ' +
                '  </md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ng-click="closeDialog()" class="md-primary">' +
                '      Close' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
            locals: {
                theevent: theevent
            },
            controller: DialogController
        });

        function DialogController($scope, $mdDialog, theevent) {
            $scope.theevent = theevent;
            $scope.closeDialog = function() {
                $mdDialog.hide();
            }
        }
    };
    //retrieve the events

    //$http.jsonp('https://spreadsheets.google.com/feeds/list/1kOA4RNBdGbcleiH8Q8yhc_YD8HHeIluH7opTzTPZYcw/od6/public/values?alt=json-in-script&callback=JSON_CALLBACK').then(function successCallback(response) {
        // this callback will be called asynchronously
    //    if (!response.data.offline){
    //        angular.forEach(response.data.feed.entry, function(value, key) {
                //put the events in the events object
    //            value.when = value.gsx$date.$t;
    //            value.whendate = Date.parse(value.when);
    //            value.event = value.gsx$event.$t;
    //            value.who = value.gsx$who.$t;
    //            value.where = value.gsx$where.$t;
    //            value.category = value.gsx$category.$t;
    //            value.notes = value.gsx$notes.$t;
    //            thetimeline.timelineEvents.push(value);
    //        });
    //        localStorage.setItem('events', JSON.stringify(thetimeline.timelineEvents));
    //        thetimeline.filteredEvents = $filter('orderBy')($filter('filter')(thetimeline.timelineEvents, this.thefilter), 'whendate');
    //        thetimeline.theselectedevent = thetimeline.filteredEvents[0];
    //        }
            //put the 
        // when the response is available
    //}, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    //});
    
    handleClientLoad()
    
   
    
    return this;
}]);
