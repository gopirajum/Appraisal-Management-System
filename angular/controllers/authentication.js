var appraisalManagement_controllers = angular.module('appraisalManagement');
appraisalManagement_controllers.controller('AuthCtrl',['$scope', '$rootScope', '$state', 
  'users', 'session', function($scope, $rootScope, $state, users, session) {
    //login
    $scope.login = function(credentials) {
      users.login(credentials).then(function(response){
        //console.log("response "+JSON.stringify(response.data));
        var details = response.data;
        if(details){
          details.personal_details.date = new Date(details.personal_details.date);
          details.official_details.joining_date = new Date(details.official_details.joining_date);
          //$scope.current_user=details;
          $scope.personal_details=details.personal_details;
          $scope.official_details=details.official_details;
        }
        session.set_user(details);
        console.log("designation"+details.personal_details.designation);
        if(details.personal_details.designation == "HR"){
          $state.go('home.admin_page');
        }else{
          $state.go('home.profile');
        }
        
      });
    }

    //logout
    $scope.logout = function() {
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