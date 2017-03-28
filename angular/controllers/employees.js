var appraisalManagement_controllers = angular.module('appraisalManagement');
appraisalManagement_controllers.controller('EmployeesCtrl',['$scope', '$rootScope', '$state', 'employees', 'session',
  function($scope, $rootScope, $state, employees, session) {

  $scope.init = function() {
    session.get_user().then(function(current_user) {
      if(current_user != null) {
        if(current_user.role == "hiring_manager"){
          console.log(current_user);
          $scope.employees_list = [];
          employees.get_employees().then(function(response){
            $scope.employees_list=response.data;
          });
        }
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

  $scope.appraisal_init = function(employees) {
    employees.appraisal_init(employees).then(function(response){
    });
  }

  $scope.get_selected_employee = function(index){
   //console.log(" in controller "+$scope.employees_list[index]);
   var emp = $scope.employees_list[index];
   emp.date= new Date(emp.date);
   $scope.project=emp;

  }


  $scope.init();
}]);
