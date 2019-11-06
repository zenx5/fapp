angular.module("app")
	.controller("control_login",["$scope","$http","$sessionStorage",function($scope, $http, $sessionStorage){
		alert(url_api)		
		if($sessionStorage.modo_nocturno == undefined){
			$sessionStorage.modo_nocturno = false;
		}
		
		$scope.$parent.modo_nocturno = $sessionStorage.modo_nocturno;

		if($sessionStorage.band_notificaciones == undefined){
			$sessionStorage.band_notificaciones = false;
		}
		$scope.$parent.band_notificaciones = $sessionStorage.band_notificaciones;

		$scope.validate_login = false;
		
		$scope.login = function(){
			var usuario = $scope.usuario,
				clave = $scope.clave;

				$http.get(url_api+"usuarios/"+usuario)
					.then( firstResponse => {
						var user = firstResponse.data;

						if( user.pass == clave ) {
							$http.get(url_api+"usuarios_materias/"+usuario)
								.then( secondResponse => {
									var array_id_materias = secondResponse.data.getAll('id_materia');
									if(array_id_materias.length != 0){
										$http.get(url_api+"materias")
											.then( thirdResponse => {
												user.materias = {};
												var materias = thirdResponse.data.filter( elem => {
													if( array_id_materias.contains(elem.id,'bool') ) return elem;
												})
												console.log(materias)
												materias.forEach( elem => {
													user.materias[elem.nombre] = elem;
												})
												$scope.goto( 'main.html' , 'user', JSON.stringify( user ) );		
											})
									}
									else{
										ons.notification.alert('su perfil no esta asociado con ninguna materia')
									}
									
								})		
						}
						else{
							ons.notification.alert( 'Credenciales Incorrectas !' )
						}
					})
					.catch( error => {
						ons.notification.alert( 'Sin Acceso al Servidor !' )
					})

		}

		$scope.goto = $scope.$parent.goto;
		
	}])