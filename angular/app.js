// app.js
var routerApp = angular.module('appraisalManagement', [
  'ngAnimate',
  'ui.router',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAria',
  'ngMaterial',
  'ngMessages',
  'ui.bootstrap',
  'LocalStorageModule',
  'toastr',
  'ngFileUpload',
  'angularLoad',
  'ngMdIcons'
]);
routerApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('root', {
    url: '/',
    templateUrl: '/angular/views/auth/login.html'
  })
  .state('reset_password', {
    url: '/reset_password/:access_token',
    templateUrl: '/angular/views/auth/reset_password.html'     
  })
  .state('home', {
    url: '/home',
    templateUrl: '/angular/views/shared/home.html'
  })
  .state('home.profile', {
    url: '/profile',
    views: {
      'container': {
        templateUrl: '/angular/views/shared/profile.html',
      }
    }
  })
  .state('home.add_employee', {
    url: '/add_employee',
    // controller:'EmployeesCtrl',
    views: {
      'container': {
        templateUrl: '/angular/views/admin/add_employee.html'
      }
    }
  })
  .state('home.appraisal_init', {
    url: '/appraisal_init',
     //controller:'addEmployeeCtrl',
    views: {
      'container': {
        templateUrl: '/angular/views/admin/appraisal_init.html'
      }

    }
  })
  .state('home.peer_form', {
   url: '/peer_form/:review_token',
   views: {
     'container': {
       templateUrl: '/angular/views/reviews/peer_form.html',
     }
   }
  })
    .state('home.admin_page', {
   url: '/admin_page',
    //controller:'addEmployeeCtrl',
   views: {
     'container': {
       templateUrl: '/angular/views/admin/admin_page.html',
       controller:'EmployeesCtrl'
     }

   }
  })
  .state('home.appraisal', {
   url: '/appraisal',
    //controller:'addEmployeeCtrl',
   views: {
     'container': {
       templateUrl: '/angular/views/admin/appraisal.html',
       controller:'EmployeesCtrl'
     }

   }
  })
  .state('home.self_form', {
   url: '/self_form/:self_token',
   views: {
     'container': {
       templateUrl: '/angular/views/reviews/self_form.html',
     }
   }
  });
});