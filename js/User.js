

(function(){	
	self.User = function(data){;
		this.user = data.user;
		this.pass = data.pass;
		this.email = data.email;
		this.nombre = data.nombre;
		this.apellido = data.apellido;
		this.tipo = data.tipo;
		this.materia = {};
		this.debug_level = 0;
	}
	self.User.prototype = {

		addMateria : function( datos ){
			if(!Array.isArray(datos)){
				datos = [datos];	
			}
			
			for(var i = 0; i < datos.length; i++){
				this.materia[datos[i].nombre] = datos[i];
				this.materia[datos[i].nombre].examenes = {}; 
			}
		},

		addNotas : function(datosUserMaterias) {
			for( var index = 0; index < datosUserMaterias.length; index++ ) {
		/*		datosUserMaterias[ index ].examenes = JSON.parse( datosUserMaterias[ index ].examenes );
				//identificar la materia
				var nameMateria = this.whatMateria( datosUserMaterias[ index ] );
				//identificar el examen
				console.log(this.materia)
				console.log(nameMateria)
				console.log(this.materia[ nameMateria ].examenes)
				
				this.materia[ nameMateria ].examenes.forEach( elem => {
					var indexID = datosUserMaterias[ index ].examenes.ids.constains( elem.id , 'index' );
					if ( indexID != -1 ){
						elem.status = true;
						elem.ponderacion = datosUserMaterias[ index ].examenes.notas[ indexID ];
					}
					else{
						elem.status = false;
						elem.ponderacion = 0;
					}
				})*/
				//agregar la nota y el status
			}
			console.log(datosUserMaterias);


		},

		addExamen : function(datosExamen,materia){
			if(!Array.isArray(datosExamen)){
				datosExamen = [datosExamen];	
			}
			for(var i = 0; i < datosExamen.length; i++){
				var nameMateria = this.whatMateria(datosExamen[i],'desde addExamen');
				if(materia != undefined){
					nameMateria = materia;
				}
				if(this.materia[nameMateria]!=undefined){
					this.materia[nameMateria].examenes[datosExamen[i].nombre] = datosExamen[i];
					this.materia[nameMateria].examenes[datosExamen[i].nombre].preguntas = [];
				}
			}	
		},

		addPregunta : function(datosPregunta){
			if(!Array.isArray(datosPregunta)){
				datosPregunta = [datosPregunta];	
			}
			for(var i = 0; i < datosPregunta.length; i++){
				var examen = this.whatExamen(datosPregunta[i],'What Examen desde addPregunta');
				if( examen == undefined ) {
					return;
				}
				var nameMateria = this.whatMateria(examen,'What Materia desde addPregunta');
				
				if( nameMateria == undefined ) {
					return;
				}
				var nameExamen = examen.nombre;
				if(this.materia[nameMateria]!=undefined){
					if(datosPregunta[i].id_examen == this.materia[nameMateria].examenes[nameExamen].id){
						this.materia[nameMateria]
							.examenes[nameExamen].preguntas.push( datosPregunta[i] );	
					}
				}
			}	
		}, 

		whatMateria : function(datosExamen,msj){
			this.debug(['whatMateria',msj,datosExamen])
			var id_materia = datosExamen.id_materia;
			for(var index in this.materia){
				if(this.materia[index].id == id_materia){
					return this.materia[index].nombre;
				}
			}
			return undefined;
		},

		whatExamen : function(datosPregunta,msj){
			this.debug(['whatExamen', msj, datosPregunta])
			var id_examen = datosPregunta.id_examen;
			for(var index1 in this.materia){
				for(var index2 in this.materia[index1].examenes){
					if(this.materia[index1].examenes[index2].id == id_examen){
						return this.materia[index1].examenes[index2];
					}
				}
			}
			return undefined;	
		},

		debug : function(arrayDebug){
			if(arrayDebug == undefined){
				return this.debug_level;
			}
			if(Array.isArray(arrayDebug)){
				for(var i = 0; i < this.debug_level; i++){
					console.log('Debug :',arrayDebug[i]);
				}
			}
			else{
				this.debug_level = arrayDebug;
				console.log('Fixe level Debug in ', this.debug_level);
			}
		}

	}

})()	//Fin User


