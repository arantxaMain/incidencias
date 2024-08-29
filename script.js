//cargar mapa desde local storage
let incidencias = new Map();
let ordenIncidencias = [];
const jsonIncidencias = localStorage.getItem('incidencias');
const jsonOrdenIncidencias = localStorage.getItem('ordenIncidencias');

if (jsonIncidencias && jsonOrdenIncidencias) {
  const objIncicendias = JSON.parse(jsonIncidencias);
  incidencias = new Map(Object.entries(objIncicendias));
  ordenIncidencias = JSON.parse(jsonOrdenIncidencias);

  actualizarTablaIncidencias();
  actualizarTablaTiempos();
}

//cargar tiempo de trabajo
const tiempoGuardado = localStorage.getItem('tiempoTotalTrabajo');
if (tiempoGuardado) {
  tiempoTotalTrabajo = parseInt(tiempoGuardado, 10);
}

//--eventos--//

//popup de horas trabajadas
const botonHoras = document.getElementById('boton-horas');
let tiempoTotalTrabajo = 0;

botonHoras.addEventListener('click', async () => {
  await setHorasTrabajadas();
  actualizarTablaTiempos();
});

if (tiempoGuardado) {
  tiempoTotalTrabajo = parseInt(tiempoGuardado, 10);
}

//mostrar u ocultar botones de ahora
const checkbox = document.getElementById('chkHora');
const botones = document.getElementsByClassName('boton-hora');
const inputInicio = document.getElementById('input-inicio');
const inputFin = document.getElementById('input-fin');
const lblInicio = document.getElementById('lbl-inicio');
const lblFin = document.getElementById('lbl-fin');

checkbox.addEventListener('change', () => {
  const mostrarBotones = checkbox.checked ? 'block' : 'none';
  const tipoInput = checkbox.checked ? 'time' : 'number';
  const txtLabelInicio = checkbox.checked ? 'Hora de inicio:' : 'Horas:';
  const txtLabelFin = checkbox.checked ? 'Hora de fin:' : 'Minutos:';

  for (let boton of botones) {
    boton.style.display = mostrarBotones;
  }

  inputInicio.type = tipoInput;
  inputFin.type = tipoInput;
  lblInicio.textContent = txtLabelInicio;
  lblFin.textContent = txtLabelFin;
});

//hora actual en inputs
const botonInicio = document.getElementById('boton-inicio');
const botonFin = document.getElementById('boton-fin');

botonInicio.addEventListener('click', () => {
  setHoraActual(inputInicio);
});

botonFin.addEventListener('click', function () {
  setHoraActual(inputFin);
});

//registrar incidencia con click o intro
const botonRegistrar = document.getElementById('boton-registrar');
const inputText = document.getElementById('input-incidencia');

botonRegistrar.addEventListener('click', function () {
  registrar();
});

inputText.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault(); //evita el comportamiento por defecto de enviar formularios en un <form>
    registrar();
  }
});

//borrar todas las incidencias
botonBorrar.addEventListener('click', function () {
  Swal.fire({
    icon: 'warning',
    title: '¿Estás seguro?',
    text: 'Se van a eliminar todas las incidencias',
    position: 'center',
    showConfirmButton: true,
    confirmButtonText: 'Si',
    showDenyButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Sesión borrada con éxito', '', 'success');
      incidencias.clear();
      actualizarTablaIncidencias();
      actualizarTablaTiempos();
      localStorage.removeItem('incidencias');
    }
  });
});

//--funciones--//

//mostrar error
function mostrarError(mensaje) {
  Swal.fire({
    icon: 'error',
    title: mensaje,
    toast: true,
    position: 'center',
    timer: 1500,
    showConfirmButton: false,
  });
}

//hora actual
function setHoraActual(input) {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  input.value = `${hours}:${minutes}`;
}

//sacar tiempos de los inputs
function extraerMinutos() {
  let horas, minutos;

  if (checkbox.checked) {
    //caso para tipo 'time'
    const tiempoInicio = inputInicio.value;
    const tiempoFin = inputFin.value || setHoraActual(inputFin);

    if (!tiempoInicio) {
      mostrarError('La hora de inicio no puede estar vacía');
      return null;
    }

    const [horasIni, minIni] = tiempoInicio.split(':').map(Number);
    const [horasFin, minFin] = tiempoFin.split(':').map(Number);

    const totalIni = horasIni * 60 + minIni;
    const totalFin = horasFin * 60 + minFin;
    const minTotales = totalFin - totalIni;

    if (minTotales <= 0) {
      mostrarError(
        minTotales < 0
          ? 'La hora de inicio no puede superar a la de fin'
          : 'Por favor, ingresa un tiempo válido (más de 0 minutos)'
      );
      return null;
    }

    return minTotales;
  } else {
    //caso para tipo 'number'
    horas = parseInt(inputInicio.value) || 0;
    minutos = parseInt(inputFin.value) || 0;

    if (
      isNaN(horas) ||
      isNaN(minutos) ||
      horas < 0 ||
      minutos < 0 ||
      minutos > 59
    ) {
      mostrarError('Debes introducir un tiempo válido');
      return null;
    }

    return horas * 60 + minutos;
  }
}

