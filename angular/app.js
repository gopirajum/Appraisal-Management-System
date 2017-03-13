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
  'toaster',
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
    url: '/reset_password',
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
     //controller:'addEmployeeCtrl',
    views: {
      'container': {
        templateUrl: '/angular/views/admin/add_employee.html'
      }

    }
  });
});