"use strict";
angular.module("app",["ngRoute","ngStorage"])
	.config(function($routeProvider){
		$routeProvider
			.when('/',{
				controller : "ctrl_open",
				templateUrl: "open.html"
			})
			.when('/loading',{
				controller : "ctrl_loading",
				templateUrl: "loading.html"
			})
			.when('/main',{
				controller : "ctrl_main",
				templateUrl: "main.html"
			})
			.when('/login',{
				controller : "ctrl_login",
				templateUrl: "login.html"
			})
			.otherwise('/');
	})
	.controller('package',["$scope",function($scope){
		$scope.bgBlue = false;
	}])
	.controller('ctrl_open',["$scope","$location",function($scope,$location){
		$scope.$parent.bgBlue = false;
		new Promise(function(response,reject){
			setTimeout(function(){
				sessionStorage.setItem('band',1);
			},5000)
		}).then(function(data){
			console.log(data)
		}).catch(function(err){
			console.log(err)
		})
		$location.path('/loading')

	}])
	.controller('ctrl_loading',["$scope","$location",function($scope,$location){
		$scope.$parent.bgBlue = false;
		$scope.count = 1;
		setInterval(function(){
			if(sessionStorage.getItem('band')==1){
				$location.path('/login');
			}
			$scope.count++;
			if($scope.count == 11){
				$scope.count = 1;
			}
			$scope.$apply();
		},80)
	}])
	.controller('ctrl_main',["$scope",function($scope){
		$scope.$parent.bgBlue = false;
		//sessionStorage.clear();
		$scope.Materias = [{nombre:"Matematicas I"},{nombre:"Fisica I"},{nombre:"Dibujo Tecnico"}];
		$scope.Historial = [
			{
				id : 1,
				descripcion: "Aqui alguna descripcion sobre el Evento",
				fecha : "28/07/2019"
			},{
				id : 2,
				descripcion: "Aqui otra descripcion sobre el Evento",
				fecha : "28/07/2019"
			},{
				id : 3,
				descripcion: "Aqui un aviso de que te quedo una mainateria",
				fecha : "28/07/2019"
			}

		];
	}])
	.controller('ctrl_login',["$scope","$location","$sessionStorage",function($scope,$location,$sessionStorage){
		sessionStorage.clear();

		$scope.$parent.bgBlue = true;

		$scope.db_fake = {
			usuario : 'omartinez1618',
			password: '12345'
		}

		$scope.estado = 0; //Estado: Standby

		$scope.login = function(){
			$scope.estado = 3; //Estado: Cargando
			if($scope.usuario === $scope.db_fake.usuario){
				 if($scope.password === $scope.db_fake.password){
				 	$scope.estado = 0;
				 	$sessionStorage.usuario = $scope.usuario;
				 	$sessionStorage.password = $scope.password;
				 	$sessionStorage.token = 'token';
				 	$location.path('/main');
				 }
				 else{
				 	$scope.estado = 2; //Estado: Error, Clave Incorrecta
				 }
			}
			else{
				$scope.estado = 1; //Estado: Error, Usuario No Existe
			}
		}

	}])