angular.module("app")
	.controller("control_login",["$scope","$http","$sessionStorage",function($scope, $http, $sessionStorage){
		
		if($sessionStorage.modo_nocturno == undefined){
			$sessionStorage.modo_nocturno = false;
		}
		
		$scope.$parent.modo_nocturno = $sessionStorage.modo_nocturno;

		if($sessionStorage.band_notificaciones == undefined){
			$sessionStorage.band_notificaciones = false;
		}
		$scope.$parent.band_notificaciones = $sessionStorage.band_notificaciones;

		$scope.validate_login = false;
		console.log( ons.notification )
		$scope.login = function(){
			
			$scope.$parent.getData($scope.usuario).then( user => {
				if((user.pass == $scope.clave)&&(user.pass != undefined)){
					$scope.validate_login = true;
				}
				if($scope.validate_login){
					sessionStorage.usuario = $scope.usuario;
					$scope.$parent.History.reg( $scope.$parent.user.user, Date().substr(0,24) ,'Session Iniciada!')
					$scope.goto('main.html');
				}
				else{
					ons.notification.alert('Credenciales Incorrectas, verifique por favor');
				}

			})
			
		}

		// $scope.login = function(){
		// 	console.log(url_api+"usuarios/"+$scope.usuario)
		// 	$http.get(url_api+"usuarios/"+$scope.usuario)
		// 		.then(function(response){
		// 			console.log(response)
		// 			if((response.data.pass == $scope.clave)&&(response.data.pass != undefined)){
		// 				$scope.validate_login = true;
		// 			}
		// 			if($scope.validate_login){
		// 				sessionStorage.usuario = $scope.usuario;
		// 				$scope.$parent.load($scope.usuario);
		// 				$scope.goto('main.html');
		// 			}
		// 			else{
		// 				ons.notification.alert('Credenciales Incorrectas, verifique por favor');
		// 			}
		// 		})
		// 		.catch(function(err){
		// 			if(_debug){
		// 				$scope.goto('main.html');
		// 			}
		// 			else{
		// 				console.log(err);
		// 				ons.notification.alert('No se establecio conexion con el servidor');	
		// 			}
		// 		})
		// }

		$scope.goto = function(page){
			if(page===undefined) return;
			var nav = document.querySelector('#nav');
			nav.pushPage(page)
		}
	}])