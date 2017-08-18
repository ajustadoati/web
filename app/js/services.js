'use strict';

/* Services */
angular.module('myApp.services', []).
  value('version', '0.1').
 factory('CategoriaService', ['$http', function ($http) {

 	var path = 'https://ajustadoati.com:9000/ajustadoati/categoria/';

 	return {
     getCategorias: function(callback) {
       $http.get(path).success(callback);
     }
   }
 	
}])
 .factory('MyWS', function($websocket) {
      // Open a WebSocket connection
      var dataStream = $websocket('ws://ajustadoati.com:8080/ajustadoatiWS/openfire');

      var collection = [];

      dataStream.onMessage(function(message) {
        collection.push(JSON.parse(message.data));
      });

      var methods = {
        collection: collection,
        get: function() {
          dataStream.send(JSON.stringify({ action: 'get' }));
        }
      };

      return methods;
    })
 
 .factory('UsuarioService', ['$http', function ($http) {

  var url = 'https://ajustadoati.com:9000/ajustadoati/usuario/';

  var usuarioService ={};


    usuarioService.getUsuarios = function () {
        return $http.get(url);
    };

    var config = {headers: {'Content-Type': 'application/json; charset=UTF-8'}};

            
    function save(usuario, successCallback) {

        console.log("guardando usuario ser"+usuario.nombre);
        //$http.post(url, successCallback);
        $http.post(url, usuario, config).success(successCallback);
    }


    return {
        save: save
        
    };

  
  
  }]).
  factory('UserOFService', ['$http', function ($http) {
    return {
     getUser: function(user, callback){
        var path = 'https://ajustadoati.com:9000/ajustadoati/proveedor/'+user;
        $http.get(path).success(callback);
     }
   };
    
}]).
   factory('ServerUrl', ['$http', function ($http) {
    return {

   
     getServer: function(callback){
        $http.get('connection.properties').success(callback);
     }
   };
    
}]).
 factory('RazonService', ['$http', function ($http) {

 	var path = 'https://ajustadoati.sytes.net:8084/aati/protected/categorias/?page=0';

 	return {
     getCategorias: function(callback) {
       $http.get(path).success(callback);
     }
   }
 	
}]).
  factory('MyData', function($websocket, MarkerCreatorService) {
      // Open a WebSocket connection
      
      var url="ws://ajustadoati.com:8080/ajustadoatiWS/openfire";
      var ws = $websocket(url);
               
      ws.onMessage(function(message) {
        console.log("receiving"+message.data);
        MarkerCreatorService.createByCoords(-71.088555, 8.629160500000001);
        collection.push(message.data);
      });

      ws.onOpen(function(){
        console.log("Abriendo websocket");
      })
   
      var collection = [];

      

      var dataFactory =[];
      return {
                            dataFactory: dataFactory,
                            status: function () {
                                return ws.readyState;
                            },
                            send: function (message) {
                              console.log("mensaje"+message);
                                if (angular.isString(message)) {
                                    ws.send(message);
                                }
                                else if (angular.isObject(message)) {
                                    ws.send(JSON.stringify(message));
                                }
                            }
                        };

      
    }).
 factory('MarkerCreatorService', function () {

    var markerId = 0;

    function create(latitude, longitude, data) {
        console.log("creando ubicacion desde el MOdal");
        var marker = {
            coords: {
                latitude: latitude,
                longitude: longitude 
            },
            mensaje:data.mensaje,
            nombre:data.nombre,
            direccion:data.direccion,
            telefono:data.telefono,
            usuario:data.usuario,
            id: ++markerId          
        };
        return marker;        
    }

    function getPosition(latitude, longitude) {
        var position = {
            
            latitude: latitude,
            longitude: longitude,
                    
        };
        return position;        
    }

  function getCurrentLocation(successCallback) {
        console.log("current position");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var marker = create(position.coords.latitude, position.coords.longitude);
                invokeSuccessCallback(successCallback, marker);
            });
        } else {
            alert('Unable to locate current position');
        }
    }
    function invokeSuccessCallback(successCallback, marker) {
        if (typeof successCallback === 'function') {
            successCallback(marker);
        }
    }

    function createByCoords(latitude, longitude, data, successCallback) {
        var marker = create(latitude, longitude, data);
        invokeSuccessCallback(successCallback, marker);
    }

    function createByAddress(address, successCallback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address' : address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var firstAddress = results[0];
                var latitude = firstAddress.geometry.location.lat();
                var longitude = firstAddress.geometry.location.lng();
                var usuario = {
                    mensaje:"mensaje",
                    nombre:"usuario-ajustado",
                    telefono:"telefono",
                    usuario:"usuario-ajustado",
                    id: "dataid"          
                };
                var marker = create(latitude, longitude, usuario);
                invokeSuccessCallback(successCallback, marker);
            } else {
                alert("Unknown address: " + address);
            }
        });
    }

    function createByCurrentLocation(successCallback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var usuario = {
                    mensaje:"mensaje",
                    nombre:"usuario-ajustado",
                    telefono:"telefono",
                    usuario:"usuario-ajustado",
                    id: "dataid"          
                };
                var marker = create(position.coords.latitude, position.coords.longitude, usuario);
                invokeSuccessCallback(successCallback, marker);
            });
        } else {
            alert('Unable to locate current position');
        }
    }


    

    return {
        getCurrentLocation: getCurrentLocation,
        createByCoords: createByCoords,
        createByAddress: createByAddress,
        createByCurrentLocation: createByCurrentLocation
        
    };

});
