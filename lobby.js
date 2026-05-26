// ── VARIABLES ─────────────────────────────────────────────
let miMazo = null;  // aquí se guardará el mazo cargado


// ── CARGAR MAZO ───────────────────────────────────────────
document.getElementById("input-mazo").addEventListener("change", function(evento) {
  const archivo = evento.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function(e) {
    miMazo = JSON.parse(e.target.result);
    document.getElementById("estado-mazo").textContent = 
      "✅ Mazo cargado: " + miMazo.nombre + " (" + miMazo.entries.length + " cartas)";
  };
  lector.readAsText(archivo);
});


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