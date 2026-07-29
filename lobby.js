// =============================================================== VARIABLES
let miMazo = null;                                              // aquí se guardará el mazo cargado
let miNombre = localStorage.getItem("hv-nombre") || "Player";   // nombre guardado, o por defecto
let miIdioma = localStorage.getItem("hv-idioma") || "en";       // idioma guardado, o inglés por defecto

// =============================================================== CARGAR MAZO
document.getElementById("input-mazo").addEventListener("change", function(evento) {
  const archivo = evento.target.files[0];                           // buscar mazo cargado
  if (!archivo) return;

  const lector = new FileReader();      
  lector.onload = function(e) {
    miMazo = JSON.parse(e.target.result);
    document.getElementById("estado-mazo").textContent = 
       "✅ " + miMazo.nombre + " (" + miMazo.entries.length + ")"; // simplificado, sin depender de traducción por ahora
  };
  lector.readAsText(archivo);
});

// =============================================================== BOTÓN CREAR PARTIDA
document.getElementById("btn-crear").addEventListener("click", function() {
  if (!miMazo) {                            // buscar mazo
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

// =============================================================== BOTÓN UNIRSE
document.getElementById("btn-unirse").addEventListener("click", function() {
  if (!miMazo) {                              // buscar mazo
    alert(t("lobby.alertMazo"));
    return;
  }

  const codigo = document.getElementById("input-codigo").value.trim().toUpperCase();
  if (codigo.length !== 6) {                  // comprobar código
    alert(t("lobby.alertCodigo"));
    return;
  }

  inicializarFirebase();
  unirseAPartida(codigo, miMazo);
  document.getElementById("estado-sala").textContent = t("lobby.uniendoPartida") + codigo + "...";
});

// ================================================================ DECKS GUARDADOS (leídos de localStorage, compartidos con el deckbuilder)
// por comentar
function llenarListaMazosGuardados() {
  const savedDecks = JSON.parse(localStorage.getItem('hv-decks') || '[]');
  const select = document.getElementById('savedDecksSelectLobby');

  if (!savedDecks.length) {
    select.innerHTML = `<option value="">${t("lobby.elegirMazoGuardado")}</option>`;
    return;
  }

  select.innerHTML = `<option value="">${t("lobby.elegirMazoGuardado")}</option>` +
    savedDecks.map(d => `<option value="${d.id}">${d.nombre} (${d.total}/40)</option>`).join('');
}

function cargarMazoGuardado(id) {
  if (!id) return;

  const savedDecks = JSON.parse(localStorage.getItem('hv-decks') || '[]');
  const saved = savedDecks.find(d => d.id === id);
  if (!saved) return;

  // adaptamos el formato guardado (id+qty) al formato que espera miMazo (con entries)
  miMazo = {
    nombre: saved.nombre,
    entries: saved.entries   // ya tiene el formato { id, qty } que usa online.js/construirMazo()
  };

  document.getElementById("estado-mazo").textContent =
    "✅ " + miMazo.nombre + " (" + miMazo.entries.reduce((s,e) => s+e.qty, 0) + " cartas)";
}
llenarListaMazosGuardados(); // rellenar el desplegable al cargar la página