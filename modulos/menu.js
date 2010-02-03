if(window.modulos){
	modulos.menu.cargadoListo();
}
/*
	Menu principal del juego.
*/

var menu = {
	explotar: null, 	// Empieza el efecto en el que el menu "explota"
	actualizar: null, 	// Actualiza los efectos
	efectoBordes: null,	// Empieza el efecto del borde
	generar: null,		// Genera el menu
	Item: null,			// La clase para cada item del menu
	Lista: null,		// La clase para cada lista o sublista del menu
	
	activo: false,	// Si se esta usando el menu
	efectoActual: false, // El efecto actual que tenga el menu
	ancho: 390,	 	// El ancho del contenedor del menu
	alto: 346, 	 	// El alto del contenedor del menu
	anchoDef: 510,	// El ancho final del contenedor
	altoDef: 450,	// El alto final del contenedor
	opacidad: 50, 	// La opacidad del contenedor
	lista: null		// La lista con todos los items del menu ( de clase MenuItem )
};


var sombra = {
	domObj: null,				// La imagen de la sombra en el documento
	largo: menu.anchoDef,		// El largo de la sombra
	alto: menu.altoDef,			// El alto de la sombra
	anchoDef: 580,				// El ancho final de la sombra
	altoDef: 519				// El alto final de la sombra
};

/*
	Se agregan las propiedades para los efectos.
*/
crearModuloCB("fx", function(){
	Fx.agregarMetodos(menu);
	Fx.agregarMetodos(sombra);
});

/*
	La clase para cada item del menu.
*/
menu.Item = function(nombre, accion){
	this.tipo = "MenuItem";
	
	this.nombre = nombre;
	
	if( tipo(accion) == "function" ){
		this.accion = "funcion";
		this.funcion = accion;
	}
	if( tipo(accion) == "array" ){
		
	}
}
/*
	La clase para cada lista o sublista del menu
	Tiene una lista padre a no ser que sea la lista principal
*/
menu.Lista = function(nombre){
	this.tipo = "SubMenu";
	
	this.nombre = nombre;
	
}

menu.lista = menu.Lista([
	new menu.Item("1 player game", function(){
		log("1 player!");
	}),
	new menu.Item("cargar", new menu.Lista([
		new menu.Item("mapa", function(){
			log("Cargar Mapa");
		}),
		new menu.Item("personaje", function(){
			log("Cargar Personaje");
		}),
		new menu.Item("otros", function(){
			log("Cargar Otros");
		})
	])),
	new menu.Item("smiley", function(){
		alert("Hello Word!");
	})
]);

/*
	Empieza el efecto en el que el menu "explota". Se corre al principio.
*/
menu.explotar = function(onFinish){
	contenedores.central.style.display = "block";
	
	menu.superponerFx("ancho", {
		hasta: menu.anchoDef,
		tiempo: 350,
		efecto: "quint_reverse"
	});
	
	menu.superponerFx("alto", {
		hasta: menu.altoDef,
		tiempo: 350,
		efecto: "quint_reverse",
		onFinish: onFinish
	});
	
	menu.superponerFx("opacidad", {
		hasta: 100,
		tiempo: 350,
		efecto: "quint_reverse"
	});
	
	menu.efectoActual = "explotar";
	
	
	sombra.domObj = dom.crear("img", {
		src: "imagenes/borde.png",
		id: "sombra",
		alt: "shadow"
	}, contenedores.sombra);
}

/*
	Actualiza los efectos del menu.
*/
menu.actualizarEfectos = function(){
	var menuCambios = menu.actualizarFx();
	var sombraCambios = sombra.actualizarFx();
	
	if( menuCambios.ancho ){
		contenedores.central.style.width = menu.ancho + "px";
	}
	if( menuCambios.alto ){
		contenedores.central.style.height = menu.alto + "px";
	}
	if( menuCambios.opacidad ){
		opacidad(contenedores.medio, menu.opacidad);
	}
	
	if( sombraCambios.largo ){
		sombra.domObj.style.width = sombra.largo + "px";
	}
	if( sombraCambios.largo ){
		sombra.domObj.style.marginTop = (sombra.altoDef - sombra.alto) + "px";
		sombra.domObj.style.height = sombra.alto + "px";
	}
}

/*
	Empieza el efecto del borde.
*/
menu.efectoBordes = function(onFinish){
	
	contenedores.central.style.marginTop = -(menu.altoDef + (sombra.altoDef - menu.altoDef) / 2) + "px";
	sombra.domObj.style.width = sombra.largo + "px";
	sombra.domObj.style.height = sombra.alto + "px";
	
	sombra.domObj.style.display = "block";
	
	sombra.superponerFx("largo", {
		hasta: sombra.anchoDef,
		tiempo: 600,
		efecto: "quint_reverse"
	});
	
	sombra.superponerFx("alto", {
		hasta: sombra.altoDef,
		tiempo: 600,
		efecto: "quint_reverse",
		onFinish: onFinish
	});
}


/*
	Genera el menu a partir de "menu.lista"
*/
menu.generar = function(){
	
}

// --------------------
if(window.modulos){
	modulos.menu.interpretadoListo();
}