//registrar incidencia
function registrar() {
  const inputText = document.getElementById('input-incidencia');
  const nombre = inputText.value;
  if (!nombre) {
    mostrarError('Introduce una incidencia');
    return;
  }

  const minTotales = extraerMinutos();
  if (minTotales == null) {
    return;
  }

  if (incidencias.has(nombre)) {
    incidencias.set(nombre, incidencias.get(nombre) + minTotales);
  } else {
    incidencias.set(nombre, minTotales);
    ordenIncidencias.push(nombre);
  }

  inputText.value = '';
  inputInicio.value = '';
  inputFin.value = '';

  actualizarTablaIncidencias();
  actualizarTablaTiempos();
  guardarIncidencias();
}

//guardar mapa en local storage
function guardarIncidencias() {
  const objIncicendias = Object.fromEntries(incidencias);
  localStorage.setItem('incidencias', JSON.stringify(objIncicendias));
  localStorage.setItem('ordenIncidencias', JSON.stringify(ordenIncidencias));
}

//horas trabajadas
async function setHorasTrabajadas() {
  const { value: horas } = await Swal.fire({
    title: '¿Cuánto trabajas hoy?',
    input: 'time',
    inputLabel: 'Número de horas totales',
    showCancelButton: true,
    inputAttributes: {
      min: 1,
    },
    inputValidator: (value) => {
      if (!value || value === '00:00') {
        return 'Debes ingresar un número positivo';
      }
      return null;
    },
  });

  if (horas) {
    const [h, m] = horas.split(':').map(Number);
    tiempoTotalTrabajo = h * 60 + m;
    Swal.fire(`Horas trabajadas: ${horas}`);
  }
  return tiempoTotalTrabajo;
}

//calcular tiempo total
function calcularTiempoTotal() {
  let tiempoTotal = 0;
  for (const [, minTotales] of incidencias) {
    tiempoTotal += minTotales;
  }
  return tiempoTotal;
}

//pasar a horas y minutos
function pasarHorasMin(int) {
  const horas = Math.floor(int / 60);
  const min = int % 60;
  return `${horas}h ${min}m`;
}

//calcular rango
function calcularRango(int) {
  let tiempo = int / 60;
  let parteEntera = Math.floor(tiempo);
  let decimales = tiempo - parteEntera;

  if (decimales === 0) {
    return parteEntera;
  }

  if (decimales > 0 && decimales <= 0.25) {
    decimales = 0.25;
  } else if (decimales <= 0.5) {
    decimales = 0.5;
  } else if (decimales <= 0.75) {
    decimales = 0.75;
  } else {
    decimales = 1;
  }
  return parteEntera + decimales;
}

