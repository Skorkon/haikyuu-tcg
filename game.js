console.log("JS CARGADO"); // comprobar si funciona el JS

// ===================================================================== MENSAJES DE TEXTO (LOG)
// =============================================================================================
const logElement = document.getElementById("log");
const logContainer = document.getElementById("log-container");
function log(texto) {
  const linea = document.createElement("div");  // cada línea es un div
  let textoFormateado = texto;

  // nombre del jugador 1 en naranja
  textoFormateado = textoFormateado.replaceAll(
    game.jugadores[0].nombre,
    `<strong><span style="color:#e65100">${game.jugadores[0].nombre}</span></strong>`
  );

  // nombre del jugador 2 en turquesa
  textoFormateado = textoFormateado.replaceAll(
    game.jugadores[1].nombre,
    `<strong><span style="color:#00838f">${game.jugadores[1].nombre}</span></strong>`
  );

  // zonas en su color correspondiente
  const zonas = {
    "saque":     "#e65100",  // naranja
    "recepcion": "#1565c0",  // azul
    "pase":      "#2e7d32",  // verde
    "remate":    "#c62828",  // rojo
    "bloqueo":   "#424242",  // gris oscuro
  };
  for (let zona in zonas) {
    textoFormateado = textoFormateado.replaceAll(
      zona,
      `<strong><span style="color:${zonas[zona]}">${zona}</span></strong>`
    );
  }

  // nombre de la carta en el color de su zona actual
  if (game.ultimaCarta && game.ultimaCarta.zonaActual) {
    let colorZona = zonas[game.ultimaCarta.zonaActual] || "#333"; // color de la zona o gris
    textoFormateado = textoFormateado.replaceAll(
      game.ultimaCarta.nombre,
      `<strong><span style="color:${colorZona}">${game.ultimaCarta.nombre}</span></strong>`
    );
  }

  linea.style.color = "#333";                    // todo el texto en gris
  linea.innerHTML = textoFormateado;             // aplicar el texto formateado
  logElement.appendChild(linea);                 // añade la línea al log
  logContainer.scrollTop = logContainer.scrollHeight; // autoscroll
}

// ================================================================================================== FUNCIONES ESTRUCTURALES
// ==========================================================================================================================

// ======================================================================== ESTRUCTURA DEL JUEGO
// =============================================================================================
const game = {         // estado general del juego
  jugadorActivo: 0,    // 0 o 1
  fase : "mulligan",   // fase inicial
  turno: 0, 
  valorAtaque: 0,
  valorDefensa: 0,

  jugadores: [ 
    crearJugador("Andres"), // 0 = jugador 1, 1 = jugador 2
    crearJugador("Raul")
  ],

  bloqueoActual: {            // para diferenciar tipos de bloqueadores
    central: null,
    apoyos: []
  },

  ultimaCarta : null,                   // para elegir la habilidad que se va a jugar
  ultimoJugador: null,                  // para limpiar contador de habilidades, entre otras cosas
  cartaSeleccionada: null,              // para elegir la carta que se juega de la mano
  mulliganConfirmado: [false, false],   // mulligan no confirmado de inicio
  efectosActivos: [],                   // para efectos que se acumulan de una fase a otra
  gutsDescartados: [],                  // para saber los GUTS que se han descartado al usar una habilidad
  jugadaActual: {                       // para guardar las cartas de la jugada actual
    saque: null,
    recepcion: null,
    pase: null,
    remate: null,
    bloqueo: null
  }
};

// =============================================================================== CREAR JUGADOR
// =============================================================================================
function crearJugador(nombre) {
  return {
    nombre: nombre,
    puntos: 0,

    mano: [],
    mazo: [],
    trash: [],
    mazoPuntos: [],

    zonas: {
      saque: [],
      recepcion: [],
      pase: [],
      remate: [],
      bloqueo: [],
      bloqueoApoyo: [],
      eventos: [],
    }
  };
}

// ================================================================================= CREAR CARTA
// =============================================================================================
function crearCarta(nombre, stats = {}, habilidad, info = {}) {
  return {
    nombre: nombre,
    stats: {
      saque: stats.saque || 0,
      recepcion: stats.recepcion || 0,
      pase: stats.pase || 0,
      remate: stats.remate || 0,
      bloqueo: stats.bloqueo || 0
    },

    info: {
      tipo: info.tipo || "personaje",
      subtipo: info.subtipo || null,
      id: info.id || null,
      fases: info.fases || [],
      escuela: info.escuela || null,
      posicion: info.posicion || null,
      anyo: info.anyo || null,
      rareza: info.rareza || null,  // rareza de la carta
      descripcion: info.descripcion || null,  // texto
      zonasProhibidas: info.zonasProhibidas || [],
      activacionMano: info.activacionMano || false, // cartas jugables desde la mano
      unica: info.unica || false,                // si la carta tiene la restricción 1 Única
    },

    habilidad, // esto será una función propia de cada carta
    zonaActual: null, // para saber en qué zona se encuentra la carta
    habilidadUsada: false // controlar si la habilidad se ha usado o no
  };
}

// ======================================================================================================== FUNCIONES BÁSICAS
// ==========================================================================================================================

// =========================================================================== SELECCIONAR CARTA
// =============================================================================================
function seleccionarCarta(carta) {
  game.cartaSeleccionada = carta;
}
// ============================================================================= CAMBIAR JUGADOR
// ============================================================================================= 
function cambiarJugador(indice = null) {
  game.turno++; // cambiamos de turno
  game.efectosActivos = game.efectosActivos.filter(e => !e.expira || e.expira > game.turno);
  game.jugadaActual = {saque: null, recepcion: null, pase: null, remate: null, bloqueo: null}; // limpiar jugada

  let jugadorAnterior = game.jugadores[game.jugadorActivo];
  limpiarRecienJugadas(jugadorAnterior);
  limpiarHabilidades(jugadorAnterior);

  if (indice !== null) {             // si no se especifica un jugador en cocreto
    game.jugadorActivo = indice;     // ir al jugador activo
  } else {
      if (modoOnline) {              
        const nuevoIndice = game.jugadorActivo === 0 ? 1 : 0;
        game.jugadorActivo = nuevoIndice;
        enviarCambioTurno(nuevoIndice);
      } 
      else {                          // modo local
        game.jugadorActivo++;
        if (game.jugadorActivo >= game.jugadores.length) {
          game.jugadorActivo = 0;
        }
      }
  }
  renderCampo();
  renderMano();
  renderManoRival()
}
// ============================================================================= RESOLVER VÁLIDO
// =============================================================================================
function esResolverValido() {
  if (modoOnline && game.jugadorActivo !== miNumero - 1) { // comprobar si es tu turno
    log(t("log.noEsTuTurno"));                              
    return false;                                          // turno no válido
  }
  return true;                                             // turno válido
}
// ================================================================================ TURNO VÁLIDO
// =============================================================================================
function esTurnoValido(zona) {
  if (modoOnline && game.jugadorActivo !== miNumero - 1) { // comprobación online del turno activo
    log(t("log.noEsTuTurno")); 
    return false;
  }
  if (game.fase === "mulligan") {
    log(t("log.mulliganPrimero"));
    return false;
  }
  if (zona === "saque" && game.fase !== "saque") { // si zona saque pero fase distinta de saque
    return false; // no es turno válido
  }
  if (zona === "recepcion" && game.fase !== "recepcion") {
    return false;
  }
  if (zona === "pase" && game.fase !== "pase") {
    return false;
  }
  if (zona === "remate" && game.fase !== "remate") {
    return false;
  }
  if (zona === "bloqueo" && game.fase !== "bloqueo") {
    return false;
  }
  return true; // turno válido si ninguna de las anteriores
}
// =============================================================== LIMPIAR CARTAS RECIEN JUGADAS 
// =============================================================================================
function limpiarRecienJugadas(jugador) {
  for (let zona in jugador.zonas) {          // para todas las zonas del jugador activo
    jugador.zonas[zona].forEach(carta => {   // para todas y cada una de las cartas de esa zona
      carta.recienJugada = false;            // recién jugada pasa a false y ya podrá usarse en el próximo GUTS
    });
  }
}
// ========================================================================= LIMPIAR HABILIDADES 
// =============================================================================================
function limpiarHabilidades(jugador) {
  for (let zona in jugador.zonas) { // en cada zona
    jugador.zonas[zona].forEach(carta => { // a cada carta de cada zona
      carta.habilidadUsada = false; // desmarcamos la habilidad usada
    });
  }
}
// ============================================================================== LIMPIAR JUGADA 
// =============================================================================================
// Necesario para el online
function limpiarJugada() { // limpiar jugada actual
  game.jugadaActual = { saque: null, recepcion: null, pase: null, remate: null, bloqueo: null };
  game.bloqueoActual = { central: null, apoyos: [] };      // limpiar bloqueo
  game.gutsDescartados = [];                               // limpiar GUTS descartados
  game.valorAtaque = 0;                                    // resetear ataque
  game.valorDefensa = 0;                                   // resetear defensa

  game.jugadores.forEach(jugador => {                      // limpiar recienJugada y habilidadUsada en todas las zonas de ambos jugadores
    limpiarRecienJugadas(jugador);                         // limpiar recién jugadas
    limpiarHabilidades(jugador);                           // limpiar habilidades usadas
  });

  // limpiar efectos activos expirados
  game.efectosActivos = [];                                // limpiar todos los efectos
  if (modoOnline) enviarEfectos();                        // sincronizar efectos con el rival
}
// ============================================================================= PERDER UN PUNTO 
// =============================================================================================
function perderPunto(jugador) {
  if (jugador.mazoPuntos.length === 0) {
    log(t("log.pierdePartida", { jugador: jugador.nombre }));
    if (modoOnline) {
      const gane = jugador !== game.jugadores[miNumero - 1];   // gané si el que perdió no soy yo
      mostrarFinPartida(gane);                                 // mostrar panel al perdedor
      enviarJugada("finPartida", { ganador: miNumero === 1 ? 2 : 1 }); // avisar al rival
      if (!gane) borrarPartida();                              // el perdedor borra la partida
    } else {
      mostrarFinPartida(true);                                 // en local siempre mostrar panel
    }
    return;
  }

  if (modoOnline) {
    // primero ambos roban hasta 6
    let miJugador = game.jugadores[miNumero - 1];        // jugador local
    let cartasQueNecesita = 6 - miJugador.mano.length;   // cartas que necesita hasta 6
    if (cartasQueNecesita > 0) {
      robarCarta(miJugador, cartasQueNecesita);           // robar hasta 6
    }
    enviarJugada("robarHasta6", {});                      // avisar al rival que robe hasta 6

    // luego el que pierde roba del mazoPuntos
    let carta = jugador.mazoPuntos.shift();               // roba del mazo de puntos
    jugador.mano.push(carta);                             // va a la mano
    log(t("log.pierdeUnPunto", { jugador: jugador.nombre, cantidad: jugador.mazoPuntos.length }));
    enviarJugada("perderPunto", {});                      // avisar al rival del punto perdido

  } else { // ------------------------------------------- // Modo local                                            
    game.jugadores.forEach(j => {
      let cartasQueNecesita = 6 - j.mano.length;          // cartas que necesita hasta 6
      if (cartasQueNecesita > 0) {
        robarCarta(j, cartasQueNecesita);                 // robar hasta 6
      }
    });
    // luego robar del mazo de puntos
    let carta = jugador.mazoPuntos.shift();               // roba del mazo de puntos
    jugador.mano.push(carta);                             // va a la mano
    log(t("log.pierdeUnPunto", { jugador: jugador.nombre, cantidad: jugador.mazoPuntos.length }));
  }

  renderMano();                                           // redibujar mano
  renderManoRival()
  actualizarMarcador();                                   // actualizar marcador
  if (modoOnline) enviarMazoPuntos();                          // sincronizar mazoPuntos
}
// ================================================================================ BARAJAR MAZO
// =============================================================================================
function barajarMazo(jugador) {
  for (let i = jugador.mazo.length - 1; i > 0; i--) {               // recorre el mazo de atrás hacia adelante para ver la longitud
    let j = Math.floor(Math.random() * (i + 1));                    // elije una posición aleatoria entre 0 e i
    [jugador.mazo[i], jugador.mazo[j]] = [jugador.mazo[j], jugador.mazo[i]]; // intercambia las dos cartas de posición
  }
}
// ========================================================================== ROBAR MANO INICIAL
// =============================================================================================
function iniciarMano(jugador) {
  // barajarMazo(jugador); // COMENTADO DE MOMENTO PARA TESTEAR
  robarCarta(jugador, 6);
  renderMano();
  renderManoRival()
}
// ============================================================================== HACER MULLIGAN
// =============================================================================================
function hacerMulligan(jugador) {
  if (game.fase !== "mulligan") {
    log(t("log.soloMulligan"));
    return;
  }
  if (!game.cartaSeleccionada) {
    log(t("log.seleccionaCartaMulligan"));
    return;
  }
  // devolver la carta seleccionada al mazo
  jugador.mano.splice(jugador.mano.indexOf(game.cartaSeleccionada), 1);
  jugador.mazo.push(game.cartaSeleccionada);
  log(t("log.cartaDevuelta", { carta: game.cartaSeleccionada.nombre }));
  game.cartaSeleccionada = null;
  renderMano();
  renderManoRival()
}
// ========================================================================== CONFIRMAR MULLIGAN
// =============================================================================================
function confirmarMulligan(jugador) {
  if (game.fase !== "mulligan") {                             // si no es fase de mulligan
    log(t("log.mulliganYaConfirmado"));
    return;
  }

  let cartasQueNecesita = 6 - jugador.mano.length;            // cartas restantes hasta 6
  if (cartasQueNecesita > 0) {                                // si faltan
    barajarMazo(jugador);
    robarCarta(jugador, cartasQueNecesita);
  }

  log(t("log.mulliganConfirmado", { jugador: jugador.nombre }));

  if (modoOnline) { // --------------------------------------- // ONLINE
    // no resetear jugadorActivo (ya fue decidido por el sorteo)
    game.mulliganConfirmado[miNumero - 1] = true;
    document.getElementById("btn-confirmar-mulligan").disabled = true; // bloquear botón tras confirmar
    let miJugador = game.jugadores[miNumero - 1];              // jugador local
    miJugador.mazoPuntos = miJugador.mazo.splice(0, 2);        // sacar las 2 primeras cartas
    log(t("log.mazoPuntosPreparado", {jugador: miJugador.nombre}));          
    confirmarMulliganOnline();
    enviarMazoPuntos();                                         // sincronizar mazoPuntos inicial
    enviarMazo();                                               // sincronizar mazo actualizado
  } else { // ------------------------------------------------- // LOCAL: comportamiento original, un mulligan tras otro
    game.mulliganConfirmado[game.jugadorActivo] = true;
    jugador.mazoPuntos = jugador.mazo.splice(0, 2);            // sacar las 2 primeras cartas para el mazo de puntos
    log(t("log.mazoPuntosPreparado", {jugador: jugador.nombre})); 

    if (game.jugadorActivo === 0 && !game.mulliganConfirmado[1]) {
      cambiarJugador(1);
      log(t("log.mulliganRival", { jugador: game.jugadores[1].nombre }));
    } else if (game.jugadorActivo === 1 && !game.mulliganConfirmado[0]) {
      cambiarJugador(0);
      log(t("log.mulliganRival", { jugador: game.jugadores[0].nombre }));
    } else {
      cambiarJugador(0);
      game.fase = "saque";
      log(t("log.partidaIniciada", { jugador: game.jugadores[0].nombre }));
      actualizarFaseUI();
    }
    renderMano();
    renderManoRival()
  }
}

