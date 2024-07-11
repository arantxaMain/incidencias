export function extraerTexto() {
    return document.getElementById('input-incidencia').value;
  }
  
  export function extraerMinutos(inputInicio, inputFin) {
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
  
    let tiempoFin = inputFin.value;
    if (!tiempoFin) {
      setHoraActual(inputFin);
      tiempoFin = inputFin.value;
    }
  
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
  
  export function calcularRango(int) {
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
  