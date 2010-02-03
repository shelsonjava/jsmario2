if(window.modulos){
	modulos.soporte.cargadoListo();
}
/*
	Script para identificar las prestaciones del navegador del usuario, para servir de informacion
	a los demas scripts.
*/

var soporte = {
	navegador: {
		nombre: null,
		version: null,
		os: null
	},
	css: {
		zoom: null,
		fontFace: null,
		borderRadius: null,
		boxShadow: null
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
		pngTrans: null,
		cookies: navigator.cookieEnabled
	},
	test: {
		navegador: null,
		cssProp: null,
		css3Prop: null,
		db: null,
		zoom: null,
		fontFace: null,
		pngTrans: null,
		audio: null,
		todo: null
	}
};

/*
	Detecta la plataforma del usuario (navegador, version y sistema operativo).
*/
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


/*
	Comprueba la disponibilidad de alguna propiedad css (propiedad) poniendole un valor (valor).
*/
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

/*
	Comprueba la disponibilidad de alguna propiedad css3 (propiedad) poniendole un valor (valor).
*/
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


/*
	Comprueba la disponibilidad de bases de datos locales.
*/
soporte.test.db = function(){
	var dbLocal = window.localStorage;
	var dbTest = typeof dbLocal != "undefined";
	
	soporte.html5.db = dbTest;
	return soporte.html5.db;
}


/*
	Comprueba la disponibilidad de font-face (css).
*/
soporte.test.fontFace = function(onFinish){
	log("*** $fontFaceTest:Font Face Test ***");
	
	var object = get("fontFaceTest");
	object.style.fontFamily = "";
	
	var offsetWidth = object.offsetWidth;
	
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

/*
	Comprueba la disponibilidad de transparencia en png.
*/
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


/*
	Comprueba la disponibilidad de audio nativo.
*/
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


/*
	Corre todos los demas tests.
*/
soporte.test.todo = function(onFinish){
	consola.separador();
	log("Detactando Soporte");
	msgGeneral("Detecting Browser Support...");
	
	soporte.test.navegador();
	log("Plataforma: " + soporte.navegador.nombre + "(" + soporte.navegador.version + ") en " + soporte.navegador.os);
	
	log("Cookies: " + soporte.global.cookies);
	
	soporte.test.db();
	log("Base de datos: " + soporte.html5.db);
	
	soporte.test.audio();
	log("Audio: " + soporte.html5.audio.basico);
	
	soporte.test.pngTrans();
	log("Png Transparent: " + soporte.global.pngTrans);
	
	soporte.css.zoom = soporte.test.cssProp("zoom", "zoom", "200%");
	log("Css -> zoom: " + soporte.css.zoom);
	
	soporte.css.borderRadius = soporte.test.css3Prop("border-radius", "2px");
	log("Css -> border-radius: " + soporte.css.borderRadius);
	
	soporte.css.boxShadow = soporte.test.css3Prop('box-shadow', '0px #BBB');
	log("Css -> border-radius: " + soporte.css.borderRadius);
	
	soporte.test.fontFace(function(){
		log("Css -> font-face: " + soporte.css.fontFace);
		
		if( onFinish ){
			onFinish();
		}
	});
}

// --------------------
if(window.modulos){
	modulos.soporte.interpretadoListo();
}