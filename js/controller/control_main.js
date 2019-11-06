angular.module("app")
	.controller("control_main",["$scope","$http","$sessionStorage",function($scope, $http, $sessionStorage){

		//$scope.user = JSON.parse( document.querySelector('#nav').dataset.user );
		$scope.user = $scope.$parent.user;
		console.log( $scope.user )

		if($sessionStorage.modo_nocturno == undefined){
			$sessionStorage.modo_nocturno = false;
		}
		
		$scope.$parent.modo_nocturno = $sessionStorage.modo_nocturno;

		if($sessionStorage.band_notificaciones == undefined){
			$sessionStorage.band_notificaciones = false;
		}
		$scope.$parent.band_notificaciones = $sessionStorage.band_notificaciones;

		$scope.goto = function(page){
			if(page===undefined) return;
			var nav = document.querySelector('#nav');
			nav.pushPage(page)
		}
	}])