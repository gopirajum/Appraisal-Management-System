var appraisalManagement_controllers = angular.module('appraisalManagement');
appraisalManagement_controllers.controller('EmployeesCtrl',['$scope', '$rootScope', '$state', 'employees', 'session',
  function($scope, $rootScope, $state, employees, session) {
  $scope.init = function() {
    $scope.personal_details={};
    $scope.official_details={};
    session.get_user().then(function(current_user) {
      if(current_user != null) {
        console.log(current_user);
        if(current_user.personal_details.designation == "HR"){
          $scope.employees_list = [];
          employees.get_employees().then(function(response){
            $scope.employees_list=response.data;
          });
        }else{
          $scope.personal_details=current_user.personal_details;
          $scope.personal_details.date=new Date($scope.personal_details.date);
          $scope.official_details=current_user.official_details;
          if($scope.official_details.joining_date){
           $scope.official_details.joining_date=new Date($scope.official_details.joining_date);
          }
        }
      } else {
        $state.go('root');
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

  $scope.update_official_details = function(details){
    details.key=$scope.key;
    employees.update_official_details(details).then(function(response){
    if(details) {
      details.date = new Date(details.date);
      $scope.project=details;
    }
    $state.go('home.profile');
    });
  }

  $scope.appraisal_init = function(employeesList) {
    employees.appraisal_init(employeesList).then(function(response){
    });
  }

  $scope.get_selected_employee = function(index){
   //console.log(" in controller "+$scope.employees_list[index]);
   var emp = $scope.employees_list[index];
   //console.log("in controller"+JSON.stringify(emp));
   if(emp.personal_details.date){emp.personal_details.date = new Date(emp.personal_details.date);}
   if(emp.official_details.joining_date){emp.official_details.joining_date= new Date(emp.official_details.joining_date);}
   $scope.personal_details=emp.personal_details;
   $scope.official_details=emp.official_details;
   $scope.key=emp.key;
   $scope.questions=emp.questions;

  }

  $scope.put_self_score = function(score){
    var doc={
      "submitted_by":$scope.key,
      "self_score":score
    }
    employees.put_self_score(doc).then(function(response){
    console.log("in controller 81 res"+JSON.stringify(response.data));
    $scope.score=response.data;
    $state.go('home.progress');
    });
  }

  $scope.progress_load = function(){
    $scope.score=employees.get_score();
    var overall = parseFloat($scope.score.peer_score)+parseFloat($scope.score.self_score);
    overall=overall/2;
    $scope.score.overall_score=overall;
  }



  $scope.init();
}]);
