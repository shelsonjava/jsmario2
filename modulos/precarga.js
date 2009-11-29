if(window.modulos){
	modulos.precarga.cargadoListo();
}
/*
	Script que se encarga de la precarga de imagenes.
*/

var precarga = {
	intervalo: null, 	// El intervalo que chequea la carga de las imagenes
	callBack: null, 	// Los callbacks de porcentaje
	onComplete: null, 	// la funcion que se corre cuando se terminan de precargar las imagenes
	empezar: null, 		// La funcion que empieza la precarga
	check: null, 		// La funcion que checkea si las imagenes cargaron
	domObj: get("precarga"),			// El div que sirve de contendor
	content: get("precargaContent"),	// El div donde se ponen las imagenes
	
	activa: false,
	urlBase: "imagenes/", // Url base para las imagenes
	imagenes: [ // Lista de imagenes, cada una es un array con su url y su peso en bytes
		["selector.gif", 99],
		["figuras/castillo1.gif", 1533],
		["figuras/castillo1_gris.gif", 1533],
		["figuras/castillo2.gif", 3900],
		["figuras/castillo2_gris.gif", 3900],
		["figuras/fuego.gif", 148],
		["figuras/montania1.gif", 563],
		["figuras/montania2.gif", 310],
		["figuras/nube1.gif", 369],
		["figuras/nube1_gris.gif", 369],
		["figuras/nube2.gif", 503],
		["figuras/nube2_gris.gif", 503],
		["figuras/nube3.gif", 631],
		["figuras/nube3_gris.gif", 631],
		["figuras/planta1.gif", 244],
		["figuras/planta2.gif", 318],
		["figuras/planta3.gif", 386],
		["figuras/poste1.gif", 286],
		["figuras/poste2.gif", 362],
		["figuras/poste3.gif", 264],
		["figuras/poste4.gif", 336],
		["figuras/princesa.gif", 295],
		["figuras/reja1.gif", 203],
		["figuras/riel.gif", 172],
		["font/mario- .gif", 60],
		["font/mario-$.gif", 82],
		["font/mario-+.gif", 73],
		["font/mario--.gif", 61],
		["font/mario-0.gif", 73],
		["font/mario-1.gif", 70],
		["font/mario-2.gif", 70],
		["font/mario-3.gif", 70],
		["font/mario-4.gif", 72],
		["font/mario-5.gif", 70],
		["font/mario-6.gif", 70],
		["font/mario-7.gif", 68],
		["font/mario-8.gif", 70],
		["font/mario-9.gif", 71],
		["font/mario-A.gif", 70],
		["font/mario-admiracion.gif", 71],
		["font/mario-asterisco.gif", 68],
		["font/mario-B.gif", 68],
		["font/mario-C.gif", 70],
		["font/mario-D.gif", 72],
		["font/mario-E.gif", 66],
		["font/mario-F.gif", 67],
		["font/mario-G.gif", 71],
		["font/mario-H.gif", 67],
		["font/mario-I.gif", 69],
		["font/mario-J.gif", 70],
		["font/mario-K.gif", 73],
		["font/mario-L.gif", 70],
		["font/mario-M.gif", 67],
		["font/mario-moneda.gif", 214],
		["font/mario-N.gif", 67],
		["font/mario-O.gif", 70],
		["font/mario-P.gif", 70],
		["font/mario-Q.gif", 71],
		["font/mario-R.gif", 70],
		["font/mario-S.gif", 72],
		["font/mario-T.gif", 69],
		["font/mario-U.gif", 69],
		["font/mario-V.gif", 70],
		["font/mario-W.gif", 67],
		["font/mario-X.gif", 70],
		["font/mario-Y.gif", 73],
		["font/mario-Z.gif", 65],
		["mario/chico/brazaleando/derecha.gif", 482],
		["mario/chico/brazaleando/izquierda.gif", 710],
		["mario/chico/corriendo/derecha.gif", 565],
		["mario/chico/corriendo/izquierda.gif", 510],
		["mario/chico/corriendo_rapido/derecha.gif", 565],
		["mario/chico/corriendo_rapido/izquierda.gif", 510],
		["mario/chico/escalando/derecha.gif", 326],
		["mario/chico/muerto/normal.gif", 203],
		["mario/chico/nadando/derecha.gif", 326],
		["mario/chico/nadando/izquierda.gif", 512],
		["mario/chico/normal/derecha.gif", 181],
		["mario/chico/normal/izquierda.gif", 185],
		["mario/chico/patinando/derecha.gif", 194],
		["mario/chico/patinando/izquierda.gif", 194],
		["mario/chico/saltando/derecha.gif", 217],
		["mario/chico/saltando/izquierda.gif", 216],
		["mario/chico/trepando/derecha.gif", 183],
		["mario/chico/trepando/izquierda.gif", 203],
		["mario/grande/agachado/derecha.gif", 447],
		["mario/grande/agachado/izquierda.gif", 370],
		["mario/grande/brazaleando/derecha.gif", 857],
		["mario/grande/brazaleando/izquierda.gif", 1207],
		["mario/grande/corriendo/derecha.gif", 923],
		["mario/grande/corriendo/izquierda.gif", 930],
		["mario/grande/corriendo_rapido/derecha.gif", 923],
		["mario/grande/corriendo_rapido/izquierda.gif", 930],
		["mario/grande/escalando/derecha.gif", 544],
		["mario/grande/nadando/derecha.gif", 567],
		["mario/grande/nadando/izquierda.gif", 826],
		["mario/grande/normal/derecha.gif", 335],
		["mario/grande/normal/izquierda.gif", 374],
		["mario/grande/patinando/derecha.gif", 368],
		["mario/grande/patinando/izquierda.gif", 371],
		["mario/grande/saltando/derecha.gif", 346],
		["mario/grande/saltando/izquierda.gif", 385],
		["mario/grande/trepando/derecha.gif", 284],
		["mario/grande/trepando/izquierda.gif", 323],
		["mario/super/agachado/derecha.gif", 282],
		["mario/super/agachado/izquierda.gif", 395],
		["mario/super/brazaleando/derecha.gif", 1101],
		["mario/super/brazaleando/izquierda.gif", 1487],
		["mario/super/corriendo/derecha.gif", 951],
		["mario/super/corriendo/izquierda.gif", 1434],
		["mario/super/corriendo_rapido/derecha.gif", 951],
		["mario/super/corriendo_rapido/izquierda.gif", 1434],
		["mario/super/disparando/derecha.gif", 307],
		["mario/super/disparando/izquierda.gif", 437],
		["mario/super/escalando/derecha.gif", 287],
		["mario/super/escalando/izquierda.gif", 333],
		["mario/super/nadando/derecha.gif", 567],
		["mario/super/nadando/izquierda.gif", 874],
		["mario/super/normal/derecha.gif", 335],
		["mario/super/normal/izquierda.gif", 466],
		["mario/super/patinando/derecha.gif", 343],
		["mario/super/patinando/izquierda.gif", 497],
		["mario/super/saltando/derecha.gif", 491],
		["mario/super/saltando/izquierda.gif", 574],
		["mario/super/trepando/derecha.gif", 544],
		["mario/transicion/derecha.gif", 373],
		["mario/transicion/izquierda.gif", 498],
		["objetos/agua/skin/cuerpo.gif", 71],
		["objetos/agua/skin/superficie.gif", 150],
		["objetos/bandera/skin_cielo/bandera.gif", 169],
		["objetos/bandera/skin_cielo/mastil.gif", 512],
		["objetos/bandera/skin_dia/bandera.gif", 169],
		["objetos/bandera/skin_dia/mastil.gif", 512],
		["objetos/bandera/skin_noche/bandera.gif", 169],
		["objetos/bandera/skin_noche/mastil.gif", 512],
		["objetos/barra/skin_cielo/normal.gif", 96],
		["objetos/barra/skin_cielo/polea_horizontal.gif", 82],
		["objetos/barra/skin_cielo/polea_TopLeft.gif", 159],
		["objetos/barra/skin_cielo/polea_TopRight.gif", 190],
		["objetos/barra/skin_cielo/polea_vertical.gif", 111],
		["objetos/barra/skin_dia/normal.gif", 88],
		["objetos/barra/skin_dia/polea_horizontal.gif", 82],
		["objetos/barra/skin_dia/polea_TopLeft.gif", 159],
		["objetos/barra/skin_dia/polea_TopRight.gif", 190],
		["objetos/barra/skin_dia/polea_vertical.gif", 111],
		["objetos/barra/skin_gris/normal.gif", 88],
		["objetos/barra/skin_gris/polea_horizontal.gif", 82],
		["objetos/barra/skin_gris/polea_TopLeft.gif", 159],
		["objetos/barra/skin_gris/polea_TopRight.gif", 155],
		["objetos/barra/skin_gris/polea_vertical.gif", 111],
		["objetos/castillo1/skin/figura9.gif", 1533],
		["objetos/cubo/skin_agua/contruccion.gif", 220],
		["objetos/cubo/skin_agua/piso.gif", 208],
		["objetos/cubo/skin_agua2/contruccion.gif", 220],
		["objetos/cubo/skin_agua2/piso.gif", 185],
		["objetos/cubo/skin_castillo/contruccion.gif", 185],
		["objetos/cubo/skin_castillo/piso.gif", 185],
		["objetos/cubo/skin_cielo/construccion.gif", 171],
		["objetos/cubo/skin_cielo/piso.gif", 227],
		["objetos/cubo/skin_dia/contruccion.gif", 166],
		["objetos/cubo/skin_dia/piso.gif", 177],
		["objetos/cubo/skin_gris/contruccion.gif", 166],
		["objetos/cubo/skin_gris/piso.gif", 185],
		["objetos/cubo/skin_subterraneo/contruccion.gif", 166],
		["objetos/cubo/skin_subterraneo/piso.gif", 185],
		["objetos/ladrillos/skin_castillo/fragmento.gif", 215],
		["objetos/ladrillos/skin_castillo/normal.gif", 135],
		["objetos/ladrillos/skin_dia/fragmento.gif", 199],
		["objetos/ladrillos/skin_dia/normal.gif", 141],
		["objetos/ladrillos/skin_subterraneo/fragmento.gif", 135],
		["objetos/ladrillos/skin_subterraneo/normal.gif", 183],
		["objetos/moneda/skin/primaria.gif", 364],
		["objetos/moneda2/skin/secundaria.gif", 239],
		["objetos/plataforma/skin_cielo/Bottom.gif", 71],
		["objetos/plataforma/skin_cielo/BottomCenter.gif", 146],
		["objetos/plataforma/skin_cielo/TopCenter.gif", 128],
		["objetos/plataforma/skin_cielo/TopLeft.gif", 172],
		["objetos/plataforma/skin_cielo/TopRight.gif", 168],
		["objetos/plataforma/skin_dia/Bottom.gif", 125],
		["objetos/plataforma/skin_dia/BottomCenter.gif", 125],
		["objetos/plataforma/skin_dia/TopCenter.gif", 111],
		["objetos/plataforma/skin_dia/TopLeft.gif", 140],
		["objetos/plataforma/skin_dia/TopRight.gif", 140],
		["objetos/plataforma/skin_gris/Bottom.gif", 119],
		["objetos/plataforma/skin_gris/BottomCenter.gif", 119],
		["objetos/plataforma/skin_gris/TopCenter.gif", 111],
		["objetos/plataforma/skin_gris/TopLeft.gif", 140],
		["objetos/plataforma/skin_gris/TopRight.gif", 140],
		["objetos/puente/skin/cadena.gif", 131],
		["objetos/puente/skin/hacha.gif", 202],
		["objetos/puente/skin/piso.gif", 212],
		["objetos/signo/skin_castillo/cubo.gif", 139],
		["objetos/signo/skin_castillo/normal.gif", 461],
		["objetos/signo/skin_dia/normal.gif", 461],
		["objetos/signo/skin_dia/roto.gif", 139],
		["objetos/signo/skin_subterraneo/normal.gif", 461],
		["objetos/signo/skin_subterraneo/roto.gif", 139],
		["objetos/trampolin/skin_dia/chico.gif", 229],
		["objetos/trampolin/skin_dia/medio.gif", 268],
		["objetos/trampolin/skin_dia/normal.gif", 292],
		["objetos/trampolin/skin_gris/chico.gif", 230],
		["objetos/trampolin/skin_gris/mediano.gif", 270],
		["objetos/trampolin/skin_gris/normal.gif", 295],
		["objetos/tubo1/skin_agua2/BottomLeft.gif", 191],
		["objetos/tubo1/skin_agua2/BottomRight.gif", 172],
		["objetos/tubo1/skin_agua2/TopLeft.gif", 180],
		["objetos/tubo1/skin_agua2/TopRight.gif", 165],
		["objetos/tubo1/skin_cielo/BottomLeft.gif", 191],
		["objetos/tubo1/skin_cielo/BottomRight.gif", 172],
		["objetos/tubo1/skin_cielo/TopLeft.gif", 180],
		["objetos/tubo1/skin_cielo/TopRight.gif", 165],
		["objetos/tubo1/skin_dia/BottomLeft.gif", 191],
		["objetos/tubo1/skin_dia/BottomRight.gif", 199],
		["objetos/tubo1/skin_dia/TopLeft.gif", 180],
		["objetos/tubo1/skin_dia/TopRight.gif", 165],
		["objetos/tubo1/skin_noche/BottomLeft.gif", 191],
		["objetos/tubo1/skin_noche/BottomRight.gif", 172],
		["objetos/tubo1/skin_noche/TopLeft.gif", 180],
		["objetos/tubo1/skin_noche/TopRight.gif", 165],
		["objetos/tubo1/skin_subterraneo/BottomLeft.gif", 191],
		["objetos/tubo1/skin_subterraneo/BottomRight.gif", 199],
		["objetos/tubo1/skin_subterraneo/TopLeft.gif", 180],
		["objetos/tubo1/skin_subterraneo/TopRight.gif", 165],
		["objetos/tubo2/skin_agua2/BottomLeft.gif", 217],
		["objetos/tubo2/skin_agua2/BottomRight.gif", 201],
		["objetos/tubo2/skin_agua2/TopLeft.gif", 274],
		["objetos/tubo2/skin_agua2/TopRight.gif", 155],
		["objetos/tubo2/skin_cielo/BottomLeft.gif", 325],
		["objetos/tubo2/skin_cielo/BottomRight.gif", 206],
		["objetos/tubo2/skin_cielo/TopLeft.gif", 263],
		["objetos/tubo2/skin_cielo/TopRight.gif", 128],
		["objetos/tubo2/skin_dia/BottomLeft.gif", 191],
		["objetos/tubo2/skin_dia/BottomRight.gif", 152],
		["objetos/tubo2/skin_dia/TopLeft.gif", 169],
		["objetos/tubo2/skin_dia/TopRight.gif", 110],
		["objetos/tubo2/skin_noche/BottomLeft.gif", 217],
		["objetos/tubo2/skin_noche/BottomRight.gif", 159],
		["objetos/tubo2/skin_noche/TopLeft.gif", 209],
		["objetos/tubo2/skin_noche/TopRight.gif", 132],
		["objetos/tubo2/skin_subterraneo/BottomLeft.gif", 191],
		["objetos/tubo2/skin_subterraneo/BottomRight.gif", 152],
		["objetos/tubo2/skin_subterraneo/TopLeft.gif", 169],
		["objetos/tubo2/skin_subterraneo/TopRight.gif", 110],
		["objetos/tubo3/skin_agua2/BottomLeft.gif", 204],
		["objetos/tubo3/skin_agua2/BottomRight.gif", 172],
		["objetos/tubo3/skin_agua2/TopLeft.gif", 191],
		["objetos/tubo3/skin_agua2/TopRight.gif", 172],
		["objetos/tubo3/skin_cielo/BottomLeft.gif", 204],
		["objetos/tubo3/skin_cielo/BottomRight.gif", 172],
		["objetos/tubo3/skin_cielo/TopLeft.gif", 191],
		["objetos/tubo3/skin_cielo/TopRight.gif", 172],
		["objetos/tubo3/skin_dia/BottomLeft.gif", 204],
		["objetos/tubo3/skin_dia/BottomRight.gif", 201],
		["objetos/tubo3/skin_dia/TopLeft.gif", 191],
		["objetos/tubo3/skin_dia/TopRight.gif", 201],
		["objetos/tubo3/skin_noche/BottomLeft.gif", 204],
		["objetos/tubo3/skin_noche/BottomRight.gif", 172],
		["objetos/tubo3/skin_noche/TopLeft.gif", 191],
		["objetos/tubo3/skin_noche/TopRight.gif", 172],
		["objetos/tubo3/skin_subterraneo/BottomLeft.gif", 204],
		["objetos/tubo3/skin_subterraneo/BottomRight.gif", 201],
		["objetos/tubo3/skin_subterraneo/TopLeft.gif", 191],
		["objetos/tubo3/skin_subterraneo/TopRight.gif", 201],
		["objetos/tubo4/skin_agua2/BottomLeft.gif", 191],
		["objetos/tubo4/skin_agua2/BottomRight.gif", 172],
		["objetos/tubo4/skin_agua2/TopLeft.gif", 191],
		["objetos/tubo4/skin_agua2/TopRight.gif", 172],
		["objetos/tubo4/skin_cielo/BottomLeft.gif", 191],
		["objetos/tubo4/skin_cielo/BottomRight.gif", 172],
		["objetos/tubo4/skin_cielo/TopLeft.gif", 191],
		["objetos/tubo4/skin_cielo/TopRight.gif", 172],
		["objetos/tubo4/skin_dia/BottomLeft.gif", 191],
		["objetos/tubo4/skin_dia/BottomRight.gif", 199],
		["objetos/tubo4/skin_dia/TopLeft.gif", 191],
		["objetos/tubo4/skin_dia/TopRight.gif", 199],
		["objetos/tubo4/skin_noche/BottomLeft.gif", 191],
		["objetos/tubo4/skin_noche/BottomRight.gif", 172],
		["objetos/tubo4/skin_noche/TopLeft.gif", 191],
		["objetos/tubo4/skin_noche/TopRight.gif", 172],
		["objetos/tubo4/skin_subterraneo/BottomLeft.gif", 191],
		["objetos/tubo4/skin_subterraneo/BottomRight.gif", 199],
		["objetos/tubo4/skin_subterraneo/TopLeft.gif", 191],
		["objetos/tubo4/skin_subterraneo/TopRIght.gif", 199],
		["seres/acorazado/skin/cadaver.gif", 154],
		["seres/acorazado/skin/derecha.gif", 647],
		["seres/acorazado/skin/izquierda.gif", 375],
		["seres/acorazado/skin/muerto.gif", 297],
		["seres/bicho/skin_castillo/cadaver.gif", 138],
		["seres/bicho/skin_castillo/muerto.gif", 201],
		["seres/bicho/skin_castillo/normal.gif", 415],
		["seres/bicho/skin_dia/cadaver.gif", 138],
		["seres/bicho/skin_dia/muerto.gif", 248],
		["seres/bicho/skin_dia/normal.gif", 411],
		["seres/bicho/skin_subterraneo/bicho.gif", 376],
		["seres/bicho/skin_subterraneo/bicho_muerto.gif", 194],
		["seres/bicho/skin_subterraneo/cadaver.gif", 138],
		["seres/burbuja/skin/normal.gif", 55],
		["seres/cadena/skin/cubo.gif", 139],
		["seres/cadena/skin/fuego.gif", 396],
		["seres/canion/skin/Bottom.gif", 218],
		["seres/canion/skin/Top.gif", 194],
		["seres/carpincho/skin/derecha.gif", 614],
		["seres/carpincho/skin/huevo.gif", 188],
		["seres/carpincho/skin/izquierda.gif", 729],
		["seres/carpincho/skin/muerto_derecha.gif", 218],
		["seres/carpincho/skin/muerto_izquierda.gif", 332],
		["seres/disparo/skin/normal.gif", 396],
		["seres/disparo2/skin/normal.gif", 26412],
		["seres/disparo3/skin/abajo.gif", 300],
		["seres/disparo3/skin/arriba.gif", 206],
		["seres/disparo4/skin/derecha.gif", 194],
		["seres/disparo4/skin/izquierda.gif", 206],
		["seres/dragon/skin/derecha.gif", 1771],
		["seres/dragon/skin/izquierda.gif", 1057],
		["seres/estrella/skin/normal.gif", 426],
		["seres/explosion/skin/explocion.gif", 478],
		["seres/hongo/skin_muerte/normal.gif", 179],
		["seres/hongo/skin_normal/normal.gif", 195],
		["seres/hongo/skin_vida/normal.gif", 179],
		["seres/martillo/skin/derecha.gif", 1031],
		["seres/martillo/skin/izquierda.gif", 1005],
		["seres/nube_asesisina/skin/derecha.gif", 465],
		["seres/nube_asesisina/skin/izquierda.gif", 271],
		["seres/nube_asesisina/skin/muerta.gif", 403],
		["seres/nube_asesisina/skin/vacia.gif", 218],
		["seres/pez/skin_agua/muerto_derecha.gif", 270],
		["seres/pez/skin_agua/muerto_izquierda.gif", 208],
		["seres/pez/skin_agua/normal_derecha.gif", 498],
		["seres/pez/skin_agua/normal_izquierda.gif", 395],
		["seres/pez/skin_agua2/muerto_derecha.gif", 207],
		["seres/pez/skin_agua2/muerto_izquierda.gif", 208],
		["seres/pez/skin_agua2/normal_derecha.gif", 678],
		["seres/pez/skin_agua2/normal_izquierda.gif", 395],
		["seres/planta/skin_dia/normal.gif", 556],
		["seres/planta/skin_noche/normal.gif", 556],
		["seres/planta2/skin/normal.gif", 151],
		["seres/pulpo/skin/chico.gif", 225],
		["seres/pulpo/skin/muerto.gif", 224],
		["seres/pulpo/skin/normal.gif", 282],
		["seres/tortuga/skin_dia/cadaver.gif", 196],
		["seres/tortuga/skin_dia/muerto.gif", 355],
		["seres/tortuga/skin_dia/normal_derecha.gif", 615],
		["seres/tortuga/skin_dia/normal_izquierda.gif", 649],
		["seres/tortuga/skin_dia/volando_derecha.gif", 1046],
		["seres/tortuga/skin_dia/volando_izquierda.gif", 1180],
		["seres/tortuga/skin_dia2/cadaver.gif", 196],
		["seres/tortuga/skin_dia2/muerto.gif", 184],
		["seres/tortuga/skin_dia2/normal_derecha.gif", 597],
		["seres/tortuga/skin_dia2/normal_izquierda.gif", 643],
		["seres/tortuga/skin_dia2/volando_derecha.gif", 1011],
		["seres/tortuga/skin_dia2/volando_izquierda.gif", 606],
		["seres/tortuga/skin_subterraneo/cadaver.gif", 196],
		["seres/tortuga/skin_subterraneo/muerto.gif", 199],
		["seres/tortuga/skin_subterraneo/normal_derecha.gif", 637],
		["seres/tortuga/skin_subterraneo/normal_izquierda.gif", 558],
		["seres/tortuga/skin_subterraneo/volando_derecha.gif", 631],
		["seres/tortuga/skin_subterraneo/volando_izquierda.gif", 932],
		["seres/tortuga_asesina/skin/disparo.gif", 273],
		["seres/tortuga_asesina/skin/disparo_derecha.gif", 448],
		["seres/tortuga_asesina/skin/disparo_izquierda.gif", 273],
		["seres/tortuga_asesina/skin/muerto_derecha.gif", 272],
		["seres/tortuga_asesina/skin/muerto_izquierda.gif", 455],
		["seres/tortuga_asesina/skin/normal_derecha.gif", 991],
		["seres/tortuga_asesina/skin/normal_izquierda.gif", 582]
	],
	tamTotal: 0, 	// El tamaño total de las iamgenes
	tamCargado: 0, 	// El tamaño de las imagenes que ya se terminaron de cargar
	ultimoTam: 0, 	// El ultimo tamaño de imagenes cargado, que sirve para saber si cambio y llamar al callbak
	tiempo: 0 		// Para medir el tiempo que tarda
};

