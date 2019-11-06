
var debug_count = 0;
JSON.deepParse = function ( elem ){
	var obj = this.parse( elem );	
	var keys = obj.keys();
	for( var i = 0; i < keys.length; i++ ){
		try{
			obj[ keys[i] ] = this.parse( obj[ keys[i] ] )	
		}
		catch(e){
			//console.log('<<',obj[ keys[i] ], '>> No es parseable.')	
		}
		
	}
	return obj;
}

NodeList.prototype.in_getValue = function() {
	var result = [], index = 0;
	this.forEach( elem=> {
		if( elem.type == 'radio' ) {
			if( elem.checked ){
				result = [{ index : index , value : elem.value }];
			}
		}
		else if( elem.type == 'checkbox' ){
			if( elem.checked ){
				result.push({ index : index , value : elem.value });
			}	
		}
		else {
			result.push({ index : index , value : elem.value });	
		}
		index++;
	})
	return result;
}

Object.prototype.empty = function( action1 = null , action2 = null ){
	if( Array.isArray( this ) ){
		var result = this.length==0?true:false;
		var type = "Array";
		var length = this.length;
	}
	else{
		var result = this.keys().length==0?true:false;
		var type = "Object";
		var length = this.keys().length;
	}
	if( action1 != null && result ){
		result = action1( this , type , length );
		if(result  != undefined) return result;
		return true;
	}
	else if(action2 != null && !result ){
		result = action2( this , type );
		if(result  != undefined) return result;
		return false;
	}
	else{
		return result;
	}
}

Object.prototype.filt = function ( param ) {
	var resultado = {};
	for( var index = 0; index < param.length; index++ ) {
		resultado[ param[ index] ] = this[ param[ index] ];
	}
	return resultado;
}

Object.prototype.getAll = function( key , value ){
	var resultado = [];
	if( Array.isArray( this ) ){
		var keys = [];
		for ( index = 0; index < this.length; index++ ) {
			keys.push( index );
		}

	}
	else{
		var keys =  this.keys();
	}
	
	for ( index = 0; index < keys.length; index++ ) {
		if( value === undefined ) {
			resultado.push( this[ keys[ index ] ][ key ] )	
		}
		else if( this[ keys[ index ] ][ key ] == value ) {
			resultado.push( this[ keys[ index ] ] )	
		}
		
	}
	return resultado;
}

Object.prototype.setAll = function( key , value, overwrite = true ){
	var resultado = this;
	if( Array.isArray( this ) ){
		var keys = [];
		for ( var index = 0; index < this.length; index++ ) {
			keys.push( index );
		}
	}
	else{
		var keys =  this.keys();
	}
	
	for ( var index = 0; index < keys.length; index++ ) {
		if(overwrite){
			resultado[ keys[ index ] ][ key ] = value;	
		}
		else{
			if( resultado[ keys[ index ] ] != undefined ) {
				resultado[ keys[ index ] ][ key ] = value;			
			}	
		}
		
	}
	return resultado;
}

Array.prototype.last = function ( ) {
	return this[this.length - 1]
}

Array.prototype.push2 = function( elem , oneXone = true){

	if( oneXone && Array.isArray(elem) ){
		for( var index = 0; index < elem.length; index++ ) {
			this.push( elem[index] );
		}
	}
	else{
		this.push(elem);
	}
	return this;
	
}

Array.prototype.sub = function( start = 0  , end = this.length ){
	if( start < 0 ) start = 0;
	if( end > this.length ) end = this.length - 1;
	var resultado = [];
	if( end < start ) return [];
	for( var index = start; index <= end; index++ ) {
		resultado.push( this[index] );
	}
	return resultado;
}

Array.prototype.nocontains = function ( value , config = 'index' ) {
	var non = this.contains( value , 'object');
	var resultado = [];
	for ( var index = 0; index < this.length; index++ ) {
		if ( !non.contains( this[ index ] , 'bool' ) ) {
			resultado.push( {
				'index' : index,
				'object': this[ index ]}[config] );
		}
	}
	return resultado;	
}

Array.prototype.contains = function( value , config = 'index' ) {
	debug_count++;
	if( debug_count == 100 ) return null;
	//console.log(value)
	if( Array.isArray( value ) ){
		if(value.length == 1) return this.contains( value[0] , config );
		return [this.contains( value[0] , config ) ].push2( this.contains( value.sub( 1 , value.length - 1 ) , config )) ;
	}
	resultado = [];
	for( var index = 0; index < this.length; index++ ){
		if( this[ index ] == value ){ 
			resultado.push({
				'index' : index,
				'object': this[index],
				'bool'	: true
			}[config]);
		}
	}
	if(resultado.empty()){
		return {
					'index' : -1,
					'object': undefined,
					'bool'	: false
				}[config];	
	}
	else{
		return resultado;
	}
	
}

Array.prototype.filterAs = function( handle ){
	if(Array.isArray(this)){
		var resultado = [];
		this.forEach( elem => {
			var temp = handle(elem);
			if(temp != undefined){
				resultado.push(temp)
			}
		})
		return resultado;
	}
	return null;
}
Array.prototype.extObj = function( attr , value ){
	var resultado = [];
	this.forEach( elem => {
		if(elem.hasOwnProperty(attr)){
			if(elem[attr] == value){
				resultado.push(elem);
			}
		}
	})
	return resultado;
}
Object.prototype.toArray = function(){
	if(!Array.isArray(this)){
		var temp = this;
		return [temp];
	}
	return this;
}

Object.prototype.keys = function(){
	var keys = [];
	for( var key in this ){
		if( this.hasOwnProperty( key ) ){
			keys.push( key )	
		}
	}
	return keys;
}
