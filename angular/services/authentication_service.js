angular.module('appraisalManagement').service('users', ['$http', '$stateParams', '$rootScope', 'toaster',
  function($http, $stateParams, $rootScope, toaster) {
    
  var get_default = function() {
    return {
      list: [],
      single: {},
      statuses: []
    };
  }

  var login = function(credentials){
    //console.log("credentials in service:"+credentials.email+" "+credentials.password);
    return $http.post('/auth',credentials).success(function(response) {
        $rootScope.current_user = response;
        //console.log($rootScope.current_user);
    }).error(function(response) {
      console.log("in service.js else part");
      toaster.error('Something went wrong','Error');
    });
  }


  var add_employee = function(details){

    return $http.post('/addEmployee',details).success(function(response) {
        $rootScope.current_user = response;
        //console.log($rootScope.current_user);
    }).error(function(response) {
      console.log("in service.js, add_details else part");
      toaster.error('Something went wrong','Error');
    });
  }

  // public methods
  return {
    list: {
      
    },
    single:{
      
    },
    login: login,
    add_employee: add_employee,
    model: {
      get: get_default
    }
  }
  
}]);
