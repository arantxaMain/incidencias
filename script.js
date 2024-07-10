document.addEventListener("DOMContentLoaded", function () {
    const botonInicio = document.getElementById("boton-inicio");
    const botonFin = document.getElementById("boton-fin");
    const inputInicio = document.getElementById("input-inicio");
    const inputFin = document.getElementById("input-fin");
    const checkbox = document.getElementById("chkHora");
    const botones = document.getElementsByClassName("boton-hora");
    const botonRegistrar = document.getElementById("boton-registrar");
    const inputText = document.getElementById("input-incidencia");
    const outputText = document.getElementById("output");

    function actualizarBotones() {
        for (let i = 0; i < botones.length; i++) {
            botones[i].style.display = checkbox.checked ? "block" : "none";
        }
    }

    function setHoraActual(input) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        input.value = `${hours}:${minutes}`;
        // input.value = hours + ':' + minutes; (es lo mismo)
    }

    function extraerTexto() {
        const texto = inputText.value;
        outputText.textContent = `${texto}`;
    }

    function extraerMinutos() {
        const minutos = inputInicio.value;
        console.log(minutos);
    }

    actualizarBotones();

    checkbox.addEventListener("change", actualizarBotones);

    botonInicio.addEventListener("click", () => { //es lo mismo que
        setHoraActual(inputInicio);
    });

    botonFin.addEventListener("click", function () { //esto
        setHoraActual(inputFin);
    })

    botonRegistrar.addEventListener("click", extraerTexto, extraerMinutos);
});
