
// ============================================================================================================ CONFIGURACIÓN
// ── CONFIGURACIÓN FIREBASE ────────────────────────────────
const firebaseConfig = { // conexión a la base BaaS de fire base
  apiKey: "AIzaSyAQyjOIh4dAqb4a05DpV-DvGSQLEt8BvOc",
  authDomain: "hv-tcg.firebaseapp.com",
  databaseURL: "https://hv-tcg.firebaseio.com",
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
  console.log("Firebase connected ✅"); 

  // Detección de conexión WebSocket
  firebase.database().ref(".info/connected").on("value", function(snap) {
    console.log("Firebase connection status:", snap.val() ? "CONNECTED" : "DISCONNECTED");
  });
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

// ============================================================================ CREAR PARTIDA 
async function crearPartida(mazo) { 
  const codigo = generarCodigo();
  salaActual   = codigo;
  miNumero     = 1;
  modoOnline   = true;

  // Buscar si ya existe una sala creada por este jugador
  const snapshot = await db.ref("partidas").orderByChild("jugador1nombre").equalTo(miNombre).once("value");
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      child.ref.remove(); // borrar la sala antigua
    });
  }

  await db.ref("partidas/" + codigo).set({
    estado:         "esperando",
    jugador1listo:  false,
    jugador2listo:  false,
    jugador1mazo:   mazo,
    jugador2mazo:   null,
    jugador1nombre: miNombre,
  });

  console.log("Match created: " + codigo);
  return codigo;
}

