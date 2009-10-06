function get(id){
	return document.getElementById(id);
}

function generate(){
	get("imagesWarp").innerHTML = "";
	for( var i = 0; i < 500; i++ ){
		var x = Math.ceil( Math.random() * 200 * 32 );
		var y = Math.ceil( Math.random() * 12 * 32 );
		var src = "img" + (Math.round(Math.random() * 50)) + ".gif";
		
		var img = document.createElement("img");
		img.src = "images/" + src;
		img.style.left = x + "px";
		img.style.bottom = y + "px";
		get("imagesWarp").appendChild(img);
	}
}

function testScr(){
	var scr = get("scr");
	var time = (new Date()).getTime();
	
	for( var t = 0; t < 2000; t++ ){
		scr.scrollLeft = t;
	}
	
	time = (new Date()).getTime() - time;
	get("results").innerHTML = time + "ms";
}

function testLeft(){
	_return();
	
	var warp = get("imagesWarp");
	var time = (new Date()).getTime();
	
	for( var t = 0; t < 2000; t++ ){
		warp.style.left = "-" + t + "px";
	}
	
	time = (new Date()).getTime() - time;
	get("results").innerHTML = time + "ms";
}

function _return(){
	get("imagesWarp").style.left = "0px";
	get("scr").scrollLeft = 0;
}