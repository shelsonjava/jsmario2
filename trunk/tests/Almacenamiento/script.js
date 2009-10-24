function get(id){
	return document.getElementById(id);
}

var soporte = {
	html5: {
		db: null
	},
	test: {}
}

soporte.test.db = function(){
	var dbLocal = window.localStorage;
	var dbTest = typeof dbLocal != "undefined";
	
	soporte.html5.db = dbTest;
	return soporte.html5.db;
}

soporte.test.db();

function limpiar(){
	get("color").value = "";
	get("posX").value = "";
	get("posY").value = "";
}

var obj1 = {
	color: null,
	posX: null,
	posY: null
}

function guardar(){
	obj1.color = get("color").value;
	obj1.posX = parseFloat(get("posX").value) || 0;
	obj1.posY = parseFloat(get("posY").value) || 0;
	
	
	guardarVariable("obj1", obj1);
}

function cargar(){
	cargarVariable("obj1");
}


function cargarVariable(nombre){
	
	return nombre;
}

function guardarVariable(nombre, variable){
	if( soporte.html5.db ){
		alert("db si");
	}
	else{
		alert("db no");
	}
	
	return nombre;
}