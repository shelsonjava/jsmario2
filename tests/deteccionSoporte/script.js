function get(id){
	return document.getElementById(id);
}

var soporte = {
	navegador: {
		nombre: null,
		version: null,
		os: null
	},
	css: {
		zoom: null,
		borderRadius: null,
		fontFace: null
	},
	html5: {
		db: null,
		audio: {
			basico: null,
			ogg: null,
			mp3: null,
			wav: null
		}
	},
	global: {
		pngTrans: null
	},
	test: {}
};

// ----------------------
//	Detecta la plataforma del usuario (navegador, version y sistema operativo)
// ----------------------
soporte.test.navegador = function(){
	var userAgent = navigator.userAgent;
	var vendor = navigator.vendor;
	var plataform = navigator.platform;
	
	if( /Chrome/g.test(userAgent) ){
		soporte.navegador.nombre = "chrome";
		soporte.navegador.version = parseFloat(userAgent.split("Chrome/")[1]);
	}
	else if( /OmniWeb/g.test(userAgent) ){
		soporte.navegador.nombre = "omniweb";
		soporte.navegador.version = parseFloat(userAgent.split("OmniWeb/")[1]);
	}
	else if( /Apple/g.test(vendor) ){
		soporte.navegador.nombre = "safari";
		soporte.navegador.version = parseFloat(userAgent.split("Version/")[1]);
	}
	else if( window.opera ){
		soporte.navegador.nombre = "opera";
		soporte.navegador.version = parseFloat(userAgent.split("Opera/")[1]);
	}
	else if( /iCab/g.test(vendor) ){
		soporte.navegador.nombre = "icab";
	}
	else if( /KDE/g.test(vendor) ){
		soporte.navegador.nombre = "konqueror";
	}
	else if( /OmniWeb/g.test(userAgent) ){
		soporte.navegador.nombre = "omniweb";
	}
	else if( /Firefox/g.test(userAgent) ){
		soporte.navegador.nombre = "firefox";
		soporte.navegador.version = parseFloat(userAgent.split("Firefox/")[1]);
	}
	else if( /Camino/g.test(vendor) ){
		soporte.navegador.nombre = "camino";
	}
	else if( /Netscape/g.test(userAgent) ){
		soporte.navegador.nombre = "netscape";
	}
	else if( /MSIE/g.test(userAgent) ){
		soporte.navegador.nombre = "iexplorer";
		soporte.navegador.version = parseFloat(userAgent.split("MSIE")[1]);
	}

	if( /win/gi.test(plataform) ){
		soporte.navegador.os = "windows";
	}
	if( /mac/gi.test(plataform) ){
		soporte.navegador.os = "mac";
	}
	if( /iphone/gi.test(plataform) ){
		soporte.navegador.os = "iphone";
	}
	if( /linux/gi.test(plataform) ){
		soporte.navegador.os = "linux";
	}
	
	return soporte.navegador;
}
soporte.test.navegador();


// ----------------------
//	Comprobacion de disponibilidad de algun propiedad css (propiedad) poniendole un valor (valor)
// ----------------------
soporte.test.cssProp = function(cssProp, jsProp, valor){
	if( !soporte.testObj ){ // Crea el objeto de prueba si no estaba creado
		soporte.testObj = document.createElement("test_obj");
	}
	
	// Le pone el estilo
	var objStyle = soporte.testObj.style;
	objStyle.cssText = cssProp + ": " + valor + ";";
	
	// Y lo comprueba
	return typeof objStyle[jsProp] != "undefined";
}

// ----------------------
//	Comprobacion de disponibilidad de algun propiedad css3 (propiedad) poniendole un valor (valor)
// ----------------------
soporte.test.css3Prop = function(cssProp, valor){
	var test = soporte.test.cssProp;
	
	var letraCapital = function(a){
		return a.substr(1, 1).toUpperCase();
	};
	
	var jsProp = cssProp.replace(/-./g, letraCapital);
	var _jsProp = ("-" + cssProp).replace(/-./g, letraCapital);
	
	return test(cssProp, jsProp, valor)
		|| test("-moz-" 	+ cssProp, "Moz" 	+ _jsProp, valor)
		|| test("-moz-" 	+ cssProp, "moz" 	+ _jsProp, valor)
		|| test("-webkit-" 	+ cssProp, "webkit" + _jsProp, valor)
		|| test("-ms-" 		+ cssProp, "ms" 	+ _jsProp, valor)
		|| test("-o-" 		+ cssProp, "o" 		+ _jsProp, valor);
}


// ----------------------
//	Comprobacion de disponibilidad de bases de datos locales.
// ----------------------

// Comprobacion por script:
soporte.test.db = function(){
	var dbLocal = window.localStorage;
	var dbTest = typeof dbLocal != "undefined";
	
	soporte.html5.db = dbTest;
	return soporte.html5.db;
}


// ----------------------
//	Comprobacion de disponibilidad font-face (css)
// ----------------------

// Comprobacion por script:
soporte.test.fontFace = function(onFinish){
	var object = get("fontFaceTest");
	object.style.fontFamily = "";
	
	var offsetWidth = object.offsetWidth;
	//alert(offsetWidth);
	
	object.style.fontFamily = "Mario";
	
	setTimeout(function(){
		var newOffsetWidth = object.offsetWidth;
		
		soporte.css.fontFace = offsetWidth != newOffsetWidth;
		
		if( onFinish ){
			onFinish(soporte.css.fontFace);
		}
	}, 300);
	
	return;
}


// ----------------------
//	Comprobacion de disponibilidad zoom (css)
// ----------------------

// Comprobacion por script:
soporte.test.zoom = function(){
	soporte.css.zoom = soporte.test.cssProp("zoom", "zoom", "200%");
	return soporte.css.zoom;
}

// Comprobacion manual:
var testZoomManual = function(){
	
	var zoom = 100;
	var zoomUpdate = setInterval(function(){
		zoom += 2;
		
		if( zoom > 200 ){
			zoom = 100;
			clearInterval(zoomUpdate);
		}
		
		get("testObj").style.zoom = zoom + "%";
	}, 30);
}


// ----------------------
//	Comprobacion de disponibilidad transparencia en png
// ----------------------

// Comprobacion por script:
soporte.test.pngTrans = function(){
	soporte.global.pngTrans = true;
	
	// Todos los ie menores que 7 no tienen soporte de transparencia
	if(soporte.navegador.nombre == "iexplorer"){
		if( soporte.navegador.version < 7 ){
			soporte.global.pngTrans = false;
		}
	}
	
	return soporte.global.pngTrans;
}


// ----------------------
//	Comprobacion de disponibilidad de audio nativo
// ----------------------

// Comprobacion por script:
soporte.test.audio = function(){
	var audio = document.createElement("audio");
	
	var sopAudio = {};
	sopAudio.basico = typeof audio.play == "function";
	
	if(sopAudio.basico){
		sopAudio.ogg = audio.canPlayType("audio/ogg");
		sopAudio.ogg = sopAudio.ogg == "" || sopAudio.ogg == "no" ? false : true;
		
		sopAudio.mp3 = audio.canPlayType("audio/mp3");
		sopAudio.mp3 = sopAudio.mp3 == "" || sopAudio.mp3 == "no" ? false : true;
		
		sopAudio.wav = audio.canPlayType("audio/wav");
		sopAudio.wav = sopAudio.wav == "" || sopAudio.wav == "no" ? false : true;
	}
	
	soporte.html5.audio = sopAudio;
	return soporte.html5.audio;
}