var timeline = angular.module('timeline', ['ngMaterial']);




timeline.controller('timelineCtrl', ['$scope', '$filter', '$http', '$mdDialog','$mdMedia', function($scope,$filter,$http,$mdDialog,$mdMedia)
{
      
       
   this.filteredEvents=$filter('orderBy')($filter('filter')(this.timelineEvents,this.thefilter),'whendate');
   $scope.$watch(angular.bind(this, function () {
        return this.thefilter;
   }), function (newVal) {
        this.filteredEvents=$filter('orderBy')($Filter('filter')(this.timelineEvents,this.thefilter),'whendate');
   });
   this.setTheEvent=function($event,theEvent)
  {
      this.theselectedevent=theEvent;

      //if the right hand pane is not displayed the send the details to a modal
      if(!$mdMedia('gt-sm')){
          this.showDialog($event, theEvent);
      }

  };
      
   this.showDialog=function($event,theevent) {
       var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template:
           '<md-dialog aria-label="dialog">' +
           '  <md-dialog-title>'+
           '      ' +
           '  </md-dialog-title>' +
           '  <md-dialog-content>'+
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
this.thefilter='';
this.title='Timeline';
this.scale=1;
      var scale=this.scale;
 this.divheight=function(date2, date1){
 return  (parseInt(10*scale/2,10 )+parseInt(scale/16* ((date2/1000)-(date1/1000)) /((60*60*24)),10)).toString()+'px';
 }
 this.tileheight=function(date2, date1){
 return  parseInt(scale/2,10 )+parseInt(scale/16* ((date2/1000)-(date1/1000)) /((60*60*240)),10);
 }
 
 this.timelineEvents=[
        {
         'when':'',
         'whendate':null,
         'event':'', 
         'who':'',
         'where':'',
         'category':'',
         'notes':''
        }
 ];
//retrieve the events
var thetimeline=this;
$http.jsonp( 'https://spreadsheets.google.com/feeds/list/1kOA4RNBdGbcleiH8Q8yhc_YD8HHeIluH7opTzTPZYcw/od6/public/values?alt=json-in-script&callback=JSON_CALLBACK'
).then(function successCallback(response) {
    // this callback will be called asynchronously
 angular.forEach(response.data.feed.entry,function(value,key){
 //put the events in the events object
  value.when=value.gsx$date.$t;
  value.whendate = Date.parse(value.when);
  value.event=value.gsx$event.$t;
  value.who=value.gsx$who.$t;
  value.where=value.gsx$where.$t;
  value.category=value.gsx$category.$t;
  value.notes=value.gsx$notes.$t;
  thetimeline.timelineEvents.push(value);
 });
 
  thetimeline.theselectedevent = thetimeline.timelineEvents[0];
 //put the 
    // when the response is available
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
 return this;
}
]);


