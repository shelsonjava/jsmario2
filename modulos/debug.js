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
	activa: true, 	// Si la consola esta activa
	oculta: false, 	// Si la consola esta oculta
	convinacion: "Ctrl Space", 	// La convinacion de teclado para ocultarla o mostrarla
	objetos: [], 	// Los objetos que se debuguean
	lineas: 400, 	// Cantidad de objetos almacenados
	posY: 0, 		// La posicion Y
	lastY: 0, 		// La ultima posicion Y
	alto: 201, 		// El alto de la consola en pixels
	inputAlto: 19, 	// El alto del input de la consola
	inputArr: [], 	// Donde se guarda lo que se escribe en el input
	inputArrPos: 0	// La posicion dentro de "inputArray" actual
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
			html = "Array[" + objeto.length + "]: " + htmlentities(String(objeto));
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
			html = htmlentities(String(objeto));
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
	"cargarConsola" Carga la nueva consola que ya no es provisoria.
*/
function cargarConsola(){
	
	consola.domObj = get("consola");
	consola.content = get("conContent");
	consola.input = get("conInput");
	
	consola.content.innerHTML = "";
	for( var d in debugArray ){
		log(debugArray[d]);
	}
	
	log("-- Debug avanzado cargado --");
	log(consola.convinacion + " para Mostrar / Ocultar Consola");
	
	log(["t", "e", "s", "t"]);
	
	log(155.222);
	log(/TU \H\E\R\A\M\A\n\A/g);
	
	log(true);
	log(false);
	
	log({
		tipo: 1,
		velocidad: 20,
		nombre: "Juan"
	});
	
}
cargarConsola();

/*
	Carga el input de la consola.
*/
function cargarConsolaInput(){
	log("-- Input de la consola activado --");
	consola.input.style.display = "";
	
	consola.alto += consola.inputAlto;
	consola.domObj.style.height = consola.alto + "px";
	
	eventos.agregar(consola.input, "keydown", function(evento){
		if( evento.keyCode == 13 ){
			inputEvaluar();
		}
		else if(evento.keyCode == 38){
			inputMemoria(+1);
		}
		else if(evento.keyCode == 40){
			inputMemoria(-1);
		}
	});
}

/*
	Muestra u oculta la consola.
*/
function consolaToogle(){
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
			consolaToogle();
		},
		prevenirDef: true
	});
	
	cargarConsolaInput();
});

/*
	Cuando se interpreta el modulo fx se activan los efectos de la consola.
*/
crearModuloCB("fx", function(){
	extender(consola, Fx.metodos);
});

/*
	Actualiza la posicion de la consola en la DOM.
*/
function actualizarConsola(){
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
function inputEvaluar(){
	var js = consola.input.value;
	consola.inputArr.push(js);
	consola.input.value = "";
	
	log(">>> " + js);
	log(eval(js));
}

/*
	Escribe en el input las ultimas cosas que se hayan evaluado.
*/
function inputMemoria(posicionDelta){
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