// ── UNIRSE A PARTIDA ──────────────────────────────────────
function unirseAPartida(codigo, mazo) {
  salaActual = codigo;
  miNumero   = 2;
  modoOnline = true;

  db.ref("partidas/" + codigo + "/jugador2mazo").set(mazo); // añade el mazo del jugador 2
  db.ref("partidas/" + codigo + "/jugador2nombre").set(miNombre); // nombre del jugador 2
  db.ref("partidas/" + codigo + "/estado").set("completa"); // cambia el estado de la partida

  console.log("Joined the match: " + codigo);

  // esperar un momento y redirigir
    setTimeout(function() {
      window.location.href = "game.html?sala=" + salaActual + "&jugador=" + miNumero;
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

function enviarJugadaReactiva(tipo, datos) {                           // mensajes reactivos independientes
  if (!modoOnline) return;                                             // solo en modo online
  db.ref("partidas/" + salaActual + "/ultimaJugadaReactiva").set({     // nodo separado en Firebase
    tipo: tipo,                                                        // tipo de jugada
    jugador: miNumero,                                                 // quién envía
    timestamp: Date.now(),                                             // marca de tiempo
    ...datos                                                           // datos adicionales
  });
}

// ── ESCUCHAR JUGADAS DEL RIVAL ────────────────────────────
function escucharPartida() {
  console.log("escucharPartida iniciado, miNumero:", miNumero);
  db.ref("partidas/" + salaActual + "/ultimaJugada").on("value", function(snap) { // detecta si últimaJugada ha cambiado y recupera la informacíón
    const jugada = snap.val(); // añadir los datos recibidos en la variable jugada

    if (!jugada)                    return;
    if (jugada.jugador === miNumero) return;

    aplicarJugadaRival(jugada); // aplica la jugada del rival en el tu tablero
  });

  // ================================================================================ APARTADO PARA EL REMATCH
  db.ref("partidas/" + salaActual + "/rematch").on("value", function(snap) {
    const rematch = snap.val();
    if (!rematch) return;

    const rivalNumero = miNumero === 1 ? 2 : 1;

    // el rival quiere rematch — avisamos en el log
    if (rematch["jugador" + rivalNumero] && !rematch["jugador" + miNumero]) {
      logCompartido("log.jugadorQuiereRematch", { jugador: game.jugadores[rivalNumero - 1].nombre });
    }

    // los dos quieren rematch — arrancar nueva partida
    if (rematch.jugador1 && rematch.jugador2) {
      db.ref("partidas/" + salaActual + "/rematch").off();
      if (miNumero === 1) {
        iniciarRematch(); // J1 resetea y redirige
      } else {
        // J2 espera un momento y redirige
        setTimeout(function() {
          window.location.href = "game.html?sala=" + salaActual + "&jugador=" + miNumero;
        }, 2000);
      }
    }
  });
}

function escucharJugadasReactivas() {                                  // listener para jugadas reactivas
  db.ref("partidas/" + salaActual + "/ultimaJugadaReactiva").on("value", function(snap) {
    const jugada = snap.val();                                         // leer datos
    if (!jugada) return;                                               // ignorar si vacío
    if (jugada.jugador === miNumero) return;                           // ignorar si es mío
    console.log("jugadaReactiva recibida:", jugada.tipo);              // debug
    aplicarJugadaReactivaRival(jugada);                                // aplicar jugada reactiva
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
    game.ultimaZonaJugada[rivalIndice] = jugada.zona;     // registrar la última zona en la que ha jugado el rival
    log(t("log.cartaColocadaEn", { 
      jugador: rival.nombre, 
      carta: DESCRIPCIONES[carta.info?.id]?.["nombre_" + idiomaActivo] || carta.nombre, 
      zona: t("ui.zona" + jugada.zona.charAt(0).toUpperCase() + jugada.zona.slice(1)), 
      stat: carta.stats[jugada.zona === "bloqueoApoyo" ? "bloqueo" : jugada.zona] // un apoyo usa su stat de bloqueo
    })); 
    renderCampo();                                        // redibujar campo
    break;

    case "eventoJugado": // ====================================================================== EVENTO JUGADO
      const todasCartasEvento = inicializarCartas();                           // cargar catálogo
      const evento = todasCartasEvento.find(c => c.info?.id === jugada.cartaId); // buscar evento
      if (!evento) return;                                                     // si no existe, ignorar

      const rivalIndiceEvento = miNumero === 1 ? 1 : 0;                       // índice del rival
      const rivalEvento = game.jugadores[rivalIndiceEvento];
      rivalEvento.zonas.eventos.push(evento);                                 // añadir a zona eventos
      mostrarAnimacionEventoRival(evento.info?.id);
      log(t("log.eventoJugado", { 
        jugador: rivalEvento.nombre, 
        carta: DESCRIPCIONES[evento.info?.id]?.["nombre_" + idiomaActivo] || evento.nombre 
      }));
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

      log(t("log.rivalUsaGuts", { 
        jugador: rivalGuts.nombre, 
        zona: t("ui.zona" + jugada.zona.charAt(0).toUpperCase() + jugada.zona.slice(1)) 
      }));
      renderCampo();                                           // redibujar campo
      break;

    case "robarCarta": // ====================================================================== ROBAR CARTA
      const miIndiceRobo = miNumero - 1;                   // índice del jugador local
      robarCarta(game.jugadores[miIndiceRobo], jugada.cantidad); // robar en local
      renderMano();                                        // redibujar mano
      renderManoRival()
      renderCampo();                                       // redibujar campo
      break;

    case "robarHasta6": // ====================================================================== ROBAR HASTA 6
      const miJugadorRobo = game.jugadores[miNumero - 1];    // jugador local
      let necesita = 6 - miJugadorRobo.mano.length;          // cartas que necesita
      if (necesita > 0) {
        robarCarta(miJugadorRobo, necesita);                  // robar hasta 6
      }
      renderMano();                                           // redibujar mano
      renderManoRival()
      break;

    case "perderPunto": // ====================================================================== PERDER PUNTO
      limpiarJugada();
      const rivalIndicePunto = miNumero === 1 ? 1 : 0;       // índice del rival
      const rivalPunto = game.jugadores[rivalIndicePunto];    // jugador rival
      if (rivalPunto.mazoPuntos.length > 0) {
        let carta = rivalPunto.mazoPuntos.shift();            // roba del mazo de puntos
        rivalPunto.mano.push(carta);                          // va a la mano del rival
        log(t("log.pierdeUnPunto", { jugador: rivalPunto.nombre, cantidad: rivalPunto.mazoPuntos.length }));
      }
      actualizarMarcador();                                   // actualizar marcador
      renderMano();                                           // redibujar mano
      renderManoRival()
      renderCampo();                                          // redibujar campo
      break;

    case "concederPunto": // ====================================================================== CONCEDER PUNTO
      limpiarJugada();                                         // limpiar estado de la jugada
      const miIndiceConcede = miNumero - 1;                    // yo gané el punto, yo saco
      game.jugadorActivo = miIndiceConcede;                    // actualizar jugador activo
      game.fase = "saque";                                     // volver a saque

      // robar hasta 6 cartas
      const miJugadorConcede = game.jugadores[miIndiceConcede]; // jugador local
      let necesitaConcede = 6 - miJugadorConcede.mano.length;   // cartas que necesita
      if (necesitaConcede > 0) {
        robarCarta(miJugadorConcede, necesitaConcede);           // robar hasta 6
      }

      actualizarMarcador();                                    // actualizar marcador
      actualizarFaseUI();                                      // actualizar letrero
      renderMano();                                            // redibujar mano
      renderManoRival();                                       // redibujar mano rival
      renderCampo();                                           // redibujar campo
      break;

    case "limpiarBloqueadores": // ========================================================= LIMPIAR BLOQUEADORES
      const rivalIndiceBloq = miNumero === 1 ? 1 : 0;       // índice del rival
      const rivalBloq = game.jugadores[rivalIndiceBloq];     // jugador rival
      rivalBloq.zonas.bloqueoApoyo = [];                     // vaciar zona de apoyo
      game.bloqueoActual = { central: null, apoyos: [] };    // limpiar bloqueo actual
      renderCampo();                                         // redibujar campo
      break;
    
    case "quitarCartaZona": // ================================================================= QUITAR CARTA ZONA
      const rivalIndiceQuitar = miNumero === 1 ? 1 : 0;   // índice del rival
      const rivalQuitar = game.jugadores[rivalIndiceQuitar]; // jugador rival
      const zonaQuitar = jugada.zona;                      // zona de donde sacar

      // si el rival envía la posición exacta y coincide con la carta, se usa esa posición
      // (evita quitar otra copia de la misma carta); si no, se busca por id
      let indexQuitar = (jugada.indice !== undefined &&
          rivalQuitar.zonas[zonaQuitar][jugada.indice]?.info?.id === jugada.cartaId)
        ? jugada.indice                                    // posición exacta enviada por el rival
        : rivalQuitar.zonas[zonaQuitar]                    // coincidencia por id
            .findIndex(c => c.info?.id === jugada.cartaId);

      if (indexQuitar !== -1) {
        rivalQuitar.zonas[zonaQuitar].splice(indexQuitar, 1); // sacar de la zona
      }
      renderCampo();                                       // redibujar campo
      break;

    case "cartaMovida":
      const rivalIndiceMovida = miNumero === 1 ? 1 : 0;
      const rivalMovida = game.jugadores[rivalIndiceMovida];
      const zonaMovida = jugada.zona;

      const indexMovida = rivalMovida.zonas[zonaMovida]
        .findIndex(c => c.info?.id === jugada.cartaId);
      if (indexMovida !== -1) {
        let carta = rivalMovida.zonas[zonaMovida]
          .splice(indexMovida, 1)[0];
        if (jugada.posicion === "guts") {                        // si va al GUTS
          rivalMovida.zonas[zonaMovida].unshift(carta);          // poner al inicio
          carta.recienJugada = false;                            // ya no es recién jugada
        } else {                                                 // si va al frente
          rivalMovida.zonas[zonaMovida].push(carta);             // poner al final
          carta.recienJugada = true;                             // marcar como recién jugada
        }
      }
      renderCampo();
      break;

    case "habilidadDesdeMano": // ================================================================= HABILIDAD DESDE MANO
      const rivalIndiceHab = miNumero === 1 ? 1 : 0;            // índice del rival
      const rivalHab = game.jugadores[rivalIndiceHab];           // jugador rival
      const todasHab = inicializarCartas();                      // cargar catálogo
      const cartaHab = todasHab.find(c => c.info?.id === jugada.cartaId); // buscar carta
      if (!cartaHab) return;

      // sacar carta de la mano del rival
      const indexHab = rivalHab.mano.findIndex(c => c.info?.id === jugada.cartaId);
      if (indexHab !== -1) rivalHab.mano.splice(indexHab, 1);   // sacar de la mano
      rivalHab.trash.push(cartaHab);                             // enviar al trash

      renderCampo();                                             // redibujar campo
      break;

    case "pedirDescarte": // ========================================================= PEDIR DESCARTE (OIKAWA)
      const miJugadorDescarte = game.jugadores[miNumero - 1];              // jugador local (el que descarta)
      if (miJugadorDescarte.mano.length === 0) {                           // si no tiene cartas
        log(t("log.sinCartasParaDescartar"));
        db.ref("partidas/" + salaActual + "/confirmacionDescarte").set({   // responder igualmente para no dejar colgado al rival
          jugador: miNumero,                                               // quién responde
          cartaId: null                                                    // sin carta descartada
        });
        break;
      }
      mostrarSelectorCartas(                                               // abrir selector obligatorio
        t("log.descarteForzado"),                                          // título traducido
        miJugadorDescarte.mano                                             // toda la mano
      ).then(cartaElegida => {                                             // cuando elige
        if (!cartaElegida) return;                                         // no debería cancelarse (selector obligatorio)

        let index = miJugadorDescarte.mano.indexOf(cartaElegida);         // buscar en la mano
        miJugadorDescarte.mano.splice(index, 1);                          // sacar de la mano
        miJugadorDescarte.trash.push(cartaElegida);                       // enviar al trash
        log(t("log.descartaPorEfecto", { jugador: miJugadorDescarte.nombre, carta: cartaElegida.nombre }));

        enviarTrash(miJugadorDescarte);                                   // sincronizar trash antes de confirmar
        db.ref("partidas/" + salaActual + "/confirmacionDescarte").set({  // confirmar al rival
          jugador: miNumero,                                              // quién responde
          cartaId: cartaElegida.info?.id                                  // carta descartada
        });

        renderMano();                                                     // actualizar mano
        renderManoRival();                                                // actualizar mano rival
        renderCampo();                                                    // actualizar campo
      });
      break;

    case "cartaDescartadaRival": // ============================================= CARTA DESCARTADA
      break; // gestionado por el Promise en forzarDescarteRival
// =============================================================================================== PEDIR DESCARTE DE EVENTO >
  case "pedirEventoVoluntario": // ======================================= PEDIR EVENTO VOLUNTARIO
    const miJugadorEvento = game.jugadores[miNumero - 1];                // jugador local
    const eventosEnMano = miJugadorEvento.mano.filter(                   // filtrar eventos en mano
      c => c.info?.tipo === "evento"
    );

    if (eventosEnMano.length === 0) {                                    // si no tiene eventos
      db.ref("partidas/" + salaActual + "/confirmacionEvento").set({
        jugador: miNumero,
        tipo: "eventoRechazado"
      });
      break;
    }

    mostrarEleccion([                                                    // preguntar al jugador local
      { texto: t("log.colocarEventoZona") },
      { texto: t("log.noColocar") }
    ]).then(async eleccion => {                                          // cuando elige
      if (eleccion === 0) {                                              // si quiere colocar
        let eventoElegido = await mostrarSelectorCartas(                 // abrir selector
          t("log.elegirEventoColocar"),
          eventosEnMano
        );
        if (!eventoElegido) {                                            // si cancela
          db.ref("partidas/" + salaActual + "/confirmacionEvento").set({
            jugador: miNumero,
            tipo: "eventoRechazado"
          });
          return;
        }
        let index = miJugadorEvento.mano.indexOf(eventoElegido);        // buscar en la mano
        miJugadorEvento.mano.splice(index, 1);                          // sacar de la mano
        miJugadorEvento.zonas.eventos.push(eventoElegido);              // colocar en zona de eventos
        eventoElegido.zonaActual = "eventos";                           // actualizar zona
        log(t("log.eventoColocadoEnZona", { carta: eventoElegido.nombre }));
        db.ref("partidas/" + salaActual + "/confirmacionEvento").set({ 
          jugador: miNumero,
          tipo: "eventoColocadoVoluntario",
          cartaId: eventoElegido.info?.id
        });
        enviarCantidadMano();                                            // sincronizar mano
        renderMano();                                                    // actualizar mano
        renderManoRival();                                               // actualizar mano rival
        renderCampo();                                                   // actualizar campo
      } else {                                                           // si no quiere colocar
        db.ref("partidas/" + salaActual + "/confirmacionEvento").set({
          jugador: miNumero,
          tipo: "eventoRechazado"
        });
      }
    });
    break;

  case "eventoColocadoVoluntario": // ==================================== EVENTO COLOCADO VOLUNTARIO
    const rivalIndiceEventoVol = miNumero === 1 ? 1 : 0;                // índice del rival
    const rivalEventoVol = game.jugadores[rivalIndiceEventoVol];        // jugador rival
    const todasCartasEventoVol = inicializarCartas();                   // cargar catálogo
    const eventoVol = todasCartasEventoVol.find(                        // buscar evento por id
      c => c.info?.id === jugada.cartaId
    );
    if (eventoVol) {                                                     // si se encontró
      rivalEventoVol.zonas.eventos.push(eventoVol);                     // colocar en zona de eventos
      log(t("log.rivalColocaEventoEnZona", { jugador: rivalEventoVol.nombre, carta: eventoVol.nombre })); // usar rivalEventoVol, no rival (rival no existe en este case)
    }
    renderCampo();                                                       // actualizar campo
    break;

  case "eventoRechazado": // ============================================= EVENTO RECHAZADO
    break; // gestionado por el Promise de la habilidad de Yamaguchi
// =============================================================================================== PEDIR DESCARTE DE EVENTO <

    case "resetearManoRival": // ====================================================== RESETEAR MANO RIVAL (OIKAWA P01-034, PR-024)
      const miJugadorReset = game.jugadores[miNumero - 1];               // jugador local (el que resetea)
      const cantidadReset = jugada.cantidad ?? 6;                        // cartas a robar (6 por defecto, como P01-034)
      miJugadorReset.mazo.push(...miJugadorReset.mano);                  // devolver mano al mazo
      miJugadorReset.mano = [];                                          // vaciar mano
      barajarMazo(miJugadorReset);                                       // barajar mazo
      log(t("log.efectoRivalDevuelveMano"));
      robarCarta(miJugadorReset, cantidadReset);                         // robar las cartas indicadas
      enviarCantidadMano();                                              // sincronizar cantidad de mano
      enviarMazo();                                                      // sincronizar mazo
      renderMano();                                                      // actualizar mano
      renderManoRival();                                                 // actualizar mano rival
      renderCampo();                                                     // actualizar campo
      break;

    case "pedirTrashearGuts": // ========================================= PEDIR TRASHEAR GUTS
      const miJugadorTrashear = game.jugadores[miNumero - 1];
      const zonaTrashear = jugada.zona;
      jugada.cartasIds.forEach(id => {
        let index = miJugadorTrashear.zonas[zonaTrashear].findIndex(c => c.info?.id === id);
        if (index !== -1) {
          let carta = miJugadorTrashear.zonas[zonaTrashear].splice(index, 1)[0];
          miJugadorTrashear.trash.push(carta);
          log(t("log.cartaTrasheadaPorEfectoRival", { 
            carta: DESCRIPCIONES[carta.info?.id]?.["nombre_" + idiomaActivo] || carta.nombre, 
            zona: t("ui.zona" + zonaTrashear.charAt(0).toUpperCase() + zonaTrashear.slice(1)) 
          }));
        }
      });

      db.ref("partidas/" + salaActual + "/confirmacionGuts").set({
        jugador: miNumero,                                               // quién responde
        zona: zonaTrashear,                                             // zona trasheada
        cartasIds: jugada.cartasIds                                     // ids de las cartas
      });
      if (modoOnline) enviarTrash(miJugadorTrashear);

      if (zonaTrashear === "eventos") {           // mismo fix preventivo
        enviarEventos(miJugadorTrashear);
      }

      renderCampo();
      break;

    case "gutsRivalTrasheado": // ============================================ CONFIRMACIÓN TRASHEO
      break; // gestionado por el Promise en trashearGutsZonaRival

    case "cartaMovidaEntreGuts": // ========================================= CARTA MOVIDA ENTRE GUTS
      const rivalIndiceGutsGuts = miNumero === 1 ? 1 : 0;                      // índice del rival
      const rivalGutsGuts = game.jugadores[rivalIndiceGutsGuts];               // jugador rival

      const indexGutsGuts = rivalGutsGuts.zonas[jugada.zonaOrigen]             // buscar en la zona de origen
        .findIndex(c => c.info?.id === jugada.cartaId);
      if (indexGutsGuts !== -1) {                                              // si se encuentra
        let carta = rivalGutsGuts.zonas[jugada.zonaOrigen].splice(indexGutsGuts, 1)[0]; // sacar de origen
        carta.zonaActual = jugada.zonaDestino;                                 // actualizar zona
        carta.recienJugada = false;                                            // sigue siendo GUTS
        rivalGutsGuts.zonas[jugada.zonaDestino].unshift(carta);                // añadir al GUTS de destino
      }
      renderCampo();                                                           // actualizar campo
      break;

    case "cartaDesdeManoAGuts": // ========================================= CARTA DE MANO A GUTS
      const todasLasCartasManoGuts = inicializarCartas();                     // cargar catálogo
      const cartaManoGuts = todasLasCartasManoGuts.find(c => c.info?.id === jugada.cartaId); // buscar carta
      if (!cartaManoGuts) return;                                            // si no existe, ignorar

      const rivalIndiceManoGuts = miNumero === 1 ? 1 : 0;                    // índice del rival
      const rivalManoGuts = game.jugadores[rivalIndiceManoGuts];             // jugador rival

      cartaManoGuts.zonaActual = jugada.zona;                                // zona destino
      cartaManoGuts.recienJugada = false;                                    // entra como GUTS
      rivalManoGuts.zonas[jugada.zona].push(cartaManoGuts);              // añadir al GUTS

      log(t("log.cartaAlGuts", { carta: cartaManoGuts.nombre, zona: t("ui.zona" + jugada.zona.charAt(0).toUpperCase() + jugada.zona.slice(1)) })); 
      renderCampo();                                                         // actualizar campo
      break;

    case "pedirMoverAFondoMazo":
      const miJugadorFondoMazo = game.jugadores[miNumero - 1];
      const zonaFondoMazo = jugada.zona;
      const indexFondoMazo = miJugadorFondoMazo.zonas[zonaFondoMazo]
        .findIndex(c => c.info?.id === jugada.cartaId);
      if (indexFondoMazo !== -1) {
        let carta = miJugadorFondoMazo.zonas[zonaFondoMazo].splice(indexFondoMazo, 1)[0];
        miJugadorFondoMazo.mazo.push(carta);
        log(t("log.cartaAlFondoMazoPorEfectoRival", { 
          carta: DESCRIPCIONES[carta.info?.id]?.["nombre_" + idiomaActivo] || carta.nombre 
        }));
      }

      // confirmar al rival usando ruta separada
      db.ref("partidas/" + salaActual + "/confirmacionMoverMazo").set({
        jugador: miNumero,
        zona: zonaFondoMazo,
        cartaId: jugada.cartaId
      });

      if (modoOnline) enviarMazo();                                          // sincronizar conteo de mazo

      if (zonaFondoMazo === "eventos") {                                     // si es zona de eventos
        enviarEventos(miJugadorFondoMazo);                                   // sincronizar eventos
      }

      renderCampo();
      break;

    case "cartaMovidaAFondoMazo":
      break; // ya no se usa, gestionado por confirmacionMoverMazo

    case "notificarLogRival": // ================================================================ LOG ENVIADO POR EL RIVAL
      if (jugada.clave) {                                           // si llega una clave de traducción
        log(t(jugada.clave, traducirParamsCartas(jugada.params || {}))); // traducir nombres y texto en el idioma de este cliente
      } else if (jugada.texto) {                                    // si llega un texto ya escrito
        log(jugada.texto);                                          // mostrarlo tal cual
      }
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

function aplicarJugadaReactivaRival(jugada) {                          // aplicar jugada reactiva del rival
  switch (jugada.tipo) {
    case "robarCartaReactivo":                                         // robar carta reactivo
      const miJugadorReactivo = game.jugadores[miNumero - 1];          // jugador local
      robarCarta(miJugadorReactivo, jugada.cantidad);                  // robar en local
      log(t("log.robarPorEfectoReactivo", { cantidad: jugada.cantidad }));
      renderMano();                                                    // actualizar mano
      renderManoRival();                                               // actualizar mano rival
      renderCampo();                                                   // actualizar campo
      break;
    default:
      console.log("Jugada reactiva desconocida:", jugada.tipo);
  }
}

// ============================================================================================================ INICIAR PARTIDA
// ── ESCUCHAR ESTADO DE LA SALA ────────────────────────────
function escucharSala() {
  db.ref("partidas/" + salaActual + "/estado").on("value", function(snap) {
    const estado = snap.val();

    if (estado === "completa") {
      console.log("Opponent found! Launching game...");
      db.ref("partidas/" + salaActual).once("value", function(snap) {
        const sala = snap.val();
        const miIndice = miNumero - 1;
        
        // redirigir a game.html con los parámetros de la partida
        window.location.href = "game.html?sala=" + salaActual + "&jugador=" + miNumero;
      });
    }
  });
}

// ── ARRANCAR PARTIDA Y CREAR MAZOS ────────────────────────────
function arrancarPartidaOnline(mazoJ1, mazoJ2, nombreJ1, nombreJ2) {
  const miMazoData    = miNumero === 1 ? mazoJ1 : mazoJ2;
  const rivalMazoData = miNumero === 1 ? mazoJ2 : mazoJ1;

  // cargar mi mazo en el índice que me corresponde
  const miIndice    = miNumero - 1;
  const rivalIndice = miNumero === 1 ? 1 : 0;

  game.jugadores[miIndice].mazo    = construirMazo(miMazoData);
  game.jugadores[rivalIndice].mazo = construirMazo(rivalMazoData);
  // asignar nombres a los jugadores
  game.jugadores[0].nombre = nombreJ1 || "Jugador 1"; // nombre J1
  game.jugadores[1].nombre = nombreJ2 || "Jugador 2"; // nombre J2

  console.log("Starting game — J1 deck:", mazoJ1?.entries?.length, "J2 deck:", mazoJ2?.entries?.length);

  escucharPartida();
  iniciarSorteo();                                             // iniciar sorteo antes del mulligan
  renderManoRival()

  // borrar sala si el jugador 1 se desconecta durante la partida
  if (miNumero === 1) {
    db.ref("partidas/" + salaActual).onDisconnect().remove(); // borrar sala al desconectarse
  }

  vigilarPresenciaRival();
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
  // barajar el mazo
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // posición aleatoria
    [mazo[i], mazo[j]] = [mazo[j], mazo[i]];       // intercambiar
  }
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
    if (!sala) {                                               // si la sala no existe
      alert(t("ui.partidaNoExiste")); 
      window.location.href = "lobby.html";                     // volver al lobby
      return;
    }
    arrancarPartidaOnline(sala.jugador1mazo, sala.jugador2mazo, sala.jugador1nombre, sala.jugador2nombre);
  });
}

// ==================================================================== DETECTAR SI EL RIVAL ABANDONA
// ==================================================================================================
const SEGUNDOS_GRACIA_ABANDONO = 8;   // margen antes de dar la victoria por abandono

function vigilarPresenciaRival() {
  const miRef = db.ref("partidas/" + salaActual + "/presencia/jugador" + miNumero);

  // cada vez que me (re)conecto a Firebase: marco que estoy aquí y programo el borrado si me desconecto
  db.ref(".info/connected").on("value", function(snap) {
    if (snap.val() !== true) return;
    miRef.onDisconnect().remove();
    miRef.set(true);
  });

  const rivalNumero = miNumero === 1 ? 2 : 1;
  let rivalVisto = false;               // evita falsos avisos antes de que el rival entre
  let temporizador = null;              // cuenta atrás de abandono

  db.ref("partidas/" + salaActual + "/presencia/jugador" + rivalNumero).on("value", function(snap) {
    if (snap.val()) {                                   // el rival está conectado
      rivalVisto = true;
      if (temporizador) {                               // estaba en cuenta atrás: ha vuelto a tiempo
        clearTimeout(temporizador);
        temporizador = null;
        log(t("log.rivalVuelve"));
      }
      return;
    }
    if (!rivalVisto || partidaTerminada || temporizador) return;   // nada que vigilar, o ya hay cuenta atrás

    log(t("log.rivalDesconectado", { segundos: SEGUNDOS_GRACIA_ABANDONO }));
    temporizador = setTimeout(function() {
      temporizador = null;
      if (partidaTerminada) return;                     // la partida acabó mientras tanto
      log(t("log.rivalAbandona"));
      mostrarFinPartida(true);                          // gano por abandono (y suena finpartido)
    }, SEGUNDOS_GRACIA_ABANDONO * 1000);
  });
}

// ── CONFIRMAR MULLIGAN ONLINE ─────────────────────────────
function confirmarMulliganOnline() {
  db.ref("partidas/" + salaActual + "/mulligan/jugador" + miNumero).set(true);
  log(t("log.esperandoMulliganRival"));

  db.ref("partidas/" + salaActual + "/mulligan").on("value", function(snap) {
    const mulligan = snap.val();
    if (!mulligan) return;

    if (mulligan.jugador1 && mulligan.jugador2) {
      log(t("log.ambosListos"));
        game.fase = "saque";        // fase inicial
        // game.jugadorActivo = 0;     // el jugador activo ya se decide por sorteo
        document.getElementById("btn-confirmar-mulligan").disabled = false; // desbloquear boton mulligan por si acaso
        escucharTurno();            // empezar a escuchar cambios de turno
        escucharFase();             // empezar a escuchar cambios de fase
        escucharManoRival();        // escuchar cambios en mano rival
        escucharEfectos()           // escuchar los efectos que se vayan añadiendo al array
        escucharTrashRival()        // escuchar los cambios de cartas en el trash
        escucharEventosRival();
        escucharMazoPuntosRival()   // escuchar los cambios de el mazo de puntos
        escucharMazoRival()         // escuchar los cambios de el mazo del rival
        escucharJugadasReactivas(); // escuchar jugadas reactivas
        iniciarChat(); 
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
  console.log("Enviando fase:", fase);                       // debug
  db.ref("partidas/" + salaActual + "/fase").set({       // escribir en Firebase
    nombre: fase,                                        // nombre de la fase
    valorAtaque: game.valorAtaque,                       // valor de ataque actual
    valorDefensa: game.valorDefensa,                     // valor de defensa actual
    faseAnterior: game.faseAnterior                      // fase anterior (para "si el rival acaba de sacar", etc.)
  });
}

function escucharFase() {
  db.ref("partidas/" + salaActual + "/fase").on("value", function(snap) {
    const data = snap.val();                             // datos recibidos de Firebase
    if (!data) return;                                   // ignorar si no hay dato
        console.log("Fase recibida:", data.nombre);              // debug
    game.fase = data.nombre;                             // actualizar fase
    game.valorAtaque = data.valorAtaque;                 // actualizar valor de ataque
    game.valorDefensa = data.valorDefensa;               // actualizar valor de defensa
    if (data.faseAnterior !== undefined) game.faseAnterior = data.faseAnterior; // sincronizar fase anterior (si viene)
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
    JSON.stringify({ efectos: game.efectosActivos, turno: game.turno }) // convertir array a string
  );
}

function escucharEfectos() {
  db.ref("partidas/" + salaActual + "/efectos").on("value", function(snap) {
    const data = snap.val();
    if (!data) return;
    const parsed = JSON.parse(data);
    game.efectosActivos = parsed.efectos;                              // actualizar efectos
    game.turno = parsed.turno;                                         // sincronizar turno
  });
}

// ── SINCRONIZAR TRASH ─────────────────────────────────────
function enviarTrash(jugador) {
  if (!modoOnline) return;                                    // solo en modo online
  const miIndice = miNumero - 1;                             // índice del jugador local
  if (jugador !== game.jugadores[miIndice]) return;          // solo si es el jugador local
  
  db.ref("partidas/" + salaActual + "/trash/jugador" + miNumero).set(
    jugador.trash.map(c => c.info?.id || null)               // array de IDs del trash
  );
}

function escucharTrashRival() {
  const rivalNumero = miNumero === 1 ? 2 : 1;               // número del rival
  const rivalIndice = miNumero === 1 ? 1 : 0;               // índice del rival
  
  db.ref("partidas/" + salaActual + "/trash/jugador" + rivalNumero).on("value", function(snap) {
    const ids = snap.val();                                   // ids del trash del rival
    if (!ids) return;                                         // ignorar si no hay dato
    
    const todasLasCartas = inicializarCartas();               // cargar catálogo
    game.jugadores[rivalIndice].trash = ids                  // reconstruir trash del rival
      .filter(id => id)                                       // filtrar nulls
      .map(id => todasLasCartas.find(c => c.info?.id === id)) // buscar carta por id
      .filter(c => c);                                        // filtrar no encontradas
    
    renderCampo();                                            // redibujar campo
  });
}

// ── SINCRONIZAR EVENTOS ─────────────────────────────────────
function enviarEventos(jugador) {
  if (!modoOnline) return;
  const miIndice = miNumero - 1;
  if (jugador !== game.jugadores[miIndice]) return;

  db.ref("partidas/" + salaActual + "/eventos/jugador" + miNumero).set(
    jugador.zonas.eventos.map(c => c.info?.id || null)
  );
}

function escucharEventosRival() {
  const rivalNumero = miNumero === 1 ? 2 : 1;
  const rivalIndice = miNumero === 1 ? 1 : 0;

  db.ref("partidas/" + salaActual + "/eventos/jugador" + rivalNumero).on("value", function(snap) {
    const ids = snap.val();
    if (!ids) return;

    const todasLasCartas = inicializarCartas();
    game.jugadores[rivalIndice].zonas.eventos = ids
      .filter(id => id)
      .map(id => todasLasCartas.find(c => c.info?.id === id))
      .filter(c => c);

    renderCampo();
  });
}

// ==================================================================== ANIMACIÓN EVENTO RIVAL
function mostrarAnimacionEventoRival(idCarta) {
  if (!idCarta) return;                                           // comprobar que el ID existe

  const overlay = document.createElement("div");                  // Crear el overlay
  overlay.id = "overlay-evento-rival";
  overlay.classList.add("evento-rival-overlay");

  const img = document.createElement("img");
  img.src = `img/cartas/${idCarta}.png`; 
  img.classList.add("evento-rival-img");

  const label = document.createElement("div");
  label.classList.add("evento-rival-label");
  label.textContent = DESCRIPCIONES[idCarta]?.["nombre_" + idiomaActivo] || idCarta;

  const titulo = document.createElement("div");
  titulo.classList.add("evento-rival-titulo");
  titulo.textContent = t("ui.rivalJuegaEvento");

  const lineaGorda = document.createElement("div");
  lineaGorda.classList.add("evento-rival-linea-gorda");

  const lineaFina = document.createElement("div");
  lineaFina.classList.add("evento-rival-linea-fina");

  overlay.appendChild(lineaGorda);
  overlay.appendChild(lineaFina);
  overlay.appendChild(titulo);
  overlay.appendChild(img);
  overlay.appendChild(label);
  document.body.appendChild(overlay);

  setTimeout(() => overlay.remove(), 3000);                        // Eliminar tras 3 segundos
}

// ── SINCRONIZAR MAZO DE PUNTOS ────────────────────────────
function enviarMazoPuntos() {
  if (!modoOnline) return;                                    // solo en modo online
  const miJugador = game.jugadores[miNumero - 1];            // jugador local
  db.ref("partidas/" + salaActual + "/mazoPuntos/jugador" + miNumero)
    .set(miJugador.mazoPuntos.length);                       // número de cartas en mazoPuntos
}

let puntosRivalAnterior = null;
function escucharMazoPuntosRival() {
  const rivalNumero = miNumero === 1 ? 2 : 1;               // número del rival
  const rivalIndice = miNumero === 1 ? 1 : 0;               // índice del rival

  db.ref("partidas/" + salaActual + "/mazoPuntos/jugador" + rivalNumero).on("value", function(snap) {
    const cantidad = snap.val();                             // cantidad de cartas del rival
    if (cantidad === null) return;                           // ignorar si no hay dato
    console.log("mazoPuntos rival:", puntosRivalAnterior, "→", cantidad);
    // si el rival tiene menos que antes, ha perdido un punto: lo he ganado yo
    if (puntosRivalAnterior !== null && cantidad < puntosRivalAnterior) reproducirFinPartido();  
    puntosRivalAnterior = cantidad;     

    game.jugadores[rivalIndice].mazoPuntos = Array(cantidad).fill({}); // simular mazoPuntos
    actualizarMarcador();                                    // actualizar marcador
    renderCampo();                                           // redibujar campo
  });
}

// ── SINCRONIZAR MAZO ─────────────────────────────────────
function enviarMazo() {
  if (!modoOnline) return;                                    // solo en modo online
  const miJugador = game.jugadores[miNumero - 1];            // jugador local
  db.ref("partidas/" + salaActual + "/mazo/jugador" + miNumero)
    .set(miJugador.mazo.length);                             // número de cartas en mazo
}

function escucharMazoRival() {
  const rivalNumero = miNumero === 1 ? 2 : 1;               // número del rival
  const rivalIndice = miNumero === 1 ? 1 : 0;               // índice del rival

  db.ref("partidas/" + salaActual + "/mazo/jugador" + rivalNumero).on("value", function(snap) {
    const cantidad = snap.val();                             // cantidad de cartas del rival
    if (cantidad === null) return;                           // ignorar si no hay dato
    game.jugadores[rivalIndice].mazo = Array(cantidad).fill({}); // simular mazo
    renderCampo();                                           // redibujar campo
  });
}

// ── BORRAR PARTIDA TERMINADA ──────────────────────────────
function borrarPartida() {
  if (!modoOnline) return;                               // solo en modo online
  db.ref("partidas/" + salaActual).remove()             // borrar la sala de Firebase
    .then(() => console.log("Match deleted from Firebase.")) // confirmación
    .catch(e => console.log("Error deleting match " + e)); // error
}

// ================================================================================== PEDIR REMATCH 
// ================================================================================================
function pedirRematch() {
  db.ref("partidas/" + salaActual + "/rematch/jugador" + miNumero).set(true);       // escribir en Firebase que este jugador quiere rematch
  document.getElementById("btn-rematch").disabled = true;                           // deshabilitar el botón para que no pueda pulsar dos veces
}
function iniciarRematch() {
  if (miNumero !== 1) return;

  db.ref("partidas/" + salaActual).once("value", function(snap) {
    const sala = snap.val();

    db.ref("partidas/" + salaActual).set({
      estado:         "jugando",
      jugador1listo:  false,
      jugador2listo:  false,
      jugador1mazo:   sala.jugador1mazo,
      jugador2mazo:   sala.jugador2mazo,
      jugador1nombre: sala.jugador1nombre,
      jugador2nombre: sala.jugador2nombre,
    }).then(() => {
      // cancelar el onDisconnect antes de redirigir
      db.ref("partidas/" + salaActual).onDisconnect().cancel();
      window.location.href = "game.html?sala=" + salaActual + "&jugador=" + miNumero;
    });
  });
}

// ================================================================================= SORTEO INICIAL 
// ================================================================================================
function iniciarSorteo() {
  console.log("Starting coin flip, myNumber:", miNumero, "room:", salaActual);
  document.getElementById("btn-confirmar-mulligan").style.display = "none";
  const miNumeroSorteo = Math.random();
  db.ref("partidas/" + salaActual + "/sorteo/jugador" + miNumero).set(miNumeroSorteo);

  db.ref("partidas/" + salaActual + "/sorteo").on("value", async function(snap) {
    const sorteo = snap.val();
    console.log("Coin flip received:", JSON.stringify(sorteo));

    if (!sorteo || !sorteo.jugador1 || !sorteo.jugador2) return;

    // desactivar listener
    db.ref("partidas/" + salaActual + "/sorteo").off();
    reproducirHinchada();

    const miPuntuacion = sorteo["jugador" + miNumero];                          // mi puntuación
    const rivalPuntuacion = sorteo["jugador" + (miNumero === 1 ? 2 : 1)];       // puntuación rival
    const yoGano = miPuntuacion > rivalPuntuacion ||                             // gano si tengo más
      (miPuntuacion === rivalPuntuacion && miNumero === 1);                      // empate: gana J1
    console.log("I win:", yoGano, "myScore:", miPuntuacion, "rivalScore:", rivalPuntuacion);

    if (yoGano) {
      log(t("log.ganadoSorteo"));
      let eleccion = await mostrarEleccion([
        { texto: t("log.yoSaquePrimero") },
        { texto: t("log.rivalSaquePrimero") }
      ]);

      const miIndice = miNumero - 1;
      const rivalIndice = miNumero === 1 ? 1 : 0;
      const j1Saca = eleccion === 0 ? miIndice : rivalIndice;
      db.ref("partidas/" + salaActual + "/sorteo/j1Saca").set(j1Saca);

      db.ref("partidas/" + salaActual + "/sorteo/j1Saca").on("value", function(snap2) {
        const j1Saca = snap2.val();
        if (j1Saca === null) return;
        db.ref("partidas/" + salaActual + "/sorteo/j1Saca").off();
        arrancarMulligan(j1Saca);
      });

    } else {
      log(t("log.rivalGanoSorteo"));

      db.ref("partidas/" + salaActual + "/sorteo/j1Saca").on("value", function(snap2) {
        const j1Saca = snap2.val();
        if (j1Saca === null) return;
        db.ref("partidas/" + salaActual + "/sorteo/j1Saca").off();
        arrancarMulligan(j1Saca);
      });
    }
  });
}

function arrancarMulligan(indicePrimerSacador) {
  document.getElementById("btn-confirmar-mulligan").style.display = "block"; // mostrar botón
  game.jugadorActivo = indicePrimerSacador;                  // el que saca primero
  iniciarMano(game.jugadores[0]);                            // repartir mano al jugador 0
  iniciarMano(game.jugadores[1]);                            // repartir mano al jugador 1
  log(t("log.partidaIniciada", { jugador: game.jugadores[indicePrimerSacador].nombre }));
  renderMano();
  renderCampo();
}

// ============================================================================= CHAT
function iniciarChat() {
  if (!modoOnline) return;                                   // solo en modo online
  document.getElementById("chat-modo-solo").style.display = "none";

  const input    = document.getElementById("chat-input");    // campo de texto
  const boton    = document.getElementById("chat-send");     // botón enviar
  const mensajes = document.getElementById("chat-messages"); // contenedor de mensajes

  // aplicar textos traducidos
  input.placeholder = t("ui.chatPlaceholder");
  boton.textContent  = t("ui.chatEnviar");

  // enviar mensaje a Firebase
  function enviarMensaje() {
    const texto = input.value.trim();                         // leer y limpiar el texto
    if (!texto) return;                                       // ignorar si está vacío
    db.ref("partidas/" + salaActual + "/chat").push({         // añadir mensaje a Firebase
      jugador: miNumero,                                      // quién lo envía
      texto:   texto,                                         // contenido
      ts:      Date.now()                                     // marca de tiempo
    });
    input.value = "";                                         // limpiar el input
  }

  boton.addEventListener("click", enviarMensaje);            // enviar al pulsar botón
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") enviarMensaje();                  // enviar al pulsar Enter
  });

  // escuchar mensajes nuevos en tiempo real
  db.ref("partidas/" + salaActual + "/chat").on("child_added", function(snap) {
    const msg  = snap.val();                                  // datos del mensaje
    const esMio = msg.jugador === miNumero;                   // ¿lo he enviado yo?

    const div = document.createElement("div");                // crear elemento visual
    div.textContent = msg.texto;
    div.classList.add(esMio ? "chat-mio" : "chat-rival");
    div.style.cssText =
      "padding:2px 6px; border-radius:4px;" +
      "background: rgba(0,0,0,0.07);" +
      "align-self:" + (esMio ? "flex-end" : "flex-start") + ";" +
      "max-width:90%; word-break:break-word;";

    mensajes.appendChild(div);                               // añadir al contenedor
    mensajes.scrollTop = mensajes.scrollHeight;              // scroll al último mensaje
  });
}