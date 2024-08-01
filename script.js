document.addEventListener('DOMContentLoaded', function () {
  const botonInicio = document.getElementById('boton-inicio');
  const botonFin = document.getElementById('boton-fin');
  const inputInicio = document.getElementById('input-inicio');
  const inputFin = document.getElementById('input-fin');
  const checkbox = document.getElementById('chkHora');
  const botones = document.getElementsByClassName('boton-hora');
  const botonRegistrar = document.getElementById('boton-registrar');
  const botonBorrar = document.getElementById('boton-borrar');
  const inputText = document.getElementById('input-incidencia');
  const tablaIncidencias = document.querySelector('#tabla-incidencias tbody');
  let incidencias = new Map();

  cargarIncidencias();

  function actualizarBotones() {
    for (let i = 0; i < botones.length; i++) {
      botones[i].style.display = checkbox.checked ? 'block' : 'none';
    }
  }

  function setHoraActual(input) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    input.value = `${hours}:${minutes}`;
  }

  function extraerTexto() {
    return inputText.value;
  }

  function extraerMinutos() {
    //si el inicio está vacío devuelve null
    const tiempoInicio = inputInicio.value;
    if (!tiempoInicio) {
      Swal.fire({
        icon: 'error',
        title: 'La hora de inicio no puede estar vacía',
        toast: true,
        position: 'center',
        timer: 1500,
        showConfirmButton: false,
      });
      return null;
    }

    //si el fin está vacío se cambia por la hora actual
    let tiempoFin = inputFin.value;
    if (!tiempoFin) {
      setHoraActual(inputFin);
      tiempoFin = inputFin.value;
    }

    //calculamos la minTotales entre horas
    const [horasIni, minIni] = tiempoInicio.split(':').map(Number);
    const [horasFin, minFin] = tiempoFin.split(':').map(Number);

    const totalIni = horasIni * 60 + minIni;
    const totalFin = horasFin * 60 + minFin;
    const minTotales = totalFin - totalIni;

    if (minTotales < 0) {
      Swal.fire({
        icon: 'error',
        title: 'La hora de inicio no puede superar a la de fin',
        toast: true,
        position: 'center',
        timer: 1500,
        showConfirmButton: false,
      });
      return null;
    }

    if (minTotales == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Por favor, ingresa un tiempo válido (más de 0 minutos)',
        toast: true,
        position: 'center',
        timer: 1500,
        showConfirmButton: false,
      });
      return null;
    }

    return minTotales;
  }

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

  function registrar() {
    const nombre = extraerTexto();
    if (!nombre) {
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

    const minTotales = extraerMinutos();
    if (minTotales == null) {
      return;
    }

    //guarda el registro en el map
    if (incidencias.has(nombre)) {
      incidencias.set(nombre, incidencias.get(nombre) + minTotales);
    } else {
      incidencias.set(nombre, minTotales);
    }

    //actualizar tabla incidencias
    actualizarTablaIncidencias();

    //limpiar campos
    inputText.value = '';
    inputInicio.value = '';
    inputFin.value = '';

    //guardar incidencias en local storage
    guardarIncidencias();
  }

  function actualizarTablaIncidencias() {
    //limpiar tabla para evitar duplicados
    while(tablaIncidencias.firstChild) {
      tablaIncidencias.removeChild(tablaIncidencias.firstChild);
    }

    incidencias.forEach((minTotales, nombre) => {
      const horas = Math.floor(minTotales / 60);
      const minutos = minTotales % 60;
      const rango = calcularRango(minTotales);

      const botonEditarIncidencia = document.createElement('button');
      botonEditarIncidencia.className = 'boton-editar-incidencia';
      const iconoEditar = document.createElement('i');
      iconoEditar.className ='fa-solid fa-pen-to-square';
      botonEditarIncidencia.appendChild(iconoEditar);
      
      const botonBorrarIncidencia = document.createElement('button');
      botonBorrarIncidencia.className = 'boton-borrar-incidencia';
      const iconoBorrar = document.createElement('i');
      iconoBorrar.className ='fa-solid fa-trash';
      botonBorrarIncidencia.appendChild(iconoBorrar);

      const nuevaFila = tablaIncidencias.insertRow();

      nuevaFila.insertCell().textContent = nombre;
      nuevaFila.insertCell().textContent = `${horas}h ${minutos}m`;
      nuevaFila.insertCell().textContent = rango;

      const celdaEditar = nuevaFila.insertCell();
      const celdaBorrar = nuevaFila.insertCell();

      celdaEditar.appendChild(botonEditarIncidencia);
      celdaBorrar.appendChild(botonBorrarIncidencia);

      botonBorrarIncidencia.addEventListener('click', function() {
        //TODO implementar
      });
    
      botonBorrarIncidencia.addEventListener('click', () => {
        eliminarIncidencia(nombre);
      });
    });
  }

  //guardar mapa en local storage
  function guardarIncidencias() {
    const objIncicendias = Object.fromEntries(incidencias);
    localStorage.setItem('incidencias', JSON.stringify(objIncicendias));
  }

  //cargar mapa desde local storage
  function cargarIncidencias() {
    const jsonIncidencias = localStorage.getItem('incidencias');
    if(jsonIncidencias) {
      const objIncicendias = JSON.parse(jsonIncidencias);
      incidencias = new Map(Object.entries(objIncicendias));
      actualizarTablaIncidencias();
    }
  }

  function eliminarIncidencia(nombre) {
    incidencias.delete(nombre);
    actualizarTablaIncidencias();
    guardarIncidencias();
  }

  actualizarBotones();

  checkbox.addEventListener('change', actualizarBotones);

  botonInicio.addEventListener('click', () => {
    setHoraActual(inputInicio);
  });

  botonFin.addEventListener('click', function () {
    setHoraActual(inputFin);
  });

  botonRegistrar.addEventListener('click', function () {
    registrar();
  });

  inputText.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); //evita el comportamiento por defecto de enviar formularios en un <form>
      registrar();
    }
  });

  botonBorrar.addEventListener('click', function () {
    incidencias.clear();
    actualizarTablaIncidencias();
    localStorage.removeItem('incidencias');
  });
});