// ============================================================================== EFECTOS CARTAS 
// =============================================================================================
function añadirEfecto(tipo, valor) {
  game.efectosActivos.push({ tipo, valor });
  log(t("log.efectoActivo", { tipo: tipo }));
}

function tieneEfecto(tipo) {
  return game.efectosActivos.some(e => e.tipo === tipo);
}

function limpiarEfectos() {
  game.efectosActivos = [];
}

function mostrarEleccion(opciones) { // ===================================== MOSTRAR ELECCIONES
  bloquearUI();
  return new Promise(resolve => {                           // acción que se resuelve cuando una condición se cumpla
    let panel = document.getElementById("panel-eleccion");  // recuperar el panel
    let contenedor = document.getElementById("opciones-eleccion"); // recuperar las opciones
    contenedor.innerHTML = "";                              // opciones vacías por defecto

    opciones.forEach((opcion, index) => { 
      let btn = document.createElement("button");           // meter en cada botón de opciones...
      btn.textContent = opcion.texto;                       // ...el texto descrito en la habilidad de la carta
      btn.onclick = () => {                                 // haciendo clic en el botón 
        panel.style.display = "none";                       // ocultamos el panel
        desbloquearUI();
        resolve(index);                                     // y el resolvemos el Promise con el nuevo valor seleccionado
      };
      contenedor.appendChild(btn);
    });
    panel.style.display = "flex";
  });
}

// ========================================================================== SELECTOR DE CARTAS 
// =============================================================================================
function mostrarSelectorCartas(titulo, cartas, cancelable = false) {
  bloquearUI();
  return new Promise(resolve => {
    let selector = document.getElementById("selector-cartas");
    let contenedor = document.getElementById("selector-mano");
    let tituloEl = document.getElementById("selector-titulo");

    tituloEl.innerHTML = titulo;
    contenedor.innerHTML = "";
    selector.style.display = "flex";

    // ejemplo creado para el evento de los Miya (no he entendido mucho esto)
    if (cancelable) {                                                         // si se puede cerrar clicando fuera
      window._cerrarFuera = function(e) {                                     // guardar referencia global
        if (!selector.contains(e.target)) {                                   // si el clic es fuera del selector
          cerrarSelector();                                                    // cerrar selector
          desbloquearUI();
          resolve(null);                                                        // resolver con null (cancelado)
          document.removeEventListener("click", window._cerrarFuera, { capture: true }); // limpiar listener
          window._cerrarFuera = null;                                           // limpiar referencia global
        }
      };
      document.addEventListener("click", window._cerrarFuera, { capture: true }); // añadir listener
    }

    cartas.forEach(carta => {
      let div = document.createElement("div");
      div.classList.add("carta");

      if (carta.info?.id) {
        div.style.backgroundImage = `url('img/cartas/${carta.info.id}.png')`;
      } else {
        div.textContent = carta.nombre;
      }

      div.addEventListener("mouseover", (e) => mostrarTooltip(carta, e));
      div.addEventListener("mousemove", (e) => mostrarTooltip(carta, e));
      div.addEventListener("mouseout", () => {
        document.getElementById("tooltip").style.display = "none";
      });

      div.onclick = () => {
        cerrarSelector();
        desbloquearUI();           
        resolve(carta);                     // resolver con la carta elegida
      };
      contenedor.appendChild(div);           // añadir al contenedor
    });

    window._selectorResolve = resolve;       // guardar resolve para el botón cancelar (a verificar si borrar)
  });
}

function cerrarSelector() {
  document.getElementById("selector-cartas").style.display = "none";
  document.getElementById("selector-mano").innerHTML = "";
}

function cancelarSelector() {
  cerrarSelector();
  desbloquearUI();
  if (window._selectorResolve) {
    window._selectorResolve(null); // null = cancelado
  }
}
// ===================================================================== RESOLVER LOG : ESCRIBIR (POR BORRAR)
// =============================================================================================
// A BORRAR cuando tenga terminado el excel
function resolverLog(jugador, carta, zona, resultado) {
  let stat = carta.stats[zona]; // recuperar stats de la zona del jugador
  log(
    jugador.nombre +
    " juega a " +
    carta.nombre +
    " en " +
    zona +
    " (" +
    stat +
    ") = " +
    resultado // esto se define con texto en la función de colocar carta
  );
}

// ==================================================================================================================================================================== COLOCAR CARTA 
// ==================================================================================================================================================================================
function colocarCarta(jugador, carta, zona) { 
  // ========================================================================================================== 1: Comprobaciones
  if (carta.info?.tipo === "evento") {                              // Para evitar que se juegen eventos en la zona de los personajes
    log(t("log.eventoUsarBoton"));
    renderMano();
    renderManoRival()
    return;
  }
  
  if (carta.info?.zonasProhibidas?.includes(zona)) {                // Comprobar zonas prohibidas 
    log(t("log.zonaProhibida", { carta: carta.nombre, zona: zona }));
    return;
  }
  
  let nombreDuplicado = Object.values(jugador.zonas).some(zona =>   // comprobar nombre duplicado en el campo este turno
    zona.some(c => c.recienJugada && c.nombre === carta.nombre)
  );
  if (nombreDuplicado) {
    log(t("log.cartaDuplicada", { carta: carta.nombre }));
    renderMano();
    renderManoRival()
    return;
  }
  // ================================================================================= 1.1: Efectos
  if (tieneEfecto("negarColocador")) {
    let efecto = game.efectosActivos.find(e => e.tipo === "negarColocador");
    if (efecto.activadoPor !== game.jugadorActivo && carta.info?.posicion === "S") {
      log(t("log.negarColocador"));
      renderMano();
      renderManoRival()
      return;
    }
  }
  // ========================================================================================================= 2: Colocar carta normal
    let index = jugador.mano.indexOf(carta);    // para sacar la carta de la mano
    if (index === -1) {                         // si no hay carta seleccionada
    } else {
      jugador.mano.splice(index, 1);            // el jugador saca la carta de su mano
    }
// =======================================================================================================================================================
  if (game.fase === "saque"){ // ============================================================================================================ FASE : SAQUE
    // verificar si ya se ha jugado una carta este turno en saque
    let ultimaCarta = jugador.zonas.saque.at(-1);
    if (ultimaCarta && ultimaCarta.recienJugada){
      log(t("log.yaHayCartaEnZona", { zona: "saque" }));
      jugador.mano.push(carta);
      renderMano();
      renderManoRival()
      return
    }
    jugador.zonas.saque.push(carta);        // el jugador pone una carta en la zona de saque
    carta.zonaActual = "saque";
    carta.recienJugada = true;
    carta.habilidadUsada = false;
    game.ultimaCarta = carta;
    game.ultimoJugador = jugador;
    game.jugadaActual.saque = carta;
    game.valorAtaque = carta.stats.saque;   
    log(t("log.cartaColocadaEn", { jugador: jugador.nombre, carta: carta.nombre, zona: "saque", stat: carta.stats.saque }));
    actualizarFaseUI(); 
    renderMano(); 
    renderManoRival()
    renderCampo();
    // ================================================ ONLINE
    if (modoOnline) {
      enviarJugada("cartaJugada", {
      zona: "saque",
      cartaId: carta.info.id
      });
    }
    return;
  }
// =======================================================================================================================================================
  if (game.fase === "recepcion") { // =================================================================================================== FASE : RECEPCIÓN
    // comprobar si ya se ha jugado un receptor este turno
    let ultimaCarta = jugador.zonas.recepcion.at(-1);
    if (ultimaCarta && ultimaCarta.recienJugada) {
      log(t("log.yaHayCartaEnZona", { zona: t("ui.zonaRecepcion") }));
      jugador.mano.push(carta);
      renderMano();
      renderManoRival()
      return;
    }
    // ================================================== Efectos
    if (tieneEfecto("negarReceptorAlto") && carta.stats.recepcion >= 6) { // negar receptor alto
      log(t("log.noReceptorAlto"));
      jugador.mano.push(carta);
      renderMano();
      renderManoRival()
      return;
    }

    // ================================================== función a ejecutar
    let resultadoRecepcion = ""; // variable para guardar si buena recepción (no usada por el momento)
    jugador.zonas.recepcion.push(carta); // el jugador pone la carta en la zona de recepción
      carta.zonaActual = "recepcion";
      carta.recienJugada = true;
      carta.habilidadUsada = false;
      game.ultimaCarta = carta;
      game.ultimoJugador = jugador;
      game.jugadaActual.recepcion = carta;
      log(t("log.cartaColocadaEn", { jugador: jugador.nombre, carta: carta.nombre, zona: "recepcion", stat: carta.stats.recepcion }));

      // ================================================== Efectos
      if (tieneEfecto("debilitarReceptor")) {
        let efecto = game.efectosActivos.find(e => e.tipo === "debilitarReceptor");
        if (efecto.activadoPor !== game.jugadorActivo) {
          if (!efecto.soloSinHabilidad || carta.habilidad === null) {
            game.valorDefensa -= efecto.valor;
            log(t("log.efectoDebilitarReceptor", { valor: efecto.valor, carta: carta.nombre }));
          }
        }
      }
      actualizarFaseUI();
      renderMano();
      renderManoRival()
      renderCampo();
      // ------------------------------------------------------------------------- COMPROBAR EFECTOS ÚNICOS
      // comprobar efecto Yaku P01-023
      let cartaDebajo = jugador.zonas.recepcion.at(-2);             // carta debajo de la recién jugada
      if (cartaDebajo?.info?.id === "HV-P01-023") {                 // si es Yaku P01-023
        aplicarYaku023(jugador, carta);                             // lanzar habilidad de Yaku
      }
      if (modoOnline) {
        enviarJugada("cartaJugada", {      // enviar jugada al rival
          zona: "recepcion",               // zona donde se jugó
          cartaId: carta.info.id           // id de la carta jugada
        });
      }
      return;
    } 
// =======================================================================================================================================================  
  if (game.fase === "pase"){ // ============================================================================================================== FASE : PASE
    // verificar si ya se ha jugado una carta este turno en pase
    let ultimaCarta = jugador.zonas.pase.at(-1);
    if (ultimaCarta && ultimaCarta.recienJugada){
      log(t("log.yaHayCartaEnZona", { zona: t("ui.zonaPase") }));
      jugador.mano.push(carta);
      renderMano();
      renderManoRival()
      return
    }
    // ================================================== Efectos

    // ================================================== función a ejecutar
    jugador.zonas.pase.push(carta); 
    carta.zonaActual = "pase";
    carta.recienJugada = true;
    carta.habilidadUsada = false;
    game.ultimaCarta = carta;
    game.ultimoJugador = jugador;
    game.jugadaActual.pase = carta;
    game.valorAtaque = carta.stats.pase; 
    log(t("log.cartaColocadaEn", { jugador: jugador.nombre, carta: carta.nombre, zona: "pase", stat: carta.stats.pase }));

    // ================================================== Efectos
    if (tieneEfecto("debilitarColocador")) {
      let efecto = game.efectosActivos.find(e => e.tipo === "debilitarColocador");
      if (efecto.activadoPor !== game.jugadorActivo) {
        game.valorAtaque -= 2;
        log(t("log.efectoDebilitarColocador", { valor: 2, carta: carta.nombre }));
      }
    }
    actualizarFaseUI();
    renderMano();
    renderManoRival()
    renderCampo();
    if (modoOnline) {
      enviarJugada("cartaJugada", {      // enviar jugada al rival
        zona: "pase",                     // zona donde se jugó
        cartaId: carta.info.id           // id de la carta jugada
      });
    }
    return;
  }
// ======================================================================================================================================================= 
  if (game.fase === "remate"){ // ========================================================================================================== FASE : REMATE
    jugador.zonas.remate.push(carta); // el jugador pone la carta en la zona de remate
    // estado de la carta
    carta.zonaActual = "remate";
    carta.recienJugada = true;
    carta.habilidadUsada = false;
    // estado del juego
    game.ultimaCarta = carta;
    game.ultimoJugador = jugador;
    game.jugadaActual.remate = carta;
    log(t("log.cartaColocadaEn", { jugador: jugador.nombre, carta: carta.nombre, zona: "remate", stat: carta.stats.remate }));

    // ------------------------------------------------------------------------- COMPROBAR EFECTOS ÚNICOS
    // ------------------------------------------------------------------------- Kageyama SP
    if (tieneEfecto("kageyamaSP") && carta.nombre === "Hinata Shoyo") {
      game.valorAtaque += 2;
      log(t("log.efectoKageyamaSP"));
    }
    // ------------------------------------------------------------------------- Kenma P01-019
    if (jugador.zonas.pase.at(-1)?.info?.id === "HV-P01-019" && carta.stats.remate === 3) {
      aplicarKenma019(jugador, carta);                            // lanzar habilidad de Kenma
    }
    // ------------------------------------------------------------------------- Yamamoto P01-028
    if (jugador.zonas.remate.at(-2)?.info?.id === "HV-P01-028" && carta.nombre === "Haiba Lev") {
      aplicarYamamoto028(jugador, carta);
    }
    // ------------------------------------------------------------------------- COMPROBAR EFECTOS GENÉRICOS
    // ------------------------------------------------------------------------- EFECTO : DEBILITAR REMATADOR
    if (tieneEfecto("debilitarRematador")) {
      let efecto = game.efectosActivos.find(e => e.tipo === "debilitarRematador");
      if (efecto.activadoPor !== game.jugadorActivo) { // solo si es el rival
        game.valorAtaque -= 2;
        log(t("log.efectoDebilitarRematador", { valor: 2, carta: carta.nombre }));
      }
    }
    actualizarFaseUI();
    renderMano(); 
    renderManoRival()
    renderCampo();
    if (modoOnline) {
      enviarJugada("cartaJugada", {      // enviar jugada al rival
        zona: "remate",                  // zona donde se jugó
        cartaId: carta.info.id           // id de la carta jugada
      });
    }
    return;
  }
// ======================================================================================================================================================= 
  if (game.fase === "bloqueo") { // ======================================================================================================= FASE : BLOQUEO
      if (!game.bloqueoActual.central) { // ================================ BLOQUEADOR CENTRAL

        // comprobar Blockout antes de colocar
        if (tieneEfecto("blockout")) {
          let efecto = game.efectosActivos.find(e => e.tipo === "blockout"); // buscar efecto
          if (carta.stats.bloqueo <= efecto.valor) {                         // si bloqueo insuficiente
            log("Blockout: " + carta.nombre + " tiene bloqueo ≤ " + efecto.valor + " y va al trash.");
            jugador.trash.push(carta);                                        // carta al trash
            renderMano();
            renderManoRival()
            renderCampo();
            return;
          }
        }
        // asignar bloqueador central
        game.bloqueoActual.central = carta;           // marcar como bloqueador central
        jugador.zonas.bloqueo.push(carta);            // añadir a la zona de bloqueo
        carta.zonaActual = "bloqueo";                 // zona actual de la carta
        game.ultimaCarta = carta;                     // última carta jugada
        game.ultimoJugador = jugador;                 // último jugador que jugó
        game.jugadaActual.bloqueo = carta;            // guardar en jugada actual
        carta.recienJugada = true;                    // marcada como recién jugada
        carta.habilidadUsada = false;                 // habilidad no usada

        // comprobar efecto debilitarBloqueadorCentral
        if (tieneEfecto("debilitarBloqueadorCentral")) {
          let efecto = game.efectosActivos.find(e => e.tipo === "debilitarBloqueadorCentral");
          if (efecto.activadoPor !== game.jugadorActivo) {          // si lo activó el rival
            game.valorDefensa -= efecto.valor;                      // restar al bloqueo
            log(t("log.efectoDebilitarBloqueo", { valor: efecto.valor, carta: carta.nombre }));
          }
        }
        
      // ------------------------------------------------------------------------- COMPROBAR EFECTOS ÚNICOS
      // ------------------------------------------------------------------------- LEV D02-004
        let levEnRemate = jugador.zonas.remate.find(c => c.nombre === "Haiba Lev"); // buscar Lev
        let levEnBloqueo = [...jugador.zonas.bloqueo, ...jugador.zonas.bloqueoApoyo]
           .some(c => c.nombre === "Haiba Lev");                             // comprobar si ya hay un Lev en bloqueo
        if (levEnRemate && !levEnBloqueo && game.bloqueoActual.apoyos.length < 2) {
          aplicarLevApoyo(jugador);
        }

        // avisar al rival de la carta colocada en bloqueo
        if (modoOnline) {
          enviarJugada("cartaJugada", {               // enviar jugada al rival
            zona: "bloqueo",                          // zona donde se jugó
            cartaId: carta.info.id                    // id de la carta
          });
        }
        resolverLog(jugador, carta, "bloqueo", "Bloqueador central"); // log
      }
      else { // ============================================================ BLOQUEADOR DE APOYO
        // ============================================ Comprobar efectos
        // comprobar efecto negarBloqueadoresApoyo
        if (tieneEfecto("negarBloqueadoresApoyo")) {
          log(t("log.negarBloqueadoresApoyo"));
          jugador.mano.push(carta);                   // devolver carta a la mano
          renderMano();
          renderManoRival()
          return;
        }

        // comprobar efecto limitarBloqueadores
        if (tieneEfecto("limitarBloqueadores")) {
          let efecto = game.efectosActivos.find(e => e.tipo === "limitarBloqueadores");
          if (efecto.activadoPor !== game.jugadorActivo) {              // si lo activó el rival
            let totalBloqueadores = 1 + game.bloqueoActual.apoyos.length; // central + apoyos
            if (totalBloqueadores >= efecto.valor) {
              log(t("log.limitarBloqueadores", { max: efecto.valor }));
              jugador.mano.push(carta);               // devolver carta a la mano
              renderMano();
              renderManoRival()
              return;
            }
          }
        }

        if (game.bloqueoActual.apoyos.length >= 2) {  // comprobar máximo de bloqueadores de apoyo
          log(t("log.maximoBloqueadores"));
          jugador.mano.push(carta);                   // devolver carta a la mano
          return;
        }

        game.bloqueoActual.apoyos.push(carta);        // añadir al conteo de apoyos
        jugador.zonas.bloqueoApoyo.push(carta);       // añadir a la zona de apoyo
        carta.zonaActual = "bloqueoApoyo";            // zona actual de la carta
        carta.recienJugada = true;                    // marcada como recién jugada
        carta.habilidadUsada = false;                 // habilidad no usada
        game.ultimaCarta = carta;                     // última carta jugada
        game.ultimoJugador = jugador;                 // último jugador que jugó

        // avisar al rival de la carta colocada como apoyo
        if (modoOnline) {
          enviarJugada("cartaJugada", {               // enviar jugada al rival
            zona: "bloqueoApoyo",                     // zona donde se jugó
            cartaId: carta.info.id                    // id de la carta
          });
        }
        log(t("log.cartaColocadaBloqueo", { jugador: jugador.nombre, carta: carta.nombre, stat: carta.stats.bloqueo, tipo: t("log.apoyoBloqueo") }));
      }
      renderMano(); 
      renderManoRival()
      renderCampo(); 
      return;
    }
  }
