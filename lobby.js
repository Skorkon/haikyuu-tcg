// ── VARIABLES ─────────────────────────────────────────────
let miMazo = null;  // aquí se guardará el mazo cargado
let miNombre = localStorage.getItem("hv-nombre") || "Player"; // nombre guardado, o por defecto
let miIdioma = localStorage.getItem("hv-idioma") || "en"; // idioma guardado, o inglés por defecto

// ── CARGAR MAZO ───────────────────────────────────────────
document.getElementById("input-mazo").addEventListener("change", function(evento) {
  const archivo = evento.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function(e) {
    miMazo = JSON.parse(e.target.result);
    document.getElementById("estado-mazo").textContent = 
      "✅ Deck Loaded: " + miMazo.nombre + " (" + miMazo.entries.length + " cards)";
  };
  lector.readAsText(archivo);
});

// ── NOMBRE ────────────────────────────────────────────────
document.getElementById("input-nombre").addEventListener("change", function() {
  miNombre = this.value.trim() || "Jugador";    // guardar nombre
  localStorage.setItem("hv-nombre", miNombre);  // recordarlo para la próxima vez
});

// ── IDIOMA ────────────────────────────────────────────────
function marcarBotonIdioma() {
  // pone en negrita el botón del idioma activo y quita el resto
  document.querySelectorAll("#selector-idioma button").forEach(function(boton) {
    boton.style.fontWeight = boton.dataset.idioma === miIdioma ? "bold" : "normal";
  });
}

document.querySelectorAll("#selector-idioma button").forEach(function(boton) {
  boton.addEventListener("click", function() {
    miIdioma = boton.dataset.idioma;              // actualizar variable
    localStorage.setItem("hv-idioma", miIdioma);  // guardar para la próxima vez
    marcarBotonIdioma();                           // refrescar estado visual
  });
});

document.getElementById("input-nombre").value = miNombre; // rellenar con el nombre guardado
marcarBotonIdioma(); // pintar el idioma guardado al cargar la página

// ── BOTÓN CREAR PARTIDA ───────────────────────────────────
document.getElementById("btn-crear").addEventListener("click", function() {
  if (!miMazo) {
    alert("Primero carga tu mazo");
    return;
  }

  inicializarFirebase();
  const codigo = crearPartida(miMazo);

  document.getElementById("codigo-sala").textContent = codigo;
  document.getElementById("codigo-sala").style.display = "block";
  document.getElementById("estado-sala").textContent = "Esperando rival...";

  escucharSala();
});


// ── BOTÓN UNIRSE ──────────────────────────────────────────
document.getElementById("btn-unirse").addEventListener("click", function() {
  if (!miMazo) {
    alert("Primero carga tu mazo");
    return;
  }

  const codigo = document.getElementById("input-codigo").value.trim().toUpperCase();
  if (codigo.length !== 6) {
    alert("El código debe tener 6 caracteres");
    return;
  }

  inicializarFirebase();
  unirseAPartida(codigo, miMazo);
  document.getElementById("estado-sala").textContent = "Uniéndose a la partida " + codigo + "...";
});