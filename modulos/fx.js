if(window.modulos){
	modulos.fx.cargadoListo();
}

/*
	Un "Fx" sirve para crear movimientos, animaciones, etc.
	A cualquier clase se la puede extender con los metodos fx para que sus instancias
	puedan cambiar una propieadad de forma gradual con diferentes efectos.
*/

var Fx = {
	crear: null,
	actualizar: null,
	metodos: null,
	efectos: null
}

/*
	Un Fx tiene una propiedad, ej: "posX" y tiene opciones:
		(number) hasta:  hasta que posicion se va a llevar a la propieadad
		(number) tiempo: el tiempo en milisegundos que dura el Fx
		(string) efecto: el efecto que se le quiere dar (por defecto "linear")
		(function) onFinish: el callback para cuando termina el efecto
*/
Fx.crear = function(propiedad, settings){
	
	if( !this[propiedad] ){
		this[propiedad] = 0; // Para evitar problemas
	}
	if( !this.fx[propiedad] ){
		this.fx[propiedad] = [];
	}
	
	if( !this.fx[propiedad].length ){ 
		/*
			Si no hay ningun fx de este tipo se le de un "desde", sino se lo da cuando este
			por empezar a realizarse. Esta propiedad indica	la posicion inicial de la propieadad.
		*/
		settings.desde = this[propiedad]; 
	}
	
	settings.finalizado = false;
	
	if( settings.tiempo ){ // Si el trabajo tiene efecto
		if(!settings.efecto){
			settings.efecto = "linear"; // Por defecto el efecto es linear
		}
		
		settings.porcentaje = 0; // El efecto va 0%
		settings.velocidad = 100 / ( settings.tiempo / actualizacion.tiempo );
		
	}
	
	/*
		Los objetos tiene un array "fx", cada fx contiene un objeto (settings).
	*/
	this.fx[propiedad].push(settings);
}

Fx.actualizar = function( objeto ){ // Actualiza los fx de un objeto
	
	for( var propiedad in objeto.fx ){
		fx = objeto.fx[propiedad];
		
		settings = fx[0];
		
		if( settings && !settings.finalizado ){
			/* 
				Resuelve el valor actual de la propiedad "hasta", que puede ser un numero, una funcion 
				o un array. Una vez resuelto, "hasta" es un numero y significa a donde tiene que llegar
				el valor de la propiedad.
			*/
			
			var desde = settings.desde;
			var hasta = settings.hasta;
			
			if(tipo(hasta) == "function"){
				hasta = hasta();
			}
			else if(tipo(hasta) == "array"){
				var isFunct = tipo(hasta[1]) == "function" ? 0 : 0;
				hasta = hasta[0] * isFunct ? hasta[1]() : hasta[1] / 100;
			}
			
			if( !settings.tiempo ){
				/*
					Si el trabajo no tiene un efecto, en cada actualizacion la propiedad es igual al
					valor de "hasta".
				*/
				objeto[propiedad] = hasta;
			}
			else{
				/*
					Si el trabajo tiene efecto
				*/
				settings.porcentaje += settings.velocidad;
				
				if( settings.porcentaje >= 100 ){
					settings.porcentaje = 100;
					settings.finalizado = true;
				}
				
				if( settings.finalizado ){
					/*
						Si el efecto acaba de terminar se lo borra y si hay otro en la cola
						se le da la propieadad "desde".
					*/
					objeto[propiedad] = hasta;
					
					objeto.fx[propiedad].shift();
					
					if(objeto.fx[propiedad].length){
						objeto.fx[propiedad][0].desde = objeto[propiedad];
					}
					
					if( settings.onFinish ){
						settings.onFinish.call( objeto );
					}
				}
				else{
					
					/*
						Se calcula el porcentaje de la posicion a partir del porcentaje del tiempo.
					*/
					var porPosicion = Fx.efectos[settings.efecto](settings.porcentaje);
					
					/*
						Llama a los callbacks
					*/
					if( settings.callbacks ){
						for( var porcentaje in settings.callbacks ){
							var funcion = settings.callbacks[porcentaje];
							
							if( settings.porcentaje > Number(porcentaje) ){
								delete settings.callbacks[porcentaje];
								funcion();
							}
						}
					}
					
					/*
						Se calcula la posicion
					*/
					objeto[propiedad] = desde + ( porPosicion * ( hasta - desde ) / 100 );
					
				}
				
			}
			
		}
		
	}
}

/*
	Los metodos que se deben agregar a un objeto para poder usar works sobre este.
*/
Fx.metodos = {
	agregarFx: function(propiedad, _settings){
		Fx.crear.call(this, propiedad, _settings);
	},
	
	superponerFx: function(propiedad, _settings){
		this.fx[propiedad] = [];
		this.agregarFx(propiedad, _settings);
	},
	
	actualizarFx: function(){
		Fx.actualizar(this, this.works);
		return this;
	},
	
	removerFx: function(propiedad){
		if(propiedad){
			this.fx[propiedad] = [];
		}
		else{
			this.fx = [];
		}
	},
	
	fx: []
};

/*
	Los efectos de movimiento posibles, a un efecto se le pasa el porcentaje del
	movimiento hecho y devuelve el porcentaje de la posicion.
*/
Fx.efectos = {
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
		return 100 - Fx.efectos.quad( 100 - x );
	},
	cubic_reverse: function( x ){
		return 100 - Fx.efectos.cubic( 100 - x );
	},
	quart_reverse: function( x ){
		return 100 - Fx.efectos.quart( 100 - x );
	},
	quint_reverse: function( x ){
		return 100 - Fx.efectos.quint( 100 - x );
	},
	expo_reverse: function( x ){
		return 100 - Fx.efectos.expo( 100 - x );
	},
	
	quad_inOut: function( x ){
		if( x < 50 ){
			return Fx.efectos.quad( x * 2 ) / 2;
		}
		else{
			return 50 + ( Fx.efectos.quad_reverse( ( x - 50 ) * 2 ) / 2 );
		}
	},
	
	cubic_inOut: function( x ){
		if( x < 50 ){
			return Fx.efectos.cubic( x * 2 ) / 2;
		}
		else{
			return 50 + ( Fx.efectos.cubic_reverse( ( x - 50 ) * 2 ) / 2 );
		}
	},
	
	quart_inOut: function( x ){
		if( x < 50 ){
			return Fx.efectos.quart( x * 2 ) / 2;
		}
		else{
			return 50 + ( Fx.efectos.quart_reverse( ( x - 50 ) * 2 ) / 2 );
		}
	},
	
	quint_inOut: function( x ){
		if( x < 50 ){
			return Fx.efectos.quint( x * 2 ) / 2;
		}
		else{
			return 50 + ( Fx.efectos.quint_reverse( ( x - 50 ) * 2 ) / 2 );
		}
	},
	
	expo_inOut: function( x ){
		if( x < 50 ){
			return Fx.efectos.expo( x * 2 ) / 2;
		}
		else{
			return 50 + ( Fx.efectos.expo_reverse( ( x - 50 ) * 2 ) / 2 );
		}
	}
}

// --------------------
if(window.modulos){
	modulos.fx.interpretadoListo();
}