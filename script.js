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
  const tabla = document.querySelector('table tbody');
  let incidencias = [];

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

    //calculamos la diferencia entre horas
    const [horasIni, minIni] = tiempoInicio.split(':').map(Number);
    const [horasFin, minFin] = tiempoFin.split(':').map(Number);

    const totalIni = horasIni * 60 + minIni;
    const totalFin = horasFin * 60 + minFin;
    const diferencia = totalFin - totalIni;

    if (diferencia < 0) {
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
    return diferencia;
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

    const diferencia = extraerMinutos();
    if (diferencia == null) {
      return;
    }

    const nombre = extraerTexto();
    const horas = Math.floor(diferencia / 60);
    const minutos = diferencia % 60;
    const rango = calcularRango(diferencia);

    //guarda el registro en el array
    incidencias.push({
      nombre: nombre,
      horas: horas,
      minutos: minutos,
      rango: rango,
    });

    //actualizar tabla
    actualizarTabla();

    //limpiar campos
    inputText.value = '';
    inputInicio.value = '';
    inputFin.value = '';
  }

  function actualizarTabla() {
    //limpiar tabla para evitar duplicados
    const rows = tabla.querySelectorAll('tbody tr');
    rows.forEach((row) => row.remove());

    incidencias.forEach((incidencia) => {
      const nuevaFila = tabla.insertRow();
      nuevaFila.insertCell().textContent = incidencia.nombre;
      nuevaFila.insertCell().textContent = `${incidencia.horas}h ${incidencia.minutos}m`;
      nuevaFila.insertCell().textContent = incidencia.rango;
    });
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

  botonBorrar.addEventListener('click', function () {
    const rows = tabla.querySelectorAll('tbody tr');
    rows.forEach((row) => row.remove());
  });

  inputText.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); //evita el comportamiento por defecto de enviar formularios en un <form>
      registrar();
    }
  });
});
