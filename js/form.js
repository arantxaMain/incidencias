import { calcularRango, extraerMinutos, extraerTexto } from './utils.js';
import { actualizarTabla } from './table.js';

export function actualizarBotones() {
  const checkbox = document.getElementById('chkHora');
  const botones = document.getElementsByClassName('boton-hora');
  for (let i = 0; i < botones.length; i++) {
    botones[i].style.display = checkbox.checked ? 'block' : 'none';
  }
}

export function setHoraActual(input) {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  input.value = `${hours}:${minutes}`;
}

export function registrar() {
  const inputText = document.getElementById('input-incidencia');
  const inputInicio = document.getElementById('input-inicio');
  const inputFin = document.getElementById('input-fin');

  if (!inputText.value) {
    Swal.fire({
      icon: 'error',
      title: 'Introduce una incidencia',
      toast: true,
      position: 'center',
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  const diferencia = extraerMinutos(inputInicio, inputFin);
  if (diferencia == null) {
    return;
  }

  const nombre = extraerTexto();
  const horas = Math.floor(diferencia / 60);
  const minutos = diferencia % 60;
  const rango = calcularRango(diferencia);

  // Guardar el registro en el array
  const incidencias = JSON.parse(localStorage.getItem('incidencias')) || [];
  incidencias.push({
    nombre: nombre,
    horas: horas,
    minutos: minutos,
    rango: rango,
  });
  localStorage.setItem('incidencias', JSON.stringify(incidencias));

  // Actualizar tabla
  actualizarTabla();

  // Limpiar campos
  inputText.value = '';
  inputInicio.value = '';
  inputFin.value = '';
}