//actualizar tabla incidencias
function actualizarTablaIncidencias() {
  const tablaIncidencias = document.querySelector('#tabla-incidencias tbody');

  while (tablaIncidencias.firstChild) {
    tablaIncidencias.removeChild(tablaIncidencias.firstChild);
  }

  ordenIncidencias.forEach((nombre) => {
    const minTotales = incidencias.get(nombre);
    const horas = Math.floor(minTotales / 60);
    const minutos = minTotales % 60;
    const rango = calcularRango(minTotales);

    const botonEditarIncidencia = document.createElement('button');
    botonEditarIncidencia.className = 'boton-editar-incidencia';
    const iconoEditar = document.createElement('i');
    iconoEditar.className = 'fa-solid fa-pen-to-square';
    botonEditarIncidencia.appendChild(iconoEditar);

    const botonBorrarIncidencia = document.createElement('button');
    botonBorrarIncidencia.className = 'boton-borrar-incidencia';
    const iconoBorrar = document.createElement('i');
    iconoBorrar.className = 'fa-solid fa-trash';
    botonBorrarIncidencia.appendChild(iconoBorrar);

    const nuevaFila = tablaIncidencias.insertRow();

    let celdaNombre = nuevaFila.insertCell();
    let inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.value = nombre;
    inputNombre.className = 'input';
    inputNombre.readOnly = true;
    celdaNombre.appendChild(inputNombre);

    nuevaFila.insertCell().textContent = `${horas}h ${minutos}m`;
    nuevaFila.insertCell().textContent = rango;

    const celdaEditar = nuevaFila.insertCell();
    const celdaBorrar = nuevaFila.insertCell();

    celdaEditar.appendChild(botonEditarIncidencia);
    celdaBorrar.appendChild(botonBorrarIncidencia);

    botonEditarIncidencia.addEventListener('click', () => {
      const fila = inputNombre.parentElement.parentElement;
      const celdas = fila.getElementsByTagName('td');

      const inputNombreNuevo = document.createElement('input');
      inputNombreNuevo.type = 'text';
      inputNombreNuevo.value = inputNombre.value;
      inputNombreNuevo.className = 'input-editar-text';

      const tiempo = celdas[1].textContent.trim().split(' ');

      const horasTexto = tiempo[0];
      const minutosTexto = tiempo[1];

      const horas = parseInt(horasTexto.split('h')[0].trim()) || 0;
      const minutos = parseInt(minutosTexto.split('m')[0].trim()) || 0;

      const inputHoras = document.createElement('input');
      inputHoras.type = 'number';
      inputHoras.value = horas;
      inputHoras.className = 'input-editar-number';

      const inputMinutos = document.createElement('input');
      inputMinutos.type = 'number';
      inputMinutos.value = minutos;
      inputMinutos.className = 'input-editar-number';

      //reemplazar contenido de celdas con inputs
      celdas[0].innerHTML = '';
      celdas[0].appendChild(inputNombreNuevo);

      celdas[1].innerHTML = '';
      celdas[1].appendChild(inputHoras);
      celdas[1].appendChild(document.createTextNode('h '));
      celdas[1].appendChild(inputMinutos);
      celdas[1].appendChild(document.createTextNode('m'));

      celdas[2].textContent = '';

      //reemplazar boton de editar con botón de guardar
      const botonGuardarIncidencia = document.createElement('button');
      botonGuardarIncidencia.className = 'fa-solid fa-check';
      celdas[3].innerHTML = '';
      celdas[3].appendChild(botonGuardarIncidencia);

      //reemplazar boton de borrar con botón de cancelar
      const botonCancelarIncidencia = document.createElement('button');
      botonCancelarIncidencia.className = 'fa-solid fa-xmark';
      celdas[4].innerHTML = '';
      celdas[4].appendChild(botonCancelarIncidencia);

      //eventos de los botones nuevos
      botonGuardarIncidencia.addEventListener('click', () => {
        guardarCambios(nombre, inputNombreNuevo, inputHoras, inputMinutos);
      });

      inputNombreNuevo.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          guardarCambios(nombre, inputNombreNuevo, inputHoras, inputMinutos);
        }
      });

      inputHoras.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          guardarCambios(nombre, inputNombreNuevo, inputHoras, inputMinutos);
        }
      });

      inputMinutos.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          guardarCambios(nombre, inputNombreNuevo, inputHoras, inputMinutos);
        }
      });

      botonCancelarIncidencia.addEventListener('click', () => {
        actualizarTablaIncidencias();
        actualizarTablaTiempos();
      });
    });

    botonBorrarIncidencia.addEventListener('click', () => {
      incidencias.delete(nombre);
      ordenIncidencias = ordenIncidencias.filter((item) => item !== nombre);
      actualizarTablaIncidencias();
      actualizarTablaTiempos();
      guardarIncidencias();
    });
  });
}

//guardar cambios al editar incidencia
function guardarCambios(nombre, inputNombreNuevo, inputHoras, inputMinutos) {
  const nuevoNombre = inputNombreNuevo.value.trim();
  if (!nuevoNombre) {
    mostrarError('El nombre de la incidencia no puede estar vacío');
    return;
  }

  const minutosTotales =
    parseInt(inputHoras.value) * 60 + parseInt(inputMinutos.value);
  if (isNaN(minutosTotales) || minutosTotales <= 0) {
    mostrarError('Debe ingresar un tiempo válido');
    return;
  }

  if (nombre !== nuevoNombre) {
    if (incidencias.has(nuevoNombre)) {
      mostrarError('Ya existe una incidencia con ese nombre');
      return;
    }
    const index = ordenIncidencias.indexOf(nombre);
    if (index !== -1) {
      ordenIncidencias[index] = nuevoNombre;
    }

    incidencias.delete(nombre);
  }

  incidencias.set(nuevoNombre, minutosTotales);

  actualizarTablaIncidencias();
  actualizarTablaTiempos();
  guardarIncidencias();
}

//actualizar tabla tiempos
function actualizarTablaTiempos() {
  let tiempoTotal = calcularTiempoTotal();
  const totalHoras = pasarHorasMin(tiempoTotal);
  const rangoTotal = calcularRango(tiempoTotal);

  const minTotales = tiempoTotalTrabajo || 420;
  let txtRestante = pasarHorasMin(minTotales - tiempoTotal);

  const outRango = document.getElementById('total-rango');
  const outHoras = document.getElementById('total-horas');
  const outRestante = document.getElementById('total-restante');

  outRango.textContent = rangoTotal;
  outHoras.textContent = totalHoras;

  if (tiempoTotal === minTotales) {
    txtRestante = 'Ya has terminado ;)';
  }

  if (tiempoTotal > minTotales) {
    txtRestante = 'Te has pasado ' + pasarHorasMin(tiempoTotal - minTotales);
  }

  outRestante.textContent = txtRestante;
}