// =================================================================================================================================
// ==================================================================================================================== ROBAR CARTAS
function robarCarta(jugador, cantidad = 1, esHabilidad = false) {       // jugador activo, cantidad, es robo de habilidad o robo normal
  for (let i = 0; i < cantidad; i++) {
    if (jugador.mazo.length === 0) {
      log(t("log.sinCartasEnMazo", { jugador: jugador.nombre }));
      return;
    }
    let carta = jugador.mazo.shift();
    jugador.mano.push(carta);

    if (esHabilidad && tieneEfecto("tendoSatori")) {                    // si es por habilidad, activar Tendo si está activo
      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;
      robarCarta(game.jugadores[rivalIndex], 1);                        // el rival roba una carta como reacción
      log(t("log.tendoSatori"));
    }
  }
  log(t("log.robarCartas", { jugador: jugador.nombre, cantidad: cantidad }));
  if (modoOnline) enviarMazo();                                         // sincronizar mazo con el rival
  renderMano();
  renderManoRival()
  renderCampo();
}
// =================================================================================================================================
// ======================================================================================================================= USAR GUTS 
// ============================================== GUTS SIN SELECTOR
async function usarGuts(jugador, zona, cantidad) {
    // limpiar listener de cancelable si existe, evita que un selector cancelable anterior interfiera con el selector de GUTS que se va a abrir
    // ejemplo creado para el evento de los Miya
  if (window._cerrarFuera) {
    document.removeEventListener("click", window._cerrarFuera, { capture: true }); // eliminar listener
    window._cerrarFuera = null;                                                     // limpiar referencia global
  }

  const ultimaCartaZona = jugador.zonas[zona].at(-1);         // detectar última carta zona
  const cartasDisponibles = ultimaCartaZona?.recienJugada
    ? jugador.zonas[zona].slice(0, -1)                       // excluir del guts si es recienJugada
    : jugador.zonas[zona];                                   // incluir todas si no lo es

  if (cartasDisponibles.length < cantidad) {
    log(t("log.gutsInsuficiente"));
    return false;
  }

  let cartasElegidas = [];
  for (let i = 0; i < cantidad; i++) {
    let disponibles = cartasDisponibles.filter(c => !cartasElegidas.includes(c));
    let elegida = await mostrarSelectorCartas(
      t("log.gutsTitulo", { zona: t("ui.zona" + zona.charAt(0).toUpperCase() + zona.slice(1)), actual: i + 1, total: cantidad }),
                                                    //  coger la primera letra de la zona y ponerla en mayúsculas
      disponibles
    );
    if (!elegida) return false;
    cartasElegidas.push(elegida);
  }

  cartasElegidas.forEach(carta => {
    let index = jugador.zonas[zona].indexOf(carta);
    jugador.zonas[zona].splice(index, 1);
    jugador.trash.push(carta);
    game.gutsDescartados.push(...cartasElegidas);
  });
  
  renderCampo(); 
  renderMano(); 
  renderManoRival() 
  log(t("log.gutsUsado", { zona: zona }));
  if (modoOnline) {
    enviarJugada("gutsUsado", {                          // enviar GUTS al rival
      zona: zona,                                        // zona donde se usó
      cartasIds: cartasElegidas.map(c => c.info?.id)    // ids de las cartas descartadas
    });
  }
  return true;
}
// ==================================================================================================================================================== PRIMEROS EJEMPLOS DE JUGAR CARTA
// ==================================================================================================================================================== A BORRAR DESDE AQUI
/*
// ============================================================================================================================= BOTÓN
// ============================================================================================================================= SAQUE 
function jugarSaque() { // al hacer clic en el botón con este nombre
  if (!esTurnoValido("saque")) { // si no estamos en el turno de saque
    log(t("log.noEsFase", { zona: t("ui.zonaSaque") }));
    return;
  }
  if (!game.cartaSeleccionada) {
  log("Selecciona una carta primero ❌");
  return;
  }
  const jugador = game.jugadores[game.jugadorActivo]; // crear la constante del jugador activo
  colocarCarta(jugador, game.cartaSeleccionada, "saque"); // el jugador activo (constante) coloca la carta demo (constante) en la zona de saque (a mano)
  game.cartaSeleccionada = null; // se deselecciona la carta
}
// ============================================================================================================================= BOTÓN
// ========================================================================================================================= RECEPCIÓN 
function jugarRecepcion() {
  if (!esTurnoValido("recepcion")) {
    log("No puedes jugar recepción ahora ❌");
    return;
  }
  if (!game.cartaSeleccionada) {
  log("Selecciona una carta primero ❌");
  return;
  }
  const jugador = game.jugadores[game.jugadorActivo];
  colocarCarta(jugador, game.cartaSeleccionada, "recepcion");
  game.cartaSeleccionada = null;
}
// ============================================================================================================================= BOTÓN
// ============================================================================================================================== PASE 
function jugarPase() {
  if (!esTurnoValido("pase")) {
    log("No puedes jugar pase ahora ❌");
    return;
  }
  if (!game.cartaSeleccionada) {
  log("Selecciona una carta primero ❌");
  return;
  }
  const jugador = game.jugadores[game.jugadorActivo];
  colocarCarta(jugador, game.cartaSeleccionada, "pase");
  game.cartaSeleccionada = null;
}
// ============================================================================================================================= BOTÓN
// ============================================================================================================================ REMATE 
function jugarRemate() {
  if (!esTurnoValido("remate")) {
    log("No puedes jugar remate ahora ❌");
    return;
  }
  if (!game.cartaSeleccionada) {
  log("Selecciona una carta primero ❌");
  return;
  }
  const jugador = game.jugadores[game.jugadorActivo];
  colocarCarta(jugador, game.cartaSeleccionada, "remate");
  game.cartaSeleccionada = null;
}
// ============================================================================================================================= BOTÓN
// =============================================================================================================== AÑADIR BLOQUEADORES
function jugarBloqueo() {
  if (!esTurnoValido("bloqueo")) {
    log("No puedes jugar bloqueo ahora ❌");
    return;
  }
  if (!game.cartaSeleccionada) {
  log("Selecciona una carta primero ❌");
  return;
  }
  const jugador = game.jugadores[game.jugadorActivo];
  colocarCarta(jugador, game.cartaSeleccionada, "bloqueo");
}
// ============================================================================================================================= BOTÓN
// ======================================================================================================================= JUGAR CARTA
function jugarCarta() {
  switch(game.fase) {
    case "saque": jugarSaque(); break;
    case "recepcion": jugarRecepcion(); break;
    case "pase": jugarPase(); break;
    case "remate": jugarRemate(); break;
    case "bloqueo": jugarBloqueo(); break;
    default: log("No puedes jugar una carta en esta fase ❌");
  }
}
*/
// ==================================================================================================================================================== A BORRAR HASTA AQUI


