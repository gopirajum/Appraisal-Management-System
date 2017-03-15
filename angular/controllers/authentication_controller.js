var appraisalManagement_controllers = angular.module('appraisalManagement');
appraisalManagement_controllers.controller('AuthCtrl',['$scope', '$rootScope', '$state', 'users',
  function($scope, $rootScope, $state, users) {

  	//login authentication
    $scope.login = function(credentials) {

    users.login(credentials).then(function(response){
        console.log("response in contoller "+JSON.stringify(response));
        var details=response.data;
        
        if(details){
        	details.date=new Date(details.date);
        	$scope.project=details;
        }

		$state.go('home.profile');
      
    });
  }

  //adding new employee by admin
  $scope.add_employee = function(details) {

    users.add_employee(details).then(function(response){
      
         $state.go('home.profile');
      
    });
  }

  //updating the personal information
  $scope.update_employee = function(details) {

    users.update_employee(details).then(function(response){
    	if(details){
        	details.date=new Date(details.date);
        	$scope.project=details;
        }
      
         $state.go('home.profile');
      
    });
  }
  
}]);