angular.module("app")
	.controller("control_materias",["$scope","$http","$sessionStorage",function($scope, $http, $sessionStorage){
		
		$scope.usuario = sessionStorage.usuario

		if($sessionStorage.modo_nocturno == undefined){
			$sessionStorage.modo_nocturno = false;
		}
		
		$scope.$parent.modo_nocturno = $sessionStorage.modo_nocturno;

		if($sessionStorage.band_notificaciones == undefined){
			$sessionStorage.band_notificaciones = false;
		}
		$scope.$parent.band_notificaciones = $sessionStorage.band_notificaciones;

		//$scope.Materias = JSON.parse( document.querySelector('#nav').dataset.user ).materias;
		$scope.Materias = $scope.$parent.user.materia;
		console.log("MATERIAS : ",$scope.Materias)
		$scope.nota_total = function( materia ){
			var nota_total = 0;
			for( var index in materia.examenes ) {
				if( materia.examenes[ index ].nota != undefined ) {
					nota_total += eval(materia.examenes[index].nota)
				}
			}
			if(!_debug){
				console.log(" - - - MODO DEBUG - - -");
				console.log("Se llamo a la funcion: " , "nota_total");
				console.log("Argumento: ", materia );
				console.log("Valor de Retorno: ", nota_total );
			}
			return nota_total;
		}

		$scope.nota_acumulada = function( materia ) {
			var nota_acumulada = 0;
			var user_materia = $scope.$parent.usuarios_materias;
			for( var index in materia.examenes ){
				if( materia.examenes[ index ].status ) {
					nota_acumulada += eval( materia.examenes[ index ].ponderacion )
				}
			}
			if(!_debug){
				console.log(" - - - MODO DEBUG - - -");
				console.log("Se llamo a la funcion: " , "nota_acumulada");
				console.log("Argumento: ", materia );
				console.log("Valor de Retorno: ", nota_acumulada );
			}
			return nota_acumulada;
		}

		$scope.pendiente = function( item ){ 
			var examenes_presentados = item.examenes.getAll('status',true).getAll('id');
			var examenes_subidos = item.profesor.examenes.ids;
			return {
				num : examenes_subidos.nocontains( examenes_presentados ).length,
				id : examenes_subidos.nocontains( examenes_presentados, 'object' )
			};
		}




		$scope.examen = function( nameMateria ,id ) {
			console.log( $scope.Materias )
			console.log( "id : " , id )
			console.log( "nameMateria : " , nameMateria )
			console.log($scope.Materias[ nameMateria ])
			$scope.$parent.set( 'currentExamen' , $scope.Materias[ nameMateria ].examenes.getAll( 'id' , id[0] )[ 0 ] );
			$scope.$parent.goto('examen.html');
		}
		
	}])