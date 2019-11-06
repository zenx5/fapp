angular.module("app")
	.controller("control_examen",["$scope","$http","$sessionStorage","$localStorage",function($scope, $http, $sessionStorage,$localStorage){
		
		if($sessionStorage.modo_nocturno == undefined){
			$sessionStorage.modo_nocturno = false;
		}
		
		$scope.$parent.modo_nocturno = $sessionStorage.modo_nocturno;

		if($sessionStorage.band_notificaciones == undefined){
			$sessionStorage.band_notificaciones = false;
		}
		$scope.$parent.band_notificaciones = $sessionStorage.band_notificaciones;

		$scope.estado_examen = {
			estado: false
		}

		$scope.enviar = function(){
			if( $localStorage.currentExamen == undefined ){
				$localStorage.currentExamen = $scope.$parent.currentExamen;	
			}
			else{
				$scope.currentExamen = $localStorage.currentExamen;	
			}			
			$scope.enviarNow();
			// new Promise((request,reject)=>{
			// 	if( navigator.onLine ){
			// 		request('Conexion Establecida')
			// 	}
			// 	else{
			// 		reject('Sin Conexion');
			// 	}
			// })
			// 	.then( (response) => {
					
			// 		console.log( response );
			// 		$scope.enviarNow();
			// 	})
			// 	.catch( (response) => {
			// 		console.log( response );
			// 		setTimeout( $scope.enviar, 20000 );
			// 	})
		}

		$scope.enviarNow = function(){
			if( $scope.move( 1 ) ) {
				$scope.estado_examen.estado  =  false;
				//$scope.currentExamen.status = true;
				$http.get(url_api+'usuarios_materias/'+ $scope.$parent.user.user)
					.then( response => {
						var datos = response.data;
						if(angular.isArray(datos)){
							datos = datos.filterAs( elem => {
								if(elem.id_materia == $scope.estado_examen.id_materia){
									return elem;
								}

							})
						}
						datos.examenes = JSON.parse( datos.examenes );
						datos.examenes.ids.push($scope.currentExamen.id)
						datos.examenes.notas.push($scope.currentExamen.ponderacion)
						datos.examenes.num += 1;
						//console.log('PUT');
						$http({
							method:'PUT',
							url:url_api+'usuarios_materias',
							headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
							data : 'data='+JSON.stringify(datos),
						}).then( response2 => {
							$scope.$parent.getData($scope.$parent.user.user).then( data=>{
								$localStorage.currentExamen = undefined;
								$scope.$parent.History.reg( $scope.$parent.user.user, Date().substr(0,24) ,'Presento el Examen de '+$scope.nombreMateria($scope.currentExamen.id_materia)+' y su puntuacion fue de: '+$scope.currentExamen.ponderacion+' puntos.');
								ons.notification.alert('Su puntuacion fue de '+$scope.currentExamen.ponderacion+' puntos.');
								$scope.$parent.goto('materias.html')
							});
							
						})
					})
				
			}
		}

		$scope.move = function( i ) {
			//console.log( 'Current Examen = ', $scope.$parent.currentExamen)
			if( !$scope.estado_examen.estado ){
				$scope.estado_examen.estado = true;
				$scope.index = -1;
				$scope.numeroPreguntas = $scope.$parent.currentExamen.preguntas.length;
			}
			if(( i > 0 ) && ( $scope.index != -1 )) {
				//console.log('i=',i,' index=',$scope.index)
				var opciones = document.querySelectorAll('input[name="'+$scope.pregunta.id+'"]');
				var result = opciones.in_getValue()
				switch(result.length){
					case 0:
						//console.log('case 0');
						ons.notification.alert('Responda la pregunta  antes de continuar.');
						return false;
					default:
						//console.log('default');
						var respuesta_correcta = $scope.$parent.currentExamen.preguntas[ $scope.index ].respuesta_correcta;
						var puntuacion = 0;
						for( var j in result ){
							if( respuesta_correcta[ result[ j ].index ] ) {
								puntuacion = $scope.$parent.currentExamen.preguntas[ $scope.index ].nota;
							}
						}
						if( $scope.$parent.currentExamen.ponderacion == undefined ){
							$scope.$parent.currentExamen.ponderacion = 0;
						}
						$scope.$parent.currentExamen.ponderacion += eval(puntuacion);
				}
			}
			$scope.index = $scope.index + i;
			// console.log("$scope.index = ",$scope.index)
			$scope.pregunta = $scope.$parent.currentExamen.preguntas[ $scope.index ];
			// console.log( 'pregunta = ',$scope.pregunta );
			if( $scope.pregunta == undefined ) {
				$scope.pregunta = {
					id: 0,
					enunciado: "",
					respuestas : []
				};
				$scope.index = -1;
				$scope.estado_examen.estado = false;
			}
			return true;
		}

		$scope.pregunta = {
			id: 0,
			enunciado: "",
			respuestas : []
		}
		$scope.nombreMateria = function( idMateria ) {
			$scope.estado_examen.id_materia = idMateria;
			$scope.estado_examen.materia = $scope.$parent.user.materia.getAll( 'id' , idMateria )[0].nombre;
			return $scope.estado_examen.materia;
		}

		$scope.examen = {
			materia : "Matematicas I",
			tema 	: "Numeros Reales",
			ponderacion : "20",
			tipo_de_ponderacion : "Pts",
			tiempo_maximo : "2:00:00",
			preguntas : [{
				id: 1,
				enunciado: "Que es el Sol?",
				respuestas : [
					{text:"Una Estrella",type:"radio"},
					{text:"Un Planeta",type:"radio"},
					{text:"Un Asteroide",type:"radio"}
				]
			},{
				id: 2,
				enunciado: "Que es la Tierra?",
				respuestas : [
					{text:"Un Material",type:"checkbox"},
					{text:"Un Planeta",type:"checkbox"}
				]
			},{
				id: 3,
				enunciado: "Entre que planetas se encuentra la Tierra?",
				respuestas : [
					{text:"Venus y Marte",type:"checkbox"},
					{text:"Mercurio y Venus",type:"checkbox"},
					{text:"Saturno y Urano",type:"checkbox"}
				]
			}]

		}

	}])