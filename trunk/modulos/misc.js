if(window.modulos){
	modulos.misc.cargadoListo();
}
// --------------------

/*
	Funciones aisaladas que no requieren de ningun otro modulo. Sirven para mejorar la compatibilidad
	y hacer mas simples algunas tareas basicas.
*/

function arrayValues(array){
	/*
		Devuelve todos los valores de un array uno tras otro, los junta en uno nuevo.
	*/
	var newArray = [];
	for( var p in array ){
		newArray[p] = array[p];
	}
	return newArray;
}


function _indexOf(array, objeto){
	/*
		Index of en array multiplataforma.
		Busca un valor dentro de un array y devuelve su posicion.
	*/
	if( array.indexOf ){
		return array.indexOf(objeto);
	}
	else{
		for( var i in array ){
			if( array[i] === objeto ){
				return i;
			}
		}
	}
	
	return -1;
}

function docScroll(){
	/*
		Funcion multiplatadorma que devuelve la posicion del scroll del documento.
	*/
	
	/*
		Para la mayoria de los navegadores modernos.
	*/
	if( typeof window.pageYOffset == 'number' ){ 
		return {
			tipo: "pageOffset",
			top: window.pageYOffset,
			left: window.pageXOffset
		};
	}
	/*
		La forma estandar.
	*/
	else if( document.body 
		&& ( document.body.scrollLeft || document.body.scrollTop ) ){
		return {
			tipo: "body",
			top: document.body.scrollTop,
			left: document.body.scrollLeft
		};
	}
	/*
		Para IExplorer.
	*/
	else if( document.documentElement 
		&& ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ){ 
		return {
			tipo: "documentElement",
			top: document.documentElement.scrollTop,
			left: document.documentElement.scrollLeft
		};
	}
	
	return {
		tipo: "",
		top: 0,
		left: 0
	};
}

/*
	Recibe una variable y devuelve el tipo de variable que es.
*/
function tipo( objeto, comprobacion ){
	/*
		La comprobacion es opcional. Si el tipo de variable del "objeto" es igual a comprobacion se devuelve true, sino false.
	*/
	if(comprobacion){
		return tipo(objeto) == comprobacion;
	}
	
	var _tipo = typeof objeto, match;
	
	if(_tipo == "object" && !objeto){
		return "null";
	}
	
	if( _tipo != "undefined" && objeto.nodeType ){
		return "domObject";
	}
	
	if(_tipo == "object"){
		if (!objeto.constructor){
			return 'object';
		}
		
		var cons = objeto.constructor.toString();
		if (match = cons.match(/(\w+)\(/)){
			cons = match[1].toLowerCase();
		}
		
		var tipos = ["boolean", "number", "string", "array", "regexp", "function"];
		
		for(var clave in tipos) {
			if (cons == tipos[clave]) {
				return tipos[clave];
				break;
			}
		}
		
	}
	
	return _tipo;
}

/*
	Agregar todas las propiedades del segundo objeto al prmiero.
*/
function extender(objeto1, objeto2){
	for( var p in objeto2 ){
		objeto1[p] = objeto2[p];
	}
	
	return objeto1;
}

/*
	Hace scape de los tags html en un texto.
*/
function htmlentities(texto){
	var caracteres = [
		["&", /\&/g],
		["<", /\</g],
		[">", /\>/g],
		["/", /\//g]
	]
	
	for( var c in caracteres ){
		texto = texto.replace(caracteres[c][1], "&#" + caracteres[c][0].charCodeAt(0) + ";");
	}
	
	return texto;
}

/*
	Funciones para el DOM.
*/
var dom = {
	crear: null,
	remover: null,
	agregar: null
};

/*
	Crea un objeto del dom y le pone propiedades.
*/
dom.crear = function(tipo, propiedades, padre){
	
	propiedades = propiedades || {};
	
	var objeto = document.createElement(tipo);
	var estilo = propiedades.style;
	
	delete propiedades.style;
	
	extender(objeto, propiedades);
	if(estilo){
		extender(objeto.style, estilo);
	}
	
	if( padre ){
		dom.agregar(padre, objeto);
	}
	
	return objeto;
}

/*
	Remueve un objeto de su padre.
*/
dom.remover = function(objeto){
	if( objeto.parentNode){
		objeto.parentNode.removeChild(objeto);
		return true;
	}
	return false;
}

/*
	Agrega un objeto a otro (objeto a padre).
*/
dom.agregar = function(padre, objeto){
	padre.appendChild(objeto);
}


/*
	Le cambia la opacidad a un objeto de la dom.
*/
function opacidad( objeto, porcentaje ){
	if( soporte.navegador.nombre == "iexplorer" ){
		objeto.style.filter = "Alpha(opacity = " + porcentaje + " )";
	}
	else{
		objeto.style.opacity = porcentaje / 100;
	}
}

/*
	Recive el nombre de una propiedad css3 y devuelve una lista con las posibles notaciones en javascript.
	Ej: recive "box-shadow" y devuelve ["boxShadow", "MozBoxShadow", "webkitBoxShadow", etc]
*/
var css3Props = 	["border-image", "border-radius", "box-shadow", "background-origin", "background-clip", "background-size", "text-shadow",
					"text-overflow", "box-sizing", "resize"];

function cssToJs(cssProp){

	var letraCapital = function(a){
		return a.substr(1, 1).toUpperCase();
	};
	
	var jsProp = cssProp.replace(/-./g, letraCapital);
	
	if(_indexOf(css3Props, cssProp) != -1){
		// Si es una propiedad css3
		var _jsProp = ("-" + cssProp).replace(/-./g, letraCapital);
		
		return [
			jsProp,
			"Moz" 	+ _jsProp,
			"moz" 	+ _jsProp,
			"webkit" + _jsProp,
			"ms" 	+ _jsProp,
			"o" 	+ _jsProp
		];
	}
	else{
		return [jsProp];
	}
	
}

/*
	Le da un valor a una propiedad css de un objeto.
*/
function css(objeto, propiedades){

	for(var p in propiedades){
		var props = cssToJs(p);
		
		for(var i in props){
			objeto.style[props[i]] = propiedades[p];
		}
	}
	
}

/*
	Convierte un texto en el html necesario para mostrarlo con la fuente de mario.
*/
function escribir(texto, size){
	size = size || 16;
	return "<span class='texto'>" + texto + "</span>";
}

// --------------------
if(window.modulos){
	modulos.misc.interpretadoListo();
}