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
function tipo( objeto ){
	var tipo = typeof objeto, match;
	
	if(tipo == "object" && !objeto){
		return "null";
	}
	
	if( tipo != "undefined" && objeto.nodeType ){
		return "domObject";
	}
	
	if(tipo == "object"){
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
	
	return tipo;
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
	objeto.style.opacity = porcentaje / 100;
	objeto.style.filter = "Alpha(opacity = " + porcentaje + " )";
}


// --------------------
if(window.modulos){
	modulos.misc.interpretadoListo();
}