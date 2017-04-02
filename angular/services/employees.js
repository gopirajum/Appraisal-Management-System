angular.module('appraisalManagement').service('employees', ['$http', '$stateParams', '$rootScope', 'toastr',
  function($http, $stateParams, $rootScope, toastr) {
  var score={};

  var get_score = function(){
    return score;
  }
    
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

  var update_official_details = function(details){
    return $http.post('/updateOfficialDetails',details).success(function(response) {
      //$rootScope.current_user = details.email;
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

  //self form questions loading
  var self_form_load = function(){
    return $http.post('/self_form_load').success(function(response) {

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

  //submitting self form
  var put_self_form = function(doc){
    doc.review_token=$stateParams.review_token;
    return $http.post('PutSelfForm',doc).success(function(response) {
      toastr.success('Self Review Successful');
    }).error(function(response) {
      toastr.error('Failed to review');
    });
  }

  //submitting self score
  var put_self_score = function(doc){
    return $http.post('PutSelfScore',doc).success(function(response) {
      score=response;
      console.log("in service"+score);
      toastr.success('Rating Successful');
    }).error(function(response) {
      toastr.error('Failed to rate');
    });
  }


  // public methods
  return {
    add_employee: add_employee,
    update_employee: update_employee,
    update_official_details: update_official_details,
    peer_form_load: peer_form_load,
    self_form_load: self_form_load,
    appraisal_init: appraisal_init,
    get_employees:get_employees,
    put_peer_form:put_peer_form,
    put_self_form:put_self_form,
    put_self_score:put_self_score,
    get_score:get_score,
    model: {
      get: get_default
    }
  }
}]);
