var appraisalManagement_controllers = angular.module('appraisalManagement');
appraisalManagement_controllers.controller('AuthCtrl',['$scope', '$rootScope', '$state', 'users',
  function($scope, $rootScope, $state, users) {
  
    $scope.login = function(credentials) {
    //console.log("in auth contoller");

    users.login(credentials).then(function(response){
      
         $state.go('home.profile');
      
    });
  }
  
}]);