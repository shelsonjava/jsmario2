function get(id){
	return document.getElementById(id);
}

fontFace = function(onFinish){
	var object = get("fontFaceTest");
	object.style.fontFamily = "";
	
	var offsetWidth = object.offsetWidth;
	//alert(offsetWidth);
	
	object.style.fontFamily = "Mario";
	
	setTimeout(function(){
		var newOffsetWidth = object.offsetWidth;
		
		offsetWidth != newOffsetWidth;
	}, 300);
	
	return;
}