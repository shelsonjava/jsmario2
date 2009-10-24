// alert("misc cargado");
// ----------------------
//	arrayValues: devuelve todos los valores de un array uno tras otro, junta todo.
// ----------------------
function arrayValues(array){
	var newArray = [];
	for( var p in array ){
		newArray[p] = array[p];
	}
	return newArray;
}

// ----------------------
//	debug: escribe sobre la consola de debug.
// ----------------------