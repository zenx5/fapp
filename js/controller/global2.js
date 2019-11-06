angular.module("app")
	.controller("control_global",["$scope","$sessionStorage","$localStorage","$http",function($scope,$sessionStorage,$localStorage,$http){

	
	$scope.currentExamen = {};
	
	if($localStorage.History == undefined){
		$localStorage.History = {}
		$scope.History = {};
	}
	else{
		$scope.History = $localStorage.History;	
	}
	$scope.History.reg = function( user, date , msj ){
		if( $scope.History[user] == undefined ) {
			$scope.History[user] = [];
		}
		$scope.History[user].unshift({
			date : date,
			msj : msj
		});
		if( $scope.History[user].length > 10 ) {
			$scope.History[user].pop();
		}
		console.log($scope.History)
	}

	if($sessionStorage.modo_nocturno == undefined){
		$sessionStorage.modo_nocturno = false;
	}
	
	$scope.modo_nocturno = $sessionStorage.modo_nocturno;
	$scope.user = null;

	if($sessionStorage.band_notificaciones == undefined){
		$sessionStorage.band_notificaciones = false;
	}
	$scope.band_notificaciones = $sessionStorage.band_notificaciones;

	$scope.saveIP = function() {
		url_api = "http://"+$scope.ip+"/onsapp/api/v1/";
		console.log(url_api);
		$scope.goto('login.html');
	}

	$scope.connect = function(){
		$scope.usuarios = $http.get(url_api+'usuarios')
		$scope.usr_mate = $http.get(url_api+'usuarios_materias')
		$scope.materias = $http.get(url_api+'materias')
		$scope.examenes = $http.get(url_api+'examenes')
		$scope.pregunta = $http.get(url_api+'preguntas')	
		console.log( 'aqui....' )
	}
	
	$scope.set = function ( name , value ) {
		$scope[ name ] = value;
		console.log( 'success' );
	}

	$scope.logout = function(){
		$localStorage.History = $scope.History;
		document.location.reload();
	}

	$scope.goto = function(page, key, data){
		if(page===undefined) return;
		var nav = document.querySelector('#nav');
		if( data  != undefined ){
			nav.dataset[key] = data;
		}
		nav.pushPage(page)
	}	
}]);