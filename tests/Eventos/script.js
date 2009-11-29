function get(id){
	return document.getElementById(id);
}

function debug(txt){
	get("debug").innerHTML += "<br />" + txt;
}

var test1 = null;
var test2 = null;
var test3 = null;
var test1PreText = "Click Aqui";

function checkFocus(){
	if( test1.value == test1PreText ){
		test1.value = "";
	}
}

function checkBlur(){
	if( test1.value == "" ){
		test1.value = test1PreText;
	}
}

eventos.agregar(window, "load", function(){
	
	test1 = get("test1");
	test2 = get("test2");
	test3 = get("test3");
	
	eventos.agregar(test1, "focus", checkFocus);
	eventos.agregar(test1, "blur", checkBlur);
	
	eventos.agregar(test2, "click", function(){
		eventos.quitar(test1, "focus", checkFocus);
	});
	
	eventos.agregar(test3, "click", function(){
		eventos.quitar(test1, "blur", checkBlur);
	});
	
});


teclado.crearAtajo("Ctrl Shift q", function(){
	debug("'Control Shift q' down");
}, function(){
	debug("'Control Shift q' up");
});

teclado.crearAtajo("Ctrl", function(){
	debug("'Control' down");
}, function(){
	debug("'Control' up");
});


eventos.agregar(window, "scroll", function(){
	get("scroll").innerHTML = "[" + docScroll().tipo + "] " + docScroll().left + " - " + docScroll().top;
});

eventos.agregar(document.body, "mousedown", function(evento){
	var eInfo = eventos.mouseInfo(evento, true);
	get("mouse").innerHTML = "[" + eInfo.tipo + "] " + eInfo.x + " " + eInfo.y + " (" + eInfo.boton + ")";
});