angular.module('timeline', ['ui.bootstrap']);
$scope.scale=8;
function timelineCtrl($scope,$http) {
 $scope.divheight=function(date2, date1){
 return  (50+parseInt(((date2/1000)-(date1/1000)) /((60*60*24)*$scope.scale),10)).toString()+'px';
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