precarga.callBack = function(percent){
	var cargado = Math.round(precarga.tamCargado / 10);
	var total = Math.round(precarga.tamTotal / 10);
	
	get("prec_porcentaje").innerHTML = (percent + "% (" + cargado + " / " + total + " kb)");
}

precarga.onComplete = function(tiempo){
	log("Precarga finalizada! (" + Math.round(tiempo / 1000) + " Segundos)");
}

/*
	Empieza la precarga de imagenes.
*/
precarga.empezar = function(){
	for( var i = 0; i < precarga.imagenes.length; i++ ){
		
		var url = precarga.urlBase + precarga.imagenes[i][0];
		var tamanio = precarga.imagenes[i][1];
		
		precarga.tamTotal += tamanio;
		
		var imagen = dom.crear("img", {
			src: url,
			className: "precargaImg",
			style: {
				height: "0px"
			}
		}, precarga.content);
		
		precarga.imagenes[i].push(imagen); 		// Se agrega el objeto de la dom
		precarga.imagenes[i].push(false); 	// Si ya se cargo
	}
	
	precarga.tiempo = ( new Date() ).getTime();
	log("Precargando imagenes: $prec_porcentaje:0%");
	
	precarga.activa = true;
}

/*
	Checkea todas las imagenes de la precarga para ver cuales estan cargadas y llama a los callbacks.
*/
precarga.check = function(){
	precarga.tamCargado = 0;
	
	for( var i = 0; i < precarga.imagenes.length; i++ ){
		if( precarga.imagenes[i][2].complete ){
			if( !precarga.imagenes[i][3] ){
				precarga.imagenes[i][2].style.height = "16px";
			}
			precarga.imagenes[i][3] = true;
			precarga.tamCargado += precarga.imagenes[i][1];
		}
	}
	
	var porcentaje = Math.round(precarga.tamCargado / precarga.tamTotal * 100);
	
	/*
		Si hay callback y el tamaño cargado cambió se lo llama.
	*/
	if( precarga.callBack && precarga.tamCargado != precarga.ultimoTam ){
		precarga.domObj.scrollTop += 200;
		precarga.callBack(porcentaje);
	}
	
	if( precarga.tamCargado >= precarga.tamTotal ){
		clearInterval(precarga.intervalo);
		
		if( precarga.onComplete ){
			precarga.activa = false;
			precarga.tiempo = ( new Date() ).getTime() - precarga.tiempo;
			precarga.onComplete(precarga.tiempo);
		}
	}
	
	precarga.ultimoTam = precarga.tamCargado;
}

// --------------------
if(window.modulos){
	modulos.precarga.interpretadoListo();
}