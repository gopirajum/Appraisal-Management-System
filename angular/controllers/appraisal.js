var appraisalManagement_controllers = angular.module('appraisalManagement');
appraisalManagement_controllers.controller('AppraisalCtrl',['$scope', '$rootScope', '$state', 'employees', 'session',
  function($scope, $rootScope, $state, employees, session) {

  	$scope.init = function() {
  		//console.log("state is"+$state.current.name);
  		if($state.current.name=="home.self_form"){
		  	employees.self_form_load().then(function(response){
		      var details=response.data;
		      if(details){
		        $scope.questions=details;
		      }
			});
  		}else if($state.current.name=="home.peer_form"){
    		employees.peer_form_load().then(function(response){
      			var details=response.data;
      			if(details){
        			$scope.questions=details;
      				}
    		});
  		}
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

    //submitting self form
    $scope.self_form_submit = function(questions){
	    var doc = {
	      "questions":questions,
	      "review_token":""
	    }
	    employees.put_self_form(doc).then(function(response){
	    });
    }

  	$scope.init();



}]);