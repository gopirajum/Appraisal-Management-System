var appraisalManagement_controllers = angular.module('appraisalManagement');
appraisalManagement_controllers.controller('EmployeesCtrl',['$scope', '$rootScope', '$state', 'employees', 'session',
  function($scope, $rootScope, $state, employees, session) {

  $scope.init = function() {
    session.get_user().then(function(current_user) {
      if(current_user != null) {
        console.log(current_user)
        $scope.employees_list = [];
        employees.get_employees().then(function(response){
          $scope.employees_list=response.data;
        });
      } else {
        $state.go('root')
      }
    })
  }

  //adding new employee by admin
  $scope.add_employee = function(details) {
    employees.add_employee(details).then(function(response){
    });
  }

  //updating the personal information
  $scope.update_employee = function(details) {
    employees.update_employee(details).then(function(response){
    if(details) {
      details.date = new Date(details.date);
      $scope.project=details;
    }
    $state.go('home.profile');
    });
  }

  //review_form
  $scope.peer_form_init = function () {
    employees.peer_form_load().then(function(response){
      var details=response.data;
      if(details){
        $scope.questions=details;
      }
    });
  }

  $scope.appraisal_init = function(employees) {
    employees.appraisal_init(employees).then(function(response){
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
    employees.put_peer_form(doc).then(function(response){
    });
  }

  $scope.init();
}]);
