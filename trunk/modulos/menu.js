if(window.modulos){
	modulos.menu.cargadoListo();
}
/*
	Menu principal del juego.
*/

var menu = {
	activo: false,			// Indica si el menu esta siendo usado
	explotar: null, 		// Empieza el efecto en el que el menu "explota"
	actualizarEfectos: null, // Actualiza los efectos
	generar: null,			// Genera el menu
	generarCasilleros: null, // General los espacios para opciones y las flechas de arriba y abajo
	cargar: null, 			// Carga una cierta lista al menu
	actualizar: null,		// Actualiza el contenido de los casilleros teniendo en cuenta la lista y la posicion actual
	Lista: null,			// Conviente un array en una lista de opciones que se puede cargar en el menu
	Casillero: null,		// La clase para los casilleros donde van las opciones
	
	foco: false,		// Si el contenedor central tiene el foco
	activo: false,		// Si se esta usando el menu
	efectoActual: false, // El efecto actual que tenga el menu
	ancho: 390,	 		// El ancho del contenedor del menu
	alto: 346, 	 		// El alto del contenedor del menu
	anchoDef: 512,		// El ancho final del contenedor
	altoDef: 448,		// El alto final del contenedor
	opacidad: 50, 		// La opacidad del contenedor
	casilleros: [],		// Los casilleros para las opciones del menu
	listas: {},			// Contiene todas las listas de opciones que se pueden cargar en el menu
	lActual: "inicial",	// El nombre de la lista de opciones que se esta usando en el momento
	posActual: 0,		// Indica en que opcion de la lista se esta
	posLista: 0,		// Indica cual opcion ocupa el primer casillero
	selector: null,		// El selector de opciones de la izquierda (hongo)	
	flechaArriba: null,	// La flecha que indica que arriba hay mas opciones (el objeto del dom)
	flechaAbajo: null,	// La flecha que indica que abajo hay mas opciones (el objeto del dom)
	opcionVacia: null	// Opcion sin ninguna funcion
};


/*
	Se agregan las propiedades para los efectos.
*/
crearModuloCB("fx", function(){
	Fx.agregarMetodos(menu);
});


/*
	Clase para los casilleros donde van las opciones. Indice es el numero de casillero para saber su posicion y.
	El contenido de un casillero es un objeto de clase "menu.Opcion".
*/
menu.Casillero = function(indice, contenido){
	this.contenido = contenido;
	this.domObj = null;
	this.y = 16 + indice * 32;
	
	this.crearDomObj = function(){
		this.domObj = dom.crear("div", {
			innerHTML: this.contenido.texto,
			className: "menuCasillero",
			style: {
				top: this.y + "px"
			}
		}, contenedores.menu);
	}
	
	this.actualizar = function(){
		this.domObj.innerHTML = this.contenido.texto;
	}
}

menu.Opcion = function(data){
	this.texto = data[0];
	this.accion = data[1];
	
	if(data[2]){
		extender(this, data[2]);
	}
}

menu.opcionVacia = new menu.Opcion( ["Empty", function(){}] );

menu.Lista = function(opciones){
	for( var o in opciones ){
		opciones[o] = new menu.Opcion(opciones[o]);
	}
	
	return opciones;
}


menu.listas = {
	inicial: menu.Lista([
		// ["1 player up", function(){log("1 player up")}				],
		// ["Cargar", 		function(){menu.cargar(menu.listas.carga)} 	],
		// ["Editar Mapa", function(){log("editor")} 					]
		["Opcion 1", function(){log("1")}],
		["Opcion 2", function(){log("2")}],
		["Opcion 3", function(){log("3")}],
		["Opcion 4", function(){log("4")}],
		["Opcion 5", function(){log("5")}],
		["Opcion 6", function(){log("6")}],
		["Opcion 7", function(){log("7")}],
		["Opcion 8", function(){log("8")}],
		["Opcion 9", function(){log("9")}]
	]),
	carga: menu.Lista([
		["Mapa", 		function(){log("crear mapa")}					],
		["Personaje",	function(){log("cargar personaje")}				],
		["Otros", 		function(){menu.cargar(menu.listas.cargaOtros)}	],
		["Volver", 		function(){menu.cargar(menu.listas.inicial)}	]
	]),
	cargaOtros: menu.Lista([
		["No hay nada aca", function(){}, {habilitado: false}	],
		["Volver", 			function(){menu.volver(1)}			]
	])
};

