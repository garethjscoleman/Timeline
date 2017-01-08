var timeline = angular.module('timeline', ['ngMaterial']);


      

timeline.controller('timelineCtrl', ['$scope', '$http', '$mdDialog', function($scope,$http,$mdDialog)
{
   function showAlert() {
      alert = $mdDialog.alert({
        title: 'Attention',
        textContent: 'This is an example of how easy dialogs can be!',
        ok: 'Close'
      });

      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });      
   }
      
   function showDialog($event) {
       var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template:
           '<md-dialog aria-label="List dialog">' +
           '  <md-dialog-content>'+
           '    <md-list>'+
           '      <md-list-item ng-repeat="item in items">'+
           '       <p>Number {{item}}</p>' +
           '      '+
           '    </md-list-item></md-list>'+
           '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <md-button ng-click="closeDialog()" class="md-primary">' +
           '      Close Dialog' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',
         locals: {
           items: $scope.items
         },
         controller: DialogController
      });   
      function DialogController($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    }
                                     
 $scope.thefilter='';
$scope.title='Timeline';
$scope.scale=1;
 $scope.divheight=function(date2, date1){
 return  (parseInt(10*$scope.scale/2,10 )+parseInt($scope.scale/16* ((date2/1000)-(date1/1000)) /((60*60*24)),10)).toString()+'px';
 }
 
 $scope.timelineEvents=[
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
  $scope.timelineEvents.push(value);
 });
 
 
 //put the 
    // when the response is available
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
}
]);


