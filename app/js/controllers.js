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
.controller('MapCtrl', ['MarkerCreatorService', '$scope','GooglePlacesService','$timeout','$q','uiGmapIsReady', 'uiGmapGoogleMapApi', function (MarkerCreatorService, $scope, GooglePlacesService, $timeout,$q, uiGmapIsReady, uiGmapGoogleMapApi) {
  console.log("In the map ctrl");
    //opciones de marcadores
    $scope.MapOptions = {
      minZoom: 3,
      zoomControl: false,
      draggable: true,
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      disableDoubleClickZoom: false,
      keyboardShortcuts: true,
      fitBounds: true,
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
    $scope.address = '';
    
    
    var service;
    var infowindow;
    var latLng;
    $scope.addCurrentLocation = function () {
      console.log("Add current function")
      var mark;
      MarkerCreatorService.createByCurrentLocation(function (marker) {
        console.log("calling service"+marker.coords.latitude);
        latLng = new google.maps.LatLng(marker.coords.latitude, marker.coords.longitude);               
        var icon = {
            url: "img/icon_orange.png", // url
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
       
         marker.options = {
          icon: icon
          
        };  

        var request = {
          location: latLng,
          radius: '1000',
          type: ['restaurant']
        };

        $scope.map.markers.push(marker);
        $scope.refresh(marker);
        var dfd = $q.defer(),
            elem = document.createElement("div");
        service = new google.maps.places.PlacesService(elem);
        service.nearbySearch(request, callback);
        
          
      });
    };

      function callback(results, status) {
        console.log("buscando servicios"+status);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          createMarker(results);
          /*for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }*/
        }

      }

       function createMarker(places) {
          console.log("creating places"+new Date());
          var bounds = new google.maps.LatLngBounds();
          var places_markers = [];
           var icon = {
                url: "img/icon_green.png", // url
                scaledSize: new google.maps.Size(30, 30), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            };
          
          for (var i = 0, place; place = places[i]; i++) {
            console.log("place name: "+place.name);
            var image = {
              url: "img/icon_green.png",
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            var marker = {
              options : {
                icon: icon
              },  
              coords: {
                  latitude: place.geometry.location.lat(),
                  longitude: place.geometry.location.lng() 
              },
              mensaje:"mensaje",
              nombre:place.name,
              direccion:place.name,
              telefono:place.name,
              usuario:place.name,
              id: new Date()+i 
                  
            };


            /*var marker = new google.maps.Marker({
              //setMap: $scope.map,
              icon: image,
              title: place.name,
              coords: {
                  latitude: place.geometry.location.lat(),
                  longitude: place.geometry.location.lng() 
              }
            });*/
            bounds.extend(place.geometry.location);
            //var place_marker = $scope.createMarker(nearby_places[i]);
            places_markers.push(marker);
            $scope.map.markers.push(marker);
            $scope.refresh(marker);
            
          }
          
          var bound = new google.maps.LatLngBounds();
          var neraby_places_bound_center = bound.getCenter();

          // Center map based on the bound arround nearby places
          $scope.latitude = neraby_places_bound_center.lat();
          $scope.longitude = neraby_places_bound_center.lng();
          $scope.map.control.getGMap().fitBounds(bounds);
          
        }

    $scope.createCluster = function(markers){ 
    // var markerClusterer = new MarkerClusterer($scope.mymap, markers, {
      var dfd = $q.defer(),
            elem = document.createElement("div");
      var map = $scope.map;
      $scope.markers_cluster = new MarkerClusterer(elem, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
      
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

    $scope.refresh = function(marker) {
      console.log("refreshing"+marker.coords.latitude);
      
      $scope.map.control.refresh({latitude: marker.coords.latitude,
            longitude: marker.coords.longitude});

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
      console.log("categoria in modalctrl modified: "+categoria.nombre);
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
.controller('ModalInstanceCtrl', function ($scope, $modalInstance, MarkerCreatorService, consulta, $websocket, $http, uiGmapIsReady, uiGmapGoogleMapApi, GooglePlacesService, $q
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
  $scope.consultaId="";
  $scope.map={};

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

    $scope.windowOptions = {
        show: false
    };
    //metodo que mustra la info del marcador (proveedor)
    $scope.onClick = function (data) {
        $scope.windowOptions.show = !$scope.windowOptions.show;
        console.log('$scope.windowOptions.show: ');
        
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
                $scope.onClick(value.telefono);

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
      streetViewControl: true,
      disableDoubleClickZoom: false,
      keyboardShortcuts: true,
      fitBounds: true,
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
    //metodo que agrega evento click a maracor 
    $scope.addMarkerClick = function (marker) {
        marker.onClick = function () {
          console.log("markerclick: onclick - "+marker.nombre);
            $scope.onClick(marker.data);
            $scope.mapOptions.markers.selected = marker;
        };
        
    };
    var service;
    var infowindow;
    var latLng;
      //metodo que carga ubicacion actual
     MarkerCreatorService.createByCurrentLocation(function (marker) {
        console.log("cargando posicion");
        $scope.consulta.usuario.latitud=marker.coords.latitude;
        $scope.consulta.usuario.longitud=marker.coords.longitude;
        var icon = {
            url: "img/icon_green.png", // url
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
       
        marker.options = {
          icon: icon,
          nombre: "! Usted esta aqu&iacute; !",
          telefono: "Sin n&uacute;mero"
        };  
        
        $scope.map.markers.push(marker);
        $scope.addMarkerClickFunction($scope.map.markers);
        refresh(marker);
        latLng = new google.maps.LatLng(marker.coords.latitude, marker.coords.longitude); 
        var request = {
          location: latLng,
          radius: '3000',
          type: $scope.consulta.categoria.descripcion
        };

        var dfd = $q.defer(),
            elem = document.createElement("div");
        service = new google.maps.places.PlacesService(elem);
        service.nearbySearch(request, callback);
        $scope.createConsulta();
          
     });

    function callback(results, status) {
      console.log("buscando servicios"+status);
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
      }

    }

     async function createMarkers(places) {
      
      var bounds = new google.maps.LatLngBounds();
      var places_markers = [];
      var icon = {
          url: "img/icon_orange.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
      };
        for (let i = 0; i < places.length; i++) {
          var dfd = $q.defer(),
          elem = document.createElement("div");
          //agregar horario
          var request = { placeId: places[i].place_id,fields: ['name', 'place_id', 'rating', 'international_phone_number', 'geometry','formatted_phone_number'] };
          var service = new google.maps.places.PlacesService(elem);
          var phone = "";
          await service.getDetails(request, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (let j = 0; j < $scope.map.markers.length; j++) {
                if(place.place_id === $scope.map.markers[j].id){
                  if ((typeof place.international_phone_number !== "undefined") && (typeof place.international_phone_number !== ""))
                    $scope.map.markers[j].telefono = place.international_phone_number;
                  else
                    $scope.map.markers[j].telefono = "No registrado";
                }
              }
              //successful(place);
              //typeof callback === 'function' && callback(detail);
            }
          }, function(){
              console.log("fail");
          });
          //var place_marker = createMarker(place);
          bounds.extend(places[i].geometry.location);
          //var place_marker = $scope.createMarker(nearby_places[i]);
          var marker = {};
          marker = {
              options : {
                icon: icon
              },  
              coords: {
                  latitude: places[i].geometry.location.lat(),
                  longitude: places[i].geometry.location.lng() 
              },
              mensaje:"mensaje",
              nombre:places[i].name,
              direccion:places[i].name,
              telefono:"No registrado",
              usuario: "Nota",
              id: places[i].place_id
                  
            };
          places_markers.push(marker);
          $scope.map.markers.push(marker);
          refresh(marker);
        }
        $scope.addMarkerClickFunction($scope.map.markers);
        var bound = new google.maps.LatLngBounds();
        var neraby_places_bound_center = bound.getCenter();
        // Center map based on the bound arround nearby places
        $scope.latitude = neraby_places_bound_center.lat();
        $scope.longitude = neraby_places_bound_center.lng();
        $scope.map.control.getGMap().fitBounds(bounds);
      }
    var detail;

    

    //se crea la conexion al websocket cuando carga el controller
    var url="wss://ajustadoati.com:8443/ajustadoatiWS/openfire";
    var ws = $websocket(url);
    //aqui se reciben las respuestas de los proveedores         
    ws.onMessage(function(message) {
      console.log("receiving"+message.data);
      var obj = JSON.parse(message.data);
      console.log("receiving from: "+obj.latitud);
      console.log("message: "+obj.message);
      $scope.setMensajeProveedor(obj.user, obj.message);
    });
    //metodo que agrega el mensaje en el objeto proveedor cuando responde
    $scope.setMensajeProveedor=function(user, mensaje){
        var resultado = "";
        for (var i=0;i<$scope.map.markers.length;i++) {
          
          if (user === $scope.map.markers[i].usuario) {
              console.log("proveedor: "+$scope.map.markers[i].usuario)
              resultado = $scope.map.markers[i];
              $scope.map.markers[i].mensaje=mensaje;
              $scope.map.markers[i].mensaje
              $scope.map.markers[i].options = {
                icon: 'img/home-2.png'
              };
              $scope.map.markers[i].animation=google.maps.Animation.DROP;
          }
        }
        return resultado;
    }
    //metodo que obtiene el usuario desde servidor jabber
    $scope.getUser=function(login){
        
        var user={};
        UserOFService.getUser(login, function(data){
          
          user=data;
        });
        return user;
    }
    //metodo usado para crear proveedor y agregar al marcador
    $scope.getProveedor=function(data){
        
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
      
      $scope.map.control.refresh({latitude: marker.coords.latitude,
                longitude: marker.coords.longitude});
    }

    $scope.addLocation= function(latitud, longitud, data){
      
      MarkerCreatorService.createByCoords(latitud, longitud, data, function (marker) {
        marker.options = {
                  icon: 'img/smiley_happy.png'
                  
                };
        $scope.map.markers.push(marker);
        //$scope.addMarkerClick(marker);
            $scope.addMarkerClickFunction($scope.map.markers);
            //refresh(marker);
          });
    }

    $scope.createConsulta = function () {
        console.log("Creando consulta");
        
        $scope.consulta.producto.descripcion=$scope.consulta.producto.nombre;
        $scope.consulta.producto.id=0;    
        var url = 'https://ajustadoati.com:9000/ajustadoati/consulta/';
        var urlProveedores = 'https://ajustadoati.com:9000/ajustadoati/proveedor/categoria/'+$scope.consulta.categoria.nombre;
        var config = {headers: {'Content-Type': 'application/json; charset=UTF-8'}};
        
        var latitud="";
        var longitud="";

        $http.get(urlProveedores, config).success(function (data) {
            
            $scope.proveedores=data;
            
        }).error(function(data, status, headers, config) {
          console.log("error buscando proveedores");
          $scope.consulta={};
        });
        $http.post(url, $scope.consulta, config).success(function (data) {
            console.log("Consulta Creada"+data.id);
            $scope.consultaId=data.id;
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
            
            //se agrega cada proveedor al mapa
            var proveedor=$scope.getProveedor($scope.proveedores[i].usuario);
            $scope.addLocation($scope.proveedores[i].usuario.latitud, $scope.proveedores[i].usuario.longitud, proveedor);

            if($scope.proveedores.length==(i+1)){
              
              resp=resp+$scope.proveedores[i].usuario.user;
            }else{
              
              resp=resp+$scope.proveedores[i].usuario.user+"&&";
            }
          }
          
           //$scope.addMarkerClickFunction($scope.markers);
          
          
          var msg = '{"id":'+$scope.consultaId+',"mensaje":"' + men + '", "users":"'+resp+'", "latitud":"'+latitud+'", "longitud":"'+longitud+'"}';
          ws.send(msg); 
        });
      };
          
})
//controller para el template de cada marcador
.controller('templateController',function($scope){
  console.log("template");
  
  
});



  

  
