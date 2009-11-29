function get(id){
	return document.getElementById(id);
}

function debug(txt){
	// document.getElementById("debug").innerHTML += txt + "<br />";
	document.getElementById("debug").innerHTML = txt;
}

var precarga = {
	urlBase: "http://jsmario.com.ar/2.0/tests/preload/images/", // Url base para las imagenes
	imagenes: [ // Lista de imagenes, cada una es un array con su url y su peso en kb
		["img0.gif", 100],
		["img1.gif", 100],
		["img2.gif", 100],
		["img3.gif", 100],
		["img4.gif", 100],
		["img5.gif", 100],
		["img6.gif", 100],
		["img7.gif", 100],
		["img8.gif", 100],
		["img9.gif", 100],
		["img10.gif", 100],
		["img11.gif", 100],
		["img12.gif", 100],
		["img13.gif", 100],
		["img14.gif", 100],
		["img15.gif", 100],
		["img16.gif", 100],
		["img17.gif", 100],
		["img18.gif", 100],
		["img19.gif", 100],
		["img20.gif", 100],
		["img21.gif", 100],
		["img22.gif", 100],
		["img23.gif", 100],
		["img24.gif", 100],
		["img25.gif", 100],
		["img26.gif", 100],
		["img27.gif", 100],
		["img28.gif", 100],
		["img29.gif", 100],
		["img30.gif", 100]
	],
	tamTotal: 0, 		// El tamaño total de las iamgenes
	tamCargado: 0, 		// El tamaño de las imagenes que ya se terminaron de cargar
	intervalo: false, 	// El intervalo que chequea la carga de las imagenes
	callBack: false, 	// Los callbacks de porcentaje
	onComplete: false, 	// la funcion que se corre cuando se terminan de precargar las imagenes
	empezar: null, 		// La funcion que empieza la precarga
	check: null 		// La funcion que checkea si las imagenes cargaron
};

precarga.callBack = function(percent){
	debug(percent + "% Precargado");
}

precarga.onComplete = function(){
	debug("Finished!");
}

precarga.empezar = function(){
	for( var i = 0; i < precarga.imagenes.length; i++ ){
		var url = precarga.urlBase + precarga.imagenes[i][0];
		var size = precarga.imagenes[i][1];
		precarga.tamTotal += size;
		
		var imagen = document.createElement("img");
		imagen.src = url;
		precarga.imagenes[i].push(imagen);
		get("preload").appendChild(imagen);
	}
	
	precarga.intervalo = setInterval(precarga.check, 200);
}

precarga.check = function(){
	precarga.tamCargado = 0;
	
	for( var i = 0; i < precarga.imagenes.length; i++ ){
		if( precarga.imagenes[i][2].complete ){
			precarga.tamCargado += precarga.imagenes[i][1];
		}
	}
	
	var porcentaje = Math.round(precarga.tamCargado / precarga.tamTotal * 100);
	if( precarga.callBack ){
		precarga.callBack(porcentaje);
	}
	
	if( precarga.tamCargado >= precarga.tamTotal ){
		clearInterval(precarga.intervalo);
		
		if( precarga.onComplete ){
			precarga.onComplete();
		}
	}
}