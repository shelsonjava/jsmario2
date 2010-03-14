if(window.modulos){
	modulos.precarga.cargadoListo();
}
/*
	Script que se encarga de la precarga de imagenes.
*/

var precarga = {
	intervalo: null, 	// El intervalo que chequea la carga de las imagenes
	callBack: null, 	// Los callbacks de porcentaje
	onComplete: null, 	// La funcion que se corre cuando se terminan de precargar las imagenes
	recorrerImgs: null, // Recorre las imagenes y llama a un callback por cada una
	empezar: null, 		// Inicia la precarga
	check: null, 		// Checkea si las imagenes cargaron
	crearEfectos: null,			// Crea las filas del efecto de precarga
	actualizarEfectos: null,	// Actualiza las filas del efecto
	calcularAngulo: null, 		// Calcula el angulo del efecto
	
	domObj: get("precarga"),	// El div que sirve de contendor
	barra: get("precBarra"),	// La barra de loading
	
	filaImg: "imagenes/loading.gif", // La imagen de cada fila
	
	cargando: false,	// Si la precarda se esta realizando
	ancho: 250, 	// El ancho en pixels de la consla
	alto: 20, 		// El alto en pixels de la consla
	tamTotal: 0, 	// El tamaño total de las iamgenes
	tamCargado: 0, 	// El tamaño de las imagenes que ya se terminaron de cargar
	ultimoTam: 0, 	// El ultimo tamaño de imagenes cargado, que sirve para saber si cambio y llamar al callbak
	tiempo: 0, 		// Para medir el tiempo que tarda
	
	efectoActual: false, // El efecto que esta realizando el div de precarga
	barrasX: 0,			// La posicion X de la barra, que se mueve todo el tiempo para la izquierda
	filas: [], 			// Array que almacena las filas del efecto visual al precargar
	velocidad: 1.5,		// La velocidad a la que se mueven para la izquierda las filas
	dash: 12, 			// El ancho de cada unidad en una fila
	anguloMouse: 1, 	// El angulo entre el centro del div con el efecto y el mouse
	angulo: 1, 			// El angulo de las barras, que va con un delay con respecto al del mouse
	maxAngulo: 1,		// El angulo maximo que pueden tener las filas
	opacidad: 0			// La opacidad del div con el efecto, hace un fade in al principio
};

