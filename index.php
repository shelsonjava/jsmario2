<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>JSMario 2.0 -- The Super Mario complete reconstruction plus Map Editor.</title>
	
	<link rel="stylesheet" type="text/css" href="styles/general.css" />
	<link rel="stylesheet" type="text/css" href="styles/debug.css" />
</head>
<body>
	
	<!-- consola ( flotante ) -->
	<div id="consola">
		<!-- El background (transparente) de la consola -->
		<!-- <div id="conBack"></div> -->
		<!-- El contenido de la consola (donde se escribe) -->
		<div id="conContent"></div>
		<!-- El input de la consola (oculto al principio) -->
		<input type="text" id="conInput" value="" style="display: none;" />
	</div>
	
	<div id="contenedorArriba">
		<!-- Titulo -->
		<div id="title">JSMario 2.0</div>
		<div id="subTitle">Super Mario Bross totally reconstructed using only javascript.</div>
	</div>
	
	<br />
	
	<div id="contenedorMedio">
		<!-- Juego -->
		
	</div>
	
	<div id="contenedorAbajo">
		<!-- Comentarios y  -->
	</div>
	<!-- 
		Luego de que la dom termine de formarse practicamente en su totalidad
		se empieza a jugar con javascript :)
	-->
	<script type="text/javascript" src="nucleo.js"></script>
</body>
</html>