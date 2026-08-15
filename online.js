
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
    jugador1nombre: miNombre, // nombre del jugador 1
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
  db.ref("partidas/" + codigo + "/jugador2nombre").set(miNombre); // nombre del jugador 2
  db.ref("partidas/" + codigo + "/estado").set("completa"); // cambia el estado de la partida

  console.log("Unido a la partida: " + codigo);

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
      const rivalIndicePunto = miNumero === 1 ? 1 : 0;       // índice del rival
      const rivalPunto = game.jugadores[rivalIndicePunto];    // jugador rival
      if (rivalPunto.mazoPuntos.length > 0) {
        let carta = rivalPunto.mazoPuntos.shift();            // roba del mazo de puntos
        rivalPunto.mano.push(carta);                          // va a la mano del rival
        log("Rival pierde un punto. Le quedan " + rivalPunto.mazoPuntos.length);
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
      const indexQuitar = rivalQuitar.zonas[zonaQuitar]    // buscar carta por id
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
        log("No tienes cartas para descartar.");
        return;
      }
      mostrarSelectorCartas(                                               // abrir selector obligatorio
        "Descarte forzado: debes descartar 1 carta de tu mano:",             
        miJugadorDescarte.mano                                             // toda la mano
      ).then(cartaElegida => {                                             // cuando elige
        if (!cartaElegida) return;                                         // no debería cancelarse

        let index = miJugadorDescarte.mano.indexOf(cartaElegida);         // buscar en la mano
        miJugadorDescarte.mano.splice(index, 1);                          // sacar de la mano
        miJugadorDescarte.trash.push(cartaElegida);                       // enviar al trash
        log("Descartaste " + cartaElegida.nombre + " por el efecto rival.");

        enviarJugada("cartaDescartadaRival", {                            // avisar al rival
          cartaId: cartaElegida.info?.id                                   // id de la carta descartada
        });

        if (modoOnline) enviarTrash(miJugadorDescarte);                   // sincronizar trash

        renderMano();                                                      // actualizar mano
        renderManoRival();                                                  // actualizar mano rival
        renderCampo();                                                      // actualizar campo
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
      enviarJugada("eventoRechazado", {});                               // avisar que no puede colocar
      break;
    }

    mostrarEleccion([                                                    // preguntar al jugador local
      { texto: "Colocar 1 carta de evento en tu zona de eventos." },
      { texto: "No colocar" }
    ]).then(async eleccion => {                                          // cuando elige
      if (eleccion === 0) {                                              // si quiere colocar
        let eventoElegido = await mostrarSelectorCartas(                 // abrir selector
          "Elige un evento de tu mano para colocar en tu zona de eventos:",
          eventosEnMano
        );
        if (!eventoElegido) {                                            // si cancela
          enviarJugada("eventoRechazado", {});                           // avisar que rechazó
          return;
        }
        let index = miJugadorEvento.mano.indexOf(eventoElegido);        // buscar en la mano
        miJugadorEvento.mano.splice(index, 1);                          // sacar de la mano
        miJugadorEvento.zonas.eventos.push(eventoElegido);              // colocar en zona de eventos
        eventoElegido.zonaActual = "eventos";                           // actualizar zona
        log("Colocas " + eventoElegido.nombre + " en tu zona de eventos.");
        enviarJugada("eventoColocadoVoluntario", {                       // avisar al rival
          cartaId: eventoElegido.info?.id                                // id del evento
        });
        enviarCantidadMano();                                            // sincronizar mano
        renderMano();                                                    // actualizar mano
        renderManoRival();                                               // actualizar mano rival
        renderCampo();                                                   // actualizar campo
      } else {                                                           // si no quiere colocar
        enviarJugada("eventoRechazado", {});                             // avisar que rechazó
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
      log("El rival coloca " + eventoVol.nombre + " en su zona de eventos.");
    }
    renderCampo();                                                       // actualizar campo
    break;

  case "eventoRechazado": // ============================================= EVENTO RECHAZADO
    break; // gestionado por el Promise de la habilidad de Yamaguchi
// =============================================================================================== PEDIR DESCARTE DE EVENTO <

    case "resetearManoRival": // ====================================================== RESETEAR MANO RIVAL (OIKAWA P01-034)
      const miJugadorReset = game.jugadores[miNumero - 1];               // jugador local (el que resetea)
      miJugadorReset.mazo.push(...miJugadorReset.mano);                  // devolver mano al mazo
      miJugadorReset.mano = [];                                          // vaciar mano
      barajarMazo(miJugadorReset);                                       // barajar mazo
      log("Efecto rival: devuelves tu mano al mazo y barajas.");
      robarCarta(miJugadorReset, 6);                                     // robar 6 cartas
      log("Robas 6 cartas.");
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
          log("Trasheada " + carta.nombre + " de tu zona de " + zonaTrashear + " por efecto rival.");
        }
      });

      enviarJugada("gutsRivalTrasheado", { zona: zonaTrashear, cartasIds: jugada.cartasIds });
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

      log(t("log.cartaAlGuts", { carta: cartaManoGuts.nombre, zona: jugada.zona }));
      renderCampo();                                                         // actualizar campo
      break;

    case "pedirMoverAFondoMazo": // ========================================= PEDIR MOVER AL FONDO DEL MAZO (ej. TAKEDA)
      const miJugadorFondoMazo = game.jugadores[miNumero - 1];
      const zonaFondoMazo = jugada.zona;
      const indexFondoMazo = miJugadorFondoMazo.zonas[zonaFondoMazo]
        .findIndex(c => c.info?.id === jugada.cartaId);
      if (indexFondoMazo !== -1) {
        let carta = miJugadorFondoMazo.zonas[zonaFondoMazo].splice(indexFondoMazo, 1)[0];
        miJugadorFondoMazo.mazo.push(carta);
        log("Colocada " + carta.nombre + " al fondo de tu mazo por efecto rival.");
      }

      enviarJugada("cartaMovidaAFondoMazo", { zona: zonaFondoMazo, cartaId: jugada.cartaId }); // ahora con payload
      if (modoOnline) enviarMazo();

      // si la zona afectada es la de eventos, hay que re-sincronizarla explícitamente,
      // porque tiene su propio listener continuo (escucharEventosRival) que si no, sobreescribiría este cambio
      if (zonaFondoMazo === "eventos") {
        enviarEventos(miJugadorFondoMazo);
      }

      renderCampo();
      break;

      enviarJugada("cartaMovidaAFondoMazo", {});                              // avisar al rival que ya se aplicó
      if (modoOnline) enviarMazo();                                           // sincronizar conteo de mazo

      renderCampo();                                                          // actualizar campo
      break;

    case "cartaMovidaAFondoMazo": // ============================================ CONFIRMACIÓN
      break; // gestionado por el Promise en moverCartaZonaAFondoMazoRival

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
      log("Robas " + jugada.cantidad + " carta(s) por efecto reactivo.");
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
      console.log("¡Rival encontrado! Arrancando partida...");
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

  console.log("Mi mazo cargado: "    + game.jugadores[miIndice].mazo.length    + " cartas");
  console.log("Mazo rival cargado: " + game.jugadores[rivalIndice].mazo.length + " cartas");

  escucharPartida();
  iniciarSorteo();                                             // iniciar sorteo antes del mulligan
  renderManoRival()

  // borrar sala si el jugador 1 se desconecta durante la partida
  if (miNumero === 1) {
    db.ref("partidas/" + salaActual).onDisconnect().remove(); // borrar sala al desconectarse
  }
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
    arrancarPartidaOnline(sala.jugador1mazo, sala.jugador2mazo, sala.jugador1nombre, sala.jugador2nombre);
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
    valorDefensa: game.valorDefensa                      // valor de defensa actual
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
    log("Efectos actualizados: " + game.efectosActivos.map(e => e.tipo).join(", "));
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