// =========================================================================================================================== BOTONES
// ==================================================================================================================== RESOLVER SAQUE 
function resolverSaque() {
  if (game.fase !== "saque") {
    log(t("log.noEsFase", { zona: t("ui.zonaSaque") }));
    return;
  }
  if (!esResolverValido()) return; // comprobar turno en online
  let jugador = game.jugadores[game.jugadorActivo];
  let carta = jugador.zonas.saque.at(-1);
  if (!carta || !carta.recienJugada) {
    log(t("log.noCartaEnZona", { zona: t("ui.zonaSaque") }));
    return;
  }

  log(t("log.sacaConPotencia", { carta: carta.nombre, valor: game.valorAtaque }));

  game.gutsDescartados = [];
  game.fase = "recepcion";

  // en online el que roba tras el saque es siempre el rival local
  if (modoOnline) {
    enviarJugada("robarCarta", { cantidad: 1 });          // avisar al rival que debe robar
  } else {
    let rivalIndex = game.jugadorActivo === 0 ? 1 : 0;    // índice del rival
    robarCarta(game.jugadores[rivalIndex], 1);            // el rival roba
  }
  if (modoOnline) enviarFase("recepcion"); // avisar al rival del cambio de fase
  cambiarJugador();
  actualizarFaseUI();
  renderCampo();
  renderMano();
  renderManoRival()
}
// ============================================================================================================================= BOTÓN
// ================================================================================================================ RESOLVER RECEPCIÓN 
function resolverRecepcion() {
  if (game.fase !== "recepcion") {
    log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
    return;
  }
  if (!esResolverValido()) return;                      // comprobar turno en online

  let defensa = game.valorAtaque;                       // saque del rival
  let jugador = game.jugadores[game.jugadorActivo];     // jugador actual
  let carta = jugador.zonas.recepcion.at(-1);           // buscar carta en recepción

  if (!carta || !carta.recienJugada) {
    log(t("log.noCartaEnZona", { zona: t("ui.zonaRecepcion") }));
    return;
  }

  let valorRecepcion = carta.stats.recepcion + game.valorDefensa;
  log(t("log.recepcionVsAtaque", { recepcion: valorRecepcion, ataque: defensa }));

  if (valorRecepcion >= defensa) { // ================================================================= Recepción exitosa
    log(t("log.buenaRecepcion", { carta: carta.nombre, valor: valorRecepcion }));
    game.fase = "pase";                                 // cambiar fase a pase
    game.valorAtaque = 0;                               // resetear ataque
    game.valorDefensa = 0;                              // resetear defensa
    if (modoOnline) enviarFase("pase");                 // avisar al rival del cambio de fase
    actualizarFaseUI();                                 // actualizar letrero
    renderMano();                                       
    renderManoRival()
    renderCampo();                                      

  } else { // ========================================================================================= Recepción fallida
    log(t("log.recepcionFallida", { carta: carta.nombre, valor: valorRecepcion }));

    let rivalIndex = game.jugadorActivo === 0 ? 1 : 0; // índice del rival en local
    if (modoOnline) {
      rivalIndex = miNumero === 1 ? 1 : 0;             // en online el rival es siempre el otro
    }
    let rival = game.jugadores[rivalIndex];             // jugador rival

    perderPunto(jugador);                               // el que falla pierde el punto
    log(t("log.puntoParaRival", { jugador: rival.nombre }));

    limpiarJugada();                                    // limpiar estado de la jugada
    game.fase = "saque";                                // volver a fase de saque

    if (modoOnline) {
      enviarCambioTurno(rivalIndex);                    // el rival ganó el punto, saca él
      enviarFase("saque");                              // avisar cambio de fase
    } else {
      cambiarJugador(rivalIndex);                       // cambiar al rival en local
    }

    actualizarFaseUI();                                 // actualizar letrero
    actualizarMarcador();                               // actualizar marcador
    renderMano();                                       // redibujar mano
    renderManoRival();                                  // redibujar mano rival
    renderCampo();                                      // redibujar campo
  }

  // efectos de cartas
  game.efectosActivos = game.efectosActivos.filter(e => e.tipo !== "negarReceptorAlto");
}
// ============================================================================================================================= BOTÓN
// ===================================================================================================================== RESOLVER PASE 
function resolverPase(){
  if (game.fase !== "pase"){
    log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
    return;
  }
  if (!esResolverValido()) return;                    // comprobar turno en online
  let jugador = game.jugadores[game.jugadorActivo];   // jugador activo
  let carta = jugador.zonas.pase.at(-1);              // última carta colocada en la zona

  if (!carta || !carta.recienJugada) {
    log(t("log.noCartaEnZona", { zona: t("ui.zonaPase") }));
    return;
  }

  log(t("log.paseConPotencia", { carta: carta.nombre, valor: game.valorAtaque }));
  game.gutsDescartados = [];
  game.fase = "remate";
  if (modoOnline) enviarFase("remate"); // avisar al rival del cambio de fase
  actualizarFaseUI();
  renderMano();
  renderManoRival()
  renderCampo();
}
// ============================================================================================================================= BOTÓN
// =================================================================================================================== RESOLVER REMATE
function resolverRemate() {
  if (game.fase !== "remate") {
    log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
    return;
  }
  if (!esResolverValido()) return;                  // comprobar turno en online
  let atacante = game.valorAtaque;                  // valor del pase que se ha enviado al atacante
  let jugador = game.jugadores[game.jugadorActivo]; // jugador activo
  let carta = jugador.zonas.remate.at(-1);          // carta colocada en la zona
  let valorRemate = carta.stats.remate;             // remate del atacante
  if (!carta || !carta.recienJugada) {
    log(t("log.noCartaEnZona", { zona: t("ui.zonaRemate") }));
    return;
  }
  game.valorAtaque = atacante + valorRemate;
  log(t("log.remataConPotencia", { carta: carta.nombre, valor: game.valorAtaque }));
  game.gutsDescartados = [];
  game.fase = "bloqueo";
  if (modoOnline) enviarFase("bloqueo"); // avisar al rival del cambio de fase
  cambiarJugador();
  actualizarFaseUI();
  renderMano();
  renderManoRival()
  renderCampo();
}
// ============================================================================================================================= BOTÓN
// ================================================================================================================== RESOLVER BLOQUEO 
function resolverBloqueo() {
  if (game.fase !== "bloqueo") {
    log(t("log.noEsFase", { zona: t("ui.zonaBloqueo") }));
    return;
  }
  if (!esResolverValido()) return;                      // comprobar turno en online

  let jugador = game.jugadores[game.jugadorActivo];     // jugador activo
  let defensaTotal = game.valorDefensa;                 // empezar con los bonuses acumulados

  if (game.bloqueoActual.central) {
    let efecto = game.efectosActivos.find(e => e.tipo === "anularBloqueadorCentral");
    if (efecto && efecto.activadoPor !== game.jugadorActivo) {
      log(t("log.efectoAnularBloqueadorCentral"));
      game.valorDefensa = 0;                            // resetear defensa
      defensaTotal = 0;                                 // resetear defensaTotal
    } else {
      defensaTotal += game.bloqueoActual.central.stats.bloqueo; // sumar bloqueo central
    }
  }

  game.bloqueoActual.apoyos.forEach(carta => {
    defensaTotal += carta.stats.bloqueo;                // sumar bloqueo de apoyos
  });

  log(t("log.defensaTotal", { valor: defensaTotal }));

  if (tieneEfecto("bloqueoMinimo")) {
    let efecto = game.efectosActivos.find(e => e.tipo === "bloqueoMinimo");
    if (defensaTotal <= efecto.valor) {
      log(t("log.bloqueoMinimoForzado"));
    }
  }

  if (defensaTotal >= game.valorAtaque) { // ================================= BLOQUEO EXITOSO
    log(t("log.bloqueoExitoso"));
    if (tieneEfecto("doshat")) {
      let efecto = game.efectosActivos.find(e => e.tipo === "doshat");
      game.valorAtaque = efecto.valor;                  // potencia del contraataque
      log(t("log.bloqueoOfensivo", { valor: efecto.valor }));
    } else {
      game.valorAtaque = 0;                             // contraataque normal
    }

    game.valorDefensa = 0;                              // resetear defensa
    game.gutsDescartados = [];                          // limpiar GUTS descartados

    if (modoOnline) {
      enviarJugada("robarCarta", { cantidad: 1 });      // avisar al rival que robe 1 carta
    } else {
      let rivalIndex = game.jugadorActivo === 0 ? 1 : 0; // índice del rival
      robarCarta(game.jugadores[rivalIndex], 1);          // el rival roba
    }

    game.fase = "recepcion";                            // cambiar fase
    if (modoOnline) enviarFase("recepcion");            // avisar al rival del cambio de fase
    cambiarJugador();                                   // cambiar turno
    actualizarFaseUI();                                 // actualizar letrero
    renderMano();                                       // redibujar mano
    renderManoRival()
    renderCampo();                                      // redibujar campo

  } else { // ================================================================ BLOQUEO FALLIDO
    log(t("log.bloqueoFallido"));
    game.valorDefensa = 0;                              // resetear defensa
    game.gutsDescartados = [];                          // limpiar GUTS descartados

    if (modoOnline) {
      robarCarta(game.jugadores[miNumero - 1], 1);      // el bloqueador roba en su propia pestaña
    } else {
      robarCarta(jugador, 1);                           // el jugador activo roba
    }

    game.fase = "recepcion";                            // cambiar fase
    if (modoOnline) enviarFase("recepcion");            // avisar al rival del cambio de fase
    actualizarFaseUI();                                 // actualizar letrero
    renderMano();                                       // redibujar mano
    renderManoRival()
    renderCampo();                                      // redibujar campo
  }

  jugador.zonas.bloqueoApoyo.forEach(carta => {        // para cada carta de apoyo
    jugador.trash.push(carta);                          // enviar al trash
  });
  jugador.zonas.bloqueoApoyo = [];                      // vaciar zona de apoyo
  game.bloqueoActual = {                                // limpiar bloqueo actual
    central: null,
    apoyos: []
  };

  if (modoOnline) {
    enviarJugada("limpiarBloqueadores", {});               // avisar al rival que limpie bloqueadores
    enviarTrash(jugador);                                  // sincronizar trash con las cartas de apoyo
  }

  game.efectosActivos = game.efectosActivos              // limpiar efectos de bloqueo
    .filter(e => e.tipo !== "negarBloqueadoresApoyo");
  renderCampo();                                         // redibujar campo
}
// ============================================================================================================================= BOTÓN
// ==================================================================================================================== USAR HABILIDAD 
function usarHabilidad() {
  // =================================================== variables por si acaso
  let carta = game.ultimaCarta;
  let jugador = game.ultimoJugador;
  // =================================================== comprobaciones de efectos
  if (tieneEfecto("anularHabilidadReceptor")) {
    let efecto = game.efectosActivos.find(e => e.tipo === "anularHabilidadReceptor");
    if (efecto.activadoPor !== game.jugadorActivo && carta.zonaActual === "recepcion") {
      log(t("log.anularHabilidadReceptor"));
      return;
    }
  }
  if (tieneEfecto("anularHabilidadColocador")) {
    let efecto = game.efectosActivos.find(e => e.tipo === "anularHabilidadColocador");
    if (efecto.activadoPor !== game.jugadorActivo && carta.zonaActual === "pase") {
      log(t("log.anularHabilidadColocador"));
      return;
    }
  }
  // =================================================== comprobaciones básicas
  if (carta.info?.activacionMano && carta.zonaActual !== null) { // ---- si habilidad desde mano
    log(t("log.soloDesdeMano"));
    return;
  }
  if (jugador.zonas[carta.zonaActual]?.at(-1) !== carta) { // ------------ si carta en el GUTS
    log("Esta carta está en el GUTS y no puede usar su habilidad ❌");
    return;
  }
  if (!carta || !carta.habilidad) { // --------------- si carta sin habilidad
    log("Esta carta no tiene habilidad.");
    return;
  }
  if (carta.habilidadUsada) { // ------------------------- si habilidad usada
    log("Esta habilidad ya fue usada.");
    return;
  }


  let resultado = carta.habilidad(jugador, game, carta);
  if (resultado !== false) { // solo marcar como usada si no fue cancelada
    carta.habilidadUsada = true;
  }
  renderCampo();
  renderMano();
  renderManoRival()
}

