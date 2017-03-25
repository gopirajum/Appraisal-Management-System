angular.module('appraisalManagement').service('employees', ['$http', '$stateParams', '$rootScope', 'toastr',
  function($http, $stateParams, $rootScope, toastr) {
    
  var get_default = function() {
    return {
      list: [],
      single: {},
    };
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

  var peer_form_load = function(){
    return $http.post('/peer_form_load').success(function(response) {

    }).error(function(response) {
      toastr.error('Failed to Load page');
    });
  }

  //after adding employees sending mails
  var appraisal_init = function(employees){
    return $http.post('/appraisal_init',employees).success(function(response) {
      //$rootScope.current_user = details.email;
      toastr.success('Successfully sent');
    }).error(function(response) {
      toastr.error('Unable to send');
    });
  }
  
  var get_employees = function(){
   return $http.post('/GetEmployees').success(function(response) {
    // employees = response;
   }).error(function(response) {
      toastr.error('Unable to fetch');
   });
  }

  //submitting peer form
  var put_peer_form = function(doc){
    doc.review_token=$stateParams.review_token;
    return $http.post('PutPeerForm',doc).success(function(response) {
      toastr.success('Peer Review Successful');
    }).error(function(response) {
      toastr.error('Failed to review');
    });
  }

  // public methods
  return {
    add_employee: add_employee,
    update_employee: update_employee,
    peer_form_load: peer_form_load,
    appraisal_init: appraisal_init,
    get_employees:get_employees,
    put_peer_form:put_peer_form,
    model: {
      get: get_default
    }
  }
}]);
