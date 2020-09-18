'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'myApp.version',
  'ui.bootstrap',
  'uiGmapgoogle-maps',
  'ngWebSocket',
  'ngGeolocation'
  
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.when('/session', {templateUrl: 'views/chat.html', controller: 'ChatCtrl'});
  $routeProvider.when('/', {templateUrl: 'views/inicio.html', controller: 'InicioCtrl'});
  $routeProvider.when('/registro', {templateUrl: 'views/registro.html', controller: 'RegistroCtrl'});
  $routeProvider.when('/comofunciona', {templateUrl: 'views/comofunciona.html', controller: 'ComoFuncionaCtrl'});
  $routeProvider.when('/map', {templateUrl: 'views/map.html', controller: 'MapCtrl'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}])
.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDt4Y3LBIPNE5HxvW6nWnC7J7rcchI-vOc',
        v: '3',
        libraries: 'weather,geometry,visualization'
    });
});
