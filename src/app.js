// app.js
// Misión 9 - conecta la pantalla con las funciones de taskService.js
// aqui solo hay eventos y dibujo, las reglas viven en el otro archivo
// las funciones de taskService.js ya estan disponibles porque se cargo antes en el html

// elementos de la pagina
const form = document.getElementById("form-tarea");
const inputTitulo = document.getElementById("input-titulo");
const mensaje = document.getElementById("mensaje");
const inputBusqueda = document.getElementById("input-busqueda");
const selectFiltro = document.getElementById("filtro");
const resumen = document.getElementById("resumen");
const seccionPendientes = document.getElementById("seccion-pendientes");
const seccionTerminadas = document.getElementById("seccion-terminadas");
const gridPendientes = document.getElementById("grid-pendientes");
const gridTerminadas = document.getElementById("grid-terminadas");
const contadorPendientes = document.getElementById("contador-pendientes");
const contadorTerminadas = document.getElementById("contador-terminadas");

// estado de la app
let tareas = [
  crearTarea(1, "Revisar requisitos"),
  crearTarea(2, "Diseñar pruebas"),
  crearTarea(3, "Refactorizar código")
];
let siguienteId = 4;
let textoBusqueda = "";
let filtro = "todas";

// arma una tarjeta con su checkbox y su boton de eliminar
function crearTarjeta(tarea) {
  const card = document.createElement("div");
  card.className = "card";
  if (tarea.completada) card.classList.add("terminada");

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "check";
  check.checked = tarea.completada;
  check.title = tarea.completada ? "Regresar a pendientes" : "Marcar como terminada";
  check.addEventListener("change", () => {
    tareas = cambiarEstado(tareas, tarea.id);
    render();
  });

  const titulo = document.createElement("span");
  titulo.className = "titulo";
  titulo.textContent = tarea.titulo;

  const eliminar = document.createElement("button");
  eliminar.type = "button";
  eliminar.className = "eliminar";
  eliminar.textContent = "✕";
  eliminar.title = "Eliminar tarea";
  eliminar.addEventListener("click", () => {
    tareas = eliminarTarea(tareas, tarea.id);
    render();
  });

  card.append(check, titulo, eliminar);
  return card;
}

// Misión 10 - una sola funcion dibuja las dos columnas
// antes habia codigo repetido para pendientes y terminadas
function dibujarTareas(grid, lista) {
  grid.innerHTML = "";

  if (lista.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "vacio";
    vacio.textContent = "No hay tareas por aqui.";
    grid.appendChild(vacio);
    return;
  }

  lista.forEach(tarea => grid.appendChild(crearTarjeta(tarea)));
}

// vuelve a dibujar toda la pantalla con el estado actual
function render() {
  const visibles = buscarPorTexto(tareas, textoBusqueda);
  dibujarTareas(gridPendientes, obtenerPendientes(visibles));
  dibujarTareas(gridTerminadas, obtenerTerminadas(visibles));

  // el filtro solo esconde una de las dos secciones
  seccionPendientes.hidden = filtro === "terminadas";
  seccionTerminadas.hidden = filtro === "pendientes";

  const r = obtenerResumen(tareas);
  contadorPendientes.textContent = r.pendientes;
  contadorTerminadas.textContent = r.terminadas;
  resumen.textContent = `${r.total} tareas en total, ${r.pendientes} pendientes y ${r.terminadas} terminadas`;
}

// agregar tarea
form.addEventListener("submit", evento => {
  evento.preventDefault();

  if (!validarTitulo(inputTitulo.value)) {
    mensaje.textContent = "Escribe un título para la tarea.";
    return;
  }

  mensaje.textContent = "";
  tareas = agregarTarea(tareas, crearTarea(siguienteId++, inputTitulo.value.trim()));
  inputTitulo.value = "";
  render();
});

// Misión 11 - buscador por texto
inputBusqueda.addEventListener("input", () => {
  textoBusqueda = inputBusqueda.value;
  render();
});

// filtro por estado
selectFiltro.addEventListener("change", () => {
  filtro = selectFiltro.value;
  render();
});

render();
