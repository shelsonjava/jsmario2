if(window.modulos){
	modulos.eventos.cargadoListo();
}
// --------------------

/*
	Requiere: misc.js
	Script multiplataforma con utilidades para gestionar mas facil los eventos del DOM.
	Incluye un gestor para convinaciones del teclado.
*/

var eventos = {
	agregar: null, // Agrega un evento a un objeto.
	quitar: null, // Saca un evento de un objeto.
	prevenirDef: null, // Previene el default de un evento.
	/*
		Funciones multiplataforma que a partir de objetos de tipo event extraen informacion 
		y la devuelven.
	*/
	mouseInfo: null // Devuelve la posicion del mouse y si esta disponible con que boton se hizo click
};

var teclado = {
	crearAtajo: null, // Crear un atajo.
	convinacionParse: null, // Parsear una convinacion de teclado.
	down: null, // Se corre en el evento keydown del documento.
	up: null, // Se corre en el evento keyup del documento.
	atajosCheck: null, // Revisa los atajos cuando alguna tecla es apretada o soltada.
	/*
		"teclas" contiene los nombres de las teclas en orden segun su codigo.
	*/
	teclas: [
		0, 0, 0, 0, 0, 0, 0, 0,	"BackSpace", "Tab", 0, 0, 0, "Enter", 0, 0, "Shift", "Ctrl",
		"Alt", "Pause", "CapsLock",	0, 0, 0, 0, 0, 0, "Escape", 0, 0, 0, 0, "Space", "PageUp", 
		"PageDown", "End", "Home", "Left", "Up", "Right", "Down",0, 0, 0, 0, "Insert", 
		"Delete", 0, "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 0, 0, 0, 0, 0, 0, 0,
		"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q",
		"r", "s", "t", "u", "v", "w", "x", "y", "z", "LSuper", "RSuper", "Select", 0, 0,
		"N0", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "Multiply", "Add", 0,
		"Subtract", "Decimal", "Divide", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
		"F9", "F10", "F11", "F12",0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, "NumLock", "ScrollLock", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "Semicolon",
		"Equal", "Comma", "Dash", "Period", "ForwardSlash", "GraveAccent",0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "OpenBracket", 
		"BackSlash", "CloseBraket", "SingleQuote"
	],
	/*
		"activas" contiene las teclas actualmente apretadas.
		Por ejemplo si la tecla con codigo 13 esta apretada, entonces activas[13] va 
		a ser true.
	*/
	activas: [],
	/*
		El array que contiene los atajos.
	*/
	atajos: []
};


eventos.agregar = function( objeto, evento, funcion ){
	/*
		Agrega un evento a un objeto del DOM de forma cross-browser.
	*/
	if( objeto.addEventListener ){
		objeto.addEventListener( evento, funcion, false );
		return true;
	}
	else if( objeto.attachEvent ){
		 objeto.attachEvent( "on" + evento, funcion );
		 return true;
	}
	
	return false;
}

eventos.quitar = function(objeto, evento, funcion){
	/*
		Quita un evento de un objeto del DOM de forma cross-browser.
	*/
    if( objeto.removeEventListener ){
		objeto.removeEventListener(evento, funcion, false);
	}
	
    else if( objeto.detachEvent ){
        objeto.detachEvent( "on" + evento, funcion );
    }
}

eventos.prevenirDef = function( evento ){
	/*
		Previene el default de un evento a partir de su objeto event.
	*/
	//var evento = evento ? evento : window.event;
	evento.defPrevenido = true;
	
    if( evento.preventDefault ){
        return evento.preventDefault();
    }
	else if( evento.stopPropagation ){
		evento.stopPropagation();
	}
	else{
        evento.returnValue = false;
    }
}

teclado.crearAtajo = function(convinacion, settings){
	/*
		Crea un atajo de teclado. 
		"convinacion" es el string con los nombres de las teclas 
		(separados por un espacio) necesarias para que se active el atajo.
	*/
	
	/*
		Parsea el atajo convirtiendolo en un array de codigos de las teclas.
	*/
	convinacion = teclado.convinacionParse(convinacion);
	
	var atajo = {
		convinacion: convinacion,
		activo: false, // Si la convinacion esta cumplida o no
		onDown: settings.down,
		onUp: settings.up,
		prevenirDef: settings.prevenirDef || false
	};
	
	teclado.atajos.push(atajo);
	
	return atajo;
}

