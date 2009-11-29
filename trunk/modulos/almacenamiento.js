if(window.modulos){
	modulos.almacenamiento.cargadoListo();
}
/*
	Modulo que se encarga del almacenamiento dinamico de variables del lado del usurio.
*/

var almacenamiento = {
	cargarConfig: null
};

almacenamiento.cargarConfig = function(){
	log("Cargada: Configuracion general");
}

// --------------------
if(window.modulos){
	modulos.almacenamiento.interpretadoListo();
}