/*
	Lista de imagenes, cada una es un array con su url y su peso en bytes
*/
var imgs = {
	base: "http://jsmario.com.ar/2.0/beta/imagenes/",
	// base: "imagenes/",
	
	selector: ["selector.gif", 99],
	
	figuras: {
		base: "figuras/",
		cast1: ["castillo1.gif", 1533],
		cast1Gris: ["castillo1_gris.gif", 1533],
		cast2: ["castillo2.gif", 3900],
		cast2Gris: ["castillo2_gris.gif", 3900],
		fuego: ["fuego.gif", 148],
		mon1: ["montania1.gif", 563],
		mon2: ["montania2.gif", 310],
		nube1: ["nube1.gif", 369],
		nube1Gris: ["nube1_gris.gif", 369],
		nube2: ["nube2.gif", 503],
		nube2Gris: ["nube2_gris.gif", 503],
		nube3: ["nube3.gif", 631],
		nube3Gris: ["nube3_gris.gif", 631],
		planta1: ["planta1.gif", 244],
		planta2: ["planta2.gif", 318],
		planta3: ["planta3.gif", 386],
		poste1: ["poste1.gif", 286],
		poste2: ["poste2.gif", 362],
		poste3: ["poste3.gif", 264],
		poste4: ["poste4.gif", 336],
		princesa: ["princesa.gif", 295],
		reja1: ["reja1.gif", 203],
		riel: ["riel.gif", 172]
	},
	
	font: {
		base: "font/",
		_0: ["0.gif", 73],
		_1: ["1.gif", 70],
		_2: ["2.gif", 70],
		_3: ["3.gif", 70],
		_4: ["4.gif", 72],
		_5: ["5.gif", 70],
		_6: ["6.gif", 70],
		_7: ["7.gif", 68],
		_8: ["8.gif", 70],
		_9: ["9.gif", 71],
		A: ["A.gif", 70],
		B: ["B.gif", 68],
		C: ["C.gif", 70],
		D: ["D.gif", 72],
		E: ["E.gif", 66],
		F: ["F.gif", 67],
		G: ["G.gif", 71],
		H: ["H.gif", 67],
		I: ["I.gif", 69],
		J: ["J.gif", 70],
		K: ["K.gif", 73],
		L: ["L.gif", 70],
		M: ["M.gif", 67],
		N: ["N.gif", 67],
		O: ["O.gif", 70],
		P: ["P.gif", 70],
		Q: ["Q.gif", 71],
		R: ["R.gif", 70],
		S: ["S.gif", 72],
		T: ["T.gif", 69],
		U: ["U.gif", 69],
		V: ["V.gif", 70],
		W: ["W.gif", 67],
		X: ["X.gif", 70],
		Y: ["Y.gif", 73],
		Z: ["Z.gif", 65],
		espacio: ["espacio.gif", 60],
		add: ["add.gif", 73],
		sub: ["sub.gif", 61],
		admiracion: ["admiracion.gif", 71],
		asterisco: ["asterisco.gif", 68],
		mira: ["mira.gif", 82],
		moneda: ["moneda.gif", 214]
	},
	
	marioC: {
		base: "mario/chico/",
		brazaleandoD: ["brazaleando/derecha.gif", 482],
		brazaleandoI: ["brazaleando/izquierda.gif", 710],
		corriendoD: ["corriendo/derecha.gif", 565],
		corriendoI: ["corriendo/izquierda.gif", 510],
		corriendoRapidoD: ["corriendo_rapido/derecha.gif", 565],
		corriendoRapidoI: ["corriendo_rapido/izquierda.gif", 510],
		escalandoD: ["escalando/derecha.gif", 326],
		muerto: ["muerto/normal.gif", 203],
		nadandoD: ["nadando/derecha.gif", 326],
		nadandoI: ["nadando/izquierda.gif", 512],
		normalD: ["normal/derecha.gif", 181],
		normalI: ["normal/izquierda.gif", 185],
		patinandoD: ["patinando/derecha.gif", 194],
		patinandoI: ["patinando/izquierda.gif", 194],
		saltandoD: ["saltando/derecha.gif", 217],
		saltandoI: ["saltando/izquierda.gif", 216],
		trepandoD: ["trepando/derecha.gif", 183],
		trepandoI: ["trepando/izquierda.gif", 203]
	},
	
	marioG: {
		base: "mario/grande/",
		agachadoD: ["agachado/derecha.gif", 447],
		agachadoI: ["agachado/izquierda.gif", 370],
		brazaleandoD: ["brazaleando/derecha.gif", 857],
		brazaleandoI: ["brazaleando/izquierda.gif", 1207],
		corriendoD: ["corriendo/derecha.gif", 923],
		corriendoI: ["corriendo/izquierda.gif", 930],
		corriendoRapidoD: ["corriendo_rapido/derecha.gif", 923],
		corriendoRapidoI: ["corriendo_rapido/izquierda.gif", 930],
		escalandoD: ["escalando/derecha.gif", 544],
		nadandoD: ["nadando/derecha.gif", 567],
		nadandoI: ["nadando/izquierda.gif", 826],
		normalD: ["normal/derecha.gif", 335],
		normalI: ["normal/izquierda.gif", 374],
		patinandoD: ["patinando/derecha.gif", 368],
		patinandoI: ["patinando/izquierda.gif", 371],
		saltandoD: ["saltando/derecha.gif", 346],
		saltandoI: ["saltando/izquierda.gif", 385],
		trepandoD: ["trepando/derecha.gif", 284],
		trepandoI: ["trepando/izquierda.gif", 323]
	},
	
	marioS: {
		base: "mario/super/",
		agachadoD: ["agachado/derecha.gif", 282],
		agachadoI: ["agachado/izquierda.gif", 395],
		brazaleandoD: ["brazaleando/derecha.gif", 1101],
		brazaleandoI: ["brazaleando/izquierda.gif", 1487],
		corriendoD: ["corriendo/derecha.gif", 951],
		corriendoI: ["corriendo/izquierda.gif", 1434],
		corriendoRapidoD: ["corriendo_rapido/derecha.gif", 951],
		corriendoRapidoI: ["corriendo_rapido/izquierda.gif", 1434],
		disparandoD: ["disparando/derecha.gif", 307],
		disparandoI: ["disparando/izquierda.gif", 437],
		escalandoD: ["escalando/derecha.gif", 287],
		escalandoI: ["escalando/izquierda.gif", 333],
		nadandoD: ["nadando/derecha.gif", 567],
		normalI: ["nadando/izquierda.gif", 874],
		normalD: ["normal/derecha.gif", 335],
		normalI: ["normal/izquierda.gif", 466],
		patinandoD: ["patinando/derecha.gif", 343],
		patinandoI: ["patinando/izquierda.gif", 497],
		saltandoD: ["saltando/derecha.gif", 491],
		saltandoI: ["saltando/izquierda.gif", 574],
		trepandoD: ["trepando/derecha.gif", 544]
	},
	
	marioT: {
		base: "mario/transicion/",
		derecha: ["derecha.gif", 373],
		izquierda: ["izquierda.gif", 498]
	},
	
	objetos: {
		base: "objetos/",
		
		agua: {
			base: "agua/skin/",
			cuerpo: ["cuerpo.gif", 71],
			superficie: ["superficie.gif", 150]
		},
		
		bandera: {
			base: "bandera/",
			cielo_bandera: ["skin_cielo/bandera.gif", 169],
			cielo_mastil: ["skin_cielo/mastil.gif", 512],
			dia_bandera: ["skin_dia/bandera.gif", 169],
			dia_mastil: ["skin_dia/mastil.gif", 512],
			noche_bandera: ["skin_noche/bandera.gif", 169],
			noche_mastil: ["skin_noche/mastil.gif", 512]
		},
		
		barra: {
			base: "barra/",
			cielo_normal: ["skin_cielo/normal.gif", 96],
			cielo_poleaH: ["skin_cielo/polea_horizontal.gif", 82],
			cielo_poleaTL: ["skin_cielo/polea_TopLeft.gif", 159],
			cielo_poleaTR: ["skin_cielo/polea_TopRight.gif", 190],
			cielo_poleaV: ["skin_cielo/polea_vertical.gif", 111],
			dia_normal: ["skin_dia/normal.gif", 88],
			dia_poleaH: ["skin_dia/polea_horizontal.gif", 82],
			dia_poleaTL: ["skin_dia/polea_TopLeft.gif", 159],
			dia_poleaTR: ["skin_dia/polea_TopRight.gif", 190],
			dia_poleaV: ["skin_dia/polea_vertical.gif", 111],
			gris_normal: ["skin_gris/normal.gif", 88],
			gris_poleaH: ["skin_gris/polea_horizontal.gif", 82],
			gris_poleaTL: ["skin_gris/polea_TopLeft.gif", 159],
			gris_poleaTR: ["skin_gris/polea_TopRight.gif", 155],
			gris_poleaV: ["skin_gris/polea_vertical.gif", 111]
		},
		
		castillo1: {
			base: "castillo1/",
			normal: ["skin/normal.gif", 1533]
		},
		
		cubo: {
			base: "cubo/",
			agua_construccion: ["skin_agua/construccion.gif", 220],
			agua_piso: ["skin_agua/piso.gif", 208],
			agua2_construccion: ["skin_agua2/construccion.gif", 220],
			agua2_piso: ["skin_agua2/piso.gif", 185],
			cast_construccion: ["skin_castillo/construccion.gif", 185],
			cast_piso: ["skin_castillo/piso.gif", 185],
			cielo_construccion: ["skin_cielo/construccion.gif", 171],
			cielo_piso: ["skin_cielo/piso.gif", 227],
			dia_construccion: ["skin_dia/construccion.gif", 166],
			dia_piso: ["skin_dia/piso.gif", 177],
			gris_construccion: ["skin_gris/construccion.gif", 166],
			gris_piso: ["skin_gris/piso.gif", 185],
			sub_construccion: ["skin_subterraneo/construccion.gif", 166],
			sub_piso: ["skin_subterraneo/piso.gif", 185]
		},
		
		ladrillos: {
			base: "ladrillos/",
			cast_fragmento: ["skin_castillo/fragmento.gif", 215],
			cast_normal: ["skin_castillo/normal.gif", 135],
			dia_fragmento: ["skin_dia/fragmento.gif", 199],
			dia_normal: ["skin_dia/normal.gif", 141],
			sub_fragmento: ["skin_subterraneo/fragmento.gif", 135],
			sub_normal: ["skin_subterraneo/normal.gif", 183]
		},
		
		moneda: ["moneda/skin/primaria.gif", 364],
		
		moneda2: ["moneda2/skin/secundaria.gif", 239],
		
		plataforma: {
			base: "plataforma/",
			cielo_B: ["skin_cielo/Bottom.gif", 71],
			cielo_BC: ["skin_cielo/BottomCenter.gif", 146],
			cielo_TC: ["skin_cielo/TopCenter.gif", 128],
			cielo_TL: ["skin_cielo/TopLeft.gif", 172],
			cielo_TR: ["skin_cielo/TopRight.gif", 168],
			dia_B: ["skin_dia/Bottom.gif", 125],
			dia_BC: ["skin_dia/BottomCenter.gif", 125],
			dia_TC: ["skin_dia/TopCenter.gif", 111],
			dia_TL: ["skin_dia/TopLeft.gif", 140],
			dia_TR: ["skin_dia/TopRight.gif", 140],
			gris_B: ["skin_gris/Bottom.gif", 119],
			gris_BC: ["skin_gris/BottomCenter.gif", 119],
			gris_TC: ["skin_gris/TopCenter.gif", 111],
			gris_TL: ["skin_gris/TopLeft.gif", 140],
			gris_TR: ["skin_gris/TopRight.gif", 140]
		},
		
		puente: {
			base: "puente/skin/",
			cadena: ["cadena.gif", 131],
			hacha: ["hacha.gif", 202],
			piso: ["piso.gif", 212]
		},
		
		signo: {
			base: "signo/",
			cast_roto: ["skin_castillo/roto.gif", 139],
			cast_normal: ["skin_castillo/normal.gif", 461],
			dia_normal: ["skin_dia/normal.gif", 461],
			dia_roto: ["skin_dia/roto.gif", 139],
			sub_normal: ["skin_subterraneo/normal.gif", 461],
			sub_roto: ["skin_subterraneo/roto.gif", 139]
		},
		
		trampolin: {
			base: "trampolin/",
			dia_chico: ["skin_dia/chico.gif", 229],
			dia_medio: ["skin_dia/medio.gif", 268],
			dia_normal: ["skin_dia/normal.gif", 292],
			gris_chico: ["skin_gris/chico.gif", 230],
			gris_medio: ["skin_gris/medio.gif", 270],
			gris_normal: ["skin_gris/normal.gif", 295]
		},
		
		tubo1: {
			base: "tubo1/",
			agua2_BL: ["skin_agua2/BottomLeft.gif", 191],
			agua2_BR: ["skin_agua2/BottomRight.gif", 172],
			agua2_TL: ["skin_agua2/TopLeft.gif", 180],
			agua2_TR: ["skin_agua2/TopRight.gif", 165],
			cielo_BL: ["skin_cielo/BottomLeft.gif", 191],
			cielo_BR: ["skin_cielo/BottomRight.gif", 172],
			cielo_TL: ["skin_cielo/TopLeft.gif", 180],
			cielo_TR: ["skin_cielo/TopRight.gif", 165],
			dia_BL: ["skin_dia/BottomLeft.gif", 191],
			dia_BR: ["skin_dia/BottomRight.gif", 199],
			dia_TL: ["skin_dia/TopLeft.gif", 180],
			dia_TR: ["skin_dia/TopRight.gif", 165],
			noche_BL: ["skin_noche/BottomLeft.gif", 191],
			noche_BR: ["skin_noche/BottomRight.gif", 172],
			noche_TL: ["skin_noche/TopLeft.gif", 180],
			noche_TR: ["skin_noche/TopRight.gif", 165],
			sub_BL: ["skin_subterraneo/BottomLeft.gif", 191],
			sub_BR: ["skin_subterraneo/BottomRight.gif", 199],
			sub_TL: ["skin_subterraneo/TopLeft.gif", 180],
			sub_TR: ["skin_subterraneo/TopRight.gif", 165]
		},
		
		tubo2: {
			base: "tubo2/",
			agua2_BL: ["skin_agua2/BottomLeft.gif", 217],
			agua2_BR: ["skin_agua2/BottomRight.gif", 201],
			agua2_TL: ["skin_agua2/TopLeft.gif", 274],
			agua2_TR: ["skin_agua2/TopRight.gif", 155],
			cielo_BL: ["skin_cielo/BottomLeft.gif", 325],
			cielo_BR: ["skin_cielo/BottomRight.gif", 206],
			cielo_TL: ["skin_cielo/TopLeft.gif", 263],
			cielo_TR: ["skin_cielo/TopRight.gif", 128],
			dia_BL: ["skin_dia/BottomLeft.gif", 191],
			dia_BR: ["skin_dia/BottomRight.gif", 152],
			dia_TL: ["skin_dia/TopLeft.gif", 169],
			dia_TR: ["skin_dia/TopRight.gif", 110],
			noche_BL: ["skin_noche/BottomLeft.gif", 217],
			noche_BR: ["skin_noche/BottomRight.gif", 159],
			noche_TL: ["skin_noche/TopLeft.gif", 209],
			noche_TR: ["skin_noche/TopRight.gif", 132],
			sub_BL: ["skin_subterraneo/BottomLeft.gif", 191],
			sub_BR: ["skin_subterraneo/BottomRight.gif", 152],
			sub_TL: ["skin_subterraneo/TopLeft.gif", 169],
			sub_TR: ["skin_subterraneo/TopRight.gif", 110]
		},
		
		tubo3: {
			base: "tubo3/",
			agua2_BL: ["skin_agua2/BottomLeft.gif", 204],
			agua2_BR: ["skin_agua2/BottomRight.gif", 172],
			agua2_TL: ["skin_agua2/TopLeft.gif", 191],
			agua2_TR: ["skin_agua2/TopRight.gif", 172],
			cielo_BL: ["skin_cielo/BottomLeft.gif", 204],
			cielo_BR: ["skin_cielo/BottomRight.gif", 172],
			cielo_TL: ["skin_cielo/TopLeft.gif", 191],
			cielo_TR: ["skin_cielo/TopRight.gif", 172],
			dia_BL: ["skin_dia/BottomLeft.gif", 204],
			dia_BR: ["skin_dia/BottomRight.gif", 201],
			dia_TL: ["skin_dia/TopLeft.gif", 191],
			dia_TR: ["skin_dia/TopRight.gif", 201],
			noche_BL: ["skin_noche/BottomLeft.gif", 204],
			noche_BR: ["skin_noche/BottomRight.gif", 172],
			noche_TL: ["skin_noche/TopLeft.gif", 191],
			noche_TR: ["skin_noche/TopRight.gif", 172],
			sub_BL: ["skin_subterraneo/BottomLeft.gif", 204],
			sub_BR: ["skin_subterraneo/BottomRight.gif", 201],
			sub_TL: ["skin_subterraneo/TopLeft.gif", 191],
			sub_TR: ["skin_subterraneo/TopRight.gif", 201]
		},
		
		tubo4: {
			base: "tubo4/",
			agua2_BL: ["skin_agua2/BottomLeft.gif", 191],
			agua2_BR: ["skin_agua2/BottomRight.gif", 172],
			agua2_TL: ["skin_agua2/TopLeft.gif", 191],
			agua2_TR: ["skin_agua2/TopRight.gif", 172],
			cielo_BL: ["skin_cielo/BottomLeft.gif", 191],
			cielo_BR: ["skin_cielo/BottomRight.gif", 172],
			cielo_TL: ["skin_cielo/TopLeft.gif", 191],
			cielo_TR: ["skin_cielo/TopRight.gif", 172],
			dia_BL: ["skin_dia/BottomLeft.gif", 191],
			dia_BR: ["skin_dia/BottomRight.gif", 199],
			dia_TL: ["skin_dia/TopLeft.gif", 191],
			dia_TR: ["skin_dia/TopRight.gif", 199],
			noche_BL: ["skin_noche/BottomLeft.gif", 191],
			noche_BR: ["skin_noche/BottomRight.gif", 172],
			noche_TL: ["skin_noche/TopLeft.gif", 191],
			noche_TR: ["skin_noche/TopRight.gif", 172],
			sub_BL: ["skin_subterraneo/BottomLeft.gif", 191],
			sub_BR: ["skin_subterraneo/BottomRight.gif", 199],
			sub_TL: ["skin_subterraneo/TopLeft.gif", 191],
			sub_TR: ["skin_subterraneo/TopRIght.gif", 199]
		}
	},
	
	seres: {
		base: "seres/",
		acorazado: {
			base: "acorazado/skin/",
			cadaver: ["cadaver.gif", 154],
			derecha: ["derecha.gif", 647],
			izquierda: ["izquierda.gif", 375],
			muerto: ["muerto.gif", 297]
		},
		
		bicho: {
			base: "bicho/",
			cast_cadaver: ["skin_castillo/cadaver.gif", 138],
			cast_normal: ["skin_castillo/muerto.gif", 201],
			cast_muerto: ["skin_castillo/normal.gif", 415],
			dia_cadaver: ["skin_dia/cadaver.gif", 138],
			dia_muerto: ["skin_dia/muerto.gif", 248],
			dia_normal: ["skin_dia/normal.gif", 411],
			sub_cadaver: ["skin_subterraneo/cadaver.gif", 138],
			sub_muerto: ["skin_subterraneo/muerto.gif", 194],
			sub_normal: ["skin_subterraneo/normal.gif", 376]
		},
		
		burbuja: ["burbuja/skin/normal.gif", 55],
		
		cadena: {
			base: "cadena/skin/",
			cubo: ["cubo.gif", 139],
			fuego: ["fuego.gif", 396]
		},
		
		canion: {
			base: "canion/skin/",
			_B: ["Bottom.gif", 218],
			_T: ["Top.gif", 194]
		},
		
		carpincho: {
			base: "carpincho/skin/",
			derecha: ["derecha.gif", 614],
			huevo: ["huevo.gif", 188],
			izquierda: ["izquierda.gif", 729],
			muertoD: ["muerto_derecha.gif", 218],
			muertoI: ["muerto_izquierda.gif", 332]
		},
		
		disparo: ["disparo/skin/normal.gif", 396],
		
		disparo2: ["disparo2/skin/normal.gif", 274],
		
		disparo3: {
			base: "disparo3/skin/",
			abajo: ["abajo.gif", 300],
			arriba: ["arriba.gif", 206]
		},
		
		disparo4: {
			base: "disparo4/skin/",
			derecha: ["derecha.gif", 194],
			izquierda: ["izquierda.gif", 206]
		},
		
		dragon: {
			base: "dragon/skin/",
			derecha: ["derecha.gif", 1771],
			izquierda: ["izquierda.gif", 1057]
		},
		
		estrella: ["estrella/skin/normal.gif", 426],
		
		explosion: ["explosion/skin/explocion.gif", 478],
		
		hongo: {
			base: "hongo/",
			muerte: ["skin_muerte/normal.gif", 179],
			normal: ["skin_normal/normal.gif", 195],
			vida: ["skin_vida/normal.gif", 179]
		},
		
		martillo: {
			base: "martillo/skin/",
			derecha: ["derecha.gif", 1031],
			izquierda: ["izquierda.gif", 1005]
		},
		
		nube_asesisina: {
			base: "nube_asesisina/skin/",
			derecha: ["derecha.gif", 465],
			izquierda: ["izquierda.gif", 271],
			muerta: ["muerta.gif", 403],
			vacia: ["vacia.gif", 218]
		},
		
		pez: {
			base: "pez/",
			agua_muertoD: ["skin_agua/muerto_derecha.gif", 270],
			agua_muertoI: ["skin_agua/muerto_izquierda.gif", 208],
			agua_normalD: ["skin_agua/normal_derecha.gif", 498],
			agua_normalI: ["skin_agua/normal_izquierda.gif", 395],
			agua2_muertoD: ["skin_agua2/muerto_derecha.gif", 207],
			agua2_muertoI: ["skin_agua2/muerto_izquierda.gif", 208],
			agua2_normalD: ["skin_agua2/normal_derecha.gif", 678],
			agua2_normalI: ["skin_agua2/normal_izquierda.gif", 395]
		},
		
		planta: {
			base: "planta/",
			dia_normal: ["skin_dia/normal.gif", 556],
			noche_normal: ["skin_noche/normal.gif", 556]
		},
		
		planta2: ["planta2/skin/normal.gif", 151],
		
		pulpo: {
			base: "pulpo/skin/",
			chico: ["chico.gif", 225],
			muerto: ["muerto.gif", 224],
			normal: ["normal.gif", 282]
		},
		
		tortuga: {
			base: "tortuga/",
			dia_cadaver: ["skin_dia/cadaver.gif", 196],
			dia_muerto: ["skin_dia/muerto.gif", 355],
			dia_normalD: ["skin_dia/normal_derecha.gif", 615],
			dia_normalI: ["skin_dia/normal_izquierda.gif", 649],
			dia_volandoD: ["skin_dia/volando_derecha.gif", 1046],
			dia_volandoI: ["skin_dia/volando_izquierda.gif", 1180],
			dia2_cadaver: ["skin_dia2/cadaver.gif", 196],
			dia2_muerto: ["skin_dia2/muerto.gif", 184],
			dia2_normalD: ["skin_dia2/normal_derecha.gif", 597],
			dia2_normalI: ["skin_dia2/normal_izquierda.gif", 643],
			dia2_volandoD: ["skin_dia2/volando_derecha.gif", 1011],
			dia2_volandoI: ["skin_dia2/volando_izquierda.gif", 606],
			sub_cadaver: ["skin_subterraneo/cadaver.gif", 196],
			sub_muerto: ["skin_subterraneo/muerto.gif", 199],
			sub_normalD: ["skin_subterraneo/normal_derecha.gif", 637],
			sub_normalI: ["skin_subterraneo/normal_izquierda.gif", 558],
			sub_volandoD: ["skin_subterraneo/volando_derecha.gif", 631],
			sub_volandoI: ["skin_subterraneo/volando_izquierda.gif", 932]
		},
		
		tortuga_asesina: {
			base: "tortuga_asesina/skin/",
			disparo: ["disparo.gif", 273],
			disparoD: ["disparo_derecha.gif", 448],
			disparoI: ["disparo_izquierda.gif", 273],
			muertoD: ["muerto_derecha.gif", 272],
			muertoI: ["muerto_izquierda.gif", 455],
			normalD: ["normal_derecha.gif", 991],
			normalI: ["normal_izquierda.gif", 582]
		}
	}
};

