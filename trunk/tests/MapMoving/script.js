function get(id){
	return document.getElementById(id);
}

var colores = ["FF0000", "FFFF00", "FF00FF", "00FFFF", "00FF00", "0000FF", "555", "CCC", "FF5555", "000"];

var leftDown = false;
var mapLeft = 0;
var warpWidth = 0;
var bloques = [];

var useLeft = true;

function keyDown(code){
	if( code == 39 ){
		leftDown = true;
	}
}

function keyUp(code){
	if( code == 39 ){
		leftDown = false;
	}
}

function docLoad(){
	generarBloque();generarBloque();generarBloque();
	generarBloque();generarBloque();generarBloque();
	generarBloque();generarBloque();generarBloque();
	setInterval(update, 10);
}

function generarBloque(){
	if( bloques[bloques.length - 3] ){
		//get("warp").removeChild(bloques[bloques.length - 3]);
	}
	
	var bloque = document.createElement("div");
	bloque.className = "bloque";
	//bloque.style.background = "#" + colores[Math.floor(Math.random() * 10)];
	bloque.style.left = warpWidth + "px";
	llenarBloque(bloque);
	
	warpWidth += 510;
	get("warp").style.width = (warpWidth+510) + "px";
	
	get("warp").appendChild(bloque);
	
	bloques.push(bloque);
}

function llenarBloque(bloque){
	for( var x = 0; x < 16; x++ ){
		for( var y = 0; y < 14; y++ ){
			if( x % 2 || y % 2 ){
				continue;
			}
			var img = document.createElement("img");
			img.src = "images/img" + (Math.ceil(Math.random() * 3)) + ".gif";
			img.style.position = "absolute";
			img.style.left = (x * 32) + "px";
			img.style.top = (y * 32) + "px";
			
			bloque.appendChild(img);
		}
	}
}

function update(){
	if( leftDown ){
		mapLeft += 10;
		if(useLeft){
			get("warp").style.marginLeft = "-" + mapLeft + "px";
		}
		else{
			get("game").scrollLeft = mapLeft;
		}
	}
	
	if(mapLeft + 512 + 100 > warpWidth){
		//generarBloque();
	}
}


function restart(){
	mapLeft = 0;
	get("warp").style.marginLeft = "0px";
	get("game").scrollLeft = 0;
}