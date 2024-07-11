export function actualizarTabla() {
    const tabla = document.querySelector('table tbody');
    const incidencias = JSON.parse(localStorage.getItem('incidencias')) || [];
  
    // Limpiar tabla para evitar duplicados
    const rows = tabla.querySelectorAll('tr');
    rows.forEach((row) => row.remove());
  
    incidencias.forEach((incidencia) => {
      const nuevaFila = tabla.insertRow();
      nuevaFila.insertCell().textContent = incidencia.nombre;
      nuevaFila.insertCell().textContent = `${incidencia.horas}h ${incidencia.minutos}m`;
      nuevaFila.insertCell().textContent = incidencia.rango;
    });
  }
  