var appraisalManagement_controllers = angular.module('appraisalManagement');
appraisalManagement_controllers.controller('AuthCtrl',['$scope', '$rootScope', '$state', 'users',
  function($scope, $rootScope, $state, users) {
    //login
    $scope.login = function(credentials) {
      users.login(credentials).then(function(response){
        var details=response.data;
        if(details){
          details.date=new Date(details.date);
          $scope.project=details;
        }
        $state.go('home.profile');
      });
    }
    //reset_password
    $scope.reset_password = function(credentials) {
      users.reset_password(credentials).then(function(response){
      $state.go('root'); 
      });
    }
  }
]);