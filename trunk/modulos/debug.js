if(window.modulos){
	modulos.debug.cargadoListo();
}
/*
	El modulo debug avanzado reemplaza al provisorio. Se pueden debuguear tanto strings y numeros como arrays, objetos.
*/

/*
	Configuracion de la consola.
*/
var consola = {
	limpiar: null,		// Limpia la consola
	separador: null, 	// Muestra un separador en la consola
	cargar: null,		// Carga la consola
	cargarInput: null,	// Carga el cuadro de texto de la consola	
	toogle: null,		// Muestra / Oculta la consola
	actualizar: null,	// Actualiza la posicion de la consola
	evaluar: null,		// Evalua lo que se escribio en el input de la consola
	inputMemoria: null,	// Navega en la memoria del input de la consola.
	set: null, 			// Le cambia el valor a una "variable" que haya sido craeda dentro de la consola
	domObj: get("consola"), 		// El div que sirve de contendor
	content: get("conContent"),		// El div con el contenido de la consola
	input: get("conInput"),			// El input de la consola
	
	activa: true, 	// Si la consola esta activa
	oculta: false, 	// Si la consola esta oculta
	convinacion: "Ctrl Space", 	// La convinacion de teclado para ocultarla o mostrarla
	objetos: [], 	// Los objetos que se debuguean
	lineas: 600, 	// Cantidad de objetos almacenados
	posY: 0, 		// La posicion Y
	lastY: 0, 		// La ultima posicion Y (para actualizar el alto solo cuando cambia)
	alto: 201, 		// El alto de la consola en pixels (sin el input)
	inputAlto: 19, 	// El alto del input de la consola
	inputArr: [], 	// Donde se guarda lo que se escribe en el input
	inputArrPos: 0	// La posicion dentro de "inputArray" para poder navegar por este
};

function log(objeto){
	if(!consola.activa){
		return false;
	}
	
	var info = {
		objeto: objeto,
		domObj: dom.crear("div")
	}
	
	var html = ""; // El html del objeto debugueado
	var clase = ""; // La clase para el objeto de la DOM
	
	switch( tipo(objeto) ){
		case "array":
			html = "Array[" + objeto.length + "]: " + htmlentities( objeto.join(", ") );
			clase = "debug_array";
		break;
		
		case "object":
			html = "Object: {<div class='tab'>"; // El html generado
			var primero = true;
			
			for( var i in objeto ){
				html += ( primero ? "" : "<br />") + i + ": " + htmlentities(String(objeto[i]));
				primero = false;
			}
			
			html += "</div>}";
			
			clase = "debug_object";
		break;
		
		case "boolean": case "number": case "regexp":
			html = htmlentities(String(objeto));
			clase = "debug_" + tipo(objeto);
		break;
		
		case "function":
			html = "<pre>" + htmlentities(String(objeto)) + "</pre>";
			clase = "debug_function";
		break;
		
		case "domObject":
			html = "Dom Object: " + objeto.tagName;
			clase = "debug_domObject";
		break;
		
		default:
			var str = htmlentities(String(objeto))
			str = String(str).replace(/[^\/]\$([^\s^:]*)(:(\S*))*/g, " <label id=\"$1\">$3</label>");
			str = String(str).replace(/\/\$/g, "$");
			
			html = str;
			clase = "debug_default";
		break;
	}
	
	extender(info.domObj, {
		innerHTML: html,
		className: "debug " + clase
	});
	
	consola.objetos.push(info);
	consola.content.appendChild(info.domObj);
	consola.content.scrollTop += 999999;
	
	
	if( consola.objetos.length > consola.lineas ){
		consola.content.removeChild(consola.objetos[0].domObj);
		consola.objetos.shift();
	}
}

/*
	Cambia el mensaje que aparece cuando se esta cargando el juego.
*/
function msgGeneral(msg){
	get("msgGeneral").innerHTML = msg;
}

/*
	Le agrega un separador a la consola.
*/
consola.separador = function(){
	dom.crear("div", {
		className: "conSeparador",
		innerHTML: "&nbsp;"
	}, consola.content);
}

/*
	Funcion que limpia la consola.
*/
consola.limpiar = function(){
	consola.objetos = [];
	consola.content.innerHTML = "";
	return "Cosola Limpia";
}

