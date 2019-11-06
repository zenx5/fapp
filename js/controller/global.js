angular.module("app")
	.controller("control_global",["$scope","$sessionStorage","$localStorage","$http",function($scope,$sessionStorage,$localStorage,$http){

	$scope.user = 10;
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
		//console.log($scope.History)
	}

	if($sessionStorage.modo_nocturno == undefined){
		$sessionStorage.modo_nocturno = false;
	}
	
	$scope.modo_nocturno = $sessionStorage.modo_nocturno;

	if($sessionStorage.band_notificaciones == undefined){
		$sessionStorage.band_notificaciones = false;
	}
	$scope.band_notificaciones = $sessionStorage.band_notificaciones;

	$scope.saveIP = function() {
		url_api = "http://"+$scope.ip+"/onsapp/api/v1/";
		if(_debug){
			console.log('se cambio la url de la api a: ',url_api);
		}
		$scope.goto('login.html');
	}

	$scope.connect = function(){
		if(_debug){
			console.log( 'Se hizo la peticion local' );
			$scope.usuarios = new Promise((request,reject)=>{
				var data = [{
					nombre:"Tester Uno",
					apellido:"Apell Uno",
					email:"testeruno@gmail.com",
					user:"tester1",
					pass:"12345",
					tipo:"profe",
				},{
					nombre:"Tester Dos",
					apellido:"Apell Dos",
					email:"testerdos@gmail.com",
					user:"tester2",
					pass:"12345",
					tipo:"alumn",
				}];
				request({config:{url:'/usuarios'},data:data});
			});
			$scope.usr_mate = new Promise((request,reject)=>{
				var data = [{
					id_usuario:"tester1",
					id_materia:"1",
					examenes:'{"ids":["1","2"]}'
				},{
					id_usuario:"tester1",
					id_materia:"2",
					examenes:'{"ids":["1"]}'
				},{
					id_usuario:"tester2",
					id_materia:"1",
					examenes:'{"ids":["1","2"],"notas":["8","10"]}'
				}];
				request({config:{url:'/usuarios_materias'},data:data});
			});
			$scope.materias = new Promise((request,reject)=>{
				var data = [{
					id:"1",
					nombre:"Matematicas",
					seccion:"A"
				},{
					id:"2",
					nombre:"Fisica",
					seccion:"B"
				}];
				request({config:{url:'/materias'},data:data});
			});
			$scope.examenes = new Promise((request,reject)=>{
				var data = [{
					id:"1",
					nombre:"Numeros Reales",
					id_materia:"1",
					nota:"20",
					fecha_limite:"2019-11-11"

					//ponderacion:"20"
				},{
					id:"2",
					nombre:"Caida Libre",
					id_materia:"2",
					nota:"15"
					//ponderacion:"15"
				}];
				request({config:{url:'/examenes'},data:data});
			});
			$scope.pregunta = new Promise((request,reject)=>{
				var data = [{
					id:"1",
					id_examen:"2",
					nota:"10",
					respuesta_correcta:"[]"
				}];
				request({config:{url:'/preguntas'},data:data});
			});
		}
		else{
			$scope.usuarios = $http.get(url_api+'usuarios')
			$scope.usr_mate = $http.get(url_api+'usuarios_materias')
			$scope.materias = $http.get(url_api+'materias')
			$scope.examenes = $http.get(url_api+'examenes')
			$scope.pregunta = $http.get(url_api+'preguntas')	
		}
	}
	
	$scope.set = function ( name , value ) {
		$scope[ name ] = value;
		console.log( 'success : ', $scope[ name ] );
	}

	$scope.getData = function(user){
			
		$scope.connect();

		return Promise.all([$scope.usuarios,$scope.usr_mate,$scope.materias,$scope.examenes,$scope.pregunta])
			.then( response => {
				//console.log(response)
				$scope.tablas = {};
				response.forEach( elem => {
					var nameTabla = elem.config.url.split('/').last()
					$scope.tablas[nameTabla] = elem.data;
					//console.log( elem.data )
				})
				tablas = $scope.search(user);

				$scope.user = new User(tablas.usuarios[0]);
				$scope.user.addMateria(tablas.materias);
				$scope.user.addExamen(tablas.examenes);
				//console.log( tablas.preguntas )
				$scope.user.addPregunta(tablas.preguntas);	
				//$scope.user.addNotas(tablas.usuarios_materias);
				
				$scope.$apply()
				console.log($scope.user)
				return $scope.user;
			})
	}

	$scope.search = function(user){
		var tablas = {};
		tablas.usuarios = $scope.tablas.usuarios.filterAs( elem => {
			//console.log(elem)
			if(elem.user == user){return elem}
		}).toArray();
		
		tablas.usuarios_materias = $scope.tablas.usuarios_materias.filterAs( elem => {
			if( (elem.id_usuario == user) && (JSON.parse(elem.examenes).notas != undefined) ) {
				$scope.tablas.usuarios_materias.filterAs( elem2 => {
					if( (elem2.id_materia == elem.id_materia) && (JSON.parse(elem2.examenes).notas == undefined) ) {
						elem.profesor = {
							id : elem2.id_usuario,
							nombre : (()=>{
								return $scope.tablas.usuarios.filterAs( elem3 => {
									if( elem3.user == elem2.id_usuario ) {
										return elem3.nombre + " " + elem3.apellido ;
									}
								})[0]
							})(), 
							examenes : (elem2.examenes!=undefined)?JSON.parse(elem2.examenes):undefined
						}
					}
				})
				return elem
			}
			else if( (elem.id_usuario == user) && (JSON.parse(elem.examenes).notas == undefined) ){
				return elem;
			}
		}).toArray();
		
		//tablas.usuarios_materias = $scope.tablas.usuarios_materias;
		tablas.materias = $scope.tablas.materias.filterAs( elem => {
			for(var i = 0; i <  tablas.usuarios_materias.length; i++){
				if(elem.id == tablas.usuarios_materias[i].id_materia){
					elem.profesor = tablas.usuarios_materias[i].profesor;
					return elem;
				}
			}
		}).toArray();
		
		tablas.examenes = $scope.tablas.examenes.filterAs( elem => {
			for(var i = 0; i < tablas.materias.length; i++){
				if(elem.id_materia == tablas.materias[i].id){
					return ($scope.tablas.usuarios_materias.filterAs( elem2 => {
						if( (elem2.id_usuario == user) && (JSON.parse(elem2.examenes).notas != undefined) ){
							if( JSON.parse( elem2.examenes ).ids.contains( elem.id , 'bool' ) ){
								elem.status = true;
								elem.ponderacion = JSON.parse( elem2.examenes ).notas[ JSON.parse( elem2.examenes ).ids.contains( elem.id ) ];
							}
							else{
								elem.status = false;
							}
							return elem;
						}
						else{
							return elem;
						}
					})[0])
				}
			}
		}).toArray();

		tablas.preguntas = $scope.tablas.preguntas.filterAs( elem => {
			for(var i = 0; i < tablas.examenes.length; i++){
				if(elem.id_examen== tablas.examenes[i].id){
					elem.respuesta_correcta = JSON.parse( elem.respuesta_correcta ).filterAs( item => {
						return JSON.parse( item );
					});
					return elem;
				}
			}
		}).toArray();
		
		$scope.$apply();
		return  tablas;
	}

	$scope.logout = function(){
		$localStorage.History = $scope.History;
		document.location.reload();
	}

	$scope.goto = function(page){
		if(page===undefined) return;
		$localStorage.History = $scope.History;
		var nav = document.querySelector('#nav');
		nav.pushPage(page)
	}	
}]);