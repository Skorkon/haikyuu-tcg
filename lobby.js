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
       "✅ " + miMazo.nombre + " (" + miMazo.entries.length + ")"; // simplificado, sin depender de traducción por ahora
  };
  lector.readAsText(archivo);
});

// ── BOTÓN CREAR PARTIDA ───────────────────────────────────
document.getElementById("btn-crear").addEventListener("click", function() {
  if (!miMazo) {
    alert(t("lobby.alertMazo"));
    return;
  }

  inicializarFirebase();
  const codigo = crearPartida(miMazo);

  document.getElementById("codigo-sala").textContent = codigo;
  document.getElementById("codigo-sala").style.display = "block";
  document.getElementById("estado-sala").textContent = t("lobby.esperandoRival");

  escucharSala();
});


// ── BOTÓN UNIRSE ──────────────────────────────────────────
document.getElementById("btn-unirse").addEventListener("click", function() {
  if (!miMazo) {
    alert(t("lobby.alertMazo"));
    return;
  }

  const codigo = document.getElementById("input-codigo").value.trim().toUpperCase();
  if (codigo.length !== 6) {
    alert(t("lobby.alertCodigo"));
    return;
  }

  inicializarFirebase();
  unirseAPartida(codigo, miMazo);
  document.getElementById("estado-sala").textContent = t("lobby.uniendoPartida") + codigo + "...";
});