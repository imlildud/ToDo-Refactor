// Misión 0 - version original de la app
// se deja solo para comparar y no se carga en el html
// las tareas son simples textos y el recorrido esta pegado al DOM

const lista = document.getElementById("lista");

let tareas = [
  "Revisar requisitos",
  "Diseñar pruebas",
  "Refactorizar código"
];

function mostrarTareas() {
  lista.innerHTML = "";
  for (let i = 0; i < tareas.length; i++) {
    lista.innerHTML += `<li>${tareas[i]}</li>`;
  }
}

mostrarTareas();
