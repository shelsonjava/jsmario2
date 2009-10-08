function get(id){
	return document.getElementById(id);
}

function debug(txt){
	// document.getElementById("debug").innerHTML += txt + "<br />";
	document.getElementById("debug").innerHTML = txt;
}

var preloader = {
	urlBase: "http://jsmario.com.ar/2.0/tests/preload/images/", // Url base para las imagenes
	images: [ // Lista de imagenes, cada una es un array con su url y su peso en kb
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
	totalSize: 0, // El tamaño total de las iamgenes
	loadedSize: 0, // El tamaño de las imagenes que ya se terminaron de cargar
	checkInterval: false, // El intervalo que chequea la carga de las imagenes
	percentCallback: false,
	onComplete: false // la funcion que se corre cuando se terminan de precargar las imagenes
};

preloader.percentCallback = function(percent){
	debug(percent + "%");
}

preloader.onComplete = function(){
	debug("Finished!");
}

function preloadImages(){
	for( var i = 0; i < preloader.images.length; i++ ){
		var url = preloader.urlBase + preloader.images[i][0];
		var size = preloader.images[i][1];
		preloader.totalSize += size;
		
		var image = document.createElement("img");
		image.src = url;
		preloader.images[i].push(image);
		get("preload").appendChild(image);
	}
	
	preloader.checkInterval = setInterval(checkPreload, 200);
}

function checkPreload(){
	preloader.loadedSize = 0;
	
	for( var i = 0; i < preloader.images.length; i++ ){
		if( preloader.images[i][2].complete ){
			preloader.loadedSize += preloader.images[i][1];
		}
	}
	
	var percent = Math.round(preloader.loadedSize / preloader.totalSize * 100);
	if( preloader.percentCallback ){
		preloader.percentCallback(percent);
	}
	
	if( preloader.loadedSize >= preloader.totalSize ){
		clearInterval(preloader.checkInterval);
		
		if( preloader.onComplete ){
			preloader.onComplete();
		}
	}
}