// taskService.js
// aqui estan las reglas de las tareas
// no usa nada del DOM y ninguna funcion modifica el arreglo que recibe

// Misión 1 - una tarea ya no es un texto sino un objeto
// tiene id, titulo y completada

// Misión 2 - crear una tarea nueva, siempre empieza pendiente
function crearTarea(id, titulo) {
  return { id, titulo, completada: false };
}

// Misión 9 - revisar que el titulo no venga vacio ni solo con espacios
function validarTitulo(titulo) {
  return typeof titulo === "string" && titulo.trim().length > 0;
}

// Misión 3 - agregar una tarea y devolver un arreglo nuevo
function agregarTarea(tareas, nuevaTarea) {
  return [...tareas, nuevaTarea];
}

// Misión 4 - buscar una tarea por id, si no existe devuelve undefined
function buscarTarea(tareas, id) {
  return tareas.find(t => t.id === id);
}

// Misión 5 - separar pendientes y terminadas con filter
function obtenerPendientes(tareas) {
  return tareas.filter(t => !t.completada);
}

function obtenerTerminadas(tareas) {
  return tareas.filter(t => t.completada);
}

// Misión 6 - cambiar el estado de una tarea con map
// el spread copia la tarea para no modificar la original
function cambiarEstado(tareas, id) {
  return tareas.map(tarea =>
    tarea.id === id
      ? { ...tarea, completada: !tarea.completada }
      : tarea
  );
}

// Misión 7 - eliminar es quedarse con todas menos la del id
function eliminarTarea(tareas, id) {
  return tareas.filter(t => t.id !== id);
}

// Misión 8 - resumen usando las funciones que ya estan probadas
function obtenerResumen(tareas) {
  return {
    total: tareas.length,
    pendientes: obtenerPendientes(tareas).length,
    terminadas: obtenerTerminadas(tareas).length
  };
}

// Misión 11 - buscar por texto sin importar mayusculas
// si el texto viene vacio regresa todas las tareas
function buscarPorTexto(tareas, texto) {
  const consulta = String(texto ?? "").trim().toLowerCase();
  if (consulta === "") {
    return [...tareas];
  }
  return tareas.filter(t => t.titulo.toLowerCase().includes(consulta));
}

// esto solo se ejecuta con Node, es lo que permite que Vitest importe las funciones
// en el navegador no existe module y se ignora
if (typeof module !== "undefined") {
  module.exports = {
    crearTarea,
    validarTitulo,
    agregarTarea,
    buscarTarea,
    obtenerPendientes,
    obtenerTerminadas,
    cambiarEstado,
    eliminarTarea,
    obtenerResumen,
    buscarPorTexto
  };
}
