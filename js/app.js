import { actualizarBotones, setHoraActual, registrar } from './form.js';
import { actualizarTabla } from './table.js';

// Se ejecuta cuando el contenido del DOM se ha cargado
document.addEventListener('DOMContentLoaded', function () {
  const botonInicio = document.getElementById('boton-inicio');
  const botonFin = document.getElementById('boton-fin');
  const checkbox = document.getElementById('chkHora');
  const botonRegistrar = document.getElementById('boton-registrar');
  const inputText = document.getElementById('input-incidencia');

  // Configurar botones
  actualizarBotones();

  // Añadir eventos a los botones
  checkbox.addEventListener('change', actualizarBotones);
  botonInicio.addEventListener('click', () => setHoraActual(document.getElementById('input-inicio')));
  botonFin.addEventListener('click', () => setHoraActual(document.getElementById('input-fin')));
  botonRegistrar.addEventListener('click', registrar);

  inputText.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evitar el comportamiento por defecto de enviar formularios
      registrar();
    }
  });
});
