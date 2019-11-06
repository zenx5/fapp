angular.module("app")
	.controller("control_configuracion",["$scope","$http","$sessionStorage",function($scope, $http, $sessionStorage){
		
		if($sessionStorage.modo_nocturno == undefined){
			$sessionStorage.modo_nocturno = false;
		}
		
		$scope.$parent.modo_nocturno = $sessionStorage.modo_nocturno;

		if($sessionStorage.band_notificaciones == undefined){
			$sessionStorage.band_notificaciones = false;
		}
		$scope.$parent.band_notificaciones = $sessionStorage.band_notificaciones;

		
		$scope.guardarConfig = function(){
			$sessionStorage.modo_nocturno = $scope.modo_nocturno;
			$sessionStorage.band_notificaciones = $scope.band_notificaciones;

			if( $scope.clave_vieja > 0 ){
				if( $scope.clave_vieja == $scope.$parent.user.pass ){
					if($scope.clave_nueva >= 4){
						var datos = {
							user: $scope.$parent.user.user,
							pass: $scope.clave_nueva
						}
						$http({
							method : "put",
							url : url_api+"usuarios",
							headers : { 'Content-Type' : 'application/x-www-form-urlencoded' },
							data : 'data='+JSON.stringify( datos )
						}).then( () => {
							$scope.$parent.History.reg( $scope.$parent.user.user, Date().substr(0,24) ,'Su Clave fue Cambiada!!')
							ons.notification.alert('Su Clave fue Cambiada!!')
						})
					}
					else{
						ons.notification.alert( 'Intente con una clave con mas de 3 caracteres.' )	
					}
				}
				else{
					ons.notification.alert( 'Olvido su Contrasena? Intentelo otra vez!' )
				}
			}
		}

		$scope.goto = function(page){
			if(page===undefined) return;
			var nav = document.querySelector('#nav');
			nav.pushPage(page)
		}
	}])