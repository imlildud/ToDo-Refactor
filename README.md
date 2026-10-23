# ToDo Refactor Lab

Practica de Ingenieria de Software hecha en pareja. Partimos de una ToDo App con tareas guardadas como strings y la llevamos a un modelo de objetos con la logica separada de la interfaz y protegida con pruebas unitarias en Vitest.

## Integrantes y roles

Trabajamos con Pair Programming y cambiamos de rol al terminar cada mision.

- Integrante 1, NOMBRE AQUI
- Integrante 2, NOMBRE AQUI

## Como usar el proyecto

Para ver la aplicacion basta con abrir index.html con doble clic en el navegador.

Para correr las pruebas hace falta tener Node.js instalado y usar estos comandos en la terminal dentro de la carpeta del proyecto.

```
npm install
npm test
npm run test:watch
```

Lo que hace cada uno.

- npm install descarga Vitest, que es la herramienta de pruebas, y la guarda en la carpeta node_modules. Solo se hace una vez.
- npm test corre todas las pruebas una sola vez y muestra cuales pasaron y cuales fallaron. No modifica ningun archivo.
- npm run test:watch deja las pruebas corriendo y las repite solas cada vez que se guarda un archivo. Sirve para trabajar el ciclo RED GREEN REFACTOR.

## Que hace la aplicacion

Es una lista de tareas. Se pueden agregar tareas, buscarlas por texto, filtrarlas por estado y eliminarlas. Las tareas se muestran como tarjetas dentro de un grid. Al pasar el mouse sobre una tarjeta aparece un checkbox para marcarla y mandarla a la seccion de terminadas, y tambien un boton para eliminarla.

## Mapa de misiones

Cada mision esta marcada con un comentario en el codigo para encontrarla rapido.

| Mision | Tema | Archivo | Elemento |
|---|---|---|---|
| 0 | Comprender antes de cambiar | src/legacy.js y README | Codigo original y respuestas de esta seccion |
| 1 | De string a objeto | src/taskService.js | Comentario del modelo de tarea |
| 2 | Primera funcion y primera prueba | src/taskService.js y tests | crearTarea |
| 3 | Agregar sin acoplarse al DOM | src/taskService.js y tests | agregarTarea |
| 4 | find | src/taskService.js y tests | buscarTarea |
| 5 | filter | src/taskService.js y tests | obtenerPendientes y obtenerTerminadas |
| 6 | map | src/taskService.js y tests | cambiarEstado |
| 7 | Eliminar y casos frontera | src/taskService.js y tests | eliminarTarea |
| 8 | Resumen y composicion | src/taskService.js y tests | obtenerResumen |
| 9 | Integrar con la interfaz | src/app.js, src/taskService.js y tests | app.js completo y validarTitulo |
| 10 | Refactor final | src/app.js | dibujarTareas |
| 11 | Nuevo requerimiento opcion B | src/taskService.js, src/app.js y tests | buscarPorTexto |

## Mision 0, comprender antes de cambiar

**Donde guardariamos el estado completada.** Dentro de cada tarea como una propiedad booleana. Con strings no hay donde ponerlo y se tendrian que crear arrays paralelos, uno para textos y otro para estados, que se desacomodan facilmente.

**Que pasaria si cada tarea necesita prioridad, fecha o responsable.** Con strings seria imposible sin inventar formatos raros dentro del texto. Con objetos solo se agrega una propiedad nueva y el resto del codigo sigue funcionando.

**Que parte es dato y que parte es interfaz.** El arreglo tareas es dato. La funcion mostrarTareas es interfaz porque usa lista.innerHTML. En legacy.js las dos cosas viven en el mismo lugar y por eso no se puede probar una sin la otra.

**Comportamientos que no deben cambiar.**

1. Al cargar la pagina se muestran las tres tareas iniciales en el mismo orden.
2. Cada tarea se muestra con su titulo tal cual fue escrito.
3. La lista siempre refleja el estado actual y se vuelve a dibujar completa despues de cada cambio.

## Mision 1, de string a objeto

Cada tarea paso a ser un objeto con id, titulo y completada. Esas tres propiedades describen a la tarea. Cosas como el filtro elegido o el texto de la busqueda pertenecen a la interfaz y por eso se quedaron en app.js y no dentro de la tarea.

