'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }])
  .controller('ChatCtrl', ['$scope', function($scope) {
    console.log("cargando chat xmpp");

  }])

  .controller('InicioCtrl', ['$scope','$websocket', function($scope, $websocket) {
    console.log("cargando InicioCtrl");
    


  }])
   .controller('ComoFuncionaCtrl', ['$scope','$websocket', function($scope, $websocket) {
    console.log("cargando ComoFuncionaCtrl");
    


  }])
  .controller('RegistroCtrl', ['MarkerCreatorService', '$scope', 'CategoriaService','$http','filterFilter', '$uibModal', function(MarkerCreatorService, $scope, categoriaService, $http, filterFilter, $uibModal) {
        $scope.categorias={};
        $scope.cat=[];
        $scope.proveedor={};
        $scope.proveedor.categorias=[];
        $scope.proveedor.usuario={};
        $scope.proveedor.usuario.latitud="";
        $scope.proveedor.usuario.longitud="";
        $scope.consulta={};
        $scope.consulta.cliente={};
        $scope.consulta.categoria={};
        $scope.consulta.producto="";
        //carga las categorias desde el servidor
        categoriaService.getCategorias(function(data) {
            console.log("obteniendo categoria"+data.length);
             for(var i=0; i<data.length;i++){
              var categoria={};

              categoria.selected=false;
              categoria.id=i;
              categoria.nombre=data[i].nombre;
              categoria.descripcion=data[i].descripcion;
              $scope.cat.push(categoria);

             }

            

        });
        $scope.cat.sort();
        //arreglo donde se almacenan las categorias seleccionadas 
        $scope.selection = [];
        //metodo que crea el proveedor
        $scope.createProveedor = function (formRegistro) {
          if($scope.selection.length > 0){
                console.log("guardando proveedor !!"+ $scope.proveedor);
                console.log("nombre: "+$scope.proveedor.usuario.nombre);
                console.log("email: "+$scope.proveedor.usuario.email);
                console.log("lat: "+$scope.proveedor.usuario.latitud);
                console.log("long: "+$scope.proveedor.usuario.longitud);
                console.log("user: "+$scope.proveedor.usuario.user);
                console.log("pass: "+$scope.proveedor.usuario.password);
                

              for(var i=0; i<$scope.selection.length;i++){
                  console.log("categorias:"+$scope.selection[i].nombre);
                  var categoria={};
                  //categoria.id=$scope.selection[i];
                  categoria.nombre=$scope.selection[i].nombre;
                  categoria.descripcion=$scope.selection[i].descripcion;
                  $scope.proveedor.categorias.push(categoria);
              }
              for(var i=0; i<$scope.proveedor.categorias.length;i++){
                console.log("categoriasrazon:"+$scope.proveedor.categorias[i].nombre);
                
              }
              
                var url = 'https://ajustadoati.com:9000/ajustadoati/proveedor/';

                var config = {headers: {'Content-Type': 'application/json; charset=UTF-8'}};

                $http.post(url, $scope.proveedor, config)
                    .success(function (data) {
                        console.log("Proveedor Registrado");
                        $scope.open('sm')
                        $scope.proveedor={};
                    })
                    .error(function(data, status, headers, config) {
                        console.log("error creando proveedor"+headers);
                    });
          }else{
            console.log("No ha seleccionado categoria - no puede registrar usuario");
          }

        };
        //cateogorias seleccionadas
        $scope.selectedCategorias = function selectedCategorias() {
              console.log("category selected");
              return filterFilter($scope.cat, { selected: true });
        };
        //actualiza el arreglo de categorias
        $scope.$watch('cat|filter:{selected:true}', function (nv) {

                    $scope.selection = nv.map(function (categoria) {
                      return categoria;
                    });
        }, true);
        //address para carga la ubicacion manual
        $scope.address = '';
        //mapa cargado con valores iniciales
        $scope.map = {
            center: {
                latitude: 8.6288551,
                longitude: -71.08868810000001
            },
            zoom: 13,
            markers: [],
            control: {},
            options: {
                scrollwheel: false
            },
            events: {
              click: function (map, eventName, originalEventArgs) {
                  var e = originalEventArgs[0];
                  var lat = e.latLng.lat(),lon = e.latLng.lng();
                  var marker = {
                      id: 0,
                      coords: {
                          latitude: lat,
                          longitude: lon
                      }
                  };
                  $scope.map.markers.push(marker);
                  console.log($scope.map.markers);
                  $scope.$apply();
              }
            }
        }
        //obtiene la ubicacion actual
        MarkerCreatorService.createByCurrentLocation(function (marker) {
                
                $scope.proveedor.usuario.latitud=marker.coords.latitude;
                $scope.proveedor.usuario.longitud=marker.coords.longitude;
                $scope.map.markers.push(marker);
                refresh(marker);
        });

        //metodo para cargar ubicacion manual
        $scope.addAddress = function() {
            var address = $scope.address;
            if (address !== '') {
                MarkerCreatorService.createByAddress(address, function(marker) {
                    $scope.map.markers.pop();
                    $scope.map.markers.push(marker);
                    $scope.proveedor.usuario.latitud=marker.coords.latitude;
                    $scope.proveedor.usuario.longitud=marker.coords.longitude;
                    refresh(marker);
                });
            }
        };
        //metodo que refresca el mapa cada vez que se agrega un marcador
        function refresh(marker) {
            $scope.map.control.refresh({latitude: marker.coords.latitude,
                longitude: marker.coords.longitude});
        }


        //metodo que abre el popup de busqueda
  $scope.open = function (size) {
      
      var modalInstance = $uibModal.open({
          templateUrl: 'popupContent.html',
          controller: 'ModalPopupCtrl',
          size: size,
          resolve: {
            
          }
      });
      
      //envia los parametros de busqueda al controller del popup
      modalInstance.result.then(function (selectedItem) {
        
      }, function () {
        //se inicializa la consulta
        
        $log.info('Modal dismissed at: ' + new Date());
      });
     
  };
}])