teclado.convinacionParse = function(convinacion){
	// Requiere misc.js -> _indexOf
	/*
		Convierte un string con los nombres de las teclas en un array con los codigos de las mismas.
	*/
	
	convinacion = convinacion.split(/\s/g);
	
	var nueva_convinacion = [];
	
	for( var t in convinacion ){
		var tecla = convinacion[t];
		var codigo = _indexOf(teclado.teclas, tecla);
		
		if(codigo != -1){
			nueva_convinacion.push( codigo );
		}
	}
	
	return nueva_convinacion;
}

teclado.down = function(evento){
	//log(evento.keyCode);
	/*
		Se corre cuando una tecla es apretada en el documento.
	*/
	var codigo = evento.keyCode;
	teclado.activas[codigo] = true;
	
	teclado.atajosCheck(evento);
	
	// log(evento.defPrevenido ? "Event Blocked" : "Event Allowed");
	return !evento.defPrevenido;
}

teclado.up = function(evento){
	/*
		Se corre cuando una tecla es soltada en el documento.
	*/
	var codigo = evento.keyCode;
	teclado.activas[codigo] = null;
	
	teclado.atajosCheck(evento);
	
	return !evento.defPrevenido;
}

teclado.atajosCheck = function(evento){
	/*
		Por cada atajo se comprueba si su estado cambio, es decir si 
	*/
	for( var t in teclado.atajos ){
		var atajo = teclado.atajos[t];
		
		var activa = true; // Se torna false si alguna de las teclas requerias no esta apretada.
		for( var t in atajo.convinacion ){
			var tecla = atajo.convinacion[t];
			if( !teclado.activas[tecla] ){
				activa = false;
			}
		}
		
		/*
			Un evento si es que la convinacion esta activa o si se acaba de soltar, nunca cuando
			no esta activa porque bloquearia a todas las demas.
		*/
		if( activa && atajo.prevenirDef == true ){
			eventos.prevenirDef(evento);
		}
		
		if( activa && !atajo.activo ){
			atajo.activo = true;
			if(atajo.onDown){
				atajo.onDown(evento);
			}
		}
		else if( !activa && atajo.activo ){
			atajo.activo = false;
			if(atajo.onUp){
				atajo.onUp(evento);
			}
			
			if( atajo.prevenirDef == true ){
				eventos.prevenirDef(evento);
			}
		}
	}
	
}

eventos.agregar(document, "keydown", teclado.down);
eventos.agregar(document, "keyup", teclado.up);


/*
	Scripts para parsear eventos.
*/
eventos.mouseInfo = function(evento, scroll){
	// Requiere misc.js -> docScroll
	/*
		A partir de un evento del mouse devuelve su posicion ("x" e "y") y, si esta disponible,
		el boton del mismo que se utilizó ("derecho", "medio" o "izquierdo").
		
		En el caso de IE, los eventos del mouse agregados al documento no incluyen en su posicion
		la posicion del scroll, osea que la posicion es siempre relativa al viewport. Si "scroll" es
		true la funcion le agregará la posicion del scroll a la del mouse.
	*/
	
	evento = evento || window.event; // Por IExplorer
	/*
		"info" almacena la informacion del evento. Es la variable que se devuelve.
	*/
	var info = {
		boton: "left",
		x: 0,
		y: 0
	};
	
	
	if(evento.which){
		info.boton = ["", "left", "middle", "right"][evento.which];
	}
	else if(evento.button){
		info.boton = ["", "left", "right", "", "middle"][evento.button];
	}
	
	if(evento.pageX || evento.pageY){ 
		info.tipo = "page";
		info.x = evento.pageX;
		info.y = evento.pageY;
	} 
	else{ // IExplorer
		info.tipo = "client";
		info.x = evento.clientX;
		info.y = evento.clientY;
		
		if( scroll == true ){
			info.x += docScroll().left;
			info.y += docScroll().top;
		}
	}
	
	return info;
}


// --------------------
if(window.modulos){
	crearModuloCB("misc", function(){
		modulos.eventos.interpretadoListo();
	});
}