/*
	Cuando se interpreta el modulo fx se activan los efectos de precarga.
*/
crearModuloCB("fx", function(){
	Fx.agregarMetodos(precarga);
});


precarga.callBack = function(porcentaje){
	var cargado = Math.round(precarga.tamCargado / 100);
	var total = Math.round(precarga.tamTotal / 100);
	
	consola.set("prec_porcentaje", porcentaje + "% (" + cargado + " / " + total + " kb)");
	msgGeneral("Preloading images " + porcentaje + "%");
	
	precarga.barra.style.width = (porcentaje * 250 / 100) + "px";
}

/*
	Recorre las imagenes y por cada una llama a un callback.
*/
precarga.recorrerImgs = function(imagenes, funcion, base){
	base = base || "";
	
	for(var i in imagenes){
		var datos = imagenes[i];

		if(i == "base"){
			base += datos;
		}
		else if(tipo(datos) == "array"){
			funcion(base, datos);
		}
		else if(tipo(datos) == "object"){
			precarga.recorrerImgs(datos, funcion, base);
		}
		
	}
}

/*
	Empieza la precarga de imagenes.
*/
precarga.empezar = function(onComplete){
	precarga.onComplete = onComplete;
	
	consola.separador();
	
	if( !general.precarga ){
		/*
			Si la precarga esta desactivada solo se corre el onComplete.
		*/
		log("Precarga desactivada");
		
		if(precarga.onComplete){
			precarga.onComplete(0);
		}
		return false;
	}
	
	log("Precargando imagenes: $prec_porcentaje:0%");
	msgGeneral("Preloading images...");
	precarga.crearEfectos();
	
	/*
		El div del efecto hace un fade in al principio.
	*/
	
	opacidad(precarga.domObj, 0);
	precarga.domObj.style.display = "block";
	
	/*
		Se crean las imagenes, no es necesario agregarlas al documento, solas empiezan a cargarse.
	*/
	
	precarga.recorrerImgs(imgs, function(base, img){
		var url = base +  img[0];
		var tamanio = img[1];
		
		precarga.tamTotal += tamanio;
		
		var imagen = dom.crear( "img", {src: url} );
		
		img.push(imagen); 	// Se agrega el objeto que las carga
	});
	
	precarga.tiempo = ( new Date() ).getTime();
	precarga.cargando = true;
}

