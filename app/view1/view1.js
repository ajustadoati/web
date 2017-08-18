'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope','$websocket', function($scope, $websocket) {
    console.log("cargando InicioCtrl");
    var url="ws://ajustadoati.com:8080/ajustadoatiWS/openfire";
      var ws = $websocket(url);
      //aqui se reciben las respuestas de los proveedores         
      ws.onMessage(function(message) {
        console.log("receiving"+message.data);
        var obj = JSON.parse(message.data);

        console.log("receiving from: "+obj.latitud);
        console.log("message: "+obj.longitud);
        //var user=$scope.getUser(obj.user);
        
        //console.log("obteniendo usuario: "+user.nombre);
        $scope.addLocation(obj.latitud, obj.longitud);
        //collection.push(message.data);
      });

      $scope.getUser=function(login){
        console.log("getUser"+login);
        var user={};
        UserOFService.getUser(login, function(data){
          console.log("data: "+data.nombre);
          user=data;
        });
        return user;
      }

      ws.onOpen(function(){
        console.log("Abriendo websocket");
      })


  }])
.controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
})

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});