.controller('ModalPopupCtrl', function ($scope, $modalInstance, $http){
  console.log("cargando ctrl popup");
  $scope.ok = function () {
    $modalInstance.close();
  };
})
// controller de prueba para map
.controller('MapCtrl', ['MarkerCreatorService', '$scope', function (MarkerCreatorService, $scope) {
  console.log("cargando ctrl map");

        MarkerCreatorService.createByCoords(8.6288551, -71.08868810000001, function (marker) {
            marker.options.labelContent = 'Richard';
            $scope.autentiaMarker = marker;
        });
        
        $scope.address = '';

        $scope.map = {
            center: {
                latitude: $scope.autentiaMarker.latitude,
                longitude: $scope.autentiaMarker.longitude
            },
            zoom: 12,
            markers: [],
            control: {},
            options: {
                scrollwheel: false
            }
        };

        $scope.map.markers.push($scope.autentiaMarker);

        $scope.addCurrentLocation = function () {
            MarkerCreatorService.createByCurrentLocation(function (marker) {
                marker.options.labelContent = 'You´re here';
                $scope.map.markers.push(marker);
                refresh(marker);
            });
        };
        
        $scope.addAddress = function() {
            var address = $scope.address;
            if (address !== '') {
                MarkerCreatorService.createByAddress(address, function(marker) {
                    $scope.map.markers.push(marker);
                    refresh(marker);
                });
            }
        };

        function refresh(marker) {
            $scope.map.control.refresh({latitude: marker.latitude,
                longitude: marker.longitude});
        }

    }])
//controller del modal que hace la busqueda
.controller('ModalCtrl', function ($scope, $uibModal, $log, CategoriaService) {

  $scope.categoriaSelected={};  
  $scope.cat=[];  
  $scope.consulta={};
  $scope.consulta.usuario={};
  $scope.consulta.usuario.latitud=0.0;
  $scope.consulta.usuario.longitud=0.0;
  $scope.consulta.categoria={};
  $scope.consulta.producto={};

  $scope.formConsulta={};

  //llamada a servicio de catogorias para mostrar en el select de busqueda
  CategoriaService.getCategorias(function(data) {
    for(var i=0; i<data.length;i++){
      var categoria=[];
      categoria.selected=false;
      //categoria.id=data[i].id;
      categoria.nombre=data[i].nombre;
      categoria.descripcion=data[i].descripcion;
      $scope.cat.push(categoria);
    }
  });
  //metodo que toma el valor de la categoria seleccionada
  $scope.changedValue = function(categoria) {
    if(categoria){
      console.log("categoria in modalctrl: "+categoria.nombre);
      $scope.consulta.categoria.nombre=categoria.nombre;
      $scope.consulta.categoria.descripcion=categoria.descripcion; 
    }
  }  
  //metodo que abre el popup de busqueda
  $scope.open = function (size) {
      
      var modalInstance = $uibModal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            items: function () {
              return $scope.consulta;
            },
            consulta:function(){
              return $scope.consulta;
            }
          }
      });
      
      //envia los parametros de busqueda al controller del popup
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        //se inicializa la consulta
        $scope.consulta.producto="";
        $scope.consulta.categoria={};
        $scope.formConsulta.$setPristine();
        $log.info('Modal dismissed at: ' + new Date());
      });
     
  };

  
})