// ============================================================================================================================= BOTÓN
// ====================================================================================================================== JUGAR EVENTO 
function jugarEvento() {
  // ==================================================================================================== Comprobaciones
  if (!game.cartaSeleccionada) {
    log("Selecciona una carta primero ❌");
    return;
  }
  let jugador = game.jugadores[game.jugadorActivo];
  let carta = game.cartaSeleccionada;
  if (carta.info?.tipo !== "evento") {
    log("Esta carta no es un evento ❌");
    return;
  }
  if (!carta.info.fases.includes(game.fase)) {
    log("No puedes jugar este evento en fase de " + game.fase + " ❌");
    return;
  }

  // ==================================================================================================== Efectos
  if (tieneEfecto("negarEventosBloqueo")) {                                  // si efecto activo
    let efecto = game.efectosActivos.find(e => e.tipo === "negarEventosBloqueo"); // buscar efecto
    if (efecto.activadoPor !== game.jugadorActivo &&                         // si lo activó el rival
        carta.info?.fases?.includes("bloqueo")) {                            // y es evento de bloqueo
      log("No puedes jugar eventos de bloqueo este turno ❌");               // mostrar mensaje
      return;                                                                // cancelar
    }
  }
  if (carta.info?.unica) {                                         // si la carta tiene restricción 1 Única
    let yaJugada = jugador.zonas.eventos.some(                     // buscar en la zona de eventos
      e => e.nombre === carta.nombre                               // si ya hay una carta con ese nombre
    );
    if (yaJugada) {                                                // si ya fue jugada este turno
      log("Ya has jugado una carta de " + carta.nombre + " este turno ❌");
      jugador.mano.push(carta);                                    // devolver a la mano
      renderMano();                                                // actualizar mano
      renderManoRival();                                           // actualizar mano rival
      return;                                                      // cancelar
    }
  }

  

  let index = jugador.mano.indexOf(carta); 
  if (index !== -1) jugador.mano.splice(index, 1); // sacar de la mano

  jugador.zonas.eventos.push(carta); // colocar en zona de eventos
  carta.zonaActual = "eventos";
  // game.ultimaCarta = carta;
  // game.ultimoJugador = jugador;

  log(jugador.nombre + " juega el evento: " + carta.nombre);

  if (carta.habilidad) { // activar el efecto
    carta.habilidad(jugador, game, carta);
  }

  game.cartaSeleccionada = null;
  if (modoOnline) {
    enviarJugada("eventoJugado", {    // enviar evento al rival
      cartaId: carta.info.id          // id del evento jugado
    });
  }
  renderMano();
  renderManoRival()
  renderCampo();
}
// ============================================================================================================================= BOTÓN
// ================================================================================================================== JUGAR DESDE MANO 
function jugarHabilidadDesdeMano() {
  if (!game.cartaSeleccionada) {
    log("Selecciona una carta primero.");
    return;
  }
  // ============================================== Efectos de  habilidades
  let efectoMano = game.efectosActivos.find(e => e.tipo === "negarCartaDesdeMano");
  if (efectoMano && efectoMano.fases.includes(game.fase)) {
    log("No puedes usar habilidades desde la mano en " + game.fase + " ❌");
    return;
  }

  let carta = game.cartaSeleccionada;

  if (carta.info?.tipo !== "personaje" || !carta.info?.activacionMano) {
    log("Esta carta no tiene habilidad de mano ❌");
    return;
  }

  if (!carta.info.fases.includes(game.fase)) {
    log("No puedes usar esta habilidad en fase de " + game.fase + " ❌");
    return;
  }

  let jugador = game.jugadores[game.jugadorActivo];

  let index = jugador.mano.indexOf(carta);
  if (index !== -1) jugador.mano.splice(index, 1);
  jugador.trash.push(carta);
  log(jugador.nombre + " descarta " + carta.nombre + " desde la mano para activar su habilidad.");

  if (carta.habilidad) {
    carta.habilidad(jugador, game, carta);
  }

  game.cartaSeleccionada = null;

  if (modoOnline) {
    enviarJugada("habilidadDesdeMano", {                       // avisar al rival
      cartaId: carta.info.id                                   // id de la carta usada
    });
    enviarTrash(jugador);                                      // sincronizar trash
  }

  renderMano();
  renderManoRival()
  renderCampo();
}
// ============================================================================================================================= BOTÓN
// ==================================================================================================================== CONCEDER PUNTO
function concederPunto() {
  if (modoOnline && game.jugadorActivo !== miNumero - 1) { // comprobar turno en online
    log(t("log.noEsTuTurno")); 
    return;
  }

  let rivalIndex = game.jugadorActivo === 0 ? 1 : 0;      // índice del rival
  let rival = game.jugadores[rivalIndex];                 // jugador rival

  perderPunto(game.jugadores[game.jugadorActivo]);         // el que concede pierde el punto
  log(game.jugadores[game.jugadorActivo].nombre + " concede el punto.");
  log("Punto para " + rival.nombre);                       

  limpiarJugada();                                         // limpiar estado de la jugada

  if (modoOnline) {
    enviarJugada("concederPunto", {});                     // avisar al rival
    enviarFase("saque");                                   // avisar cambio de fase
    enviarCambioTurno(rivalIndex);                         // el rival saca
  } else {
    cambiarJugador(rivalIndex);                            // cambiar turno en local
  }

  game.fase = "saque";                                     // volver a saque

  actualizarMarcador();                                    // actualizar marcador
  actualizarFaseUI();                                      // actualizar letrero
  renderMano();                                            // redibujar mano
  renderManoRival();                                       // redibujar mano rival
  renderCampo();                                           // redibujar campo
}
// ============================================================================================================================= BOTÓN
// =============================================================================================================== DESELECCIONAR CARTA
function deseleccionarCarta() {
  if (!game.cartaSeleccionada) {
    log("No hay carta seleccionada ❌");
    return;
  }
  // log("Carta deseleccionada: " + game.cartaSeleccionada.nombre);
  game.cartaSeleccionada = null;
  renderMano(); // para quitar el marco rojo de selección
  renderManoRival()
}

// ============================================================================================================================= BOTÓN
// ========================================================================================================== MOSTRAR ESTADO DEL JUEGO
function mostrarEstado() {

  game.jugadores.forEach(jugador => {

    log("\n====================");
    log("Jugador: " + jugador.nombre);
    log("Puntos: " + jugador.puntos);
    log("====================");

    // ZONAS
    log("ZONAS:");

    for (let zona in jugador.zonas) {

      const carta = jugador.zonas[zona];

      if (Array.isArray(carta)) {
        log("- " + zona + ": " + carta.length + " cartas");
      } else if (carta) {
        log("- " + zona + ": " + carta.nombre);
      } else {
        log("- " + zona + ": vacío");
      }
    }

  });
}

// ===================================================================================================================================
// ========================================================================================================== ACTUALIZAR FASE DE LA UI
function actualizarFaseUI() { // texto que indica la fase de juego en directo
  document.getElementById("faseActual").textContent =
    "Fase: " + game.fase;
  let btnMulligan = document.getElementById("btn-confirmar-mulligan");
  btnMulligan.style.display = game.fase === "mulligan" ? "block" : "none"; // solo visible en mulligan
  document.getElementById("contador-ataque").textContent = "⚔️ " + game.valorAtaque;  // actualiza contador ataque
  document.getElementById("contador-defensa").textContent = "🛡️ " + game.valorDefensa; // actualiza contador defensa
  moverPelota()
}

// ===================================================================================================================================
// ======================================================================================================= FUNCIÓN QUE MUESRTA LA MANO
function renderMano() {
  // en online siempre mostrar la mano del jugador local
  const jugador = modoOnline 
    ? game.jugadores[miNumero - 1] 
    : game.jugadores[game.jugadorActivo];
  const contenedor = document.getElementById("mano");
  document.getElementById("nombreJugadorActivo").textContent = "Jugador: " + jugador.nombre;
  contenedor.innerHTML = "";

  let totalCartas = jugador.mano.length;
  let contenedorAncho = contenedor.offsetWidth;
  let cartaAncho = 80;
  let overlapNecesario = totalCartas > 1 
  ? Math.max(0, (totalCartas * cartaAncho - contenedorAncho) / (totalCartas - 1))
  : 0;

  jugador.mano.forEach((carta, index) => {

    const div = document.createElement("div");
    div.classList.add("carta");
    div.style.marginLeft = index === 0 ? "0" : `-${overlapNecesario}px`;

    if (carta.info?.id) {
      div.style.backgroundImage = `url('img/cartas/${carta.info.id}.png')`;
    } else {
      div.textContent = carta.nombre;
    }

    if (carta === game.cartaSeleccionada) {
      div.classList.add("seleccionada");
    }

    div.onclick = () => {
      if (game.fase === "mulligan") {
        if (modoOnline && game.mulliganConfirmado[miNumero - 1]) return; // bloqueado tras confirmar
        seleccionarCarta(carta);
        const jugadorMulligan = modoOnline 
          ? game.jugadores[miNumero - 1]
          : game.jugadores[game.jugadorActivo];
        hacerMulligan(jugadorMulligan);
        return;
      }
      seleccionarCarta(carta);
      game.ultimaCarta = null; 
      renderMano();
      renderCampo();
      renderManoRival()
    };

    div.addEventListener("mouseover", (e) => mostrarTooltip(carta, e));
    div.addEventListener("mousemove", (e) => mostrarTooltip(carta, e));
    div.addEventListener("mouseout", () => {
      document.getElementById("tooltip").style.display = "none";
    });
    contenedor.appendChild(div);
  });
  if (modoOnline) enviarCantidadMano();                        // enviar cantidad de cartas al rival
}
// ======================================================================================================= MANO DEL RIVAL
function renderManoRival() {
  if (!modoOnline) return;                               // solo en modo online

  const rivalIndice = miNumero === 1 ? 1 : 0;           // índice del rival
  const rival = game.jugadores[rivalIndice];             // jugador rival
  const contenedor = document.getElementById("mano-rival"); // contenedor de la mano rival

  if (!contenedor) return;                               // si no existe el contenedor, ignorar
  contenedor.innerHTML = "";                             // limpiar contenedor

  rival.mano.forEach(() => {                             // para cada carta del rival
    const div = document.createElement("div");           // crear div
    div.classList.add("carta");                          // añadir clase carta
    div.style.backgroundImage = "url('img/cartas/cardback.png')"; // dorso
    div.style.marginLeft = "-40px";                               // superponer cartas
    div.style.marginTop = "-70px";                                // esconder parte superior
    contenedor.appendChild(div);                         // añadir al contenedor
  });
}
// ======================================================================================================= BLOQUEAR / DESBLOQUEAR BOTONES
function bloquearUI() {
  document.querySelectorAll("button").forEach(btn => btn.disabled = true); // deshabilitar todos los botones
}
function desbloquearUI() {
  document.querySelectorAll("button").forEach(btn => btn.disabled = false); // habilitar todos los botones
}
// ===================================================================================================================================
// ================================================================================================================ ACTUALIZAR MARCADOR
function actualizarMarcador() {
  const j1 = document.getElementById("puntos-j1");
  const j2 = document.getElementById("puntos-j2");
  if (!j1 || !j2) return;                                    // ignorar si no existen
  j1.textContent = game.jugadores[0].nombre + ": " + game.jugadores[0].mazoPuntos.length + " 📛";
  j2.textContent = game.jugadores[1].nombre + ": " + game.jugadores[1].mazoPuntos.length + " 📛";
}
// ===================================================================================================================================
// =================================================================================================== PELOTA VISUAL PARA INDICAR FASE
const posicionesPelota = {
  0: { // jugador 1
    saque:     { top: 150, left: 120 },
    recepcion: { top: 175, left: 210 },
    pase:      { top: 175, left: 296 },
    remate:    { top: 175, left: 382 },
    bloqueo:   { top: 40,  left: 296 }
  },
  1: { // jugador 2
    saque:     { top: -20,  left: 430 },
    recepcion: { top: 12,   left: 342 },
    pase:      { top: 12,   left: 256 },
    remate:    { top: 12,   left: 170 },
    bloqueo:   { top: 130,  left: 256 }
  }
};

function moverPelota() {
  let pelota = document.getElementById("pelota");
  let campo = document.querySelector(".campo-central");
  
  const zonaIds = {
    0: { saque: "j1-saque", recepcion: "j1-recepcion", pase: "j1-pase", remate: "j1-remate", bloqueo: "j1-bloqueo" },
    1: { saque: "j2-saque", recepcion: "j2-recepcion", pase: "j2-pase", remate: "j2-remate", bloqueo: "j2-bloqueo" }
  };

  // en online el campo está invertido para el J2
  let indiceVisual = modoOnline 
    ? (game.jugadorActivo === miNumero - 1 ? 0 : 1)  // local = abajo (0), rival = arriba (1)
    : game.jugadorActivo;                              // en local usar jugadorActivo directamente
  let zonaId = zonaIds[indiceVisual][game.fase];
  if (!zonaId) return;

  let zona = document.getElementById(zonaId);
  if (!zona) return;

  let rectZona = zona.getBoundingClientRect(); // función del navegador que devuelve la posición exacta en la pantalla
  let rectCampo = campo.getBoundingClientRect();

  let top = rectZona.top - rectCampo.top;
  let left = rectZona.left - rectCampo.left;

  pelota.style.top = top + "px";
  pelota.style.left = left + "px";
}

