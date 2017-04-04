angular.module('appraisalManagement').factory('session', ['$http', '$stateParams', '$rootScope', 
  '$q', 'toastr', 'localStorageService', function($http, $stateParams, $rootScope, $q, toastr, localStorageService) {
  
  var set_current_user = function(details){
    localStorageService.set('current_user', JSON.stringify(details));
  }

  var get_current_user = function(){
    var defer = $q.defer();
    var user = JSON.parse(localStorageService.get('current_user'));
    defer.resolve(user);
    return defer.promise;
  }

  var logout = function() {
    localStorageService.remove('current_user');
  }

  // public methods
  return {
    get_user: get_current_user,
    set_user: set_current_user,
    logout: logout
  }
}]);