//controller del modal
.controller('ModalInstanceCtrl', function ($scope, $modalInstance, MarkerCreatorService, consulta, $websocket, $http, uiGmapIsReady, uiGmapGoogleMapApi
  ) {

  $scope.consulta=consulta;
  //se crea un usuario anonimo con el long time para que no se repita
  var x = new Date();
  $scope.consulta.usuario.user="anonimo"+x.getTime();
  $scope.consulta.usuario.password="anonimo";
  $scope.consulta.usuario.email="anonimo";
  $scope.consulta.usuario.nombre="anonimo";
  $scope.consulta.usuario.telefono="anonimo";
  $scope.consulta.producto.descripcion=$scope.consulta.producto.nombre;
  $scope.consulta.producto.id=0;
  $scope.proveedores={}
  $scope.consulta.usuario.longitud="";
  $scope.consulta.usuario.latitud="";

  $scope.formConsulta={};
  // metodo para salir del modal
  $scope.ok = function () {
    $scope.formConsulta;
    $modalInstance.close();
  };
  // metodo para salir del modal
  $scope.cancel = function () {
    
    $modalInstance.dismiss('cancel');
  };

   $scope.googlemap = {};
        $scope.map = {
            center: {
                latitude: 37.78,
                longitude: -122.41
            },
            zoom: 13,
            pan: 1,
            options: $scope.mapOptions,
            markers:[],
            control: {},
            events: {
                tilesloaded: function (maps, eventName, args) {},
                dragend: function (maps, eventName, args) {},
                zoom_changed: function (maps, eventName, args) {}
            }
        };
    $scope.windowOptions = {
        show: false
    };
    //metodo que mustra la info del marcador (proveedor)
    $scope.onClick = function (data) {
        $scope.windowOptions.show = !$scope.windowOptions.show;
        console.log('$scope.windowOptions.show: ', $scope.windowOptions.show);
        console.log('This is a ' + data);
    };
    //metodo que cierra info del marcador
    $scope.closeClick = function () {
        $scope.windowOptions.show = false;
    };
    $scope.title = "Window Title!";

    //metodo que agrega el evento click a los marcadores
    $scope.addMarkerClickFunction = function (markersArray) {
        angular.forEach(markersArray, function (value, key) {
            value.onClick = function () {
                $scope.onClick(value.nombre);

                $scope.MapOptions.markers.selected = value;
                
            };
        });
    };
    //opciones de marcadores
    $scope.MapOptions = {
        minZoom: 3,
        zoomControl: false,
        draggable: true,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        disableDoubleClickZoom: false,
        keyboardShortcuts: true,
        markers: {
            selected: {}
        },
        styles: [{
            featureType: "poi",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "transit",
            elementType: "all",
            stylers: [{
                visibility: "off"
            }]
        }],
    };
    //metodo que agrega evento click a maracor 
    $scope.addMarkerClick = function (marker) {
        
          
              marker.onClick = function () {
                console.log("markerclick: onclick - "+marker.nombre);
                  $scope.onClick(marker.data);
                  $scope.mapOptions.markers.selected = marker;
              };
          
      };
      //metodo que carga ubicacion actual
     MarkerCreatorService.createByCurrentLocation(function (marker) {
                console.log("cargando posicion");
                $scope.consulta.usuario.latitud=marker.coords.latitude;
                $scope.consulta.usuario.longitud=marker.coords.longitude;
                
                marker.options = {
                  icon: 'img/home-2.png'
                  
                };
                

                $scope.map.markers.push(marker);
                $scope.addMarkerClickFunction($scope.map.markers);
                refresh(marker);
                $scope.createConsulta();
          
     });

    //se crea la conexion al websocket cuando carga el controller
    var url="wss://ajustadoati.com:8443/ajustadoatiWS/openfire";
    var ws = $websocket(url);
    //aqui se reciben las respuestas de los proveedores         
    ws.onMessage(function(message) {
      console.log("receiving"+message.data);
      var obj = JSON.parse(message.data);
      console.log("receiving from: "+obj.latitud);
      console.log("message: "+obj.longitud);
      $scope.setMensajeProveedor(obj.user, obj.message);
    });
    //metodo que agrega el mensaje en el objeto proveedor cuando responde
    $scope.setMensajeProveedor=function(user, mensaje){
        var resultado = "";
        for (var i=0;i<$scope.map.markers.length;i++) {
          console.log("agregando mensaje a proveedor con imagen:  "+$scope.map.markers[i].usuario)
          if (user === $scope.map.markers[i].usuario) {
              
              console.log("proveedor: "+$scope.map.markers[i].usuario)
              resultado = $scope.map.markers[i];
              $scope.map.markers[i].mensaje=mensaje;
              $scope.map.markers[i].mensaje
              $scope.map.markers[i].options = {
                  icon: 'img/smiley_happy.png'
                  
                };
              $scope.map.markers[i].animation=google.maps.Animation.DROP;

              
          }
        }
        return resultado;
    }
    //metodo que obtiene el usuario desde servidor jabber
    $scope.getUser=function(login){
        console.log("getUser"+login);
        var user={};
        UserOFService.getUser(login, function(data){
          console.log("data: "+data.nombre);
          user=data;
        });
        return user;
    }
    //metodo usado para crear proveedor y agregar al marcador
    $scope.getProveedor=function(data){
        console.log("getUser"+data.nombre);
        var usuario = {
            mensaje:"mensaje",
            nombre:data.nombre,
            direccion:data.direccion,
            telefono:data.telefono,
            usuario:data.user,
            id: data.id          
        };
          
        return usuario;
    }
    //metodo que se carga cuando conecta al websocket
    ws.onOpen(function(){
      console.log("Abriendo websocket para realizar busqueda");
    })
          
    $scope.selection = [];
    var resp="";
    var men="";
    //metodo para refrescar marcadores
    function refresh(marker) {
      console.log("refreshing");
      $scope.map.control.refresh({latitude: marker.coords.latitude,
                longitude: marker.coords.longitude});
    }

    $scope.addLocation= function(latitud, longitud, data){
      console.log("creando la location del proveedor");
      MarkerCreatorService.createByCoords(latitud, longitud, data, function (marker) {
        marker.options = {
                  icon: 'img/smiley.png'
                  
                };
        $scope.map.markers.push(marker);
        //$scope.addMarkerClick(marker);
            $scope.addMarkerClickFunction($scope.map.markers);
            //refresh(marker);
          });
    }

    $scope.createConsulta = function () {
        console.log("longitud cliente"+$scope.consulta.usuario.longitud);
        console.log("latitud cliente"+$scope.consulta.usuario.latitud);
        $scope.consulta.producto.descripcion=$scope.consulta.producto.nombre;
        $scope.consulta.producto.id=0;    
        var url = 'https://ajustadoati.com:9000/ajustadoati/consulta/';
        var config = {headers: {'Content-Type': 'application/json; charset=UTF-8'}};
        console.log("guardando consulta !!"+$scope.consulta.categoria.nombre);
        var latitud="";
        var longitud="";
        $http.post(url, $scope.consulta, config).success(function (data) {
            console.log("Consulta Creada"+data);
            $scope.proveedores=data;
            men=$scope.consulta.producto.nombre;
            latitud = $scope.consulta.usuario.latitud;
            longitud = $scope.consulta.usuario.longitud;
            $scope.consulta={};
        }).error(function(data, status, headers, config) {
          console.log("error creando registro");
          $scope.consulta={};
        }).finally(function(data){
          //se recorre por la lista de proveedores
          for(var i=0; i<$scope.proveedores.length; i++){
            console.log("proveedor: "+$scope.proveedores[i].usuario.user);
            //se agrega cada proveedor al mapa
            var proveedor=$scope.getProveedor($scope.proveedores[i].usuario);
            $scope.addLocation($scope.proveedores[i].usuario.latitud, $scope.proveedores[i].usuario.longitud, proveedor);
            /*uiGmapIsReady.promise().then(function (map_instances) {
                    $scope.map.control.refresh({latitude: marker.latitude,longitude: marker.longitude});
                   
                    //$scope.addMarkerClick(mark);
                });*/
            if($scope.proveedores.length==(i+1)){
              console.log("fin de ciclo");
              resp=resp+$scope.proveedores[i].usuario.user;
            }else{
              console.log("sigue el ciclo");
              resp=resp+$scope.proveedores[i].usuario.user+"&&";
            }
          }
          console.log("data a proveedores"+$scope.map.markers.length);
           //$scope.addMarkerClickFunction($scope.markers);
          console.log("resp"+resp);
          
          var msg = '{"mensaje":"' + men + '", "users":"'+resp+'", "latitud":"'+latitud+'", "longitud":"'+longitud+'"}';
          ws.send(msg); 
        });
      };
          
})
//controller para el template de cada marcador
.controller('templateController',function(){
  console.log("template");
});



  

  
