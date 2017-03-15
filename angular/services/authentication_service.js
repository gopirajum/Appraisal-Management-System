angular.module('appraisalManagement').service('users', ['$http', '$stateParams', '$rootScope', 'toastr',
  function($http, $stateParams, $rootScope, toastr) {
    
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
        $rootScope.current_user = credentials.email;
        toastr.success('Login successful');
    }).error(function(response) {
      //console.log("in service.js else part");
      toastr.error('Invalid credentials');
    });
  }


  var add_employee = function(details){

    return $http.post('/addEmployee',details).success(function(response) {
        $rootScope.current_user = response.email;
         toastr.success('Successfully added');
    }).error(function(response) {
      toastr.error('Unable to add');
    });
  }

  var update_employee = function(details){

    return $http.post('/updateEmployee',details).success(function(response) {
        $rootScope.current_user = details.email;
         toastr.success('Successfully updated');
    }).error(function(response) {
      toastr.error('Unable to update');
    });
  }

  var reset_password = function(credentials){
    
    credentials.access_token=$stateParams.access_token;
    return $http.post('/reset_password',credentials).success(function(response) {
        toastr.success('Password Reset Successful');
    }).error(function(response) {
      //console.log("in service.js else part");
      toastr.error('Failed to update password');
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
    update_employee: update_employee,
    reset_password: reset_password,
    model: {
      get: get_default
    }
  }
  
}]);
