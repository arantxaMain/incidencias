document.addEventListener('DOMContentLoaded', function () {
  //página principal


  //popup fecha
  const botonPopup = document.getElementById('boton-popup');
  const popupFecha = document.getElementById('popup-fecha');
  const cerrarPopup = document.getElementById('cerrar-popup');
  const botonGuardarFecha = document.getElementById('boton-guardar-fecha');
  const inputFecha = document.getElementById('input-fecha');


  cargarIncidencias();
  cargarTiempoTotalTrabajo();
  actualizarTablaTiempos();



  

  //tiempo restante
  

  //eventos



  

  botonPopup.addEventListener('click', () => {
    popupFecha.style.display = 'flex';
  });

  cerrarPopup.addEventListener('click', () => {
    popupFecha.style.display = 'none';
  });

  botonGuardarFecha.addEventListener('click', () => {
    const fechaSeleccionada = inputFecha.value;
    if (fechaSeleccionada) {
      return fechaSeleccionada;
    }
  });

  window.addEventListener('click', (event) => {
    if (event.target === popupFecha) {
      popupFecha.style.display = 'none';
    }
  });
});
