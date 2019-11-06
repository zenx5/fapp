angular.module("app")
	.controller("control_historial",["$scope","$http","$sessionStorage",function($scope, $http, $sessionStorage){
		
		if($sessionStorage.modo_nocturno == undefined){
			$sessionStorage.modo_nocturno = false;
		}
		
		$scope.$parent.modo_nocturno = $sessionStorage.modo_nocturno;

		if($sessionStorage.band_notificaciones == undefined){
			$sessionStorage.band_notificaciones = false;
		}
		$scope.$parent.band_notificaciones = $sessionStorage.band_notificaciones;


		$scope.Historial = [{
			titulo : "Nueva Evaluacion",
			descripcion : "Aqui alguna informacion...",
			fecha : "30/07/2019"
		},{
			titulo: "Cambio de Clave",
			descripcion: "Por favor cambie su clave pronto..",
			fecha : "29/07/2019"
		}];

		$scope.goto = function(page){
			if(page===undefined) return;
			var nav = document.querySelector('#nav');
			nav.pushPage(page)
		}
	}])