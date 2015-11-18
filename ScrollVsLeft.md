## Problema ##
En la primera versión de jsmario uno de los problemas mas grandes era que en las computadoras y navegadores mas lentos la velocidad del juego se veía afectada cuando el escenario se movía. En esta versión se usaba un div en el documento, dentro del cual estaban todas las imágenes, y se movía la propiedad scroll de este para desplazarse por el juego.

La idea es encontrar una forma mas rápido de moverlo, y una de mas simples seria de dejar el scroll del div estático, y mover para la izquierda lo que esta adentro.

## Test ##
Este test crea un escenario al azar, y prueba el tiempo que se tarda en mover 2000 pixels el mapa usando scroll, y usando la propiedad left de css.

Para probarlo solo hay que tocar el botón generar, para mover usando scroll Test Scroll, para moverlo usando left Test Left, y siempre después de poner test hay que poner return. El tiempo de cada test aparece debajo de los botones.

## Resultados ##
Los resultados son increibles. En Firefox 3.5 left es _100_ veces mas rápido que scroll, en IE 7 es _32_ veces mas rápido, en Safari 4 es _75_ veces, en Opera 10 es _1.9_ veces y en Chrome 4 _70_.

Me parecen algo anti intuitivo, ya que uno pensaría que al no tocar ninguna propiedad css el contenido no se debiera redibujar y andaría mas rápido, pero se ve que scroll es demasiado lento.

Sin embargo, y como demuestra el test "MapMoving", a la hora de hacer su tarea consume muchos mas recursos que scroll, a tal punto que deja de ser fluido y scroll pasa a andar mejor.

Por ahora JSMario 2.0 seguirá usando scroll debido a esto, podrá ser mas rápido pero no necesariamente mejor.


---

PD: Los archivos de los dos tests (este y MapMoving) y los resultados están en el svn.