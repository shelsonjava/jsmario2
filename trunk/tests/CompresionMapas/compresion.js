function comprimirMapa( mapa ){
	var nMapa = {};
	
	for( var n in mapa ){
		if( n == "settings" ){ // Settings del mapa
			nMapa.s = {};
		
			if( typeof mapa.settings.order != "undefined" ){ // Orden de los mapas, le saca el level de principio
				nMapa.s.o = mapa.settings.order;
				for( var n in nMapa.s.o ){
					nMapa.s.o[n] = nMapa.s.o[n].replace(/level/g, "");
				}
			}
			if( typeof mapa.settings.lifes != "undefined" ){ // Vidas del mapa
				nMapa.s.l = mapa.settings.lifes;
			}
			if( typeof mapa.settings.score != "undefined" ){ // Puntaje inicial del mapa
				nMapa.s.s = mapa.settings.score;
			}
			if( typeof mapa.settings.money != "undefined" ){ // Monedas del mapa
				nMapa.s.m = mapa.settings.money;
			}
		}
		else{ // Si es un nivel
			var id = n.replace(/level/g, ""); // Le saca de igual forma el level al id
			nMapa[id] = {}; // Crea un nuevo nivel en el nuevo mapa
			
			if( typeof mapa[n].displayName != "undefined" ){ // El nombre del nivel
				nMapa[id].d = mapa[n].displayName;
			}
			
			if( typeof mapa[n].settings != "undefined" ){ // Settings del nivel
				nMapa[id].s = {};
				
				if( typeof mapa[n].settings.background != "undefined" ){ // Color de fondo
					nMapa[id].s.b = mapa[n].settings.background;
				}
				if( typeof mapa[n].settings.spawns != "undefined" ){ // Zonas de inicio
					nMapa[id].s.s = mapa[n].settings.spawns;
				}
				if( typeof mapa[n].settings.gravity != "undefined" ){ // Gravedad
					nMapa[id].s.g = mapa[n].settings.gravity;
				}
			}
			
			if( typeof mapa[n].warpers != "undefined" ){ // Warpers del nivel
				nMapa[id].w = [];
				
				for( var w in mapa[n].warpers ){
					var warper = mapa[n].warpers[w];
					nMapa[id].w[w] = [];
					
					for( var x in warper ){
						if(	warper[x].length != 0 ){
							nMapa[id].w[w][x] = [];
							
							for( var o in warper[x] ){
								nMapa[id].w[w][x].push( comprimirObjeto(warper[x][o]) );
							}
						}
					}
				}
				
			}
		}
	}
	
	console.log(nMapa);
}


function comprimirObjeto(objeto){
	return objeto;
}