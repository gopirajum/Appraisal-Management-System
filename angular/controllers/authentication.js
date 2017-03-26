var appraisalManagement_controllers = angular.module('appraisalManagement');
appraisalManagement_controllers.controller('AuthCtrl',['$scope', '$rootScope', '$state', 
  'users', 'session', function($scope, $rootScope, $state, users, session) {
    //login
    $scope.login = function(credentials) {
      users.login(credentials).then(function(response){
        var details = response.data;
        if(details){
          details.date = new Date(details.date);
          $scope.project = details;
        }
        session.set_user(details);
        $state.go('home.profile');
      });
    }

    //logout
    $scope.logout = function() {
      console.log("efefef")
      session.logout();
      $state.go('root')
    }

    //reset_password
    $scope.reset_password = function(credentials) {
      users.reset_password(credentials).then(function(response){
      $state.go('root'); 
      });
    }
  }
]);