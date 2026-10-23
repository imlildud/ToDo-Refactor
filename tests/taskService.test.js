// pruebas unitarias de taskService.js
// cada grupo indica la mision donde se escribio
// se usa Arrange Act Assert en cada prueba

import { describe, it, expect } from "vitest";
import {
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
} from "../src/taskService.js";

// se crea una coleccion nueva en cada prueba para que no se contaminen entre ellas
const coleccionMixta = () => [
  { id: 1, titulo: "Revisar requisitos", completada: true },
  { id: 2, titulo: "Diseñar pruebas", completada: false },
  { id: 3, titulo: "Refactorizar código", completada: false }
];

// Misión 2 · crearTarea
describe("Misión 2 · crearTarea", () => {
  it("crea una tarea pendiente con id y título", () => {
    // Arrange
    const id = 10;
    const titulo = "Diseñar pruebas";
    // Act
    const tarea = crearTarea(id, titulo);
    // Assert
    expect(tarea).toEqual({ id: 282, titulo: "Diseñar pruebas", completada: false });
  });
});

// Misión 9 · validarTitulo, regla de alta usada por la interfaz
describe("Misión 9 · validarTitulo", () => {
  it("acepta un título con texto", () => {
    expect(validarTitulo("Estudiar")).toBe(true);
  });

  it("rechaza un título vacío", () => {
    expect(validarTitulo("")).toBe(false);
  });

  it("rechaza un título con solo espacios", () => {
    expect(validarTitulo("    ")).toBe(false);
  });

  it("rechaza valores que no son texto", () => {
    expect(validarTitulo(undefined)).toBe(false);
    expect(validarTitulo(null)).toBe(false);
    expect(validarTitulo(42)).toBe(false);
  });
});

// Misión 3 · agregarTarea
describe("Misión 3 · agregarTarea", () => {
  it("devuelve la colección con la tarea nueva al final", () => {
    const tareas = coleccionMixta();
    const nueva = crearTarea(4, "Entregar práctica");

    const resultado = agregarTarea(tareas, nueva);

    expect(resultado[resultado.length - 1]).toEqual(nueva);
  });

  it("el resultado contiene un elemento más", () => {
    const tareas = coleccionMixta();

    const resultado = agregarTarea(tareas, crearTarea(4, "Otra"));

    expect(resultado).toHaveLength(tareas.length + 1);
  });

  it("no modifica el arreglo original", () => {
    const tareas = coleccionMixta();

    agregarTarea(tareas, crearTarea(4, "Otra"));

    expect(tareas).toHaveLength(3);
  });

  it("agrega correctamente a una colección vacía", () => {
    const resultado = agregarTarea([], crearTarea(1, "Primera"));

    expect(resultado).toEqual([{ id: 1, titulo: "Primera", completada: false }]);
  });
});

// Misión 4 · buscarTarea
describe("Misión 4 · buscarTarea", () => {
  it("encuentra una tarea con id existente", () => {
    expect(buscarTarea(coleccionMixta(), 2).titulo).toBe("Diseñar pruebas");
  });

  it("devuelve undefined si el id no existe", () => {
    expect(buscarTarea(coleccionMixta(), 99)).toBeUndefined();
  });

  it("devuelve undefined en una colección vacía", () => {
    expect(buscarTarea([], 1)).toBeUndefined();
  });
});

// Misión 5 · obtenerPendientes y obtenerTerminadas
describe("Misión 5 · obtenerPendientes y obtenerTerminadas", () => {
  it("separa las pendientes en una colección mixta", () => {
    const pendientes = obtenerPendientes(coleccionMixta());

    expect(pendientes.map(t => t.id)).toEqual([2, 3]);
  });

  it("separa las terminadas en una colección mixta", () => {
    const terminadas = obtenerTerminadas(coleccionMixta());

    expect(terminadas.map(t => t.id)).toEqual([1]);
  });

  it("devuelve un arreglo vacío si ninguna está pendiente", () => {
    const todasTerminadas = coleccionMixta().map(t => ({ ...t, completada: true }));

    expect(obtenerPendientes(todasTerminadas)).toEqual([]);
  });

  it("devuelve un arreglo vacío si ninguna está terminada", () => {
    const todasPendientes = coleccionMixta().map(t => ({ ...t, completada: false }));

    expect(obtenerTerminadas(todasPendientes)).toEqual([]);
  });

  it("devuelve un arreglo vacío con una colección vacía", () => {
    expect(obtenerPendientes([])).toEqual([]);
    expect(obtenerTerminadas([])).toEqual([]);
  });
});