/*
	Empieza el efecto en el que el menu "explota". Se corre al principio.
*/
menu.explotar = function(onFinish){

	css(contenedores.central, {"box-shadow": "0px 0px 40px #888"});
	
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
}

/*
	Actualiza los efectos del menu.
*/
menu.actualizarEfectos = function(){
	var menuCambios = menu.actualizarFx();
	
	if( menuCambios.ancho ){
		contenedores.central.style.width = menu.ancho + "px";
	}
	if( menuCambios.alto ){
		contenedores.central.style.height = menu.alto + "px";
	}
	if( menuCambios.opacidad ){
		opacidad(contenedores.medio, menu.opacidad);
	}
}


/*
	Genera el menu a partir de "menu.lista"
*/
menu.generar = function(lista){
	menu.generarCasilleros();
	
	/* juego.generarPreview(); */
	css(contenedores.juego, {"display": "block"});
	css(contenedores.menu,  {"display": "block"});
	css(contenedores.stats, {"display": "block"});
	
	menu.activo = true;
}

menu.generarCasilleros = function(){
	
	for( var n = 0; n < 4; n++ ){
		menu.casilleros[n] = new menu.Casillero(n, menu.opcionVacia);
		menu.casilleros[n].crearDomObj();
	}
	
	menu.selector = dom.crear("img", {
		src: imgs.selector[3],
		id: "menuSelector"
	}, contenedores.menu);
}

menu.cargar = function(lista){
	menu.lActual = lista;
	menu.posActual = 0;
	menu.posLista = 0;
	menu.actualizar();
}

menu.actualizar = function(){
	for(var l = menu.posLista; l < menu.posLista + 4; l++){
		var opcion = menu.listas[menu.lActual][l];
		var casillero = l - menu.posLista;
		
		if(opcion){
			menu.casilleros[casillero].contenido = opcion;
			if(casillero == 4){
				alert("cuarto");
			}
		}
		else{
			menu.casilleros[casillero].contenido = menu.opcionVacia;
		}
		
		menu.casilleros[casillero].actualizar();
	}
	
	menu.selector.style.top = (16 + (menu.posActual - menu.posLista) * 32) + "px";
}

crearModuloCB("eventos", function(){
	teclado.crearAtajo("Down", {
		down: function(e){
			if(!menu.foco){return;}
			if(menu.listas[menu.lActual][menu.posActual + 1]){
				menu.posActual++;
				if(menu.posActual - menu.posLista >= 4){
					menu.posLista = menu.posActual - 3;
				}
				menu.actualizar();
			}
		}
	});
	teclado.crearAtajo("Up", {
		down: function(e){
			if(!menu.foco){return;}
			if(menu.listas[menu.lActual][menu.posActual - 1]){
				menu.posActual--;
				if(menu.posLista > menu.posActual){
					menu.posLista = menu.posActual;
				}
				menu.actualizar();
			}
		}
	});
	
	/*
		Deteccion de foco del juego.
	*/
	eventos.agregar(document.body, "click", function(){
		menu.foco = false;
		contenedores.central.style.borderBottom = "none";
	});
	
	eventos.agregar(contenedores.central, "click", function(){
		setTimeout(function(){
			menu.foco = true;
			contenedores.central.style.borderBottom = "2px dashed #99D5FF";
		}, 20);
	});
});

// --------------------
if(window.modulos){
	modulos.menu.interpretadoListo();
}