// ── SINCRONIZAR MAZO DE PUNTOS ────────────────────────────
function enviarMazoPuntos() {
  if (!modoOnline) return;                                    // solo en modo online
  const miJugador = game.jugadores[miNumero - 1];            // jugador local
  db.ref("partidas/" + salaActual + "/mazoPuntos/jugador" + miNumero)
    .set(miJugador.mazoPuntos.length);                       // número de cartas en mazoPuntos
}

function escucharMazoPuntosRival() {
  const rivalNumero = miNumero === 1 ? 2 : 1;               // número del rival
  const rivalIndice = miNumero === 1 ? 1 : 0;               // índice del rival

  db.ref("partidas/" + salaActual + "/mazoPuntos/jugador" + rivalNumero).on("value", function(snap) {
    const cantidad = snap.val();                             // cantidad de cartas del rival
    if (cantidad === null) return;                           // ignorar si no hay dato
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
    .then(() => console.log("Partida borrada de Firebase ✅")) // confirmación
    .catch(e => console.log("Error al borrar partida: " + e)); // error
}

// ── SORTEO INICIAL ────────────────────────────────────────
function iniciarSorteo() {
  document.getElementById("btn-confirmar-mulligan").style.display = "none"; // ocultar botón confirmar mulligan
  const miNumeroSorteo = Math.random();                      // número aleatorio para el sorteo
  db.ref("partidas/" + salaActual + "/sorteo/jugador" + miNumero).set(miNumeroSorteo); // subir a Firebase

  db.ref("partidas/" + salaActual + "/sorteo").on("value", async function(snap) {
    const sorteo = snap.val();                               // datos del sorteo
    if (!sorteo || !sorteo.jugador1 || !sorteo.jugador2) return; // esperar a los dos

    // desactivar listener
    db.ref("partidas/" + salaActual + "/sorteo").off();

    const yoGano = sorteo["jugador" + miNumero] > sorteo["jugador" + (miNumero === 1 ? 2 : 1)]; // comparar números

    if (yoGano) {                                            // si gano el sorteo
      log("¡Has ganado el sorteo!");
      let eleccion = await mostrarEleccion([                 // mostrar opciones
        { texto: "Saco yo primero" },
        { texto: "Saca el rival primero" }
      ]);

      const miIndice = miNumero - 1;                               // mi índice
      const rivalIndice = miNumero === 1 ? 1 : 0;                  // índice del rival
      const j1Saca = eleccion === 0 ? miIndice : rivalIndice;      // 0: saco yo, 1: saca el rival
      db.ref("partidas/" + salaActual + "/sorteo/j1Saca").set(j1Saca); // subir decisión

    } else {                                                 // si pierdo el sorteo
      log("El rival ha ganado el sorteo. Esperando su decisión...");

      db.ref("partidas/" + salaActual + "/sorteo/j1Saca").on("value", function(snap2) {
        const j1Saca = snap2.val();                          // quién saca según el ganador
        if (j1Saca === null) return;                         // esperar decisión
        db.ref("partidas/" + salaActual + "/sorteo/j1Saca").off(); // desactivar listener
        arrancarMulligan(j1Saca);                            // arrancar mulligan
      });
    }

    if (yoGano) {                                            // el ganador también arranca
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
  log("Saca primero: " + game.jugadores[indicePrimerSacador].nombre);
  renderMano();
  renderCampo();
}