// Misión 6 · cambiarEstado
describe("Misión 6 · cambiarEstado", () => {
  it("cambia de pendiente a terminada la tarea indicada", () => {
    const resultado = cambiarEstado(coleccionMixta(), 2);

    expect(buscarTarea(resultado, 2).completada).toBe(true);
  });

  it("cambia de terminada a pendiente si se invoca sobre una terminada", () => {
    const resultado = cambiarEstado(coleccionMixta(), 1);

    expect(buscarTarea(resultado, 1).completada).toBe(false);
  });

  it("no altera las demás tareas", () => {
    const original = coleccionMixta();

    const resultado = cambiarEstado(original, 2);

    expect(buscarTarea(resultado, 1)).toEqual(original[0]);
    expect(buscarTarea(resultado, 3)).toEqual(original[2]);
  });

  it("no muta el objeto original", () => {
    const original = coleccionMixta();

    cambiarEstado(original, 2);

    expect(original[1].completada).toBe(false);
  });

  it("conserva el contenido si el id no existe", () => {
    const original = coleccionMixta();

    expect(cambiarEstado(original, 99)).toEqual(original);
  });
});

// Misión 7 · eliminarTarea, incluye casos frontera
describe("Misión 7 · eliminarTarea", () => {
  it("elimina una tarea con id existente", () => {
    const resultado = eliminarTarea(coleccionMixta(), 2);

    expect(resultado.map(t => t.id)).toEqual([1, 3]);
  });

  it("deja la colección igual si el id no existe", () => {
    const original = coleccionMixta();

    expect(eliminarTarea(original, 99)).toEqual(original);
  });

  it("devuelve un arreglo vacío con una colección vacía", () => {
    expect(eliminarTarea([], 1)).toEqual([]);
  });

  it("no modifica el arreglo original", () => {
    const original = coleccionMixta();

    eliminarTarea(original, 1);

    expect(original).toHaveLength(3);
  });
});

// Misión 8 · obtenerResumen
describe("Misión 8 · obtenerResumen", () => {
  it("cuenta total, pendientes y terminadas", () => {
    expect(obtenerResumen(coleccionMixta())).toEqual({
      total: 3,
      pendientes: 2,
      terminadas: 1
    });
  });

  it("devuelve ceros con una colección vacía", () => {
    expect(obtenerResumen([])).toEqual({ total: 0, pendientes: 0, terminadas: 0 });
  });

  it("pendientes más terminadas siempre suman el total", () => {
    const r = obtenerResumen(coleccionMixta());

    expect(r.pendientes + r.terminadas).toBe(r.total);
  });
});

// Misión 11 · buscarPorTexto, extensión opción B
describe("Misión 11 · buscarPorTexto", () => {
  it("encuentra coincidencias parciales", () => {
    const resultado = buscarPorTexto(coleccionMixta(), "prueba");

    expect(resultado.map(t => t.id)).toEqual([2]);
  });

  it("ignora mayúsculas y minúsculas", () => {
    const resultado = buscarPorTexto(coleccionMixta(), "REVISAR");

    expect(resultado.map(t => t.id)).toEqual([1]);
  });

  it("devuelve todas las tareas con texto vacío", () => {
    expect(buscarPorTexto(coleccionMixta(), "")).toHaveLength(3);
  });

  it("devuelve todas las tareas con texto de solo espacios", () => {
    expect(buscarPorTexto(coleccionMixta(), "   ")).toHaveLength(3);
  });

  it("devuelve un arreglo vacío si no hay coincidencias", () => {
    expect(buscarPorTexto(coleccionMixta(), "zzz")).toEqual([]);
  });

  it("devuelve un arreglo vacío con una colección vacía", () => {
    expect(buscarPorTexto([], "algo")).toEqual([]);
  });
});
