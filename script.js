document.addEventListener("DOMContentLoaded", function () {
  const botonInicio = document.getElementById("boton-inicio");
  const botonFin = document.getElementById("boton-fin");
  const inputInicio = document.getElementById("input-inicio");
  const inputFin = document.getElementById("input-fin");
  const checkbox = document.getElementById("chkHora");
  const lblInicio = document.getElementById("lbl-inicio");
  const lblFin = document.getElementById("lbl-fin");
  const botones = document.getElementsByClassName("boton-hora");
  const botonRegistrar = document.getElementById("boton-registrar");
  const botonBorrar = document.getElementById("boton-borrar");
  const inputText = document.getElementById("input-incidencia");
  const tablaIncidencias = document.querySelector("#tabla-incidencias tbody");
  let incidencias = new Map();

  cargarIncidencias();
  actualizarTablaTiempos();

  function actualizarBotones() {
    const mostrarBotones = checkbox.checked ? "block" : "none";
    const tipoInput = checkbox.checked ? "time" : "text";
    const txtLabelInicio = checkbox.checked ? "Hora de inicio:" : "Horas:";
    const txtLabelFin = checkbox.checked ? "Hora de fin:" : "Minutos:";

    for (let boton of botones) {
      boton.style.display = mostrarBotones;
    }

    inputInicio.type = tipoInput;
    inputFin.type = tipoInput;
    lblInicio.textContent = txtLabelInicio;
    lblFin.textContent = txtLabelFin;
  }

  function setHoraActual(input) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    input.value = `${hours}:${minutes}`;
  }

  function extraerTexto() {
    return inputText.value;
  }

  function extraerMinutos() {
    //si el input es time
    if (checkbox.checked) {
      //si el inicio está vacío devuelve null
      let tiempoInicio = inputInicio.value;
      if (!tiempoInicio) {
        Swal.fire({
          icon: "error",
          title: "La hora de inicio no puede estar vacía",
          toast: true,
          position: "center",
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
      const [horasIni, minIni] = tiempoInicio.split(":").map(Number);
      const [horasFin, minFin] = tiempoFin.split(":").map(Number);

      const totalIni = horasIni * 60 + minIni;
      const totalFin = horasFin * 60 + minFin;
      const minTotales = totalFin - totalIni;

      if (minTotales < 0) {
        Swal.fire({
          icon: "error",
          title: "La hora de inicio no puede superar a la de fin",
          toast: true,
          position: "center",
          timer: 1500,
          showConfirmButton: false,
        });
        return null;
      }

      if (minTotales == 0) {
        Swal.fire({
          icon: "error",
          title: "Por favor, ingresa un tiempo válido (más de 0 minutos)",
          toast: true,
          position: "center",
          timer: 1500,
          showConfirmButton: false,
        });
        return null;
      }
      return minTotales;
    } else {

      //si el input es text
      let horas = inputInicio.value;
      let minutos = inputFin.value;
    }
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
        icon: "error",
        title: "Introduce una incidencia",
        toast: true,
        position: "center",
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
    actualizarTablaTiempos();

    //limpiar campos
    inputText.value = "";
    inputInicio.value = "";
    inputFin.value = "";

    //guardar incidencias en local storage
    guardarIncidencias();
  }

  function actualizarTablaIncidencias() {
    //limpiar tabla para evitar duplicados
    while (tablaIncidencias.firstChild) {
      tablaIncidencias.removeChild(tablaIncidencias.firstChild);
    }

    incidencias.forEach((minTotales, nombre) => {
      const horas = Math.floor(minTotales / 60);
      const minutos = minTotales % 60;
      const rango = calcularRango(minTotales);

      const botonEditarIncidencia = document.createElement("button");
      botonEditarIncidencia.className = "boton-editar-incidencia";
      const iconoEditar = document.createElement("i");
      iconoEditar.className = "fa-solid fa-pen-to-square";
      botonEditarIncidencia.appendChild(iconoEditar);

      const botonBorrarIncidencia = document.createElement("button");
      botonBorrarIncidencia.className = "boton-borrar-incidencia";
      const iconoBorrar = document.createElement("i");
      iconoBorrar.className = "fa-solid fa-trash";
      botonBorrarIncidencia.appendChild(iconoBorrar);

      const nuevaFila = tablaIncidencias.insertRow();

      let celdaNombre = nuevaFila.insertCell();
      let inputNombre = document.createElement("input");
      inputNombre.type = "text";
      inputNombre.value = nombre;
      inputNombre.className = "input";
      inputNombre.readOnly = true;
      celdaNombre.appendChild(inputNombre);

      nuevaFila.insertCell().textContent = `${horas}h ${minutos}m`;
      nuevaFila.insertCell().textContent = rango;

      const celdaEditar = nuevaFila.insertCell();
      const celdaBorrar = nuevaFila.insertCell();

      celdaEditar.appendChild(botonEditarIncidencia);
      celdaBorrar.appendChild(botonBorrarIncidencia);

      botonEditarIncidencia.addEventListener("click", () => {
        editarIncidencia(nombre, inputNombre);
      });

      botonBorrarIncidencia.addEventListener("click", () => {
        eliminarIncidencia(nombre, inputNombre);
      });
    });
  }

  function editarIncidencia(nombre, inputNombre) {
    actualizarTablaIncidencias();
    actualizarTablaTiempos();
    guardarIncidencias();
  }

  function eliminarIncidencia(nombre) {
    incidencias.delete(nombre);
    actualizarTablaIncidencias();
    actualizarTablaTiempos();
    guardarIncidencias();
  }

  //tiempo restante
  function actualizarTablaTiempos() {
    let tiempoTotal = calcularTiempoTotal();
    const totalHoras = pasarHorasMin(tiempoTotal);
    const rangoTotal = calcularRango(tiempoTotal);
    let txtRestante = pasarHorasMin(420 - tiempoTotal);

    const outRango = document.getElementById("total-rango");
    const outHoras = document.getElementById("total-horas");
    const outRestante = document.getElementById("total-restante");

    outRango.textContent = rangoTotal;
    outHoras.textContent = totalHoras;

    if (tiempoTotal === 420) {
      txtRestante = "Ya has terminado ;)";
    }

    if (tiempoTotal > 420) {
      txtRestante = "Te has pasado " + pasarHorasMin(tiempoTotal - 420);
    }

    outRestante.textContent = txtRestante;
  }

  //guardar mapa en local storage
  function guardarIncidencias() {
    const objIncicendias = Object.fromEntries(incidencias);
    localStorage.setItem("incidencias", JSON.stringify(objIncicendias));
  }

  //cargar mapa desde local storage
  function cargarIncidencias() {
    const jsonIncidencias = localStorage.getItem("incidencias");
    if (jsonIncidencias) {
      const objIncicendias = JSON.parse(jsonIncidencias);
      incidencias = new Map(Object.entries(objIncicendias));
      actualizarTablaIncidencias();
      actualizarTablaTiempos();
    }
  }

  actualizarBotones();

  checkbox.addEventListener("change", actualizarBotones);

  botonInicio.addEventListener("click", () => {
    setHoraActual(inputInicio);
  });

  botonFin.addEventListener("click", function () {
    setHoraActual(inputFin);
  });

  botonRegistrar.addEventListener("click", function () {
    registrar();
  });

  inputText.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); //evita el comportamiento por defecto de enviar formularios en un <form>
      registrar();
    }
  });

  botonBorrar.addEventListener("click", function () {
    Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: "Se van a eliminar todas las incidencias",
      position: "center",
      showConfirmButton: true,
      confirmButtonText: "Si",
      showDenyButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Sesión borrada con éxito", "", "success");
        incidencias.clear();
        actualizarTablaIncidencias();
        actualizarTablaTiempos();
        localStorage.removeItem("incidencias");
      }
    });
  });
});
