// app.js
var routerApp = angular.module('appriasalManagement', [
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
  'angularLoad'
]);
routerApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('root', {
    url: '/',
    templateUrl: '/angular/views/auth/login.html'
  })
  .state('home', {
    url: '/home',
    templateUrl: '/angular/views/shared/home.html'     
  })
  .state('reset_password', {
    url: '/reset_password',
    templateUrl: '/angular/views/auth/reset_password.html'     
  });
});