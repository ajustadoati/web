'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngGeolocation',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'uiGmapgoogle-maps',
  'ngWebSocket'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'views/partial1.html', controller: 'FruitsCtrl'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/session', {templateUrl: 'partials/chat.html', controller: 'ChatCtrl'});
  $routeProvider.when('/', {templateUrl: 'partials/inicio.html', controller: 'InicioCtrl'});
  $routeProvider.when('/registro', {templateUrl: 'partial/registro.html', controller: 'RegistroCtrl'});
  $routeProvider.when('/comofunciona', {templateUrl: 'partials/comofunciona.html', controller: 'ComoFuncionaCtrl'});
  $routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: 'MapCtrl'});
  $routeProvider.when('/fruits', {templateUrl: 'views/partial1.html', controller: 'MapCtrl'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
