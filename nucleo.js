// alert("nucleo cargado");
/*
	Script nueclo. Coordina a todos los demas scripts, en este se encuentra la estructura del juego.
*/

/*
	Simple get de objetos de la DOM por id usado de forma provisoria.
*/
function get(id){
	return document.getElementById(id);
}

/*
	"general" guarda la configuracion general del juego y la pagina, como por ejemplo si estan 
	habilitados los efectos, el tamaño del juego si se cambió, etc.
	
	Primero se define el default, y despues cuando se carga el modulo almacenamiento se carga 
	la configuracion guardada previamente en el cliente.
*/
var general = {
	efectos: true, 		// Si los efectos estan habilitados
	comentarios: true, 	// Si estan habilitados los comentarios
	precarga: true, 	// Si esta habilitada la precarga de imagenes
	ancho: 510,			// El ancho del juego
	alto: 450			// El alto del juego
};


/*
	Debug provisorio.
	"debugArray" almacena lo que se escribe en el debug provisorio.
*/
var debugArray = [];

function log(txt){
	debugArray.push(txt);
	
	get("conContent").innerHTML += "<div>" + txt + "</div>";
	get("conContent").scrollTop = 9999999;
}

log("-- Debug provisorio cargado --");

/*
	Cada script tiene su objeto que lo identifica en el nucleo, de clase "Modulo" que contiene
	informacion sobre su url, si ya esta cargado, si ya esta interpretado, y un metodo para cargarlo.
	
	Tambien tienen eventos, que les sirven por ejemplo a un modulo para sabes cuando carga otro y 
	hacer algo.
	
	Todo esto tambien sirve en el proceso de debug, con una funcion que marca donde se interfirio la 
	carga de estos modulos por un posible error en uno.
*/

function Modulo(url){
	this.url = "modulos/" + url;
	this.creado = false; 		// Si el objeto script del DOM esta creado
	this.cargado = false; 		// Si el script ya cargó y se empezo a interpretar
	this.interpretado = false;	// Si el script se interpreto correctamente
	
	this.domObj = null;			// El objeto del document <script> que carga al modulo
	
	/*
		"Modulo.cargar" carga el modulo creando un obejto de la DOM <script>.
		Este objeto de la dom se almacena dentro del mismo Modulo por si se quiere
		eliminar o volver a cargar.
	*/
	this.cargar = function(){
		if( this.creado ){ // Si ya estaba creado lo borra
			this.borrar();
		}
		
		this.domObj = document.createElement("script");
		this.domObj.src = this.url;
		document.body.appendChild(this.domObj);
		
		this.creado = true;
	}
	
	/*
		Recargar solo consiste en volverlo a cargar ;-)
	*/
	this.recargar = this.cargar;
	
	this.borrar = function(){
		document.body.removeChild(this.domObj);
		delete this.domObj;
		this.domObj = null;
		
		this.creado = false; 
		this.cargado = false;
		this.interpretado = false;
	}
	
	/*
		"Modulo.cargadoListo" lo llama el propio modulo cuando empieza a ser interpretado
	*/
	this.cargadoListo = function(){
		// log("Cargado: " + this.url);
		this.cargado = true;
	}
	
	/*
		"Modulo.interpretadoListo" lo llama el propio modulo cuando termina de ser interpretado
	*/
	this.interpretadoListo = function(){
		log("Interpretado: " + this.url);
		this.interpretado = true;
		// Checkea los callbacks para correr el que este listo
		moduloCBCheck();
	}
	
}

/*
	"crearModuloCB" (CB = call back) crea un nuevo callback que se correra cuando un o mas modulos 
	especificos sean interpretados correctamente.
	"moduloCBCheck" es llamado cada vez que un modulo es terminado de interpretarse.
	"modulosCBs" Es el array que contiene a los callbacks de modulo.
*/
var moduloCBs = [];