/*
	Carga la nueva consola que ya no es provisoria.
*/
consola.cargar = function(){
	consola.limpiar();
	
	for( var d in debugArray ){
		log(debugArray[d]);
	}
	debugArray = [];
	
	consola.separador();
	log("-- Debug avanzado cargado --");
	log(consola.convinacion + " para Mostrar / Ocultar Consola");

	log(["t", "e", "s", "t"]);
	log({
		tipo: "test",
		velocidad: 20,
		posicion: 520
	});
	consola.separador();
	
}
consola.cargar();

/*
	Carga el input de la consola.
*/
consola.cargarInput = function(){
	log("-- Input de la consola activado --");
	consola.input.style.display = "";
	
	consola.alto += consola.inputAlto;
	consola.domObj.style.height = consola.alto + "px";
	
	eventos.agregar(consola.input, "keydown", function(evento){
		if( evento.keyCode == 13 ){
			consola.evaluar();
		}
		else if(evento.keyCode == 38){
			consola.inputMemoria(+1);
		}
		else if(evento.keyCode == 40){
			consola.inputMemoria(-1);
		}
	});
}

/*
	Muestra u oculta la consola.
*/
consola.toogle = function(){
	consola.oculta = !consola.oculta;
	
	if( consola.fx ){
		consola.superponerFx("posY", {
			hasta: consola.oculta ? -consola.alto - 1 : 0,
			tiempo: 210,
			efecto: "quad_reverse"
		});
	}
	else{
		consola.lastY = consola.posY;
		consola.posY = consola.oculta ? -consola.alto - 1 : 0;
	}
	
	if(consola.oculta){
		consola.input.blur();
	}
	else{
		consola.input.focus();
	}
	
}

/*
	Cuando se interpreta el modulo eventos se crea el atajo de teclado que muestra u oculta la consola.
*/
crearModuloCB("eventos", function(){
	teclado.crearAtajo("Ctrl Space", {
		down: function(e){
			consola.toogle();
		},
		prevenirDef: true
	});
	
	consola.cargarInput();
});

/*
	Cuando se interpreta el modulo fx se activan los efectos de la consola.
*/
crearModuloCB("fx", function(){
	Fx.agregarMetodos(consola);
});

/*
	Actualiza la posicion de la consola en la DOM.
*/
consola.actualizar = function(){
	if( consola.fx ){
		consola.actualizarFx();
	}
	if(consola.posY != consola.lastY){
		consola.lastY = consola.posY;
		consola.domObj.style.top = consola.posY + "px";
		
		// log(consola.posY);
	}
}

/*
	Evalua lo que dice el input de la consola (se corre cuando cuando se apreta enter).
*/
consola.evaluar = function(){
	var js = consola.input.value;
	consola.inputArr.push(js);
	consola.input.value = "";
	
	log("<<< " + js);
	log(eval(js));
}

/*
	Escribe en el input las ultimas cosas que se hayan evaluado.
*/
consola.inputMemoria = function(posicionDelta){
	var arrLength = consola.inputArr.length;
	
	var posicion = arrLength - consola.inputArrPos - 1;
	
	if( consola.inputArr[posicion] !== consola.input.value ){
		consola.inputArrPos = -1;
	}
	
	var posicion = arrLength - consola.inputArrPos - 1;
	
	if( tipo(consola.inputArr[posicion - posicionDelta]) == "undefined" ){
		if( posicionDelta < 0 ){
			consola.input.value = "";
		}
		return false;
	}
	
	consola.inputArrPos += posicionDelta;
	
	var posicion = arrLength - consola.inputArrPos - 1;
	consola.input.value = consola.inputArr[posicion];
}

/*
	Le cambia el valor a una "variable" que haya sido craeda dentro de la consola
*/
consola.set = function(variable, html){
	var objeto = get(variable);
	if( objeto ){
		objeto.innerHTML = html;
	}
	/*else{
		log("Variable " + variable + " no pudo ser encontrada en la consola.");
	}*/
}

/*
	El evento onerror se loguea en la consola.
*/
window.onerror = function(mensaje, url, linea){
	log("ERROR:");
	log(" -> mensaje: " + mensaje);
	log(" -> url: " + url + "  @" + linea);
}

// --------------------
if(window.modulos){
	modulos.debug.interpretadoListo();
}