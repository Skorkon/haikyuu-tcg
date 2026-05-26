
// ============================================================================================================ CONFIGURACIÓN
// ── CONFIGURACIÓN FIREBASE ────────────────────────────────
const firebaseConfig = { // conexión a la base BaaS de fire base
  apiKey: "AIzaSyAQyjOIh4dAqb4a05DpV-DvGSQLEt8BvOc",
  authDomain: "hv-tcg.firebaseapp.com",
  databaseURL: "https://hv-tcg-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hv-tcg",
  storageBucket: "hv-tcg.firebasestorage.app",
  messagingSenderId: "1088751806613",
  appId: "1:1088751806613:web:f9ca53deb63a05f51ad39c"
};

// ── ESTADO ONLINE ─────────────────────────────────────────
let db         = null;   // conexión a Firebase (true o false)
let salaActual = null;   // código de la sala (ej: "XK7F2A")
let miNumero   = null;   // 1 o 2 según si creaste o te uniste
let modoOnline = false;  // false = partida local, true = online

// ============================================================================================================ CONEXIÓN
// ── INICIALIZAR CONEXIÓN ──────────────────────────────────
function inicializarFirebase() { // cuando el jugador abre el lobby, se lanza esta función
  firebase.initializeApp(firebaseConfig); // lanzamos la función de conectarse al servidor
  db = firebase.database();  // data base: abre la conexión con la base de datos
  console.log("Firebase conectado ✅"); 
}

