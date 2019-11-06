angular.module("app")
	.controller("control_nuevo",["$scope","$http","$sessionStorage",function($scope, $http, $sessionStorage){

		$scope.index = 1;

		$scope.nuevoExamen = $sessionStorage.nuevoExamen;

		$scope.pregunta = {
			pregunta : "",																																																																																																																																																																																																																																																																			
			respuesta_1 : "",
			respuesta_2 : "",
			respuesta_3 : "",
			respuesta_4 : "",
			tipo_seleccion : "",
			nota : 0,
			imagen1 : "",
			respuesta_correcta : [ false, false, false, false ]
		}

		/*$scope.nuevoExamen = {
			id_materia : "",
			nombre	: "",
			nota	: 0,
			fecha	: "",
			pregunta : []
		}*/

		$scope.subir = function ( ) {
			document.querySelector('#upload').click();
		}

		$scope.loadImg = function ( ) {
			console.log('Archivo subido...');
		}

		$scope.agregarPregunta = function ( ) {
			if( $scope.img_URI != undefined ) {
				$scope.pregunta.imagen1 = ( $scope.img_URI[0] != undefined )?$scope.img_URI[0]:"";
			}
			if ( $scope.pregunta.respuesta_correcta.contains(true).length > 1 ) {
				$scope.pregunta.tipo_seleccion = "multiple";
			}
			else {
				$scope.pregunta.tipo_seleccion = "simple";
			}

			$scope.nuevoExamen.preguntas.push( $scope.pregunta );
			
			console.log( $scope.nuevoExamen )
			
			$scope.pregunta = {
				pregunta : "",																																																																																																																																																																																																																																																																			
				respuesta_1 : "",
				respuesta_2 : "",
				respuesta_3 : "",
				respuesta_4 : "",
				tipo_seleccion : "",
				nota : 0,
				imagen1 : "", 
				respuesta_correcta : [ false, false, false, false ]
			} 

			$scope.index++;
		}

		$scope.guardarExamen = function ( ) {
			if( $scope.pregunta.pregunta.length > 0 ) {
				$scope.agregarPregunta();
			}
			$http({  //1ro Se guarda el examen.
				method : "post",
				url : url_api+"examenes",
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
				data : 'data='+JSON.stringify( $scope.nuevoExamen.filt(['id_materia','nombre','nota','fecha_limite']) )
			})
				.then( () => {
					$http({
						method : "get", //2do Se obtiene el Id del ultimo examen guardado.
						url : url_api+"examenes",
						headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
					}).then( response => {
						var id = response.data.last().id;
						$scope.nuevoExamen.preguntas = $scope.nuevoExamen.preguntas.setAll( 'id_examen' , id );
						$http({
							method : "post", //3ro Se guardan las preguntas
							url : url_api+"preguntas",
							headers : { 'Content-Type' : 'application/x-www-form-urlencoded' },
							data : 'data='+JSON.stringify( $scope.nuevoExamen.preguntas )
						}) //fin $http: post preguntas
						.then( () => {
							//4to se obtienen los datos que vinculan a ese profesor con esa materia
							$http.get(url_api+"usuarios_materias/"+$scope.$parent.user.user)
								.then( response2 => {
									var datos = response2.data.filter( e => {
										if( e.id_materia == $scope.nuevoExamen.id_materia ) return e;
									})[0];
									datos.examenes = JSON.parse( datos.examenes );
									datos.examenes.ids.push( id );
									datos.examenes.num++;
									$http({ //5to se actualizan los datos de vinculacion profesor-materia
										method : "put",
										url : url_api+"usuarios_materias",
										headers : { 'Content-Type' : 'application/x-www-form-urlencoded' },
										data : 'data='+JSON.stringify( datos )
									}).then( ()=>{
										$scope.$parent.History.reg( $scope.$parent.user.user, Date().substr(0,24) ,'El Examen '+$scope.nuevoExamen.nombre+' fue agregado sin Problemas!')
										ons.notification.alert('El Examen '+$scope.nuevoExamen.nombre+' fue agregado sin Problemas!')
										$scope.$parent.goto('main.html')
									})
								})
						})
					}) //fin then( response => {					
				}) //fin then( () => {
		} //  fin $scope.guardarExamen = function ( ) {
	}])
