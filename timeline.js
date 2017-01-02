angular.module('timeline', ['ui.bootstrap']);

function timelineCtrl($scope,$http) {
 $scope.events=[
        {
         'when':'',
         'event':'', 
         'who':'',
         'where':'',
         'category':'',
         'Notes':''
        }
 ];
//retrieve the events
$http({
  method: 'GET',
  url: 'https://spreadsheets.google.com/feeds/list/1kOA4RNBdGbcleiH8Q8yhc_YD8HHeIluH7opTzTPZYcw/od6/public/values?alt=json-in-script&callback=timeline'
}).then(function successCallback(response) {
    // this callback will be called asynchronously
 $scope.events.push(response.data);
 //put the events in the events object
 //put the 
    // when the response is available
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
}



