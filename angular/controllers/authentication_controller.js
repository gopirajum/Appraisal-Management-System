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
      
         //$state.go('home.profile');
      
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

  //reset_password
  $scope.reset_password = function(credentials) {
    //console.log("in controller reset");

    users.reset_password(credentials).then(function(response){
        

    $state.go('root');
      
    });
  }

  //review_form
  $scope.peer_form_init = function () {
    users.peer_form_load().then(function(response){
      var details=response.data;
        
        if(details){
          //details.date=new Date(details.date);
          $scope.questions=details;
        }

    });
  }
  // and fire it after definition
  //init();

  $scope.appraisal_init = function(employees)
  {
    /*var employees=[{ "_id" : "58c98c4166a5600c86787967", "name" : "Akkineni Susmitha", "code" : "234", "date" : "1995-12-26T18:30:00.000Z", "father_name" : "Akkineni Nagaraju", "gender" : "female", "email" : "susmitha.akkineni999@gmail.com", "designation" : "Intern", "phone_number" : 9652585378, "key" : "58c98c4166a5600c86787966"},
                   { "_id" : "58cfa9b3e7493e2f258008dc", "name" : "Samhitha Venkatesh", "code" : "123", "date" : "1996-07-27T18:30:00.000Z", "father_name" : "Venkatesh", "gender" : "female", "email" : "samhitha2896@gmail.com", "designation" : "Intern", "phone_number" : 8985538903, "key" : "58cfa9b3e7493e2f258008db" }
                  ];*/
    users.appraisal_init(employees).then(function(response){
      //on success
    });
  }

  //submitting peer form
  $scope.peer_form_submit = function(questions){
    var score=0;
    for(i in questions){
    //console.log("in controller "+questions[i].answer);
    score=score+parseFloat(questions[i].answer);
    }
    var doc={
      "score":""+score+"",
      "review_token":""
    }
    users.put_peer_form(doc).then(function(response){
      //on success
    });
  }

  $scope.init = function () {
   $scope.employees_list = [];
   users.get_employees().then(function(response){
     $scope.employees_list=response.data;
   });
   console.log("controller "+$scope.employees_list);
  };
// and fire it after definition
$scope.init();
  
}]);