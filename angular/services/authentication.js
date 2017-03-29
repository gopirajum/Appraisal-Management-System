angular.module('appraisalManagement').service('users', ['$http', '$stateParams', '$rootScope', 'toastr',
  function($http, $stateParams, $rootScope, toastr) {
    
  var get_default = function() {
    return {
      list: [],
      single: {},
    };
  }

  var login = function(credentials){
    return $http.post('/auth',credentials).success(function(response) {
      //$rootScope.current_user = credentials.email;
      toastr.success('Login successful');
    }).error(function(response) {
      toastr.error('Invalid credentials');
    });
  }

  var reset_password = function(credentials){
    credentials.access_token=$stateParams.access_token;
    return $http.post('/reset_password',credentials).success(function(response) {
      toastr.success('Password Reset Successful');
    }).error(function(response) {
      toastr.error('Failed to update password');
    });
  }

  // public methods
  return {
    login: login,
    reset_password: reset_password,
    model: {
      get: get_default
    }
  }
  
}]);
