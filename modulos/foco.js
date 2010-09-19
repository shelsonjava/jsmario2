if(window.modulos){
	modulos.foco.cargadoListo();
}
/*
	Script que se encarga de seguir donde esta el foco en el documento.
*/

// document.activeElement
var foco = {
	enfocar: null, 		// Funcion que mueve el foco 
	enfocadoEn: null,	// Devuelve true o false dependiendo si es que el foco esta o no en una cierta area
	
	actual: "body",		// Area actualmente enfocada
	areas:	null		// Las diferentes areas del documento
};

foco.areas = {
	body: {},
	consola: {
		enfocar: null,
		desenfocar: null
	},
	juego: {
		enfocar: null,
		desenfocar: null
	},
	menu: {
		enfocar: null,
		desenfocar: null
	}
};

/*
	Enfoca un area (nFoco) y desenfoca la anterior.
*/
foco.enfocar = function(nFoco){
	var areas = foco.areas;
	if(!areas[nFoco] || foco.actual == nFoco){return 0;}
	
	if(areas[foco.actual].desenfocar){
		areas[foco.actual].desenfocar();
	}
	
	foco.actual = nFoco;
	
	if(areas[nFoco].enfocar){
		areas[nFoco].enfocar();
	}
}

foco.enfocadoEn = function(_foco){
	return foco.actual == _foco;
}


/*
	Consola
*/
foco.areas.consola.enfocar = function(){
	
}

foco.areas.consola.desenfocar = function(){
	
}

/*
	Menu
*/
foco.areas.menu.enfocar = function(){
	contenedores.central.style.borderBottom = "2px solid #99D5FF";
}

foco.areas.menu.desenfocar = function(){
	contenedores.central.style.borderBottom = "none";
}

/*
	Eventos
*/
crearModuloCB("eventos", function(){
	eventos.agregar(document.body, "click", function(){
		foco.enfocar("body");
	});
	
	eventos.agregar(contenedores.central, "click", function(){
		setTimeout(function(){
			foco.enfocar("menu");
		}, 1);
	});
	
	eventos.agregar(consola.domObj, "click", function(){
		setTimeout(function(){
			foco.enfocar("consola");
		}, 1);
	});
});

// --------------------
if(window.modulos){
	modulos.foco.interpretadoListo();
}