// ============================================================================================================ CREAR Y UNIRSE A PARTIDAS
// ── GENERAR CÓDIGO DE SALA ────────────────────────────────
function generarCodigo() { // genera un código aleatorio para la sala
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

// ── CREAR PARTIDA ─────────────────────────────────────────
function crearPartida(mazo) { 
  const codigo = generarCodigo();
  salaActual   = codigo;
  miNumero     = 1;
  modoOnline   = true;

  db.ref("partidas/" + codigo).set({ // crea la partida con todas las variables
    estado:        "esperando",
    jugador1listo: false,
    jugador2listo: false,
    jugador1mazo:  mazo,
    jugador2mazo:  null,
  });

  console.log("Partida creada: " + codigo);
  return codigo;
}

// ── UNIRSE A PARTIDA ──────────────────────────────────────
function unirseAPartida(codigo, mazo) {
  salaActual = codigo;
  miNumero   = 2;
  modoOnline = true;

  db.ref("partidas/" + codigo + "/jugador2mazo").set(mazo); // añade el mazo del jugador 2
  db.ref("partidas/" + codigo + "/estado").set("completa"); // cambia el estado de la partida

  console.log("Unido a la partida: " + codigo);

  // esperar un momento y redirigir
    setTimeout(function() {
      window.location.href = "juego.html?sala=" + salaActual + "&jugador=" + miNumero;
    }, 1000);
}

// ============================================================================================================ FLUJO DE JUEGO
// ── ENVIAR JUGADA ─────────────────────────────────────────
function enviarJugada(tipo, datos) { // ejemplo: enviarJugada("cartaJugada", { zona: "remate", cartaId: "HV-D01-001" })
  if (!modoOnline) return;

  db.ref("partidas/" + salaActual + "/ultimaJugada").set({ // sobreescribe la última jugada
    tipo:      tipo,
    jugador:   miNumero,
    timestamp: Date.now(), // fecha y hora en milisegundos
    ...datos // TODOS los datos de la carta
  });
}

// ── ESCUCHAR JUGADAS DEL RIVAL ────────────────────────────
function escucharPartida() {
  db.ref("partidas/" + salaActual + "/ultimaJugada").on("value", function(snap) { // detecta si últimaJugada ha cambiado y recupera la informacíón
    const jugada = snap.val(); // añadir los datos recibidos en la variable jugada

    if (!jugada)                    return;
    if (jugada.jugador === miNumero) return;

    aplicarJugadaRival(jugada); // aplica la jugada del rival en el tu tablero
  });
}

// ── APLICAR JUGADA DEL RIVAL ──────────────────────────────
function aplicarJugadaRival(jugada) {
  switch (jugada.tipo) {

  case "cartaJugada": // ====================================================================== CARTA JUGADA
    const todasLasCartas = inicializarCartas();           // cargar catálogo
    const carta = todasLasCartas.find(c => c.info?.id === jugada.cartaId); // buscar carta
    if (!carta) return;                                   // si no existe, ignorar

    const rivalIndice = miNumero === 1 ? 1 : 0;          // índice del rival
    const rival = game.jugadores[rivalIndice];            // jugador rival

    carta.zonaActual = jugada.zona;                       // zona donde se jugó
    carta.recienJugada = true;                            // marcada como recién jugada
    carta.habilidadUsada = false;                         // habilidad no usada

    if (jugada.zona === "bloqueoApoyo") {                 // si es bloqueador de apoyo
      rival.zonas.bloqueoApoyo.push(carta);               // añadir a zona de apoyo
      game.bloqueoActual.apoyos.push(carta);              // añadir al conteo de bloqueo
    } else {                                              // cualquier otra zona
      rival.zonas[jugada.zona].push(carta);               // añadir a la zona correspondiente
      if (jugada.zona === "bloqueo") {                    // si es bloqueador central
        game.bloqueoActual.central = carta;               // marcar como central
      }
    }
    game.jugadaActual[jugada.zona] = carta;               // guardar en jugada actual
    log("Rival juega " + carta.nombre + " en " + jugada.zona); // log
    renderCampo();                                        // redibujar campo
    break;

    case "eventoJugado": // ====================================================================== EVENTO JUGADO
      const todasCartasEvento = inicializarCartas();                           // cargar catálogo
      const evento = todasCartasEvento.find(c => c.info?.id === jugada.cartaId); // buscar evento
      if (!evento) return;                                                     // si no existe, ignorar

      const rivalIndiceEvento = miNumero === 1 ? 1 : 0;                       // índice del rival
      game.jugadores[rivalIndiceEvento].zonas.eventos.push(evento);           // añadir a zona eventos
      log("Rival juega el evento: " + evento.nombre);                         // log
      renderCampo();                                                           // redibujar campo
      break;

    case "habilidadUsada":
      break;

    case "gutsUsado":  // ====================================================================== GUTS USADO
      if (!jugada.cartasIds) return;                           // ignorar si no hay ids

      const rivalIndiceGuts = miNumero === 1 ? 1 : 0;         // índice del rival
      const rivalGuts = game.jugadores[rivalIndiceGuts];       // jugador rival

      jugada.cartasIds.forEach(id => {                         // para cada carta descartada
        let index = rivalGuts.zonas[jugada.zona]               // buscar carta en la zona
          .findIndex(c => c.info?.id === id);                  // por su id
        if (index !== -1) {                                    // si se encuentra
          let carta = rivalGuts.zonas[jugada.zona]             // extraer carta
            .splice(index, 1)[0];                              // sacar del array
          rivalGuts.trash.push(carta);                         // enviar al trash
        }
      });

      log("Rival usa GUTS en " + jugada.zona);                 // log
      renderCampo();                                           // redibujar campo
      break;

    case "robarCarta": // ====================================================================== ROBAR CARTA
      const miIndiceRobo = miNumero - 1;                   // índice del jugador local
      robarCarta(game.jugadores[miIndiceRobo], jugada.cantidad); // robar en local
      renderMano();                                        // redibujar mano
      renderManoRival()
      renderCampo();                                       // redibujar campo
      break;

    case "robarHasta6":
      const miJugadorRobo = game.jugadores[miNumero - 1];    // jugador local
      let necesita = 6 - miJugadorRobo.mano.length;          // cartas que necesita
      if (necesita > 0) {
        robarCarta(miJugadorRobo, necesita);                  // robar hasta 6
      }
      renderMano();                                           // redibujar mano
      renderManoRival()
      break;

    case "perderPunto":
      const rivalIndicePunto = miNumero === 1 ? 1 : 0;       // índice del rival
      const rivalPunto = game.jugadores[rivalIndicePunto];    // jugador rival
      if (rivalPunto.mazoPuntos.length > 0) {
        let carta = rivalPunto.mazoPuntos.shift();            // roba del mazo de puntos
        rivalPunto.mano.push(carta);                          // va a la mano del rival
        log("📛 Rival pierde un punto. Le quedan " + rivalPunto.mazoPuntos.length);
      }
      actualizarMarcador();                                   // actualizar marcador
      renderMano();                                           // redibujar mano
      renderManoRival()
      renderCampo();                                          // redibujar campo
      break;

    case "concederPunto":
      const miIndiceConcede = miNumero - 1;                      // yo gané el punto, yo saco
      game.jugadorActivo = miIndiceConcede;                      // actualizar jugador activo
      game.valorAtaque = 0;                                      // resetear ataque
      game.valorDefensa = 0;                                     // resetear defensa
      game.fase = "saque";                                       // volver a saque
      game.bloqueoActual = { central: null, apoyos: [] };       // limpiar bloqueo
      actualizarMarcador();                                      // actualizar marcador
      actualizarFaseUI();                                        // actualizar letrero
      renderMano();                                              // redibujar mano
      renderCampo();                                             // redibujar campo
      break;

    case "finPartida":
      mostrarFinPartida(true);                                 // el rival perdió, tú ganaste
      break;

    case "faseConfirmada":
      break;

    case "puntoTerminado":
      break;

    default:
      console.log("Jugada desconocida: " + jugada.tipo);
  }
}

// ============================================================================================================ INICIAR PARTIDA
// ── ESCUCHAR ESTADO DE LA SALA ────────────────────────────
function escucharSala() {
  db.ref("partidas/" + salaActual + "/estado").on("value", function(snap) {
    const estado = snap.val();

    if (estado === "completa") {
      console.log("¡Rival encontrado! Arrancando partida...");
      db.ref("partidas/" + salaActual).once("value", function(snap) {
        const sala = snap.val();
        const miIndice = miNumero - 1;
        
        // redirigir a juego.html con los parámetros de la partida
        window.location.href = "juego.html?sala=" + salaActual + "&jugador=" + miNumero;
      });
    }
  });
}

// ── ARRANCAR PARTIDA Y CREAR MAZOS ────────────────────────────
function arrancarPartidaOnline(mazoJ1, mazoJ2) {
  const miMazoData    = miNumero === 1 ? mazoJ1 : mazoJ2;
  const rivalMazoData = miNumero === 1 ? mazoJ2 : mazoJ1;

  // cargar mi mazo en el índice que me corresponde
  const miIndice    = miNumero - 1;
  const rivalIndice = miNumero === 1 ? 1 : 0;

  game.jugadores[miIndice].mazo    = construirMazo(miMazoData);
  game.jugadores[rivalIndice].mazo = construirMazo(rivalMazoData);

  console.log("Mi mazo cargado: "    + game.jugadores[miIndice].mazo.length    + " cartas");
  console.log("Mazo rival cargado: " + game.jugadores[rivalIndice].mazo.length + " cartas");

  escucharPartida();
  // iniciar manos y mulligan
  game.jugadorActivo = miNumero - 1;
  iniciarMano(game.jugadores[0]);
  iniciarMano(game.jugadores[1]);
  renderMano();
  renderManoRival()
  renderCampo();
}

function construirMazo(mazoData) {
  const todasLasCartas = inicializarCartas(); // carga cartas desde el cartas.js
  let mazo = [];

  mazoData.entries.forEach(entry => {
    let carta = todasLasCartas.find(c => c.info?.id === entry.id);
    if (carta) {
      for (let i = 0; i < entry.qty; i++) {
        mazo.push(Object.assign({}, carta)); // copia independiente de cada carta
      }
    }
  });

  return mazo;
}

// ── LEER PARÁMETROS DE LA URL ─────────────────────────────
function leerParametrosURL() {
  const params = new URLSearchParams(window.location.search);
  const sala   = params.get("sala");
  const jugador = params.get("jugador");

  if (!sala || !jugador) return; // no venimos del lobby, partida local

  salaActual = sala;
  miNumero   = parseInt(jugador);
  modoOnline = true;

  console.log("Partida online detectada. Sala: " + salaActual + " · Jugador: " + miNumero);

  inicializarFirebase();

  // leer los mazos de Firebase y arrancar
  db.ref("partidas/" + salaActual).once("value", function(snap) {
    const sala = snap.val();
    arrancarPartidaOnline(sala.jugador1mazo, sala.jugador2mazo);
  });
}

// ── CONFIRMAR MULLIGAN ONLINE ─────────────────────────────
function confirmarMulliganOnline() {
  db.ref("partidas/" + salaActual + "/mulligan/jugador" + miNumero).set(true);
  log("Esperando a que el rival confirme su mulligan...");

  db.ref("partidas/" + salaActual + "/mulligan").on("value", function(snap) {
    const mulligan = snap.val();
    if (!mulligan) return;

    if (mulligan.jugador1 && mulligan.jugador2) {
      log("¡Ambos jugadores listos! Arrancando partida...");
        game.fase = "saque";        // fase inicial
        game.jugadorActivo = 0;     // J1 siempre empieza
        escucharTurno();            // empezar a escuchar cambios de turno
        escucharFase();             // empezar a escuchar cambios de fase
        escucharManoRival();        // escuchar cambios en mano rival
        escucharEfectos()           // escuchar los efectos que se vayan añadiendo al array
        actualizarFaseUI();         // actualizar el letrero
        renderMano();               // redibujar mano
        renderManoRival()
        renderCampo();              // redibujar campo
    }
  });
}

// ── SINCRONIZAR TURNO ─────────────────────────────────────
function enviarCambioTurno(indice) {
  if (!modoOnline) return; // solo en modo online
  db.ref("partidas/" + salaActual + "/turno").set(indice); // escribir turno en Firebase
}

function escucharTurno() {
  db.ref("partidas/" + salaActual + "/turno").on("value", function(snap) {
    const indice = snap.val(); // índice del jugador activo recibido de Firebase
    if (indice === null) return; // ignorar si no hay dato
    game.jugadorActivo = indice; // actualizar quién es el jugador activo
    actualizarFaseUI();          // actualizar el letrero de fase
    renderMano();                // redibujar la mano
    renderManoRival()
    renderCampo();               // redibujar el campo
  });
}

// ── SINCRONIZAR FASE ──────────────────────────────────────
function enviarFase(fase) {
  if (!modoOnline) return;                               // solo en modo online
  db.ref("partidas/" + salaActual + "/fase").set({       // escribir en Firebase
    nombre: fase,                                        // nombre de la fase
    valorAtaque: game.valorAtaque,                       // valor de ataque actual
    valorDefensa: game.valorDefensa                      // valor de defensa actual
  });
}

function escucharFase() {
  db.ref("partidas/" + salaActual + "/fase").on("value", function(snap) {
    const data = snap.val();                             // datos recibidos de Firebase
    if (!data) return;                                   // ignorar si no hay dato

    game.fase = data.nombre;                             // actualizar fase
    game.valorAtaque = data.valorAtaque;                 // actualizar valor de ataque
    game.valorDefensa = data.valorDefensa;               // actualizar valor de defensa

    actualizarFaseUI();                                  // actualizar letrero
    renderMano();                                        // redibujar mano
    renderManoRival()
    renderCampo();                                       // redibujar campo
  });
}

// ── SINCRONIZAR MANO RIVAL ────────────────────────────────
function enviarCantidadMano() {
  if (!modoOnline) return;                                    // solo en modo online
  const miJugador = game.jugadores[miNumero - 1];            // jugador local
  db.ref("partidas/" + salaActual + "/mano/jugador" + miNumero) // escribir en Firebase
    .set(miJugador.mano.length);                             // número de cartas en mano
}

function escucharManoRival() {
  const rivalNumero = miNumero === 1 ? 2 : 1;               // número del rival
  db.ref("partidas/" + salaActual + "/mano/jugador" + rivalNumero) // escuchar mano rival
    .on("value", function(snap) {
      const cantidad = snap.val();                           // cantidad de cartas del rival
      if (cantidad === null) return;                         // ignorar si no hay dato
      const rivalIndice = miNumero === 1 ? 1 : 0;           // índice del rival
      // simular mano del rival con cartas vacías para el renderManoRival
      game.jugadores[rivalIndice].mano = Array(cantidad).fill({}); // array de X elementos vacíos
      renderManoRival();                                     // redibujar mano rival
    });
}

// ── SINCRONIZAR EFECTOS ACTIVOS ───────────────────────────
function enviarEfectos() {
  if (!modoOnline) return;                                    // solo en modo online
  db.ref("partidas/" + salaActual + "/efectos").set(         // escribir efectos en Firebase
    JSON.stringify(game.efectosActivos)                       // convertir array a string
  );
}

function escucharEfectos() {
  db.ref("partidas/" + salaActual + "/efectos").on("value", function(snap) {
    const data = snap.val();                                  // datos recibidos
    if (!data) return;                                        // ignorar si no hay dato
    game.efectosActivos = JSON.parse(data);                   // convertir string a array
    log("Efectos actualizados: " + game.efectosActivos.map(e => e.tipo).join(", ")); // log
  });
}


// ── BORRAR PARTIDA TERMINADA ──────────────────────────────
function borrarPartida() {
  if (!modoOnline) return;                               // solo en modo online
  db.ref("partidas/" + salaActual).remove()             // borrar la sala de Firebase
    .then(() => console.log("Partida borrada de Firebase ✅")) // confirmación
    .catch(e => console.log("Error al borrar partida: " + e)); // error
}