## Estructura final

- index.html tiene la estructura de la pantalla y no contiene reglas de negocio.
- styles.css tiene los estilos, el grid de tarjetas y el efecto hover.
- src/taskService.js contiene las reglas sobre tareas y no toca el DOM.
- src/app.js lee eventos, llama a las funciones de dominio y dibuja el resultado.
- src/legacy.js se conserva solo para comparar.
- tests/taskService.test.js contiene las pruebas unitarias.

## Decisiones de refactor

**Funciones que reciben datos y devuelven datos.** Ninguna funcion modifica el arreglo que recibe. Esto hace las pruebas mas predecibles y evita efectos que se noten hasta la interfaz.

**Metodo de array segun la intencion.**

- find en buscarTarea porque queremos encontrar uno solo y si no existe devuelve undefined.
- filter en obtenerPendientes, obtenerTerminadas y eliminarTarea porque seleccionan un subconjunto. Eliminar es conservar todo excepto un id.
- map con spread en cambiarEstado porque se transforma la coleccion y se necesita una copia de la tarea para no mutar la original.

**obtenerResumen reutiliza las funciones ya probadas.** Hace un recorrido extra comparado con contar todo en un solo ciclo, pero comunica mejor la intencion y no duplica la regla de que significa pendiente. Para una lista de tareas el costo es insignificante.

**validarTitulo vive en el servicio.** La regla de que un titulo vacio no es valido es una regla de negocio y no de pantalla, asi que se puede probar sin navegador.

**Scripts normales en lugar de modulos.** Los modulos de JavaScript no cargan al abrir un html con doble clic porque el navegador los bloquea. Por eso index.html carga taskService.js y app.js como scripts normales. Al final de taskService.js hay un bloque que solo se ejecuta con Node y que permite que Vitest importe las funciones.

**Una sola funcion para dibujar.** En el refactor final dibujarTareas reemplazo el codigo repetido que dibujaba pendientes y terminadas por separado. Se usa textContent y no innerHTML para que un titulo con etiquetas HTML no se interprete como codigo.

## Casos de prueba

Las pruebas siguen el patron Arrange Act Assert. En total son 35 y cubren los casos normales, los de frontera y los de error.

- crearTarea nace pendiente.
- validarTitulo acepta texto y rechaza vacio, solo espacios y valores que no son texto.
- agregarTarea agrega al final, suma uno, no muta el original y funciona con coleccion vacia.
- buscarTarea con id existente, inexistente y coleccion vacia.
- obtenerPendientes y obtenerTerminadas con coleccion mixta, sin coincidencias y vacia.
- cambiarEstado en ambas direcciones, sin alterar otras tareas, sin mutar el original y con id inexistente.
- eliminarTarea con id existente, inexistente, coleccion vacia y sin mutar.
- obtenerResumen con coleccion mixta, vacia y comprobando que las partes suman el total.
- buscarPorTexto parcial, sin importar mayusculas, con texto vacio, sin coincidencias y coleccion vacia.

## Pruebas de integracion manual

| Escenario | Accion | Resultado esperado | Resultado observado |
|---|---|---|---|
| Alta valida | Escribir titulo y Agregar | Aparece una tarjeta pendiente y cambia el resumen | COMPLETAR |
| Alta invalida | Enviar titulo vacio | No se agrega y sale un mensaje | COMPLETAR |
| Cambio de estado | Pasar el mouse y marcar el checkbox | La tarjeta pasa a terminadas y cambian los contadores | COMPLETAR |
| Filtro | Elegir Pendientes | Solo se ve la seccion de pendientes | COMPLETAR |
| Eliminar | Pasar el mouse y dar clic en la X | La tarjeta desaparece y se actualiza el resumen | COMPLETAR |

## Extension elegida, opcion B

Elegimos buscar por texto. Decidimos que la busqueda ignora mayusculas y minusculas y que un texto vacio o de solo espacios devuelve todas las tareas. Para agregarla solo hubo que crear una funcion nueva en taskService.js y un campo en la interfaz, sin tocar las demas funciones, lo que confirma que el refactor facilito el cambio.

## Evidencia

COMPLETAR con la captura de npm test en verde y el registro de una prueba que fallo al inicio, con este formato. Entrada, resultado observado, resultado esperado, correccion.
