var appraisalManagement_controllers = angular.module('appraisalManagement');
appraisalManagement_controllers.controller('EmployeesCtrl',['$scope', '$rootScope', '$state', 'users',
  function($scope, $rootScope, $state, users) {

  //adding new employee by admin
  $scope.add_employee = function(details) {
    users.add_employee(details).then(function(response){
    });
  }

  //updating the personal information
  $scope.update_employee = function(details) {
    users.update_employee(details).then(function(response){
    if(details) {
      details.date = new Date(details.date);
      $scope.project=details;
    }
    $state.go('home.profile');
    });
  }

  //review_form
  $scope.peer_form_init = function () {
    users.peer_form_load().then(function(response){
      var details=response.data;
      if(details){
        $scope.questions=details;
      }
    });
  }

  $scope.appraisal_init = function(employees) {
    users.appraisal_init(employees).then(function(response){
    });
  }

  //submitting peer form
  $scope.peer_form_submit = function(questions){
    var score=0;
    for(i in questions) {
      score = score+parseFloat(questions[i].answer);
    }
    var doc = {
      "score":""+score+"",
      "review_token":""
    }
    users.put_peer_form(doc).then(function(response){
    });
  }

  $scope.init = function () {
    $scope.employees_list = [];
    users.get_employees().then(function(response){
      $scope.employees_list=response.data;
    });
  };
  $scope.init();
}]);
