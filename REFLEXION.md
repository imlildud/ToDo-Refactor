# Reflexion de pareja

El cambio que mas aumento la mantenibilidad fue pasar las tareas de strings a objetos y separar las reglas en taskService.js. Antes todo estaba pegado al DOM y cualquier idea nueva, como una prioridad o una fecha, hubiera obligado a reescribir el recorrido completo. Con objetos basta con agregar una propiedad y las funciones que ya existen siguen funcionando. Al sacar la logica de la interfaz tambien pudimos probarla sin abrir el navegador, lo que hizo el trabajo mucho mas rapido.

La prueba que mas confianza nos dio fue la de cambiarEstado que verifica que no se mutan las tareas originales. Ese error es facil de cometer y no se nota a simple vista porque la pantalla se ve bien, pero despues puede romper otras partes. Con la prueba supimos que la funcion era segura aunque cambiara el codigo por dentro.

Tambien nos dimos cuenta de que una prueba solo da confianza si podemos explicar que comportamiento protege. Cuando agregamos la busqueda por texto fue claro que el refactor valio la pena, porque la extension no obligo a modificar las funciones anteriores y las pruebas viejas seguian en verde.