function crearModuloCB(modulos, funcion){
	/*
		"modulos" debe ser un string, o un array de strings que definan el nombre de los modulos que se 
		requiere que esten interpretados para que se corra la funcion ("funcion"). 
		Por ejemplo crearModuloCB(["soporte", "eventos"], xFunc);
		Cuando el modulo "soporte" y el modulo "eventos" terminen de ser interperados se correra "xFunc";
	*/
	var moduloCB = {
		modulos: typeof modulos == "string" ? [modulos] : modulos,
		funcion: funcion
	}
	
	moduloCBs.push(moduloCB);
	
	moduloCBCheck(); // Por las dudas ya hayan sido interpretados anteriormente
}

function moduloCBCheck(){
	/*
		Checkean todos los call backs de modulos a ver cual esta listo y se lo corre.
	*/
	
	for( var c in moduloCBs ){
		var callBack = moduloCBs[c];
		var callBackListo = true; // Si alguno de los modulos que se requiere no esta interpretado se torna falso
		
		for( var m in callBack.modulos ){ // Se fija en cada modulo
			var modulo = callBack.modulos[m];
			if( modulos[modulo].interpretado != true ){ // Si es que no esta interpretado
				callBackListo = false; 					// El callBack no esta listo para ser llamado
			}
		}
		
		if( callBackListo ){ // Si ya se cargaron todos los modulos necesarios, se llama a la funcion y se borra
			var funcion = callBack.funcion;
			delete moduloCBs[c];
			funcion();
		}
		
	}
}

/*
	"modulos" contiene a los objetos de los modulos.
*/
var modulos = {
	debug:			new Modulo("debug.js"),			 // No depende directamente (en su carga) de ningun otro modulo
	eventos: 		new Modulo("eventos.js"),		 // No depende directamente
	soporte: 		new Modulo("soporte.js"), 		 // Depende de eventos
	fx: 			new Modulo("fx.js"),			 // No depende de ningun otro
	almacenamiento: new Modulo("almacenamiento.js"), // Depende del modulo soporte
	misc: 			new Modulo("misc.js"),			 
	precarga: 		new Modulo("precarga.js"),		 
	resize: 		new Modulo("resize.js"),		 
	seres: 			new Modulo("seres.js"),			 
	mapas: 			new Modulo("mapas.js")			 
};


/*
	Esta funcion debuelve el estado en el que estan los modulos, por si alguno tuvo algun problema al 
	cargar o interpretarse.
*/
function modulosEstado(){
	var estado = "";
	
	for( var m in modulos ){
		var modulo = "\n> " + modulos[m];
		
		estado += m + ": ";
		if( modulo.interpretado ){
			estado += "Interpretado";
		}
		if( modulo.cargado ){
			estado += "Creado";
		}
		if( modulo.creado ){
			estado += "Interpretado";
		}
		
	}
	
	return estado;
}

/* 
	Siempre primero se carga misc y luego todos los otros.
	Hay que considerar que los scripts no siempre se cargan uno despues de otro, no siguen un orden sino que 
	cualquiera puede cargarse en antes que otro.
*/
modulos.misc.cargar();

crearModuloCB("misc", function(){
	modulos.debug.cargar();
	modulos.eventos.cargar();
	modulos.soporte.cargar();
	modulos.fx.cargar();
	modulos.almacenamiento.cargar();
	modulos.precarga.cargar();
	modulos.resize.cargar();
	modulos.seres.cargar();
	modulos.mapas.cargar();
});


// -------------------

/*
	"actualizacion" almacena la informacion sobre la actualizacion y su intervalo.
*/

var actualizacion = {
	tiempo: 30 // Los milisegundos entre cada actualizacion
}

function actualizar(){
	if(modulos.debug.interpretado){
		consola.actualizar();
	}
	if( modulos.precarga.interpretado && precarga.activa ){
		precarga.check();
	}
}

actualizacion.intevalo = setInterval(actualizar, actualizacion.tiempo);


/*
	Al terminar de cargar todos los modulos se empieza la precarga de imagenes.
*/
crearModuloCB(
	["debug", "eventos", "soporte", "fx", "almacenamiento", "precarga", "resize", "seres", "mapas"],
	function(){
		//almacenamiento.cargarConfig();
		precarga.empezar();
	}
);
