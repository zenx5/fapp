angular.module("app")
	.controller("control_materias2",["$scope","$sessionStorage",function($scope,$sessionStorage){
		
		$scope.nuevoExamen = {
			id_materia : "",
			nombre	: "",
			nota	: 0,
			fecha	: "",
			preguntas : []
		}

		//$scope.user = JSON.parse( document.querySelector('#nav').dataset.user );
		$scope.user = $scope.$parent.user;
		console.log( $scope.user )

		$scope.nuevo = function () {
			$sessionStorage.nuevoExamen = $scope.nuevoExamen;
			$scope.$parent.goto('nuevo.html');
		}

	}])