// ===================================================================================================================================
// ======================================================================================== METER LAS CARTAS EN SUS ZONAS, VISUALMENTE
function renderCampo() {
  game.jugadores.forEach((jugador, i) => { // cada jugador
    let prefix;
    if (modoOnline) { // el jugador local siempre se dibuja como j1 (abajo)
      prefix = i === miNumero - 1 ? "j1" : "j2";
    } else {
      prefix = i === 0 ? "j1" : "j2";
    }

    for (let zona in jugador.zonas) { // ===================================== para cada ZONA de cada jugador
      if (zona === "bloqueoApoyo") continue; // saltamos esta zona, la renderizamos aparte
      let cont = document.getElementById(`${prefix}-${zona}`); // busca el div en el HTML para la zona
      cont.innerHTML = ""; // limpiar zona antes de redibujar

      // ===================================================================== ZONAS GUTS
      jugador.zonas[zona].forEach((carta, index) => {  
        let div = document.createElement("div");
        div.classList.add("carta");

        if (carta === game.ultimaCarta) {  
          div.classList.add("seleccionada");
          console.log("añadiendo clase seleccionada a:", carta.nombre);
        }
        if (carta.info?.id) {
          div.style.backgroundImage = `url('img/cartas/${carta.info.id}.png')`;
        } else {
          div.textContent = carta.nombre;
        }

        // apilar visualmente — cada carta se desplaza 3px hacia abajo
        div.style.top = (2 + index * 3) + "px";
        div.style.left = "2px";
        div.style.zIndex = index; // las últimas encima

        // TOOLTIP
        div.addEventListener("mouseover", (e) => mostrarTooltip(carta, e));
        div.addEventListener("mousemove", (e) => mostrarTooltip(carta, e));
        div.addEventListener("mouseout", () => {document.getElementById("tooltip").style.display = "none";});
        div.addEventListener("click", (e) => {
          let selector = document.getElementById("selector-cartas");
          if (selector.style.display === "flex") return;              // si hay selector abierto, no hacer nada

          const esRival = modoOnline && jugador !== game.jugadores[miNumero - 1]; // es carta del rival

          if (!carta.recienJugada || esRival) {                       // si es GUTS o es carta del rival
            const ultimaCarta = jugador.zonas[zona].at(-1);           // si la última carta es recienJugada, excluirla del GUTS
            const cartasGuts = ultimaCarta?.recienJugada 
              ? jugador.zonas[zona].slice(0, -1)                      // excluir la última si es recienJugada
              : jugador.zonas[zona];                                   // incluir todas si no es recienJugada
            if (cartasGuts.length === 0) {                            // si no hay GUTS
              if (!esRival) {                                         // solo seleccionar si es tuya
                game.ultimaCarta = carta;
                game.ultimoJugador = jugador;
                game.cartaSeleccionada = null;
                log("Carta seleccionada del campo: " + carta.nombre);
                renderMano();
                renderCampo();
              }
              return;
            }
            mostrarSelectorCartas(
              "GUTS de " + zona + " — " + cartasGuts.length + " carta(s)",
              cartasGuts,
              true                                                    // permite cerrar clicando fuera
            );
            return;
          }

          // carta recienJugada propia
          game.ultimaCarta = carta;
          game.ultimoJugador = jugador;
          game.cartaSeleccionada = null;
          console.log("click detectado en:", carta.nombre);
          log("Carta seleccionada del campo: " + carta.nombre);
          renderMano();
          renderCampo();
        });

        cont.appendChild(div);
        });
        actualizarContador(cont, jugador.zonas[zona].length); // muestra cuántas cartas hay en esta zona
      }

      // ================================================================================= RENDER BLOQUEADORES APOYO
      let apoyoIzqCont = document.getElementById(`${prefix}-bloqueoApoyoIzq`); // zona izquierda
      let apoyoDerCont = document.getElementById(`${prefix}-bloqueoApoyo`);     // zona derecha
      apoyoIzqCont.innerHTML = "";                                               // limpia zona izquierda
      apoyoDerCont.innerHTML = "";                                               // limpia zona derecha

      jugador.zonas.bloqueoApoyo.forEach((carta, index) => {                    // para cada apoyo
        let cont = index === 0 ? apoyoIzqCont : apoyoDerCont;                  // primero izq, segundo der
        let div = document.createElement("div");                                 // crea un div
        div.classList.add("carta");                                              // le aplica el CSS
        if (carta.info?.id) {
          div.style.backgroundImage = `url('img/cartas/${carta.info.id}.png')`; // imagen de la carta
        } else {
          div.textContent = carta.nombre;                                        // si no, el nombre
        }
        div.style.position = "absolute";                                         // posición absoluta
        div.style.top = "2px";                                                   // margen superior
        div.style.left = "2px";                                                  // margen izquierdo
        div.addEventListener("mouseover", (e) => mostrarTooltip(carta, e));     // tooltip al pasar
        div.addEventListener("mousemove", (e) => mostrarTooltip(carta, e));     // tooltip al mover
        div.addEventListener("mouseout", () => {                                 // ocultar tooltip
          document.getElementById("tooltip").style.display = "none";
        });
        cont.appendChild(div);                                                   // añade al contenedor
      });

      // ========================================================================================= RENDER TRASH
      let trashCont = document.getElementById(`${prefix}-trash`); // busca el div del trash
      trashCont.innerHTML = "";                                    // limpia antes de redibujar
        if (jugador.trash.length > 0) {
          let carta = jugador.trash.at(-1);                              // coge la última carta
          let capas = Math.min(jugador.trash.length, 4);                 // máximo 4 capas visibles
          for (let i = 0; i < capas; i++) {                              // una capa por cada carta simulada
            let div = document.createElement("div");                     // crea un div
            div.classList.add("carta");                                  // le aplica el CSS de carta
            div.style.position = "absolute";                             // posición absoluta
            div.style.top = (2 + i * -1) + "px";                         // cada capa un poco más abajo
            div.style.right = (2 + i * 0.5) + "px";                        // cada capa un poco más a la derecha
            div.style.zIndex = i;                                        // las últimas encima
            if (i === capas - 1) {                                       // solo la carta de arriba muestra imagen
              if (carta.info?.id) {
                div.style.backgroundImage = `url('img/cartas/${carta.info.id}.png')`; // imagen de la carta
              } else {
                div.textContent = carta.nombre;                          // si no, el nombre
              }
            } else {
              div.style.backgroundImage = "url('img/cartas/cardback.png')"; // las demás muestran dorso
            }
            trashCont.appendChild(div);                                  // añade al contenedor
          }
        }
      trashCont.addEventListener("mouseover", (e) => mostrarTooltip(jugador.trash.at(-1), e));
      trashCont.addEventListener("mousemove", (e) => mostrarTooltip(jugador.trash.at(-1), e));
      trashCont.addEventListener("mouseout", () => {
        document.getElementById("tooltip").style.display = "none";
      });
      trashCont.addEventListener("click", () => {
        let selector = document.getElementById("selector-cartas");
        if (selector.style.display === "flex") return;           // si hay selector abierto, no hacer nada
        if (jugador.trash.length === 0) return;                  // si está vacío, no hacer nada
        mostrarSelectorCartas(
          "Trash de " + jugador.nombre + " — " + jugador.trash.length + " carta(s)",
          jugador.trash,
          true                                                   // permite cerrar clicando fuera
        );
      });
      actualizarContador(trashCont, jugador.trash.length);        // muestra el número de cartas

      // =============================================================================================== RENDER PUNTOS
  let puntosCont = document.getElementById(`${prefix}-mazoPuntos`); // busca el div de puntos
  puntosCont.innerHTML = "";                                         // limpia antes de redibujar

    if (jugador.mazoPuntos.length > 0) {
      let capas = Math.min(jugador.mazoPuntos.length, 4);            // máximo 4 capas visibles
      for (let i = 0; i < capas; i++) {                              // una capa por cada carta simulada
        let div = document.createElement("div");                     // crea un div
        div.classList.add("carta");                                  // le aplica el CSS de carta
        div.style.backgroundImage = "url('img/cartas/cardback-horizontal.png')"; // dorso horizontal
        div.style.position = "absolute";                             // posición absoluta
        div.style.top = (2 + i * 7) + "px";                         // cada capa un poco más abajo
        div.style.left = (2 + i * 10) + "px";                        // cada capa un poco más a la derecha
        div.style.zIndex = i;                                        // las últimas encima
        puntosCont.appendChild(div);                                 // añade al contenedor
      }
    }

  actualizarContador(puntosCont, jugador.mazoPuntos.length);        // muestra el número de cartas
      // ================================================================================================ RENDER MAZO
      let mazoCont = document.getElementById(`${prefix}-mazo`); // busca el div del mazo en el HTML
      mazoCont.innerHTML = "";                                   // limpia antes de redibujar

      if (jugador.mazo.length > 0) {
        let capas = Math.min(jugador.mazo.length, 4);            // máximo 4 capas visibles
        for (let i = 0; i < capas; i++) {                        // una capa por cada carta simulada
          let div = document.createElement("div");               // crea un div
          div.classList.add("carta");                            // le aplica el CSS de carta
          div.style.backgroundImage = "url('img/cartas/cardback.png')"; // imagen de dorso
          div.style.position = "absolute";                       // posición absoluta
          div.style.top = (2 + i * -1) + "px";                   // cada capa un poco más abajo
          div.style.right = (2 + i * 0.5) + "px";                  // cada capa un poco más a la derecha
          div.style.zIndex = i;                                  // las últimas encima
          mazoCont.appendChild(div);                             // añade al contenedor
        }
      }

      actualizarContador(mazoCont, jugador.mazo.length);        // muestra el número de cartas del mazo
      // ================================================================================================= RENDER EVENTOS
      let eventosCont = document.getElementById(`${prefix}-eventos`); // busca el div de eventos
      if (eventosCont) {
        eventosCont.innerHTML = "";                                   // limpia antes de redibujar
        if (jugador.zonas.eventos.length > 0) {
          let carta = jugador.zonas.eventos.at(-1);                      // coge la última carta
          let capas = Math.min(jugador.zonas.eventos.length, 4);         // máximo 4 capas visibles
          for (let i = 0; i < capas; i++) {                              // una capa por cada carta simulada
            let div = document.createElement("div");                     // crea un div
            div.classList.add("carta");                                   // le aplica el CSS de carta
            div.style.position = "absolute";                             // posición absoluta
            div.style.top = (2 + i * -1) + "px";                         // cada capa un poco más abajo
            div.style.right = (2 + i * 0.5) + "px";                        // cada capa un poco más a la derecha
            div.style.zIndex = i;                                        // las últimas encima
            if (i === capas - 1) {                                       // solo la carta de arriba muestra imagen
              if (carta.info?.id) {
                div.style.backgroundImage = `url('img/cartas/${carta.info.id}.png')`; // imagen de la carta
              } else {
                div.textContent = carta.nombre;                          // si no, el nombre
              }
            } else {
              div.style.backgroundImage = "url('img/cartas/cardback.png')"; // las demás muestran dorso
            }
            eventosCont.appendChild(div);                                // añade al contenedor
          }
        }

        eventosCont.addEventListener("mouseover", (e) => mostrarTooltip(jugador.zonas.eventos.at(-1), e));
        eventosCont.addEventListener("mousemove", (e) => mostrarTooltip(jugador.zonas.eventos.at(-1), e));
        eventosCont.addEventListener("mouseout", () => {
          document.getElementById("tooltip").style.display = "none";
        });
        eventosCont.addEventListener("click", () => {
          let selector = document.getElementById("selector-cartas");
          if (selector.style.display === "flex") return;           // si hay selector abierto, no hacer nada
          if (jugador.zonas.eventos.length === 0) return;          // si está vacío, no hacer nada
          mostrarSelectorCartas(
            "Eventos de " + jugador.nombre + " — " + jugador.zonas.eventos.length + " carta(s)",
            jugador.zonas.eventos,
            true                                                   // permite cerrar clicando fuera
          );
        });
        actualizarContador(eventosCont, jugador.zonas.eventos.length); // muestra el número de cartas
      }
  }); 
}
// ===================================================================================================================================
// ================================================================================================================== CONTADOR DE ZONA
// Muestra un número pequeño en la esquina de una zona indicando cuántas cartas hay
function actualizarContador(contenedor, cantidad) {
  let anterior = contenedor.querySelector(".zona-contador"); // busca si ya hay un contador en esa zona
  if (anterior) anterior.remove();                           // si existe, lo borra para no duplicar

  if (cantidad > 0) {                                        // solo muestra el contador si hay cartas
    let span = document.createElement("span");               // crea un elemento de texto
    span.classList.add("zona-contador");                     // le aplica el CSS del contador
    span.textContent = cantidad;                             // escribe el número de cartas
    contenedor.appendChild(span);                            // lo añade encima de la zona
  }
}
// ===================================================================================================================================
// =================================================================================================================== MOSTRAR TOOLTIP
function mostrarTooltip(carta, e) {
  let tooltip = document.getElementById("tooltip");

  let infoAnyo = carta.info?.tipo === "evento" ? "" : `· ${carta.info?.anyo || ""}º`;
  
  let infoStats = carta.info?.tipo === "evento" ? "" : `
    <strong style="color:#1565c0">Rec: ${carta.stats.recepcion}</strong> · 
    <strong style="color:#2e7d32">Pase: ${carta.stats.pase}</strong> · 
    <strong style="color:#c62828">Rem: ${carta.stats.remate}</strong><br>
    <strong style="color:#e65100">Saque: ${carta.stats.saque}</strong> · 
    <strong style="color:#424242">Bloqueo: ${carta.stats.bloqueo}</strong><br>
  `;

  tooltip.innerHTML = `
    <img src="img/cartas/${carta.info?.id}.png" 
        style="width:100%; display:block;"
        onerror="this.style.display='none'">
    <div style="background:white; padding:8px; font-size:11px; border: 2px solid black; border-top: none;">
      <strong>${carta.nombre}</strong><br>
      <span style="color:#888">${carta.info?.escuela || ""} · ${carta.info?.posicion || ""} ${infoAnyo}</span><br><br>
      ${infoStats}
      ${carta.info?.descripcion ? `<br>${carta.info.descripcion}` : ""}
    </div>
  `;

  tooltip.style.display = "block";

  // posición — comprobar bordes
  let x = e.clientX + 15;
  let y = e.clientY + 15;
  if (x + tooltip.offsetWidth > window.innerWidth) x = e.clientX - tooltip.offsetWidth - 15;
  if (y + tooltip.offsetHeight > window.innerHeight) y = e.clientY - tooltip.offsetHeight - 15;

  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}
