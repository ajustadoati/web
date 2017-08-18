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
  $routeProvider.when('/map', {templateUrl: 'views/map.html', controller: 'MapCtrl'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}])
.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDxTT2I0UOh0z3gE1yp8VWhty0q7ra5jk4',
        v: '3',
        libraries: 'weather,geometry,visualization'
    });
});