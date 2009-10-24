// alert("works cargado");

function Work( settings ){ // Clase Work ( trabajo, movimiento, animacion, ... ) es aplicable a todos los objetos
	for( var s in settings ){
		this[s] = settings[s];
	}
	
	this.isWork = true;
}


function addWork(property, settings){ // Un trabajo tiene una propiedad, ej: "left" y las opciones
	
	var interval = 30;
	
	if( !this[property] ){
		this[property] = 0; // Para evitar problemas
	}
	if( !this.works[property] ){
		this.works[property] = [];
	}
	
	if( !this.works[property].length ){ // Si no esta haceindo ahora ningun trabajo de este tipo
		settings.from = this[property]; // Le de un from, sino se lo da cuando este por empezar a realizarse
	}
	settings.finished = false;
	
	if( settings.time ){ // Si el trabajo tiene efecto
		
		if(!settings.effect){
			settings.effect = "linear"; // EL default de efecto es linear
		}
		
		settings.percent = 0; // El efecto va 0%
		settings.speed = 100 / ( settings.time / interval );
		
	}
	
	this.works[property].push(settings);
	// Los objetos tiene un array "works", cada trabajo contiene un objeto que se acaba de generar
}

function doWorks( object ){ // Actualiza los trabajos de un objeto
	
	for( var property in object.works ){
		works = object.works[property];
		
		settings = works[0];
		
		if( settings && !settings.finished ){ // Si no terminó
			
			// Resuelve el valor actual de la propiedad "to", que puede ser un numero, una funcion o un array
			// Una vez resuelto, to es un numero y significa a donde tiene que llegar el valor de la propiedad
			// a la que se le aplica el trabajo
			
			var to = settings.to;
			var from = settings.from;
			
			if(to.isFunction){
				to = to();
			}
			else if(to.isArray){
				to = to[0] * to[1].isFunction ? to[1]() : to[1] / 100;
			}
			
			if( !settings.time ){ // Si el trabajo no tiene un efecto, en cada actualizacion la propiedad es igual al valor de to
				object[property] = to;
			}
			else{ // Si el trabajo tiene efecto
				
				settings.percent += settings.speed;
				
				if( settings.percent >= 100 ){
					settings.percent = 100;
					settings.finished = true;
				}
				
				if( settings.finished ){
					object[property] = to;
					
					object.works[property].shift();
					object.works[property] = arrayValues(object.works[property]);
					
					if(object.works[property].length){
						object.works[property][0].from = object[property];
					}
					
					if( settings.onFinish ){
						settings.onFinish.call( object );
					}
				}
				else{
					
					// calcula el porcentaje de la posicion desde from hasta to a partir del porcentaje del tiempo
					var posPercent = effects[settings.effect](settings.percent);
					
					// llama a los pregress callbacks
					if( settings.progressCallbacks ){
						settings.progressCallbacks.each(function(_function, progress){
							
							if( settings.percent > Number(progress) ){
								_function();
								delete settings.progressCallbacks[progress];
							}
						});
					}
					
					// Calcula la posicion
					object[property] = from + ( posPercent * ( to - from ) / 100 );
					
				}
				
			}
			
		}
		
	}
}


var worksMethods = { // Los metodos que se deben agregar a un objeto para poder usar works sobre él
	addWork: function(property, _settings){
		addWork.call(this, property, _settings);
	},
	
	setWork: function(property, _settings){
		this.works[property] = [];
		this.addWork(property, _settings);
	},
	
	doWorks: function(){
		doWorks(this, this.works);
		return this;
	},
	
	removeWork: function(property){
		if(property){
			this.works[property] = [];
		}
		else{
			this.works = [];
		}
	}
};


var effects = { // Los efectos de movimiento posibles, a un efecto se le pasa el porcentaje del movimiento hecho y devuelve el porcentaje de la posicion
	linear: function( x ){
		return x;
	},
	quad: function( x ){
		x = x * Math.pow( 100, 1 / 2 ) / 100;
		return Math.pow( x, 2 );
	},
	cubic: function( x ){
		x = x * Math.pow( 100, 1 / 3 ) / 100;
		return Math.pow( x, 3 );
	},
	quart: function( x ){
		x = x * Math.pow( 100, 1 / 4 ) / 100;
		return Math.pow( x, 4 );
	},
	quint: function( x ){
		x = x * Math.pow( 100, 1 / 5 ) / 100;
		return Math.pow( x, 5 );
	},
	expo: function( x ){
		x = x * 1.83045 / 100;
		return Math.pow( 2, 8 * ( x - 1 ) );
	},
	
	quad_reverse: function( x ){
		return 100 - effects.quad( 100 - x );
	},
	cubic_reverse: function( x ){
		return 100 - effects.cubic( 100 - x );
	},
	quart_reverse: function( x ){
		return 100 - effects.quart( 100 - x );
	},
	quint_reverse: function( x ){
		return 100 - effects.quint( 100 - x );
	},
	expo_reverse: function( x ){
		return 100 - effects.expo( 100 - x );
	},
	
	quad_inOut: function( x ){
		if( x < 50 ){
			return effects.quad( x * 2 ) / 2;
		}
		else{
			return 50 + ( effects.quad_reverse( ( x - 50 ) * 2 ) / 2 );
		}
	},
	
	cubic_inOut: function( x ){
		if( x < 50 ){
			return effects.cubic( x * 2 ) / 2;
		}
		else{
			return 50 + ( effects.cubic_reverse( ( x - 50 ) * 2 ) / 2 );
		}
	},
	
	quart_inOut: function( x ){
		if( x < 50 ){
			return effects.quart( x * 2 ) / 2;
		}
		else{
			return 50 + ( effects.quart_reverse( ( x - 50 ) * 2 ) / 2 );
		}
	},
	
	quint_inOut: function( x ){
		if( x < 50 ){
			return effects.quint( x * 2 ) / 2;
		}
		else{
			return 50 + ( effects.quint_reverse( ( x - 50 ) * 2 ) / 2 );
		}
	},
	
	expo_inOut: function( x ){
		if( x < 50 ){
			return effects.expo( x * 2 ) / 2;
		}
		else{
			return 50 + ( effects.expo_reverse( ( x - 50 ) * 2 ) / 2 );
		}
	}
}