// ===================================================================================================================================
// ================================================================================================================= EFECTOS DE CARTAS
function negarBloqueadoresApoyo() {
  añadirEfecto("negarBloqueadoresApoyo");
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto: el rival solo puede colocar al bloqueador central este turno.");
}
function anularBloqueadorCentral() {
  game.efectosActivos.push({
    tipo: "anularBloqueadorCentral",
    activadoPor: game.jugadorActivo,
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto activo: el bloqueador central rival tendrá su bloqueo anulado.");
}
function limitarBloqueadores(max) {
  game.efectosActivos.push({
    tipo: "limitarBloqueadores",
    valor: max,
    activadoPor: game.jugadorActivo,
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto: el rival solo puede colocar hasta " + max + " bloqueadores de apoyo.");
}
function negarReceptorAlto() {
  añadirEfecto("negarReceptorAlto");
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto: el rival no puede colocar un receptor con recepción original de 6 o más.");
}
function anularHabilidadReceptor() {
  game.efectosActivos.push({
    tipo: "anularHabilidadReceptor",
    activadoPor: game.jugadorActivo,
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto activo: el siguiente receptor rival no podrá usar su habilidad.");
}
function anularHabilidadColocador() {
  game.efectosActivos.push({
    tipo: "anularHabilidadColocador",
    activadoPor: game.jugadorActivo,
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos();
  log("Efecto activo: el siguiente colocador rival no podrá usar su habilidad.");
}
function negarColocador() {
  game.efectosActivos.push({
    tipo: "negarColocador",
    activadoPor: game.jugadorActivo,
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto activo: el rival no podrá jugar un colocador (S) el próximo turno.");
}
function pagarConEvento(jugador) {
  let indexEvento = jugador.mano.findIndex(c => c.info?.tipo === "evento"); // buscar eventos en mano
  if (indexEvento === -1) { // si no tiene eventos en mano
    log("Necesitas una carta de evento en la mano ❌");
    carta.habilidadUsada = true;
    return false;
  }
  let evento = jugador.mano.splice(indexEvento, 1)[0];
  jugador.trash.push(evento); // trasehar evento de la mano
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Carta de evento enviada al trash como coste.");
  renderMano();
  renderManoRival()
  return true;
}
function añadirCartaAMano(jugador, carta) {
  jugador.mano.push(carta);
  
  let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;
  let rival = game.jugadores[rivalIndex];
  
  if (tieneEfecto("tendoSatori")) {
    robarCarta(rival, 1);
    log("Tendo Satori: roba 1 carta por efecto.");
  }
  if (modoOnline) enviarTrash(jugador);                      // sincronizar trash tras mover carta
  renderMano();
  renderManoRival()
}
function tendoSatori() { // robar cuando el rival roba
  game.efectosActivos.push({ 
    tipo: "tendoSatori",
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto Tendo: el rival robará 1 carta cada vez que añadas una carta a tu mano por medios no estándar 👁️");
}
function kageyamaSP() { // +2 al ataque de un Hinata
  game.efectosActivos.push({
    tipo: "kageyamaSP",
    expira: game.turno + 1 // dura hasta el próximo cambio de jugador
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto Kageyama SP: Hinata sumará +2 al remate este turno 💫");
}
function blockout(nivelBloqueo) {
  game.efectosActivos.push({
    tipo: "blockout",
    valor: nivelBloqueo, // bloqueo máximo afectado
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto Blockout(" + nivelBloqueo + "): los bloqueadores del rival con bloqueo ≤ " + nivelBloqueo + " irán al trash.");
}
function debilitarRematador() {
  game.efectosActivos.push({
    tipo: "debilitarRematador",
    activadoPor: game.jugadorActivo,
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto activo Debilitar Rematador : el próximo rematador rival tendrá al remate reducido.");
}
function debilitarColocador() {
  game.efectosActivos.push({
    tipo: "debilitarColocador",
    activadoPor: game.jugadorActivo,
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto activo Debilitar Colocador : el próximo colocador rival tendrá el pase reducido.");
}
function debilitarReceptor(cantidad = 1, soloSinHabilidad = false) {
  game.efectosActivos.push({
    tipo: "debilitarReceptor",
    activadoPor: game.jugadorActivo,
    valor: cantidad,
    soloSinHabilidad: soloSinHabilidad,
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto activo Debilitar Receptor: el próximo receptor rival tendrá -" + cantidad + "a la recepción.");
}
function debilitarBloqueadorCentral(cantidad) {
  game.efectosActivos.push({
    tipo: "debilitarBloqueadorCentral",
    activadoPor: game.jugadorActivo,
    valor: cantidad,
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos();                              // sincronizar efectos con el rival
  log("Efecto activo: el próximo bloqueador central rival tendrá -" + cantidad + " al bloqueo.");
}
function doshat(potencia) { // bloqueo ofensivo
  game.efectosActivos.push({
    tipo: "doshat",
    valor: potencia,
    expira: game.turno + 1
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto de Bloqueo Ofensivo (" + potencia + "): si el bloqueo es exitoso, el contraataque tendrá una potencia de " + potencia + ".");
}
function bloqueoMinimo(valor) {
  game.efectosActivos.push({
    tipo: "bloqueoMinimo",
    valor: valor,
    activadoPor: game.jugadorActivo,
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto activo: el bloqueo rival fallará si su defensa total es " + valor + " o menos.");
}
// ======================================= ONE TOUCH
function oneTouch(n) {
  if (tieneEfecto("negarOneTouch")) {
    log("El One Touch ha sido negado ❌");
    return false;
  }
  game.valorAtaque -= n;
  log("One Touch (" + n + "): -" + n + " al ataque rival. Ataque ahora: " + game.valorAtaque + " 🤚");
  game.fase = "recepcion";
  game.bloqueoActual = { central: null, apoyos: [] };
  actualizarFaseUI();
  renderMano();
  renderManoRival()
  renderCampo();
}
// ======================================== NEGAR ONE TOUCH
function negarOneTouch() {
  game.efectosActivos.push({
    tipo: "negarOneTouch",
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto activo: el rival no podrá usar One Touch en su próximo bloqueo.");
}
// ======================================== NEGAR USAR EFECTOS DESDE LA MANO
function negarCartaDesdeMano(fases) {
  game.efectosActivos.push({
    tipo: "negarCartaDesdeMano",
    fases: fases, // array de fases donde aplica, ej: ["recepcion"]
    expira: game.turno + 2
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto activo: el rival no podrá usar habilidades desde la mano en " + fases.join(", ") + ".");
}
// ======================================== NEGAR EVENTOS DE BLOQUEO
function negarEventosBloqueo() {
  game.efectosActivos.push({                                               // añadir efecto
    tipo: "negarEventosBloqueo",                                           // tipo del efecto
    activadoPor: game.jugadorActivo,                                       // quién lo activó
    expira: game.turno + 2                                                 // dura 1 turno rival
  });
  if (modoOnline) enviarEfectos(); // sincronizar efectos con el rival
  log("Efecto activo: el rival no podrá jugar eventos de bloqueo.");
}
// ======================================== BUSCAR EN EL TRASH
function filtrarTrash(jugador, { escuela, posicion, anyo, tipo, sinHabilidad } = {}) {
  return jugador.trash.filter(c => {
    if (escuela && c.info?.escuela !== escuela) return false;
    if (posicion && !posicion.includes(c.info?.posicion)) return false;
    if (anyo && c.info?.anyo !== anyo) return false;
    if (tipo && c.info?.tipo !== tipo) return false;
    if (sinHabilidad && c.habilidad !== null) return false;
    return true;
  });
}
function contarNombresUnicosEnTrash(jugador, escuela) {
  return new Set(
    jugador.trash
      .filter(c => c.info?.escuela === escuela && c.info?.tipo === "personaje")
      .map(c => c.nombre)
  ).size;
}


// ======================================== LLEVAR DEL TRASH A LA MANO
async function buscarEnTrashAMano(jugador, filtros, cantidad = 1) { // asyn porque tiene selector
  let elegibles = filtrarTrash(jugador, filtros);
  if (elegibles.length === 0) {
    log("No hay cartas válidas en el trash ❌");
    return false;
  }

  for (let i = 0; i < cantidad; i++) {
    let cartaElegida = await mostrarSelectorCartas("Elige una carta del trash:", elegibles);
    if (!cartaElegida) return false;

    // añadir carta a la mano y sacarla del trash
    let index = jugador.trash.indexOf(cartaElegida);
    jugador.trash.splice(index, 1);
    añadirCartaAMano(jugador, cartaElegida);
    log(cartaElegida.nombre + " añadido a la mano desde el trash.");

    elegibles = filtrarTrash(jugador, filtros);
  }
  renderMano();
  renderManoRival()
  renderCampo();
  return true;
}

// ===================================================================================================================================
// ================================================================================================================ HABILIDADES ÚNICAS
async function aplicarKenma019(jugador, carta) { // ========================================== KENMA P01-019
  // preguntar si quiere activar la habilidad
  let eleccion = await mostrarEleccion([
    { texto: "Activar habilidad de Kozume Kenma: GUTS-2 en pase para traer un jugador de Nekoma del GUTS de remate con +2." },
    { texto: "No activar" }
  ]);
  if (eleccion !== 0) return;                                     // si no quiere activar, ignorar

  // pagar 2 GUTS de pase
  if (!await usarGuts(jugador, "pase", 2)) {                      // pagar 2 GUTS de pase
    return;                                                       // return: GUTS insuficientes
  }

  // buscar personajes de Nekoma en el GUTS de remate (excluyendo recién jugadas)
  let gutRemate = jugador.zonas.remate.filter(c => !c.recienJugada && c.info?.escuela === "Nekoma");
  if (gutRemate.length === 0) {                                   // si no hay ninguno
    log("No hay personajes de Nekoma en el GUTS de remate.");
    return;                                                       // ignorar
  }

  // elegir carta del GUTS de remate
  let cartaElegida = await mostrarSelectorCartas(                 // abrir selector
    "Elige un personaje de Nekoma del GUTS de remate:",           // título
    gutRemate                                                     // cartas disponibles
  );
  if (!cartaElegida) return;                                      // si cancela, ignorar

  // sacar la carta elegida del GUTS
  let indexElegida = jugador.zonas.remate.indexOf(cartaElegida);  // buscar en la zona
  jugador.zonas.remate.splice(indexElegida, 1);                   // sacar del GUTS

  // el rematador actual pasa al GUTS
  let rematadorActual = jugador.zonas.remate.at(-1);              // rematador actual
  if (rematadorActual?.recienJugada) {                            // si hay rematador activo
    let indexActual = jugador.zonas.remate.indexOf(rematadorActual);
    jugador.zonas.remate.splice(indexActual, 1);                  // sacar de la zona
    jugador.zonas.remate.unshift(rematadorActual);                // enviar al GUTS
  }

  // colocar la carta elegida como rematador activo
  jugador.zonas.remate.push(cartaElegida);                        // colocar al final
  cartaElegida.zonaActual = "remate";                             // actualizar zona
  cartaElegida.recienJugada = true;                               // marcar como recién jugada
  cartaElegida.habilidadUsada = false;                            // habilidad no usada
  game.ultimaCarta = cartaElegida;                                // actualizar última carta
  game.ultimoJugador = jugador;                                   // actualizar último jugador

  game.valorAtaque += 2;              // sumar remate + 2 de bonus
  log("Efecto Kenma Kozume: " + cartaElegida.nombre + " colocado como rematador con +2 al remate.");

  let kenma = jugador.zonas.pase.at(-1);                          // buscar Kenma en pase
  if (kenma) kenma.habilidadUsada = true;                         // marcar habilidad como usada

  if (modoOnline && rematadorActual?.recienJugada) {
    enviarJugada("cartaMovida", {                                  // rematador anterior al GUTS
      zona: "remate",
      cartaId: rematadorActual.info?.id,
      posicion: "guts"
    });
  }
  if (modoOnline) {
    enviarJugada("cartaMovida", {                                  // nueva carta al frente
      zona: "remate",
      cartaId: cartaElegida.info.id,
      posicion: "ultimo"
    });
  }

  renderMano();                                                   // actualizar mano
  renderManoRival();                                              // actualizar mano rival
  renderCampo();                                                  // actualizar campo
}
async function aplicarYaku023(jugador, carta) { // =========================================== YAKU P01-023
  // preguntar si quiere activar la habilidad
  let eleccion = await mostrarEleccion([
    { texto: "Activar habilidad de Yaku Morisuke: descarta 1 carta de Nekoma de tu mano para +2 a la recepción." },
    { texto: "No activar" }
  ]);
  if (eleccion !== 0) return;                                     // si no quiere activar, ignorar

  // comprobar que hay cartas de Nekoma en la mano
  let nekomanEnMano = jugador.mano.filter(c => c.info?.escuela === "Nekoma"); // filtrar Nekoma
  if (nekomanEnMano.length === 0) {                               // si no hay ninguna
    log("No tienes cartas de Nekoma en la mano para descartar.");
    return;                                                       // ignorar
  }

  // elegir carta de Nekoma para descartar
  let cartaDescarte = await mostrarSelectorCartas(                // abrir selector
    "Elige una carta de Nekoma de tu mano para descartar:",       // título
    nekomanEnMano                                                 // solo Nekoma
  );
  if (!cartaDescarte) return;                                     // si cancela, ignorar

  let index = jugador.mano.indexOf(cartaDescarte);                // buscar en la mano
  jugador.mano.splice(index, 1);                                  // sacar de la mano
  jugador.trash.push(cartaDescarte);                              // enviar al trash
  log(cartaDescarte.nombre + " descartada de la mano como coste.");

  game.valorDefensa += 2;                                         // +2 a la recepción
  log("Efecto Yaku Morisuke: +2 a la recepción de " + carta.nombre + ".");

  let yaku = jugador.zonas.recepcion.at(-2);                      // buscar Yaku en recepción
  if (yaku) yaku.habilidadUsada = true;                           // marcar habilidad como usada

  if (modoOnline) enviarTrash(jugador);                           // sincronizar trash con el rival

  renderMano();                                                   // actualizar mano
  renderManoRival();                                              // actualizar mano rival
  renderCampo();                                                  // actualizar campo
}
async function aplicarYamamoto028(jugador, carta) { // ======================================= YAMAMOTO P01-028
  // preguntar si quiere activar la habilidad
  let eleccion = await mostrarEleccion([
    { texto: "Activar habilidad de Yamamoto Taketora: descarta 1 carta de Nekoma de tu mano para +1 al remate de " + carta.nombre + "." },
    { texto: "No activar" }
  ]);
  if (eleccion !== 0) return;                                     // si no quiere activar, ignorar

  // comprobar que hay cartas de Nekoma en la mano
  let nekomaEnMano = jugador.mano.filter(c => c.info?.escuela === "Nekoma"); // filtrar Nekoma
  if (nekomaEnMano.length === 0) {                                // si no hay ninguna
    log("No tienes cartas de Nekoma en la mano para descartar.");
    return;                                                       // ignorar
  }

  // elegir carta de Nekoma para descartar
  let cartaDescarte = await mostrarSelectorCartas(                // abrir selector
    "Elige una carta de Nekoma de tu mano para descartar:",       // título
    nekomaEnMano                                                  // solo Nekoma
  );
  if (!cartaDescarte) return;                                     // si cancela, ignorar

  let index = jugador.mano.indexOf(cartaDescarte);                // buscar en la mano
  jugador.mano.splice(index, 1);                                  // sacar de la mano
  jugador.trash.push(cartaDescarte);                              // enviar al trash
  log(cartaDescarte.nombre + " descartada de la mano como coste.");

  game.valorAtaque += 1;                                          // +1 al remate
  log("Efecto Yamamoto Taketora: +1 al remate de " + carta.nombre + ".");

  let yamamoto = jugador.zonas.remate.at(-2);                     // buscar Yamamoto en remate
  if (yamamoto) yamamoto.habilidadUsada = true;                   // marcar habilidad como usada

  if (modoOnline) enviarTrash(jugador);                           // sincronizar trash con el rival

  renderMano();                                                   // actualizar mano
  renderManoRival();                                              // actualizar mano rival
  renderCampo();                                                  // actualizar campo
}
async function aplicarLevApoyo(jugador) { // ================================================ LEV D02-004
  let levEnRemate = jugador.zonas.remate.find(c => c.nombre === "Haiba Lev"); // buscar Lev en remate

  let eleccion = await mostrarEleccion([                                    // preguntar al jugador
    { texto: "Añadir Haiba Lev como bloqueador de apoyo (GUTS - 2 de remate)" },
    { texto: "No" }
  ]);
  if (eleccion !== 0) return;                                               // si no quiere, ignorar

  if (!await usarGuts(jugador, "remate", 2)) {                              // pagar 2 GUTS de remate
    return;                                                                 // return: GUTS insuficientes
  }

  game.bloqueoActual.apoyos.push(levEnRemate);                              // añadir Lev al conteo de bloqueo
  jugador.zonas.bloqueoApoyo.push(levEnRemate);                             // añadir Lev a la zona de apoyo
  levEnRemate.zonaActual = "bloqueoApoyo";                                  // cambio de zona
  let index = jugador.zonas.remate.indexOf(levEnRemate);                    // buscar en remate
  if (index !== -1) jugador.zonas.remate.splice(index, 1);                 // sacar de remate
  log("Haiba Lev se une al bloqueo como apoyo desde remate.");

  if (modoOnline) {
    enviarJugada("cartaJugada", {                                            // avisar al rival
      zona: "bloqueoApoyo",                                                 // zona destino
      cartaId: levEnRemate.info.id                                          // id de Lev
    });
    enviarJugada("quitarCartaZona", {                                       // avisar que Lev sale de remate
      zona: "remate",                                                       // zona origen
      cartaId: levEnRemate.info.id                                          // id de Lev
    });
  }
  renderCampo();                                                            // actualizar campo
}
// ===================================================================================================================================
// ================================================================================================================= FIN DE LA PARTIDA
function mostrarFinPartida(gane) {
  const panel = document.getElementById("panel-fin");       // recuperar panel
  const titulo = document.getElementById("fin-titulo");     // recuperar título

  titulo.textContent = gane ? "¡Has ganado!" : "¡Has perdido!"; // mensaje según resultado
  panel.style.display = "block";                            // mostrar panel
}

function volverLobby() {
  if (modoOnline) borrarPartida();                          // borrar partida de Firebase
  window.location.href = "lobby.html";                     // volver al lobby
}

// ===================================================================================================================================
// ================================================================================================================= CREAR CARTAS TESTS

const todasLasCartas = inicializarCartas();

// cartas de prueba
/*let akaashi = todasLasCartas.find(c => c.nombre === "Keiji Akaashi");
game.jugadores[1].mano.push(akaashi);
game.jugadores[0].mano.push(
  crearCarta("Tanaka", { saque : 1, pase: 5 })
);

game.jugadores[0].mano.push(
  crearCarta("Hinata", { saque : 1, remate: 6 })
);

game.jugadores[0].mano.push(
  crearCarta("Kageyama", { pase: 4 })
);

game.jugadores[1].mano.push(
  crearCarta("Oikawa", { pase: 5 })
);

game.jugadores[1].mano.push(
  crearCarta("Kunimi", { remate: 6 })
);
// test guts y bokuto
//game.jugadores[1].trash.push(crearCarta("Kotaro Bokuto", { remate: 3 }));
//game.jugadores[1].zonas.pase.push(crearCarta("GUTS test 1", { pase: 3 }));
//game.jugadores[1].zonas.pase.push(crearCarta("GUTS test 2", { pase: 3 }));
// test bloqueo
//game.jugadores[0].mano.push(crearCarta("BLOQ 1", { bloqueo : 1 }));
//game.jugadores[0].mano.push(crearCarta("BLOQ 2", { bloqueo : 1  }));
//game.jugadores[0].mano.push(crearCarta("BLOQ 3", { bloqueo : 1  }));
game.jugadores[1].mano.push(
  crearCarta("Iwaizumi", { recepcion : 3 , pase: 4 }, habilidadTestRecepcion)
);*/

/*["Tsukishima Kei", "Hinata Shoyo", "Haruki Komi"].forEach(nombre => {
  let carta = todasLasCartas.find(c => c.nombre === nombre);
  if (carta) game.jugadores[0].mazo.push(carta);
});
["Tsukishima Kei", "Hinata Shoyo", "Nishinoya Yu", "Kageyama Tobio", "Keiji Akaashi", "Ataque amplio"].forEach(nombre => {
  let carta = todasLasCartas.find(c => c.nombre === nombre);
  if (carta) game.jugadores[1].mazo.push(carta);
});

let kageyama = todasLasCartas.find(c => c.info?.id === "HV-P01-008");
game.jugadores[0].mazo.push(kageyama);
let yu = todasLasCartas.find(c => c.info?.id === "HV-D01-004");
game.jugadores[0].mazo.push(yu);
let evento1 = todasLasCartas.find(c => c.info?.id === "HV-P01-066");
game.jugadores[0].mazo.push(evento1);
let usj = todasLasCartas.find(c => c.info?.id === "HV-P02-037");
game.jugadores[0].mazo.push(usj);
let aaz = todasLasCartas.find(c => c.info?.id === "HV-D01-010");
game.jugadores[0].mazo.push(aaz);
let aa = todasLasCartas.find(c => c.info?.id === "HV-P01-003");
game.jugadores[1].mazo.push(aa);
let st = todasLasCartas.find(c => c.info?.id === "HV-P01-068");
game.jugadores[1].mazo.push(st);
let kf = todasLasCartas.find(c => c.info?.id === "HV-P01-010");
game.jugadores[1].mazo.push(kf);
let hy = todasLasCartas.find(c => c.info?.id === "HV-P02-036");
game.jugadores[0].mazo.push(hy);
let hss = todasLasCartas.find(c => c.info?.id === "HV-D02-011");
game.jugadores[1].mazo.push(hss);
let gtsr = todasLasCartas.find(c => c.info?.id === "HV-P01-058");
game.jugadores[0].mazo.push(gtsr); */


// PRUEBAS -----------------------------------------------------------------------------------------------------------------
// PRUEBAS -----------------------------------------------------------------------------------------------------------------
// PRUEBAS -----------------------------------------------------------------------------------------------------------------
/*
// MANO J1
["HV-P01-080", "HV-D02-003", "HV-P01-019", "HV-P01-025", "HV-P01-083"].forEach(id => {
  let carta = todasLasCartas.find(c => c.info?.id === id);
  if (carta) game.jugadores[0].mano.push(carta);
  if (carta) game.jugadores[1].mano.push(carta);
});

// TRASH 
["HV-P01-003", "HV-P01-004", "HV-P02-032", "HV-P02-030", "HV-P02-028", "HV-P02-023", "HV-P02-019"].forEach(id => {
  let carta = todasLasCartas.find(c => c.info?.id === id);
  if (carta) game.jugadores[0].trash.push(carta);
  if (carta) game.jugadores[1].trash.push(carta);
});

// MAZO J1
["HV-D01-002", "HV-P02-085", "HV-P01-003", "HV-P02-015", "HV-P02-040", "HV-P02-041"].forEach(id => {
  let carta = todasLasCartas.find(c => c.info?.id === id);
  if (carta) game.jugadores[0].mazo.unshift(carta);
  if (carta) game.jugadores[1].mazo.unshift(carta);
});

// EVENTOS 
for (let i = 0; i < 5; i++) {
  let evento = todasLasCartas.find(c => c.info?.id === "HV-P01-078");
  game.jugadores[1].zonas.eventos.push(evento);
}
// MAZO J2
for (let i = 0; i < 10; i++) {
  let carta = todasLasCartas.find(c => c.info?.id === "HV-P02-044");
  game.jugadores[0].mazo.push(carta);
  game.jugadores[1].mazo.push(carta);
}
// GUTS de pase — Atsumu sin habilidad primero (el que está "jugado"), luego el P02-016 en el GUTS
let atsumuBase = todasLasCartas.find(c => c.info?.id === "HV-P01-063"); // Atsumu sin habilidad
let atsumuTP = todasLasCartas.find(c => c.info?.id === "HV-P02-016"); // Atsumu con habilidad
game.jugadores[1].zonas.pase.push(atsumuTP); // GUTS
game.jugadores[1].zonas.pase.push(atsumuBase); // el "jugado" — siempre el último
game.jugadores[0].zonas.pase.push(atsumuTP); // GUTS
game.jugadores[0].zonas.pase.push(atsumuBase); // el "jugado" — siempre el último
let kenPas = todasLasCartas.find(c => c.info?.id === "HV-D02-001"); // Osamu sin habilidad
let yakuPas = todasLasCartas.find(c => c.info?.id === "HV-D02-003"); // Osamu con habilidad
game.jugadores[1].zonas.pase.push(kenPas); 
game.jugadores[1].zonas.pase.push(yakuPas); 

// GUTS de remate — Osamu sin habilidad primero, luego el P02-020 en el GUTS
let osamuBase = todasLasCartas.find(c => c.info?.id === "HV-P01-064"); // Osamu sin habilidad
let osamuTP = todasLasCartas.find(c => c.info?.id === "HV-P02-020"); // Osamu con habilidad
let levT = todasLasCartas.find(c => c.info?.id === "HV-P01-025"); // Lev con habilidad
let levT2 = todasLasCartas.find(c => c.info?.id === "HV-D02-004"); // Lev con habilidad
game.jugadores[1].zonas.remate.push(osamuTP); // GUTS
game.jugadores[1].zonas.remate.push(osamuBase); // el "jugado" — siempre el último
game.jugadores[0].zonas.remate.push(osamuTP); // GUTS
game.jugadores[0].zonas.remate.push(osamuBase); // el "jugado" — siempre el último
game.jugadores[0].zonas.remate.push(levT); // GUTS
game.jugadores[1].zonas.remate.push(levT); // el "jugado" — siempre el último
game.jugadores[0].zonas.remate.push(levT2); // GUTS
game.jugadores[1].zonas.remate.push(levT2); // el "jugado" — siempre el último
// PRUEBA INARIZAKI -----------------------------------------------------------------------------------------------------------------

// mazos de prueba
let aoneP01 = todasLasCartas.find(c => c.info?.id === "HV-P01-054");
game.jugadores[0].trash.push(aoneP01);

// GUTS de prueba para ambos jugadores
["saque", "recepcion", "pase", "remate", "bloqueo"].forEach(zona => {
  for (let i = 0; i < 3; i++) {
    let gutsCarta = todasLasCartas.find(c => c.info?.id === "HV-P01-028"); // Sasaya, sin habilidad
    game.jugadores[0].zonas[zona].push(Object.assign({}, gutsCarta));
    game.jugadores[1].zonas[zona].push(Object.assign({}, gutsCarta));
  }
});

// mazo evento de pruebas
for (let i = 0; i < 5; i++) {
  let evento = todasLasCartas.find(c => c.info?.id === "HV-D01-011");
  game.jugadores[1].zonas.eventos.push(evento);
}
*/
// PRUEBAS -----------------------------------------------------------------------------------------------------------------
// PRUEBAS -----------------------------------------------------------------------------------------------------------------
// PRUEBAS -----------------------------------------------------------------------------------------------------------------

leerParametrosURL(); // conexión con la URL desde el lobby

if (!modoOnline) {  // IF añadido para el modo online
  // ambos jugadores roban su mano inicial
  iniciarMano(game.jugadores[0]); 
  iniciarMano(game.jugadores[1]);
  renderMano();  // mostrar la mano al jugador inicial al empezar el juego
  renderManoRival()
}