/*
	Checkea todas las imagenes de la precarga para ver cuales estan cargadas y llama a los callbacks.
*/
precarga.check = function(){
	
	if( !general.precarga ){
		return false;
	}
	
	precarga.tamCargado = 0;
	
	precarga.recorrerImgs(imgs, function(base, img){
		if( img[2].complete ){
			precarga.tamCargado += img[1];
		}
	});
	
	var porcentaje = Math.round(precarga.tamCargado / precarga.tamTotal * 100);
	
	/*
		Si hay callback y el tamaño cargado cambió se lo llama.
	*/
	if( precarga.callBack && precarga.tamCargado != precarga.ultimoTam ){
		precarga.callBack(porcentaje);
	}
	
	if( precarga.tamCargado >= precarga.tamTotal ){
		clearInterval(precarga.intervalo);
		eventos.quitar(document, "mousemove", precarga.calcularAngulo);
		opacidad(precarga.domObj, 100);
		
		if( precarga.onComplete ){
			precarga.cargando = false;
			precarga.efectoActual = false;
			precarga.tiempo = ( new Date() ).getTime() - precarga.tiempo;
			
			log("Precarga finalizada! (" + Math.round(precarga.tiempo / 1000) + " Segundos)");
			precarga.onComplete(precarga.tiempo);
		}
	}
	
	precarga.ultimoTam = precarga.tamCargado;
}


/*
	Crea las filas y crea el evento mousemove para calcular el angulo con el mouse.
	Empieza el fade in del div de precarga.
*/
precarga.crearEfectos = function(){
	for( var n = 1; n <= precarga.alto; n++ ){
		var fila = {
			posY: n,
			domObj: null
		};
		
		fila.domObj = dom.crear("img", {
			src: precarga.filaImg,
			className: "precFila",
			style: {
				marginLeft: ( n - precarga.dash ) + "px"
			}
		}, precarga.barra);
		
		precarga.filas.push(fila);
	}
	
	eventos.agregar(document, "mousemove", precarga.calcularAngulo);
	
	precarga.superponerFx("opacidad", {
		hasta: 100,
		tiempo: 1000,
		efecto: "linear"
	});
	
	precarga.efectoActual = "precargando";
}

/*
	Actualiza las filas, moviendolas para la izquierda al mismo tiempo que calcula y mueve su angulo.
	Actualiza la opcidad del div cuando esta haciendo fade in.
*/
precarga.actualizarEfectos = function(){
	
	var cambios = precarga.actualizarFx();
	
	if( precarga.efectoActual == "precargando" ){
		
		/*
			Fade-in inicial.
		*/
		if( cambios.opacidad ){
			opacidad(precarga.domObj, Math.round(precarga.opacidad));
		}
		
		if( !general.efectos ){
			return false;
		}
		/*
			Si los efectos generales estan activos se mueven las barras segun el mouse.
		*/
		precarga.barrasX -= precarga.velocidad;
		if( -precarga.barrasX > (precarga.dash * 2) ){
			precarga.barrasX += precarga.dash * 2;
		}
		
		if( precarga.angulo < precarga.anguloMouse ){
			precarga.angulo += (precarga.anguloMouse - precarga.angulo) / 5;
		}
		if( precarga.angulo > precarga.anguloMouse ){
			precarga.angulo -= (precarga.angulo - precarga.anguloMouse) / 5;
		}
		
		for( var f = 0; f < precarga.filas.length; f++ ){
			var fila = precarga.filas[f];
			
			
			var x = precarga.barrasX - (precarga.alto * precarga.maxAngulo);
			x += + ( fila.posY * precarga.angulo );
			
			fila.domObj.style.marginLeft = x + "px";
		}
	}
	else if(precarga.efectoActual == "implotando"){
		if( cambios.ancho ){
			precarga.domObj.style.width = precarga.ancho + "px";
		}
		
		if( cambios.alto ){
			precarga.domObj.style.height = precarga.alto + "px";
		}
	}
	
}

/*
	Calcula el angulo entre el centro del div de preload y el mouse.
*/
precarga.calcularAngulo = function(evento){
	var mouse = eventos.mouseInfo(evento);
	
	var centroX = precarga.domObj.offsetLeft + ( precarga.domObj.offsetWidth / 2 );
	var centroY = precarga.domObj.offsetTop + ( precarga.domObj.offsetHeight / 2 );
	
	var xDiff = mouse.x - centroX;
	var yDiff = mouse.y - centroY;
	
	precarga.anguloMouse = xDiff / yDiff;
	
	if( precarga.anguloMouse > precarga.maxAngulo ){
		precarga.anguloMouse = precarga.maxAngulo;
	}
	else if( precarga.anguloMouse < -precarga.maxAngulo ){
		precarga.anguloMouse = -precarga.maxAngulo;
	}
}

// --------------------
if(window.modulos){
	modulos.precarga.interpretadoListo();
}