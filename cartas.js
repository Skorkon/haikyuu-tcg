/*
Recepción → #1565c0 (azul)
Pase → #2e7d32 (verde)
Remate → #c62828 (rojo)
Bloqueo → #424242 (gris oscuro)
Saque → #e65100 (naranja)

`<strong><span style="background:#e65100; color:white; padding:1px 4px; border-radius:2px;">Saque</span> GUTS - 3</strong>`
`<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS - 3</strong>`
`<strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span> GUTS - 2</strong>`
`<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> GUTS - 3</strong>:`
`<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span> GUTS - 1</strong>`
`<span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>One Touch (2)</strong></span> : resta 2 al ataque del rival y pasa directamente a fase de recepción.` 
*/

function inicializarCartas() {
  return [
  // ========================================================================================= D01 : KARASUNO
  crearCarta("Hinata Shoyo", // ============================================================== D01-001
    {
      saque: 2,
      recepcion: 2,
      pase: 0,
      remate: 2,
      bloqueo: 2
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "remate") {
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        return;
      }
      if (!await usarGuts(jugador, "remate", 2)) {
        return;
      }
      game.valorAtaque += 2;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-D01-001",
      escuela: "Karasuno",
      posicion: "MB",
      anyo: 1,
      rareza: "DP",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS 2</strong>: +2 al remate.`
    }
  ),
  crearCarta("Kageyama Tobio", // ============================================================== D01-002
    {
      saque: 1,
      recepcion: 2,
      pase: 1,
      remate: 1,
      bloqueo: 1
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "pase") {
        log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
        return;
      }
      if (!await usarGuts(jugador, "pase", 2)) {
        return;
      }
      game.valorAtaque += 2;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-D01-002",
      escuela: "Karasuno",
      posicion: "S",
      anyo: 1,
      rareza: "D",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Pase</span> GUTS - 2</strong>: +2 al pase.`
    }
  ),
  crearCarta("Tsukishima Kei", // ============================================================== D01-003
    {
      saque: 1,
      recepcion: 1,
      pase: 0,
      remate: 2,
      bloqueo: 3
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "bloqueo") {
        log(t("log.noEsFase", { zona: t("ui.zonaBloqueo") }));
        return;
      }
      if (game.valorAtaque > 4) {
        log(t("log.condicionNoCumplida"));
        return;
      }
      if (!await usarGuts(jugador, "bloqueo", 1)) {
        return;
      }
      robarCarta(jugador, 1, true);
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-D01-003",
      escuela: "Karasuno",
      posicion: "MB",
      anyo: 1,
      rareza: "D",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span> GUTS - 1</strong>: Sólo puedes usar esta habilidad si el ataque del rival es igual o inferior a 4. Roba una carta.`
    }
  ),
  crearCarta("Yamaguchi Tadashi", // ============================================================== D01-004
    {
      saque: 5,
      recepcion: 3,
      pase: 0,
      remate: 1,
      bloqueo: 3
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-D01-004",
      escuela: "Karasuno",
      posicion: "MB",
      anyo: 1,
      rareza: "D"
    }
  ),
  crearCarta("Nishinoya Yu", // =================================================================== D01-005
    {
      saque: 0,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "recepcion") {
        log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
        return;
      }
      if (!await usarGuts(jugador, "recepcion", 3)) {
        return;
      }
      robarCarta(jugador, 1, true);
      game.valorDefensa += 2;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-D01-005",
      escuela: "Karasuno",
      posicion: "L",
      anyo: 2,
      rareza: "D",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> GUTS - 3</strong>: roba 1 carta y +2 a la recepción.`,
      zonasProhibidas: ["saque", "bloqueo"]
    }
  ),
  crearCarta("Tanaka Ryunosuke", // ============================================================== D01-006
    {
      saque: 1,
      recepcion: 2,
      pase: 1,
      remate: 3,
      bloqueo: 2
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-D01-006",
      escuela: "Karasuno",
      posicion: "WS",
      anyo: 2,
      rareza: "D"
    }
  ),
  crearCarta("Ennoshita Chikara", // ============================================================== D01-007
    {
      saque: 2,
      recepcion: 2,
      pase: 0,
      remate: 3,
      bloqueo: 1
    },
    async function(jugador, game, carta) {              // async porque tiene selector de descarte
      if (carta.zonaActual !== "recepcion") {           // comprobar que está en recepción
        log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
        carta.habilidadUsada = false;                   // resetear para no bloquear la habilidad
        return false;                                   // return false: habilidad no ejecutada
      }
      if (jugador.mano.length === 0) {                  // comprobar que hay cartas en mano
        log("No tienes cartas en la mano para descartar.");
        carta.habilidadUsada = false;                   // resetear para no bloquear la habilidad
        return false;                                   // return false: habilidad no ejecutada
      }
      let cartaDescarte = await mostrarSelectorCartas(  // abrir selector para elegir qué descartar
        "Elige una carta de tu mano para descartar:",   // título del selector
        jugador.mano                                    // mostrar toda la mano
      );
      if (!cartaDescarte) {                             // si cancela el selector // quizás habría que borrar esto
        carta.habilidadUsada = false;                   // resetear para no bloquear la habilidad
        return false;                                   // return false: habilidad no ejecutada
      }
      let index = jugador.mano.indexOf(cartaDescarte);  // buscar la carta elegida en la mano
      jugador.mano.splice(index, 1);                    // sacarla de la mano
      jugador.trash.push(cartaDescarte);                // enviarla al trash
      log(cartaDescarte.nombre + " descartada de la mano como coste.");

      game.valorDefensa += 3;                           // añadir +3 a la recepción de esta jugada
      log(t("log.habilidadActivada", { carta: carta.nombre }));
      renderMano();                                     // actualizar la mano tras el descarte
      renderManoRival();                                // actualizar la mano del rival
      renderCampo();                                    // actualizar el campo
    },
    {
      tipo: "personaje",
      id: "HV-D01-007",
      escuela: "Karasuno",
      posicion: "WS",
      anyo: 2,
      rareza: "D",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Descarta 1 carta de tu mano para añadir +3 a la recepción.`
    }
  ),
  crearCarta("Sawamura Daichi", // ============================================================== D01-008
    {
      saque: 3,
      recepcion: 5,
      pase: 0,
      remate: 2,
      bloqueo: 1
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-D01-008",
      escuela: "Karasuno",
      posicion: "WS",
      anyo: 3,
      rareza: "D"
    }
  ),
  crearCarta("Sugawara Koshi", // ============================================================== D01-009
    {
      saque: 1,
      recepcion: 2,
      pase: 2,
      remate: 3,
      bloqueo: 1
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-D01-009",
      escuela: "Karasuno",
      posicion: "S",
      anyo: 3,
      rareza: "D"
    }
  ),
  crearCarta("Azumane Asahi", // ============================================================== D01-010
    {
      saque: 2,
      recepcion: 4,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-D01-010",
      escuela: "Karasuno",
      posicion: "WS",
      anyo: 3,
      rareza: "D"
    }
  ),
  crearCarta("¡El voleibol es un deporte en el que siempre mira hacia arriba!", // =================== D01-011
    {saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0},
    function(jugador, game, carta) {
      robarCarta(jugador, 1, true); // robar 1 carta

      let cartaRecepcion = jugador.zonas.recepcion.at(-1); // buscar carta en recepción
      if (!cartaRecepcion) {
        log(t("log.condicionNoCumplida"));
        return false;
      }

      game.valorDefensa += 1; 
      log("Evento: +1 a la recepción.");

      if (cartaRecepcion.stats.recepcion <= 4) { // si recepción era 4 o menos, +1 adicional
        game.valorDefensa += 1;
        log("Evento: bonus adicional +1 a la recepción 💫");
      }
    },
    {
      tipo: "evento",
      id: "HV-D01-011",
      fases: ["recepcion"],
      escuela: "Karasuno",
      rareza: "D",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Roba 1. +1 de recepción. Si la recepción de base del jugador es de 4 o menos, +1 de recepción adicional.`
    }
  ),
  crearCarta("Ataque amplio", // ================================================================ D01-012
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {
      robarCarta(jugador, 1, true);
      game.valorAtaque += 1;
      log("Evento: +1 al remate");
      // combo Kageyama + Hinata
      let cartaPase = jugador.zonas.pase.at(-1);
      let cartaRemate = jugador.zonas.remate.at(-1);
      if (cartaPase?.nombre === "Kageyama Tobio" && cartaRemate?.nombre === "Hinata Shoyo") {
        negarBloqueadoresApoyo();
        log("¡Combo Kageyama + Hinata activado!");
      }
    },
    {
      tipo: "evento",
      id: "HV-D01-012",
      fases: ["remate"],
      escuela: "Karasuno",
      rareza: "D",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Roba 1 carta y añade +1 al remate. Si en la jugada están presentes <strong><span style= color:#2e7d32>Kageyama Tobio</span></strong> y <strong><span style= color:#c62828>Hinata Shoyo</span></strong>, el rival no podrá usar bloqueadores laterales para defender.`
    }
  ),
  // ======================================================================================================== D02 : NEKOMA
  crearCarta("Kozume Kenma", // ================================================================= D02-001
    {
      saque: 1,
      recepcion: 1,
      pase: 1,
      remate: 0,
      bloqueo: 2
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "pase") {
        log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
        return;
      }
      if (!await usarGuts(jugador, "pase", 2)) {
        log("Necesitas 2 GUTS en pase ❌");
        return;
      }
      game.valorAtaque += 1;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
      debilitarRematador(2);
    },
    {
      tipo: "personaje",
      id: "HV-D02-001",
      escuela: "Nekoma",
      posicion: "S",
      anyo: 2,
      rareza: "D",
      descripcion: `<strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span> GUTS - 2</strong> : +1 al pase. Durante el próximo turno, el rematador rival tendrá -2 al remate.`
    }
  ),
  crearCarta("Kuroo Tetsuro", // ================================================================ D02-002
    {
      saque: 1,
      recepcion: 1,
      pase: 0,
      remate: 2,
      bloqueo: 3
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "bloqueo") {
        log(t("log.noEsFase", { zona: t("ui.zonaBloqueo") }));
        return;
      }
      if (!await usarGuts(jugador, "bloqueo", 1)) {
        log("Necesitas 1 GUTS en bloqueo ❌");
        return;
      }
      doshat(5);
    },
    {
      tipo: "personaje",
      id: "HV-D02-002",
      escuela: "Nekoma",
      posicion: "MB",
      anyo: 3,
      rareza: "D",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span> GUTS - 1</strong>: Si el bloqueo es exitoso : </br><span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>Bloqueo Ofensivo (5)</strong></span> : Devuelve un contraataque con potencia de 5.`
    }
  ),
  crearCarta("Yaku Morisuke", // ================================================================ D02-003
    {
      saque: 0,       
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 0      
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "recepcion") {               // comprobar que está en recepción
        log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
        return false;                                       
      }
      if (jugador.mano.length === 0) {                      // comprobar que hay cartas en mano
        log("No tienes cartas en la mano para descartar ❌");
        return false;                                       
      }
      let cartaDescarte = await mostrarSelectorCartas(      // abrir selector para elegir qué descartar
        "Elige una carta de tu mano para descartar:",       // título del selector
        jugador.mano                                        // mostrar toda la mano
      );
      if (!cartaDescarte) {                                 // si cancela el selector
        return false;                                       // return false: habilidad cancelada
      }
      let index = jugador.mano.indexOf(cartaDescarte);      // buscar la carta elegida en la mano
      jugador.mano.splice(index, 1);                        // sacarla de la mano
      jugador.trash.push(cartaDescarte);                    // enviarla al trash
      log(cartaDescarte.nombre + " descartada de la mano como coste.");

      game.valorDefensa += 2;                               // añadir +2 a la recepción de esta jugada
      log(t("log.habilidadActivada", { carta: carta.nombre }));
      renderMano();                                         // actualizar la mano tras el descarte
      renderManoRival();                                    // actualizar la mano del rival
      renderCampo();                                        // actualizar el campo
    },
    {
      tipo: "personaje",
      id: "HV-D02-003",
      escuela: "Nekoma",
      posicion: "Li",
      anyo: 3,
      rareza: "D",
      zonasProhibidas: ["saque", "bloqueo"],                
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Descarta 1 carta de tu mano para añadir +2 a la recepción.`
    }
  ),
  crearCarta("Haiba Lev", // ==================================================================== D02-004
    {
      saque: 1,
      recepcion: 1,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    null, // habilidad gestionada automáticamente al colocar un bloqueador central
    {
      tipo: "personaje",
      id: "HV-D02-004",
      escuela: "Nekoma",
      posicion: "MB",
      anyo: 1,
      rareza: "D",
      descripcion: `Durante un bloqueo, una vez que jueges un bloqueador central, si esta carta está en tu zona de <strong><span style= color:#c62828>remate</span></strong>, puedes <strong>GUTS - 2</strong> de tu zona de remate para desplazar esta carta como bloqueador de apoyo.`
    }
  ),
  crearCarta("Kai Nobuyuki", // ================================================================= D02-005
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 2,
      bloqueo: 2
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-D02-005",
      escuela: "Nekoma",
      posicion: "WS",
      anyo: 3,
      rareza: "D",
    }
  ),
  crearCarta("Yamamoto Taketora", // ============================================================ D02-006
    {
      saque: 5,
      recepcion: 2,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-D02-006",
      escuela: "Nekoma",
      posicion: "WS",
      anyo: 2,
      rareza: "D",
    }
  ),
  crearCarta("Fukunaga Shohei", // ============================================================== D02-007
    {
      saque: 1,
      recepcion: 4,
      pase: 1,
      remate: 3,
      bloqueo: 0
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-D02-007",
      escuela: "Nekoma",
      posicion: "WS",
      anyo: 2,
      rareza: "D",
    }
  ),
  crearCarta("Inouka So", // ==================================================================== D02-008
    {
      saque: 2,
      recepcion: 3,
      pase: 0,
      remate: 3,
      bloqueo: 3
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-D02-008",
      escuela: "Nekoma",
      posicion: "WS",
      anyo: 1,
      rareza: "D",
    }
  ),
  crearCarta("Shibayama Yuki", // =============================================================== D02-009
    {
      saque: 0,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "recepcion") {
        log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
        return;
      }
      if (!await usarGuts(jugador, "recepcion", 2)) {
        return;
      }
      robarCarta(jugador, 1, true);
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    }, 
    {
      tipo: "personaje",
      id: "HV-D02-009",
      escuela: "Nekoma",
      posicion: "L",
      anyo: 1,
      rareza: "D",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> GUTS - 2</strong>: Roba 1 carta.`,
      zonasProhibidas: ["saque", "bloqueo"]
    }
  ),
  crearCarta("Teshiro Tamahiko", // ============================================================= D02-010
    {
      saque: 4,
      recepcion: 4,
      pase: 1,
      remate: 0,
      bloqueo: 1
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-D02-010",
      escuela: "Nekoma",
      posicion: "S",
      anyo: 1,
      rareza: "D",
    }
  ),
  crearCarta("¡Las manos al frente, Lev!", // =================================================== D02-011
    {saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0},
    async function(jugador, game, carta) { // async porque hay que esperar a que se cumpla el Promise
      robarCarta(jugador, 1, true);

      let eleccion = await mostrarEleccion([
        { texto: "+1 al bloqueo de Kuroo Tetsuro." },
        { texto: "+1 a la recepción de tu receptor." }
      ]);

      if (eleccion === 0) {
        let kuroo = jugador.zonas.bloqueo.at(-1);
        if (!kuroo || kuroo.nombre !== "Kuroo Tetsuro") {
          log(t("log.condicionNoCumplida"));
          return false;
        }
        game.valorAtaque -= 1;
        log("Evento: +1 al bloqueo de Kuroo.");
      } else {
        let receptor = jugador.zonas.recepcion.at(-1);
        if (!receptor) {
          log(t("log.condicionNoCumplida"));
          return false;
        }
        game.valorDefensa += 1;
        log("Evento: +1 a la recepción de " + receptor.nombre + ".");
      }
    },
    {
      tipo: "evento",
      id: "HV-D02-011",
      fases: ["bloqueo", "recepcion"],
      escuela: "Nekoma",
      rareza: "D",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span></strong><strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Roba 1 carta. Elige: </br><strong>· +1 al bloqueo de Kuroo</strong> </br><strong>· +1 a la recepción</strong>.`
    }
  ),
  crearCarta("Basta con golpear físicamente, ¿verdad?",  // ===================================== D02-012
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      if (jugador.mazo.length === 0) {
        log(t("log.condicionNoCumplida"));
        return false;
      }
      robarCarta(jugador, 1, true);
      log(jugador.nombre + " roba 1 carta por efecto del evento.");

      if (jugador.mazo.length === 0) {
        log(t("log.condicionNoCumplida"));
        return false;
      }

      // mirar las 3 primeras cartas
      let tresCartas = jugador.mazo.slice(0, 3);
      log("Cartas reveladas: " + tresCartas.map(c => c.nombre).join(", "));
      // filtrar Lev e Inuoka
      let elegibles = tresCartas.filter(c => 
        c.nombre === "Haiba Lev" || c.nombre === "Inuoka So"
      );

      if (elegibles.length === 0) {
        log(t("log.condicionNoCumplida"));
        // mandar las 3 al fondo
        let restantes = jugador.mazo.splice(0, 3);
        jugador.mazo.push(...restantes);
        return;
      }

      // mostrar selector
      let cartaElegida = await mostrarSelectorCartas("Elige una carta para añadir a tu mano:", elegibles);

      if (cartaElegida) {
        let index = jugador.mazo.indexOf(cartaElegida);
        jugador.mazo.splice(index, 1);
        añadirCartaAMano(jugador, cartaElegida);
        log(t("log.cartaAMano", { carta: cartaElegida.nombre }));
      }

      // las restantes al fondo
      let restantes = jugador.mazo.splice(0, cartaElegida ? 2 : 3);
      jugador.mazo.push(...restantes);
      log("Cartas restantes enviadas al fondo del mazo.");

      renderMano();
      renderManoRival()
      renderCampo();
    },
    {
      tipo: "evento",
      id: "HV-D02-012",
      fases: ["recepcion"],
      escuela: "Nekoma",
      rareza: "D",
      descripcion: `Roba 1 carta. Después, mira las 3 primeras de tu mazo: si hay un <strong>Haiba Lev</strong> o un <strong>Inuoka So</strong>, puedes añadir 1 de ellos a tu mano. </br>Devuelve las otras cartas al fondo del mazo.`
    }
  ),
  // ========================================================================================================= P01
  crearCarta("Hinata Shoyo", // ================================================================= P01-001
    {saque: 2, recepcion: 4, pase: 0, remate: 2, bloqueo: 3},
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-P01-001",
      escuela: "Karasuno",
      posicion: "MB",
      anyo: 1,
      rareza: "HI",
    }
  ),
  crearCarta("Hinata Shoyo", // ================================================================= P01-002
    {saque: 2, recepcion: 1, pase: 0, remate: 1, bloqueo: 3},

    async function(jugador,game,carta) {
      if (carta.zonaActual !== "remate") {
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        return;
      }
      if (!await usarGuts(jugador, "remate", 3)) {
        return;
      }
      game.valorAtaque += 4;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
      negarReceptorAlto();
    },
    {
      tipo: "personaje",
      id: "HV-P01-002",
      escuela: "Karasuno",
      posicion: "MB",
      anyo: 1,
      rareza: "TP",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS - 3</strong>: +4 al remate. El rival no podrá recibir con un jugador que tenga una recepción de base igual o superior a 6.`
    }
  ),
  crearCarta("Hinata Shoyo", // ================================================================= P01-003
    {saque: 1, recepcion: 2, pase: 0, remate: 2, bloqueo: 2},
    function(jugador, game, carta) {
      if (carta.zonaActual !== "remate") {
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        return false;
      }
      // condición: 3 o menos cartas en mano
      if (jugador.mano.length > 3) {
        log(t("log.condicionNoCumplida"));
        return false;
      }
      // condición: colocador es Kageyama Tobio
      let colocador = jugador.zonas.pase.at(-1);
      if (!colocador || !colocador.nombre.includes("Kageyama Tobio")) {
        log(t("log.condicionNoCumplida"));
        return false;
      }

      game.valorAtaque += 2;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
      limitarBloqueadores(2);
    },
    {
      tipo: "personaje",
      id: "HV-P01-003",
      escuela: "Karasuno",
      posicion: "MB",
      anyo: 1,
      rareza: "S",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Si tienes 3 cartas o menos en tu mano y tu colocador ha sido <strong><span style= color:#2e7d32>Kageyama Tobio</span></strong>: +2 al remate. </br>El rival solo puede colocar <strong>2 bloqueadores</strong> en el próximo turno.`
    }
  ),
  crearCarta("Hinata Shoyo", // ================================================================= P01-004
    {
      saque: 2,
      recepcion: 5,
      pase: 0,
      remate: 3,
      bloqueo: 0
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-P01-004",
      escuela: "Karasuno",
      posicion: "MB",
      anyo: 1,
      rareza: "R"
    }
  ),
  crearCarta("Kageyama Tobio", // =============================================================== P01-005
    {
      saque: 4,
      recepcion: 2,
      pase: 2,
      remate: 1,
      bloqueo: 1
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P01-005",
      escuela: "Karasuno",
      posicion: "S",
      anyo: 1,
      rareza: "HI"
    }
  ),
  crearCarta("Kageyama Tobio", // =============================================================== P01-006
    {
      saque: 1,
      recepcion: 1,
      pase: 1,
      remate: 2,
      bloqueo: 1
    },
   async function(jugador, game, carta) { // GUTS - 2: +2 al remate de hinata. Busca (1) un Hinata o Ataque Amplio 
    if (carta.zonaActual !== "pase") {
      log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
      return;
    }
    if (!await usarGuts(jugador, "pase", 2)) {
      log("Necesitas 2 GUTS en pase ❌");
      return;
    }

    if (jugador.mazo.length === 0) {  // si no quedan cartas en el mazo
      log(t("log.condicionNoCumplida"));
    }
    // ??? Quizás debería meter todo esto en un else, salvo el kageyamaSP
    let cartaRevelada = jugador.mazo.shift(); // revelar carta de arriba del mazo
    log("Carta revelada: " + cartaRevelada.nombre);

    if (cartaRevelada.nombre === "Hinata Shoyo" || cartaRevelada.nombre === "Ataque Amplio") {
      añadirCartaAMano(jugador, cartaRevelada);
      log("¡" + cartaRevelada.nombre + " añadido a la mano!");
    } 
    else {
      jugador.mazo.push(cartaRevelada); // va al fondo del mazo
      log(cartaRevelada.nombre + " enviado al fondo del mazo.");
    }
    potenciarPersonaje("Hinata Shoyo", "remate", 2);
  },
    {
      tipo: "personaje",
      id: "HV-P01-006",
      escuela: "Karasuno",
      posicion: "S",
      anyo: 1,
      rareza: "T",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Pase</span> GUTS - 2</strong>: Revela la primera carta del mazo. Si es <strong><span style= color:#c62828>Hinata Shoyo</span></strong> o <strong><span style= color:#c62828>Ataque amplio</span></strong>, añádela a tu mano. Si no es el caso, envía la carta al fondo de tu mazo. Añade +2 al remate de esta jugada, si el rematador es <strong><span style= color:#c62828>Hinata Shoyo</span></strong>.`
    }
  ),
  crearCarta("Kageyama Tobio", // ============================================================== P01-007
    {
      saque: 2,
      recepcion: 1,
      pase: 2,
      remate: 2,
      bloqueo: 2
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-P01-007",
      escuela: "Karasuno",
      posicion: "S",
      anyo: 1,
      rareza: "R"
    }
  ),
  crearCarta("Tsukishima Kei", // ============================================================== P01-008
    {
      saque: 1,
      recepcion: 2,
      pase: 0,
      remate: 2,
      bloqueo: 2
    },
    async function(jugador, game, carta) { // GUTS - 2: Si Yamaguchi en juego : +2 de bloqueo. Contraataque 6
      if (carta.zonaActual !== "bloqueo") {
        log(t("log.noEsFase", { zona: t("ui.zonaBloqueo") }));
        return;
      }
      if (!await usarGuts(jugador, "bloqueo", 2)) {
        log("Necesitas 2 GUTS en bloqueo ❌");
        return;
      }

      let yamaguchi = [
        jugador.zonas.recepcion.at(-1),
        jugador.zonas.pase.at(-1),
        jugador.zonas.remate.at(-1),
        jugador.zonas.bloqueo.at(-1),
        jugador.zonas.saque.at(-1)
      ].find(c => c?.nombre === "Yamaguchi Tadashi");

      if(yamaguchi){
        game.valorDefensa += 2;
        log(t("log.habilidadActivada", { carta: carta.nombre }));
      }
      else{
        log(t("log.condicionNoCumplida"));
      }

      doshat(6);
    }, 
    {
      tipo: "personaje",
      id: "HV-P01-008",
      escuela: "Karasuno",
      posicion: "MB",
      anyo: 1,
      rareza: "S",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span> GUTS - 2</strong>: Si hay un <strong>Yamaguchi Tadashi</strong> en tu campo, añade +2 al bloqueo. </br>Si el bloqueo es exitoso : </br><span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>Bloqueo ofensivo (6)</strong></span> : Devuelve un contraataque con potencia de 6.`
    }
  ),
  crearCarta("Tsukishima Kei", // ============================================================== P01-009
    {
      saque: 2,
      recepcion: 3,
      pase: 0,
      remate: 3,
      bloqueo: 3
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-P01-009",
      escuela: "Karasuno",
      posicion: "MB",
      anyo: 1,
      rareza: "N"
    }
  ),
  crearCarta("Yamaguchi Tadashi", // ============================================================== P01-010
  {
    saque: 2,
    recepcion: 0,
    pase: 0,
    remate: 3,
    bloqueo: 2
  },
  function(jugador, game, carta) { // SAQUE : Revela 1 carta del deck, si Karasuno = -2 al pase siguiente
    if (carta.zonaActual !== "saque") {
      log(t("log.noEsFase", { zona: t("ui.zonaSaque") }));
      return;
    }

    if (jugador.mazo.length === 0) {
      log("No hay cartas en el mazo ❌");
      return;
    }

    // revelar carta de arriba
    let cartaRevelada = jugador.mazo.shift();
    log("Carta revelada: " + cartaRevelada.nombre);

    if (cartaRevelada.info?.escuela === "Karasuno") {
      log("¡Es de Karasuno! Efecto activado.");
      debilitarColocador(2);
    } else {
      log("La carta revelada no es de Karasuno: efecto no activado.");
    }
    // carta al fondo del mazo
    jugador.mazo.push(cartaRevelada);
    log("Carta enviada al fondo del mazo.");
  },
  {
    tipo: "personaje",
    id: "HV-P01-010",
    escuela: "Karasuno",
    posicion: "MB",
    anyo: 1,
    rareza: "S",
    descripcion: `<strong><span style="background:#e65100; color:white; padding:1px 4px; border-radius:2px;">Saque</span></strong> Revela la carta superior de tu mazo. Si es de <strong>Karasuno</strong>, el próximo colocador rival tendrá <strong>-2 al pase</strong>. </br>Coloca la carta mostrada al fondo del mazo.`
  }
),
  crearCarta("Nishinoya Yu", // ============================================================== P01-011
    {
      saque: 0,
      recepcion: 6,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-P01-011",
      escuela: "Karasuno",
      posicion: "L",
      anyo: 2,
      rareza: "RP",
      zonasProhibidas: ["saque", "bloqueo"]
    }
  ),
  crearCarta("Tanaka Ryunosuke", // ============================================================== P01-012
    {
      saque: 5,
      recepcion: 2,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-P01-012",
      escuela: "Karasuno",
      posicion: "WS",
      anyo: 2,
      rareza: "NP"
    }
  ),
  crearCarta("Ennoshita Chikara", // ============================================================== P01-013
    {
      saque: 1,
      recepcion: 2,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    function(jugador, game, carta) {              // habilidad: se activa desde la mano en recepción
      let receptor = jugador.zonas.recepcion.at(-1); // buscar la carta en recepción
      if (!receptor) {                            // si no hay receptor en juego
        log(t("log.condicionNoCumplida"));
        return false;                             // return false: habilidad no ejecutada
      }
      if (receptor.info?.escuela !== "Karasuno") { // comprobar que es de Karasuno
        log(t("log.condicionNoCumplida"));
        return false;                             // return false: habilidad no ejecutada
      }
      game.valorDefensa += 2;                     // añadir +2 a la recepción de esta jugada
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P01-013",
      escuela: "Karasuno",
      posicion: "WS",
      anyo: 2,
      rareza: "N",
      activacionMano: true,
      fases: ["recepcion"],
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> <span style="background:#6a1b9a; color:white; padding:1px 4px; border-radius:2px;">Desde la mano</span></strong> Descarta esta carta desde tu mano para añadir +2 a la recepción de un personaje de <strong>Karasuno</strong> en juego.`
    }
  ),
  crearCarta("Sawamura Daichi", // ============================================================== P01-014
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P01-014",
      escuela: "Karasuno",
      posicion: "WS",
      anyo: 3,
      rareza: "R"
    }
  ),
  crearCarta("Sugawara Koshi", // ============================================================== P01-015
    {
      saque: 1,
      recepcion: 2,
      pase: 1,
      remate: 2,
      bloqueo: 0
    },
    async function(jugador, game, carta) {              // async porque usa usarGuts
      if (carta.zonaActual !== "pase") {                // comprobar que está en pase
        log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
        carta.habilidadUsada = false;                   // resetear para no bloquear la habilidad
        return false;                                   // return false: habilidad no ejecutada
      }
      if (!await usarGuts(jugador, "pase", 2)) {        // pagar 2 GUTS de pase
        carta.habilidadUsada = false;                   // resetear si no hay suficientes GUTS
        return false;                                   // return false: habilidad no ejecutada
      }
      robarCarta(jugador, 1, true);                     // robar 1 carta
      game.valorAtaque += 1;                            // +1 al pase
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P01-015",
      escuela: "Karasuno",
      posicion: "S",
      anyo: 3,
      rareza: "N",
      descripcion: `<strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span> GUTS - 2</strong>: Roba 1 carta y +1 al pase.`
    }
  ),
  crearCarta("Azumane Asahi", // ============================================================== P01-016
    {
      saque: 3,
      recepcion: 1,
      pase: 0,
      remate: 3,
      bloqueo: 0
    },
    async function(jugador, game, carta) {              // async porque usa usarGuts
      if (carta.zonaActual !== "remate") {              // comprobar que está en remate
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        carta.habilidadUsada = false;                   // resetear para no bloquear la habilidad
        return false;                                   // return false: habilidad no ejecutada
      }
      let colocador = jugador.zonas.pase.at(-1);        // buscar el colocador en pase
      if (!colocador || colocador.info?.escuela !== "Karasuno" || colocador.info?.posicion !== "S") {
        log(t("log.condicionNoCumplida")); // comprobar escuela y posición
        carta.habilidadUsada = false;                   // resetear para no bloquear la habilidad
        return false;                                   // return false: habilidad no ejecutada
      }
      if (!await usarGuts(jugador, "remate", 4)) {      // pagar 4 GUTS de remate
        carta.habilidadUsada = false;                   // resetear si no hay suficientes GUTS
        return false;                                   // return false: habilidad no ejecutada
      }
      game.valorAtaque += 2;                            // +2 al remate
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P01-016",
      escuela: "Karasuno",
      posicion: "WS",
      anyo: 3,
      rareza: "N",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS - 4</strong>: Si tu colocador es un <strong>colocador (S) de Karasuno</strong>, +2 al remate.`
    }
  ),
  crearCarta("Kozume Kenma", // ================================================================ P01-017
    {
      saque: 2,
      recepcion: 2,
      pase: 2,
      remate: 1,
      bloqueo: 2
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-017",
      escuela: "Nekoma",
      posicion: "S",
      anyo: 2,
      rareza: "HI"
    }
  ),
  crearCarta("Kozume Kenma", // ================================================================ P01-018
    {
      saque: 1,
      recepcion: 0,
      pase: 1,
      remate: 1,
      bloqueo: 2
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "pase") {                              // comprobar que está en pase
        log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
        return false;                                                 // return false: condición no cumplida
      }
      if (!await usarGuts(jugador, "pase", 3)) {                      // pagar 3 GUTS de pase
        return false;                                                 // return false: GUTS insuficientes
      }

      game.valorAtaque += 1;                                          // +1 al pase
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      // comprobar que todos los personajes en juego son de Nekoma
      let cartasEnJuego = [
        jugador.zonas.saque.at(-1),                                   // último sacador
        jugador.zonas.recepcion.at(-1),                               // último receptor
        jugador.zonas.pase.at(-1),                                    // último colocador
        jugador.zonas.remate.at(-1),                                  // último rematador
        jugador.zonas.bloqueo.at(-1)                                  // último bloqueador
      ].filter(c => c !== null && c !== undefined);                   // filtrar zonas vacías

      let todasNekoma = cartasEnJuego.every(c => c.info?.escuela === "Nekoma"); // comprobar escuela
      if (!todasNekoma) {                                             // si no todas son de Nekoma
        log("No todos tus personajes en juego son de Nekoma. Efecto adicional no activado.");
        return;                                                       // termina sin el bonus
      }

      // buscar cartas en zona de eventos
      if (jugador.zonas.eventos.length === 0) {                       // si no hay eventos
        log(t("log.condicionNoCumplida"));
        return;                                                       // termina sin el bonus
      }

      let cartaElegida = await mostrarSelectorCartas(                 // abrir selector
        "Elige una carta de tu zona de eventos para añadir a tu mano:",
        jugador.zonas.eventos                                         // mostrar zona de eventos
      );
      if (!cartaElegida) return false;                                // return false: cancelado

      let index = jugador.zonas.eventos.indexOf(cartaElegida);        // buscar en zona de eventos
      jugador.zonas.eventos.splice(index, 1);                         // sacar de la zona de eventos
      añadirCartaAMano(jugador, cartaElegida);                        // añadir a la mano
      log(cartaElegida.nombre + " añadida a la mano desde la zona de eventos.");

      if (modoOnline) enviarJugada("quitarCartaZona", {                     // avisar al rival
        zona: "eventos",                                                     // zona de origen
        cartaId: cartaElegida.info.id                                        // id de la carta
      });

      renderMano();                                                   // actualizar mano
      renderManoRival();                                              // actualizar mano rival
      renderCampo();                                                  // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P01-018",
      escuela: "Nekoma",
      posicion: "S",
      anyo: 2,
      rareza: "T",
      descripcion: `<strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span> GUTS - 3</strong>: +1 al pase. Si todos tus personajes en juego son de <strong>Nekoma</strong>, puedes añadir 1 carta de tu zona de eventos a tu mano.`
    }
  ),
  crearCarta("Kozume Kenma", // ================================================================ P01-019
    {
      saque: 1,
      recepcion: 2,
      pase: 1,
      remate: 1,
      bloqueo: 1
    },
    null, // habilidad gestionada automáticamente en colocarCarta()
    {
      tipo: "personaje",
      id: "HV-P01-019",
      escuela: "Nekoma",
      posicion: "S",
      anyo: 2,
      rareza: "R",
      descripcion: `Si tu rematador esta jugada tiene un remate base de 3, puedes gastar <strong>GUTS - 2</strong> de <strong><span style="color:#2e7d32">pase</span></strong> para traer un personaje de <strong>Nekoma</strong> del GUTS de remate y añadir <strong>+2</strong> a su remate.`
    }
  ),
  crearCarta("Kuroo Tetsuro", // =============================================================== P01-021
    {
      saque: 2,
      recepcion: 3,
      pase: 0,
      remate: 1,
      bloqueo: 2
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "remate") {                            // comprobar que está en remate
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        return false;                                                 // return false: condición no cumplida
      }
      if (!await usarGuts(jugador, "remate", 3)) {                    // pagar 3 GUTS de remate
        return false;                                                 // return false: GUTS insuficientes
      }

      game.valorAtaque += 3;                                          // +3 al remate
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      // buscar zonas con al menos 1 carta de Nekoma en el GUTS (excluyendo recién jugadas)
      let zonasValidas = ["saque", "recepcion", "pase", "remate", "bloqueo"].filter(zona => {
        let guts = jugador.zonas[zona].filter(c => !c.recienJugada);  // excluir todas las recién jugadas
        return guts.some(c => c.info?.escuela === "Nekoma");           // al menos 1 Nekoma en el GUTS
      });

      if (zonasValidas.length === 0) {                                // si no hay ninguna zona válida
        log(t("log.condicionNoCumplida"));
        return false;                                                 // return false: condición no cumplida
      }

      // elegir zona
      let eleccion = await mostrarEleccion(                           // mostrar selector de zonas
        zonasValidas.map(zona => ({ texto: zona }))                   // convertir zonas a opciones
      );
      let zonaElegida = zonasValidas[eleccion];                       // zona elegida por el jugador

      // calcular GUTS de esa zona (excluyendo todas las recién jugadas)
      let cartasGuts = jugador.zonas[zonaElegida].filter(c => !c.recienJugada); // excluir recién jugadas

      // filtrar solo Nekoma
      let gutNekoma = cartasGuts.filter(c => c.info?.escuela === "Nekoma");     // solo Nekoma
      if (gutNekoma.length === 0) {                                   // si no hay ninguna de Nekoma
        log(t("log.condicionNoCumplida"));
        return false;                                                 // return false: condición no cumplida
      }

      // elegir hasta 2 cartas con nombres distintos
      let cartasElegidas = [];                                        // array de cartas elegidas
      for (let i = 0; i < 2; i++) {                                   // repetir hasta 2 veces
        let disponibles = gutNekoma.filter(c =>                       // filtrar las ya elegidas
          !cartasElegidas.some(e => e.nombre === c.nombre)            // excluir nombres ya elegidos
        );
        if (disponibles.length === 0) {                               // si no quedan disponibles
          log(t("log.condicionNoCumplida"));
          break;                                                      // salir del bucle sin error
        }
        let cartaElegida = await mostrarSelectorCartas(               // abrir selector
          "Elige una carta de Nekoma del GUTS de " + zonaElegida + " (" + (i + 1) + "/2):",
          disponibles                                                 // cartas disponibles
        );
        if (!cartaElegida) return false;                              // return false: cancelado
        cartasElegidas.push(cartaElegida);                            // añadir a las elegidas
      }

      // sacar las cartas elegidas del GUTS y añadirlas a la mano
      cartasElegidas.forEach(c => {
        let index = jugador.zonas[zonaElegida].indexOf(c);                   // buscar en la zona
        jugador.zonas[zonaElegida].splice(index, 1);                         // sacar de la zona
        añadirCartaAMano(jugador, c);                                        // añadir a la mano
        log(c.nombre + " añadida a la mano desde el GUTS de " + zonaElegida + ".");

        if (modoOnline) enviarJugada("quitarCartaZona", {                    // avisar al rival
            zona: zonaElegida,                                                 // zona de origen
            cartaId: c.info?.id                                                // id de la carta
          });
      });

      renderMano();                                                   // actualizar mano
      renderManoRival();                                              // actualizar mano rival
      renderCampo();                                                  // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P01-021",
      escuela: "Nekoma",
      posicion: "MB",
      anyo: 3,
      rareza: "T",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS - 3</strong>: +3 al remate. Después, elige una zona de tu campo y añade a tu mano hasta 2 cartas de <strong>Nekoma</strong> del GUTS de esa zona con nombres distintos entre sí.`
    }
  ),
  crearCarta("Kuroo Tetsuro", // =============================================================== P01-022
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 3,
      bloqueo: 1
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-022",
      escuela: "Nekoma",
      posicion: "MB",
      anyo: 3,
      rareza: "S"
    }
  ),
  crearCarta("Yaku Morisuke", // =============================================================== P01-023
    {
      saque: 0,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    null, // habilidad gestionada automáticamente en colocarCarta()
    {
      tipo: "personaje",
      id: "HV-P01-023",
      escuela: "Nekoma",
      posicion: "Li",
      anyo: 3,
      rareza: "S",
      zonasProhibidas: ["saque", "bloqueo"],
      descripcion: `Cuando coloques un personaje de <strong>Nekoma</strong> encima de esta carta en <strong><span style="color:#1565c0">recepción</span></strong>, puedes descartar 1 carta de <strong>Nekoma</strong> de tu mano para añadir +2 a su recepción.`
    }
  ),
  crearCarta("Yaku Morisuke", // =============================================================== P01-024
    {
      saque: 0,
      recepcion: 6,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    null, // sin habilidad
    {
      tipo: "personaje",
      id: "HV-P01-024",
      escuela: "Nekoma",
      posicion: "Li",
      anyo: 3,
      rareza: "N",
      zonasProhibidas: ["saque", "bloqueo"]
    }
  ),
  crearCarta("Haiba Lev", // =================================================================== P01-025
    {
      saque: 1,
      recepcion: 1,
      pase: 0,
      remate: 2,
      bloqueo: 3
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "remate") {                        // comprobar que está en remate
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        return false;                                             // return false: condición no cumplida
      }
      if (!await usarGuts(jugador, "remate", 2)) {                // pagar 2 GUTS de remate
        return false;                                             // return false: GUTS insuficientes
      }

      // comprobar si fue traído por Kenma P01-019
      let kenma = jugador.zonas.pase.at(-1);                      // buscar colocador en pase
      if (kenma?.info?.id === "HV-P01-019" && kenma?.habilidadUsada) { // si es Kenma y usó habilidad
        game.valorAtaque += 2;                                    // +2 al remate
        log(t("log.habilidadActivada", { carta: carta.nombre }));
      }
      debilitarBloqueadorCentral(3);                              // -3 al próximo bloqueador central rival
    },
    {
      tipo: "personaje",
      id: "HV-P01-025",
      escuela: "Nekoma",
      posicion: "MB",
      anyo: 1,
      rareza: "S",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS - 2</strong>: </br>· Durante el próximo turno rival, cada bloqueador central que coloque tendrá <strong>-3 al bloqueo</strong>.</br>· Si esta carta fue traída por la habilidad de <strong><span style="color:#2e7d32">Kozume Kenma</span></strong>, +2 al remate.`
    }
  ),
  crearCarta("Haiba Lev", // =================================================================== P01-026
    {
      saque: 2,
      recepcion: 3,
      pase: 0,
      remate: 3,
      bloqueo: 3
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-026",
      escuela: "Nekoma",
      posicion: "MB",
      anyo: 1,
      rareza: "N"
    }
  ),
  crearCarta("Kai Nobuyuki", // ================================================================ P01-027
    {
      saque: 1,
      recepcion: 4,
      pase: 1,
      remate: 3,
      bloqueo: 0
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-027",
      escuela: "Nekoma",
      posicion: "WS",
      anyo: 3,
      rareza: "R"
    }
  ),
  crearCarta("Yamamoto Taketora", // =========================================================== P01-028
    {
      saque: 1,
      recepcion: 0,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    null, // habilidad gestionada automáticamente en colocarCarta()
    {
      tipo: "personaje",
      id: "HV-P01-028",
      escuela: "Nekoma",
      posicion: "WS",
      anyo: 2,
      rareza: "N",
      descripcion: `Cuando coloques a <strong>Haiba Lev</strong> encima de esta carta en <strong><span style="color:#c62828">remate</span></strong>, puedes descartar 1 carta de <strong>Nekoma</strong> de tu mano para añadir +1 a su remate.`
    }
  ),
  crearCarta("Fukunaga Shohei", // ============================================================= P01-029
    {
      saque: 1,
      recepcion: 5,
      pase: 1,
      remate: 0,
      bloqueo: 1
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-029",
      escuela: "Nekoma",
      posicion: "WS",
      anyo: 2,
      rareza: "R"
    }
  ),
  crearCarta("Inuoka So", // =================================================================== P01-030
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 3
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-030",
      escuela: "Nekoma",
      posicion: "WS",
      anyo: 1,
      rareza: "N"
    }
  ),
  crearCarta("Shibayama Yuki", // ============================================================== P01-031
    {
      saque: 0,
      recepcion: 4,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    function(jugador, game, carta) {
      let receptor = jugador.zonas.recepcion.at(-1);              // buscar carta en recepción
      if (!receptor) {                                            // si no hay receptor en juego
        log(t("log.condicionNoCumplida"));
        return false;                                             // return false: condición no cumplida
      }
      if (receptor.info?.escuela !== "Nekoma") {                  // comprobar que es de Nekoma
        log("El receptor debe ser de Nekoma.");
        return false;                                             // return false: condición no cumplida
      }
      game.valorDefensa += 2;                                     // +2 a la recepción
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P01-031",
      escuela: "Nekoma",
      posicion: "Li",
      anyo: 1,
      rareza: "N",
      activacionMano: true,                                       // se activa desde la mano
      fases: ["recepcion"],                                       // solo en recepción
      zonasProhibidas: ["saque", "bloqueo"],
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> <span style="background:#6a1b9a; color:white; padding:1px 4px; border-radius:2px;">Desde la mano</span></strong> Descarta esta carta desde tu mano para añadir +2 a la recepción de un personaje de <strong>Nekoma</strong> en juego.`
    }
  ),
  crearCarta("Teshiro Tamahiko", // ============================================================ P01-032
    {
      saque: 3,
      recepcion: 1,
      pase: 1,
      remate: 0,
      bloqueo: 1
    },
    function(jugador, game, carta) {
      if (carta.zonaActual !== "saque") {                         // comprobar que está en saque
        log(t("log.noEsFase", { zona: t("ui.zonaSaque") }));
        return false;                                             // return false: condición no cumplida
      }
      anularHabilidadReceptor();                                  // anular habilidad del receptor rival
      anularHabilidadColocador();                                 // anular habilidad del colocador rival
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P01-032",
      escuela: "Nekoma",
      posicion: "S",
      anyo: 1,
      rareza: "R",
      descripcion: `<strong><span style="background:#e65100; color:white; padding:1px 4px; border-radius:2px;">Saque</span></strong> Durante el próximo turno rival, las habilidades del <strong>receptor</strong> y del <strong>colocador</strong> quedan anuladas.`
    }
  ),
  // ===================================================================================================== AOBA JOSAI
  crearCarta("Oikawa Toru", // ================================================================= P01-033
    {
      saque: 5,
      recepcion: 0,
      pase: 1,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "saque" && carta.zonaActual !== "pase") { // comprobar zona válida
        log(t("log.noEsFase", { zona: t("ui.zonaSaque") }));
        log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
        return false;                                                     // return false: zona incorrecta
      }

      // buscar cartas de Aoba Jôsai en la mano
      let aobaEnMano = jugador.mano.filter(c => c.info?.escuela === "Aoba Jôsai"); // filtrar por escuela
      if (aobaEnMano.length === 0) {                                     // si no hay ninguna
        log("Necesitas una carta de Aoba Jôsai en la mano para activar esta habilidad.");
        return false;                                                     // return false: coste no pagable
      }

      // elegir carta de Aoba Jôsai para descartar
      let cartaDescarte = await mostrarSelectorCartas(                   // abrir selector
        "Elige una carta de Aoba Jôsai para descartar:",                 // título
        aobaEnMano                                                       // solo Aoba Jôsai
      );
      if (!cartaDescarte) return false;                                  // return false: cancelado

      let index = jugador.mano.indexOf(cartaDescarte);                   // buscar en la mano
      jugador.mano.splice(index, 1);                                     // sacar de la mano
      jugador.trash.push(cartaDescarte);                                 // enviar al trash
      log(cartaDescarte.nombre + " descartada de la mano como coste.");

      game.valorAtaque += 1;                                             // +1 al ataque
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      if (modoOnline) enviarTrash(jugador);                              // sincronizar trash

      // comprobar si el rival tiene 4 o más cartas
      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;   // índice del rival
      let rival = game.jugadores[rivalIndex];                            // jugador rival

      if (rival.mano.length >= 4) {                                      // si el rival tiene 4+ cartas
        await forzarDescarteRival(rival, rivalIndex);               // forzar descarte del rival
      }

      renderMano();                                                      // actualizar mano
      renderManoRival();                                                  // actualizar mano rival
      renderCampo();                                                      // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P01-033",
      escuela: "Aoba Jôsai",
      posicion: "S",
      anyo: 3,
      rareza: "TP",
      descripcion: `<strong><span style="background:#e65100; color:white; padding:1px 4px; border-radius:2px;">Saque</span> <span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span></strong> Descarta 1 carta de <strong>Aoba Jôsai</strong> de tu mano para +1 al saque o al pase. Si el rival tiene 4 o más cartas en la mano, debe descartar 1 carta de su mano.`
    }
  ),
  crearCarta("Oikawa Toru", // ================================================================= P01-034
    {
      saque: 5,
      recepcion: 0,
      pase: 1,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "saque") {                                // comprobar zona válida
        log(t("log.noEsFase", { zona: t("ui.zonaSaque") }));
        return false;                                                    // return false: zona incorrecta
      }
      if (!await usarGuts(jugador, "saque", 1)) {                       // pagar 1 GUTS de saque
        return false;                                                    // return false: GUTS insuficientes
      }

      let cartaDescartada = game.gutsDescartados[0];                    // carta descartada en el GUTS
      if (!cartaDescartada || cartaDescartada.info?.escuela !== "Aoba Jôsai") { // comprobar escuela
        log("La carta descartada no es de Aoba Jôsai. Efecto no activado.");
        return false;                                                    // return false: condición no cumplida
      }

      // aplicar efecto sobre el rival
      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;  // índice del rival
      let rival = game.jugadores[rivalIndex];                           // jugador rival

      // devolver mano del rival al mazo y barajar
      rival.mazo.push(...rival.mano);                                   // devolver mano al mazo
      rival.mano = [];                                                  // vaciar mano
      barajarMazo(rival);                                               // barajar mazo
      log(rival.nombre + " devuelve su mano al mazo y baraja.");

      if (modoOnline) {
        enviarJugada("resetearManoRival", {});                          // avisar al rival
      } else {
        robarCarta(rival, 6);                                           // el rival roba 6 en local
        log(rival.nombre + " roba 6 cartas.");
      }

      renderMano();                                                     // actualizar mano
      renderManoRival();                                                // actualizar mano rival
      renderCampo();                                                    // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P01-034",
      escuela: "Aoba Jôsai",
      posicion: "S",
      anyo: 3,
      rareza: "R",
      descripcion: `<strong><span style="background:#e65100; color:white; padding:1px 4px; border-radius:2px;">Saque</span> GUTS - 1</strong>: Si la carta descartada es de <strong>Aoba Jôsai</strong>, el rival devuelve todas las cartas de su mano al mazo, baraja y roba 6 cartas.`
    }
  ),
  crearCarta("Iwaizumi Hajime", // ============================================================= P01-035
    {
      saque: 1,
      recepcion: 1,
      pase: 0,
      remate: 2,
      bloqueo: 3
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "remate") {                               // comprobar zona válida
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        return false;                                                    // return false: zona incorrecta
      }

      // buscar cartas de Aoba Jôsai en la mano
      let aobaEnMano = jugador.mano.filter(c => c.info?.escuela === "Aoba Jôsai"); // filtrar por escuela
      if (aobaEnMano.length === 0) {                                     // si no hay ninguna
        log("Necesitas una carta de Aoba Jôsai en la mano para activar esta habilidad.");
        return false;                                                    // return false: coste no pagable
      }

      // elegir carta de Aoba Jôsai para descartar
      let cartaDescarte = await mostrarSelectorCartas(                   // abrir selector
        "Elige una carta de Aoba Jôsai para descartar:",                 // título
        aobaEnMano                                                        // solo Aoba Jôsai
      );
      if (!cartaDescarte) return false;                                  // return false: cancelado

      let index = jugador.mano.indexOf(cartaDescarte);                   // buscar en la mano
      jugador.mano.splice(index, 1);                                     // sacar de la mano
      jugador.trash.push(cartaDescarte);                                 // enviar al trash
      log(cartaDescarte.nombre + " descartada de la mano como coste.");

      game.valorAtaque += 2;                                             // +2 al remate
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      if (modoOnline) enviarTrash(jugador);                              // sincronizar trash

      // comprobar si el rival tiene 4 o menos cartas
      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;   // índice del rival
      let rival = game.jugadores[rivalIndex];                            // jugador rival

      if (rival.mano.length <= 4) {                                      // si el rival tiene 4 o menos
        negarRobar();                                                    // activar efecto
      }

      renderMano();                                                      // actualizar mano
      renderManoRival();                                                 // actualizar mano rival
      renderCampo();                                                     // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P01-035",
      escuela: "Aoba Jôsai",
      posicion: "WS",
      anyo: 3,
      rareza: "S",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Descarta 1 carta de <strong>Aoba Jôsai</strong> de tu mano para +2 al remate. Si el rival tiene 4 o menos cartas en la mano, durante el próximo turno rival no podrá robar cartas mediante habilidades.`
    }
  ),
  crearCarta("Kindaichi Yutaro", // ============================================================ P01-036
    {
      saque: 3,
      recepcion: 2,
      pase: 0,
      remate: 3,
      bloqueo: 3
    },
    null, // sin habilidad
    {
      tipo: "personaje",
      id: "HV-P01-036",
      escuela: "Aoba Jôsai",
      posicion: "MB",
      anyo: 1,
      rareza: "N"
    }
  ),
  crearCarta("Matsukawa Issei", // ============================================================= P01-037
    {
      saque: 1,
      recepcion: 1,
      pase: 0,
      remate: 2,
      bloqueo: 3
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "bloqueo") {                              // comprobar zona válida
        log(t("log.noEsFase", { zona: t("ui.zonaBloqueo") }));
        return false;                                                    // return false: zona incorrecta
      }
      if (game.valorAtaque < 8) {                                        // comprobar ataque rival
        log(t("log.condicionNoCumplida"));
        return false;                                                    // return false: condición no cumplida
      }
      if (!await usarGuts(jugador, "bloqueo", 1)) {                      // pagar 1 GUTS de bloqueo
        return false;                                                    // return false: GUTS insuficientes
      }

      potenciarReceptor(3, "Aoba Jôsai");                                 // +3 solo a receptores de Aoba Jôsai

      game.fase = "recepcion";                                           // terminar fase de bloqueo
      log(t("log.habilidadActivada", { carta: carta.nombre }));
      if (modoOnline) enviarFase("recepcion");                           // sincronizar fase con el rival

      actualizarFaseUI();                                                // actualizar letrero
      renderMano();                                                      // actualizar mano
      renderManoRival();                                                 // actualizar mano rival
      renderCampo();                                                     // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P01-037",
      escuela: "Aoba Jôsai",
      posicion: "MB",
      anyo: 3,
      rareza: "N",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span> GUTS - 1</strong>: Solo puedes usar esta habilidad si el ataque del rival es 8 o más. Termina inmediatamente la fase de bloqueo y pasa a recepción. Durante este turno, si tu receptor es del <strong>Aoba Jôsai</strong> tendrá <strong>+3 a la recepción</strong>.`
    }
  ),
  crearCarta("Hanamaki Takahiro", // =========================================================== P01-038
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 2,
      bloqueo: 2
    },
    null, // sin habilidad
    {
      tipo: "personaje",
      id: "HV-P01-038",
      escuela: "Aoba Jôsai",
      posicion: "WS",
      anyo: 3,
      rareza: "N"
    }
  ),
  crearCarta("Watari Shinji", // =============================================================== P01-039
    {
      saque: 0,
      recepcion: 5,
      pase: 1,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "recepcion") {                            // comprobar zona válida
        log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
        return false;                                                    // return false: zona incorrecta
      }
      if (game.valorAtaque < 6) {                                        // comprobar ataque rival
        log(t("log.condicionNoCumplida"));
        return false;                                                    // return false: condición no cumplida
      }

      // buscar cartas de Aoba Jôsai en la mano
      let aobaEnMano = jugador.mano.filter(c => c.info?.escuela === "Aoba Jôsai"); // filtrar por escuela
      if (aobaEnMano.length === 0) {                                     // si no hay ninguna
        log("Necesitas una carta de Aoba Jôsai en la mano para activar esta habilidad.");
        return false;                                                    // return false: coste no pagable
      }

      // elegir carta de Aoba Jôsai para descartar
      let cartaDescarte = await mostrarSelectorCartas(                   // abrir selector
        "Elige una carta de Aoba Jôsai para descartar:",                 // título
        aobaEnMano                                                        // solo Aoba Jôsai
      );
      if (!cartaDescarte) return false;                                  // return false: cancelado

      let index = jugador.mano.indexOf(cartaDescarte);                   // buscar en la mano
      jugador.mano.splice(index, 1);                                     // sacar de la mano
      jugador.trash.push(cartaDescarte);                                 // enviar al trash
      log(cartaDescarte.nombre + " descartada de la mano como coste.");
      if (modoOnline) enviarTrash(jugador);                              // sincronizar trash

      game.valorDefensa += 1;                                            // +1 a la recepción
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      // comprobar si todos los personajes en juego son de Aoba Jôsai
      let cartasEnJuego = [
        jugador.zonas.saque.at(-1),                                      // último sacador
        jugador.zonas.recepcion.at(-1),                                  // último receptor
        jugador.zonas.pase.at(-1),                                       // último colocador
        jugador.zonas.remate.at(-1),                                     // último rematador
        jugador.zonas.bloqueo.at(-1)                                     // último bloqueador
      ].filter(c => c !== null && c !== undefined);                      // filtrar zonas vacías

      let todasAoba = cartasEnJuego.every(c => c.info?.escuela === "Aoba Jôsai"); // comprobar escuela
      if (todasAoba) {                                                   // si todas son de Aoba Jôsai
        robarCarta(jugador, 1, true);                                    // robar 1 carta
        log(t("log.habilidadActivada", { carta: carta.nombre }));
      } else {
        log("No todos los personajes en juego son de Aoba Jôsai. No se roba carta.");
      }

      renderMano();                                                      // actualizar mano
      renderManoRival();                                                 // actualizar mano rival
      renderCampo();                                                     // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P01-039",
      escuela: "Aoba Jôsai",
      posicion: "Li",
      anyo: 2,
      rareza: "N",
      zonasProhibidas: ["saque", "bloqueo"],                             // libero: no puede jugar en saque ni bloqueo
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Solo puedes usar esta habilidad si el ataque del rival es 6 o más. Descarta 1 carta de <strong>Aoba Jôsai</strong> de tu mano para +1 a la recepción. Si todos tus personajes en juego son de <strong>Aoba Jôsai</strong>, roba 1 carta.`
    }
  ),
  crearCarta("Yahaba Shigeru", // ============================================================== P01-040
    {
      saque: 2,
      recepcion: 3,
      pase: 2,
      remate: 2,
      bloqueo: 1
    },
    null, // sin habilidad
    {
      tipo: "personaje",
      id: "HV-P01-040",
      escuela: "Aoba Jôsai",
      posicion: "S",
      anyo: 2,
      rareza: "N"
    }
  ),
  crearCarta("Kunimi Akira", // ================================================================ P01-041
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "remate") {                               // comprobar zona válida
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        return false;                                                    // return false: zona incorrecta
      }

      // comprobar que todos los personajes en juego son de Aoba Jôsai
      let cartasEnJuego = [
        jugador.zonas.saque.at(-1),                                      // último sacador
        jugador.zonas.recepcion.at(-1),                                  // último receptor
        jugador.zonas.pase.at(-1),                                       // último colocador
        jugador.zonas.remate.at(-1),                                     // último rematador
        jugador.zonas.bloqueo.at(-1)                                     // último bloqueador
      ].filter(c => c !== null && c !== undefined);                      // filtrar zonas vacías

      let todasAoba = cartasEnJuego.every(c => c.info?.escuela === "Aoba Jôsai"); // comprobar escuela
      if (!todasAoba) {                                                  // si no todas son de Aoba Jôsai
        log("Todos tus personajes en juego deben ser de Aoba Jôsai.");
        return false;                                                    // return false: condición no cumplida
      }

      // comprobar que el rival tiene 3 o menos cartas
      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;   // índice del rival
      let rival = game.jugadores[rivalIndex];                            // jugador rival
      if (rival.mano.length > 3) {                                       // si el rival tiene más de 3
        log("El rival debe tener 3 o menos cartas en la mano.");
        return false;                                                    // return false: condición no cumplida
      }

      if (!await usarGuts(jugador, "remate", 1)) {                       // pagar 1 GUTS de remate
        return false;                                                    // return false: GUTS insuficientes
      }

      finta(4);                                                          // activar efecto finta con valor 4
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      renderMano();                                                      // actualizar mano
      renderManoRival();                                                 // actualizar mano rival
      renderCampo();                                                     // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P01-041",
      escuela: "Aoba Jôsai",
      posicion: "WS",
      anyo: 1,
      rareza: "R",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS - 1</strong>: Solo puedes usar esta habilidad si todos tus personajes en juego son de <strong>Aoba Jôsai</strong> y el rival tiene 3 o menos cartas en la mano: <span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>Finta (4)</strong></span> : el ataque queda fijado en 4 y el rival no puede colocar bloqueadores este turno.`
    }
  ),
  crearCarta("Kyotani Kentaro", // ============================================================= P01-042
    {
      saque: 5,
      recepcion: 4,
      pase: 0,
      remate: 3,
      bloqueo: 0
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P01-042",
      escuela: "Aoba Jôsai",
      posicion: "WS",
      anyo: 2,
      rareza: "R"
    }
  ),


  crearCarta("Kotaro Bokuto", // =============================================================== P01-044
    {
      saque: 5,
      recepcion: 2,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-044",
      escuela: "Fukurodani",
      posicion: "WS",
      anyo: 3,
      rareza: "R"
    }
  ),
  crearCarta("Keiji Akaashi", // ================================================================ P01-045
    { saque: 2,
      recepcion: 0,
      pase: 1,
      remate: 2,
      bloqueo: 1
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "pase") {
        log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
        return;
      }
      if (!await usarGuts(jugador, "pase", 2)) {
        return;
      }
      game.valorAtaque += 2;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
      let bokutos = jugador.trash.filter(c => c.nombre === "Kotaro Bokuto"); // buscar todos los Bokutos
      if (bokutos.length === 0) {
        log(t("log.condicionNoCumplida"));
        return;
      }

      let bokutoElegido = await mostrarSelectorCartas("Elige un Kotaro Bokuto del trash:", bokutos); // selector
      if (!bokutoElegido) return;

      let index = jugador.trash.indexOf(bokutoElegido);           // buscar en el trash
      jugador.trash.splice(index, 1);                             // sacar del trash
      añadirCartaAMano(jugador, bokutoElegido);                   // añadir a la mano
      log("Kotaro Bokuto añadido a tu mano desde el trash.");
      renderMano();
      },
    { tipo: "personaje",
        id: "HV-P01-045",
        escuela: "Fukurodani",
        posicion: "S",
        anyo: 2,
        rareza: "S",
        descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Pase</span> GUTS - 2</strong>: Añade +2 al pase. Después, busca un <strong>Kotaro Bokuto</strong> en tu pila de descartes y añádelo a tu mano.`
    }
  ),
  crearCarta("Keiji Akaashi", // ================================================================ P01-046
    { saque: 1,
      recepcion: 3,
      pase: 2,
      remate: 1,
      bloqueo: 2
    },
    null,
    { tipo: "personaje",
        id: "HV-P01-046",
        escuela: "Fukurodani",
        posicion: "S",
        anyo: 2,
        rareza: "R"
    }
  ),
  crearCarta("Konoha Akinori", // ================================================================ P01-048
    { saque: 1,
      recepcion: 2,
      pase: 1,
      remate: 3,
      bloqueo: 2
    },
    null,
    { tipo: "personaje",
        id: "HV-P01-048",
        escuela: "Fukurodani",
        posicion: "WS",
        anyo: 3,
        rareza: "NP"
    }
  ),
  crearCarta("Haruki Komi", // ============================================================== P01-050
    {
      saque: 0,
      recepcion: 6,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P01-050",
      escuela: "Fukurodani",
      posicion: "L",
      anyo: 3,
      rareza: "N"
    }
  ),
  crearCarta("Onaga Wataru", // ============================================================== P01-052
    {
      saque: 2,
      recepcion: 3,
      pase: 0,
      remate: 3,
      bloqueo: 3
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-052",
      escuela: "Fukurodani",
      posicion: "MB",
      anyo: 1,
      rareza: "N"
    }
  ),
  crearCarta("Ikejiri Hayato", // ============================================================== P01-053
    { 
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 2,
      bloqueo: 2
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-053",
      escuela: "Tokonami",
      posicion: "WS",
      anyo: 3,
      rareza: "N"
    }
  ),
  crearCarta("Aone Takanobu", // =================================================================== P01-054
    {
      saque: 1,
      recepcion: 1,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    async function(jugador, game, carta) { // GUTS-3 : +5 Bloqueo
      if (carta.zonaActual !== "bloqueo") {
        log(t("log.noEsFase", { zona: t("ui.zonaBloqueo") }));
        return;
      }
      if (!await usarGuts(jugador, "bloqueo", 3)) {
        return;
      }
      game.valorDefensa += 5;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P01-054",
      escuela: "Date Kôgyô",
      posicion: "MB",
      anyo: 2,
      rareza: "NP",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span> GUTS - 3</strong>: Añade +5 al bloqueo.`
    }
  ),
  crearCarta("Kenji Futakuchi", // =================================================================== P01-055
    {
      saque: 5,
      recepcion: 0,
      pase: 0,
      remate: 3,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P01-055",
      escuela: "Date Kôgyô",
      posicion: "WS",
      anyo: 2,
      rareza: "NP"
    }
  ),
  crearCarta("Ushijima Wakatoshi", // =================================================================== P01-056
    {
      saque: 4,
      recepcion: 3,
      pase: 0,
      remate: 2,
      bloqueo: 0
    },
    function(jugador, game, carta) {
      if (carta.zonaActual !== "saque" && carta.zonaActual !== "remate") {
        log(t("log.noEsFase", { zona: t("ui.zonaSaque") }));
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        carta.habilidadUsada = false;
        return;
      }
      if (!pagarConEvento(jugador)) {
        return;
      }
      robarCarta(jugador, 1, true);
      game.valorAtaque += 2;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P01-056",
      escuela: "Shiratorizawa",
      posicion: "WS",
      anyo: 3,
      fases: ["saque", "remate"],
      rareza: "S",
      descripcion: `<strong><span style="background:#e65100; color:white; padding:1px 4px; border-radius:2px;">Saque</span> <span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Puedes descartarte una carta de evento de tu mano para añadir +2 al saque o al remate de esta carta.`
    } 
  ),
  crearCarta("Tendo Satori", // =================================================================== P01-057
    {
      saque: 1,
      recepcion: 0,
      pase: 0,
      remate: 2,
      bloqueo: 3
    },
    function(jugador, game, carta) {
      if (carta.zonaActual !== "bloqueo") {
        log(t("log.noEsFase", { zona: t("ui.zonaBloqueo") }));
        return;
      }
      robarCuandoRival();
    },
      {
        tipo: "personaje",
        id: "HV-P01-057",
        escuela: "Shiratorizawa",
        posicion: "MB",
        anyo: 3,
        rareza: "N",
        descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span></strong> Durante el siguiente punto, cada vez que el rival robe una carta por un efecto, tú también robas una carta.`
      }
  ),
  crearCarta("Goshiki Tsutomu", // ============================================================== P01-058
    {
      saque: 5,
      recepcion: 2,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-058",
      escuela: "Shiratorizawa",
      posicion: "WS",
      anyo: 1,
      rareza: "N",
    }
  ),
  crearCarta("Towada Yoshiki", // ============================================================== P01-059
    {
      saque: 3,
      recepcion: 5,
      pase: 0,
      remate: 2,
      bloqueo: 1
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-059",
      escuela: "Ohgiminami",
      posicion: "WS",
      anyo: 2,
      rareza: "N",
    }
  ),
  crearCarta("Hyakuzawa Yudai", // ============================================================== P01-060
    {
      saque: 1,
      recepcion: 1,
      pase: 0,
      remate: 2,
      bloqueo: 3
    },
    function(jugador, game, carta) {
      if (carta.zonaActual !== "bloqueo") {
        log(t("log.noEsFase", { zona: t("ui.zonaBloqueo") }));
        return;
      }
      if (game.valorAtaque < 4) {
        log(t("log.condicionNoCumplida"));
        return;
      }
      oneTouch(2);
    },
    {
      tipo: "personaje",
      id: "HV-P01-060",
      escuela: "Kakugawa",
      posicion: "WS",
      anyo: 1,
      rareza: "N",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span></strong> Sólo puedes jugar este efecto si el ataque del rival es igual o superior a 4. </br><span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>One Touch (2)</strong></span> : resta 2 al ataque del rival y pasa directamente a fase de recepción.` 
    }
  ),
  crearCarta("Nakashima Takeru", // ============================================================== P01-062
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 2,
      bloqueo: 2
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-062",
      escuela: "Wakutani Minami",
      posicion: "WS",
      anyo: 3,
      rareza: "N",
    }
  ),
  crearCarta("Miya Atsumu", // ============================================================== P01-063
    {
      saque: 5,
      recepcion: 1,
      pase: 2,
      remate: 1,
      bloqueo: 1
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-063",
      escuela: "Inarizaki",
      posicion: "S",
      anyo: 2,
      rareza: "NP",
    }
  ),
  crearCarta("Miya Osamu", // ============================================================== P01-064
    {
      saque: 2,
      recepcion: 4,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P01-064",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 2,
      rareza: "N",
    }
  ),
  crearCarta("Kita Shinsuke", // ============================================================== P01-065
    {
      saque: 2,
      recepcion: 2,
      pase: 0,
      remate: 3,
      bloqueo: 1
    },
    function(jugador, game, carta) {
      if (carta.zonaActual !== "recepcion") { 
        log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
        return;
      }

      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;
      let rival = game.jugadores[rivalIndex]; // buscar al rival

      // contar cartas del rival en zona de eventos que puedan jugarse en pase o remate
      let cartasValidas = rival.zonas.eventos.filter(c => 
        c.info?.fases?.includes("pase") || c.info?.fases?.includes("remate")
      );

      if (cartasValidas.length >= 5) {
        game.valorDefensa += 6;
        log(t("log.habilidadActivada", { carta: carta.nombre }));
      } else {
        log("El rival no tiene suficientes cartas de evento en pase/remate (necesitas 5, tiene " + cartasValidas.length + ") ❌");
      }
    },
    {
      tipo: "personaje",
      id: "HV-P01-065",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 3,
      rareza: "N",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Si el rival tiene 5 o más cartas de eventos de tipo <strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> o <strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span></strong> en su zona de eventos, añade +6 a la recepción.`
    }
  ),
  crearCarta("Hoshiumi Kourai", // ============================================================== P01-066
    {
      saque: 3,
      recepcion: 1,
      pase: 0,
      remate: 2,
      bloqueo: 2
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "remate") {
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        return;
      }

      // ver las cartas activas de la jugada
      let cartasActivas = [
        game.jugadaActual.recepcion,
        game.jugadaActual.pase,
        game.jugadaActual.remate,
        game.jugadaActual.bloqueo
      ].filter(c => c !== null); // filtrar las que no se han jugado

      // condición 1: todas son de Kamomedai
      let todasKamomedai = cartasActivas.length > 0 && 
      cartasActivas.every(c => c.info?.escuela === "Kamomedai");

      // condición 2: 4 o más escuelas diferentes
      let escuelas = new Set(cartasActivas.map(c => c.info?.escuela));
      let escuelasDiferentes = escuelas.size >= 4;

      if (!todasKamomedai && !escuelasDiferentes) {
        log("No cumples la condición de escuelas ❌");
        return;
      }

      if (!await usarGuts(jugador, "remate", 3)) {
        log("Necesitas 3 GUTS en remate ❌");
        return;
      }

      game.valorAtaque += 3;
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      // descartar hasta 2 cartas del rival en zona de eventos
      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;
      let rival = game.jugadores[rivalIndex];

      let descartadas = rival.zonas.eventos.splice(0, 2);
      descartadas.forEach(c => rival.trash.push(c));
      log("Descartadas " + descartadas.length + " cartas de eventos del rival al trash 🗑️");

      // si quedan 2 o menos cartas en zona de eventos del rival, +1 adicional
      if (rival.zonas.eventos.length <= 2) {
        game.valorAtaque += 1;
        log("Hoshiumi: +1 adicional al remate.");
      }
      renderCampo();
    },
    {
      tipo: "personaje",
      id: "HV-P01-066",
      escuela: "Kamomedai",
      posicion: "WS",
      anyo: 2,
      rareza: "S",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS - 3</strong>: Sólo puedes usar esta habilidad si todos los jugadores que han participado en la jugada son del equipo <strong>Kamomedai</strong> o si pertenecen a 4 o más escuelas distintas. Añade +3 al remate. Después, puedes enviar 2 eventos de la zona de eventos del rival a su descarte. Si tras esta acción le quedan 2 eventos o menos en la zona, obtienes +1 de remate adicional.`
    }
  ),
  crearCarta("Hirugami Sachiro", // ============================================================== P01-067
    {
      saque: 5,
      recepcion: 2,
      pase: 0,
      remate: 2,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P01-067",
      escuela: "Kamomedai",
      posicion: "MB",
      anyo: 2,
      rareza: "R",
    }
  ),
  crearCarta("Sakusa Kiyoomi", // ============================================================== P01-068
  {saque: 4, recepcion: 3, pase: 0, remate: 2, bloqueo: 0},

  function(jugador, game, carta) {
    if (carta.zonaActual !== "remate") {
      log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
      return;
    }

    // condición 1: 3 o menos cartas en mano
    if (jugador.mano.length > 3) {
      log("Necesitas 3 o menos cartas en mano ❌");
      return;
    }

    // condición 2: 4 o más escuelas diferentes en juego
    let cartasEnJuego = [
      jugador.zonas.recepcion.at(-1),
      jugador.zonas.pase.at(-1),
      jugador.zonas.remate.at(-1),
      jugador.zonas.bloqueo.at(-1),
      jugador.zonas.saque.at(-1)
    ].filter(c => c !== null);

    let escuelas = new Set(cartasEnJuego.map(c => c.info?.escuela));
    if (escuelas.size < 4) {
      log("Necesitas 4 o más escuelas diferentes en juego ❌");
      return;
    }

    game.valorAtaque += 2;
    log(t("log.habilidadActivada", { carta: carta.nombre }));
    blockout(2);
  },
  {
    tipo: "personaje",
    id: "HV-P01-068",
    escuela: "Itachiyama",
    posicion: "WS",
    anyo: 2,
    rareza: "S",
    descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS - 3</strong> Si tienes 3 o menos cartas en mano y tus jugadores en el campo pertenecen a más de 4 escuelas diferentes, añade +2 al remate. </br><span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>Blockout (2)</strong></span> : En el próximo turno, si el bloqueador rival central tiene un bloqueo original de 2 o menos, irá al descarte en lugar de quedarse en la zona de bloqueo.`
  }
),
  crearCarta("Echigo Sakae", // ============================================================== P01-069
    {
      saque: 1,
      recepcion: 3,
      pase: 2,
      remate: 1,
      bloqueo: 2
    },
    null, // habilidad
    {
      tipo: "personaje",
      id: "HV-P01-069",
      escuela: "Tsubakihara",
      posicion: "S",
      anyo: 3,
      rareza: "S",
    }
  ),
  crearCarta("Shirofune Itaru", // ============================================================== P01-070
    {
      saque: 2,
      recepcion: 4,
      pase: 2,
      remate: 1,
      bloqueo: 0
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P01-070",
      escuela: "Sarukawa Kōgyō",
      posicion: "S",
      anyo: 3,
      rareza: "N",
    }
  ),
// ========================================================================================================================= KARASUNO Eventos
  crearCarta("Ukai Ikki", // ============================================================== P01-074
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {
      robarCarta(jugador, 1, true);                         // roba 1 carta
      game.valorAtaque += 1;                                // +1 al remate
      log("Ukai Ikki: roba 1 carta y +1 al remate.");

      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0; // índice del rival
      let rival = game.jugadores[rivalIndex];               // jugador rival

      let cartasValidas = rival.zonas.eventos.filter(c =>   // filtrar eventos del rival
        c.info?.fases?.includes("pase") ||                  // jugables en pase
        c.info?.fases?.includes("recepcion")                // o en recepción
      );

      if (cartasValidas.length >= 5) {                      // si hay 5 o más
        game.valorAtaque += 2;                              // +2 adicional al remate
        log("Efecto adicional Ukai Ikki: +2 al remate por condición cumplida.");
      }
    },
    {
      tipo: "evento",
      subtipo: "entrenador",
      id: "HV-P01-074",
      fases: ["remate"],
      escuela: "Karasuno",
      rareza: "N",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Roba 1 carta y +1 al remate. Si el rival tiene 5 o más cartas de eventos jugables en <strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> o <strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span></strong> en su zona de eventos, +2 adicional al remate.`
    }
  ),
  crearCarta("Shimizu Kiyoko", // ============================================================== P01-075
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {

      if (game.fase === "recepcion") {                          // si recepción
        let receptor = jugador.zonas.recepcion.at(-1);         // buscar el receptor en juego
        if (!receptor || receptor.info?.escuela !== "Karasuno") { // comprobar que es de Karasuno
          log("Tu receptor debe ser de Karasuno.");
          return false;                                         // return false: habilidad no ejecutada
        }
        game.valorDefensa += 1;                                // +1 a la recepción
        log("Shimizu Kiyoko: +1 a la recepción de " + receptor.nombre + ".");
        robarCarta(jugador, 1, true);                          // roba 1 carta solo en recepción
        log(jugador.nombre + " roba 1 carta.");              // log del robo
      } 
      else if (game.fase === "remate") {                     // si estamos en remate
        let rematador = jugador.zonas.remate.at(-1);           // buscar el rematador en juego
        if (!rematador || rematador.info?.escuela !== "Karasuno") { // comprobar que es de Karasuno
          log("Tu rematador debe ser de Karasuno.");
          return false;                                         // return false: habilidad no ejecutada
        }
        game.valorAtaque += 1;                                 // +1 al remate
        log("Shimizu Kiyoko: +1 al remate de " + rematador.nombre + ".");
      }
    },
    {
      tipo: "evento",
      subtipo: "entrenador",
      id: "HV-P01-075",
      fases: ["recepcion", "remate"],
      escuela: "Karasuno",
      rareza: "N",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> <span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Si tu receptor o rematador es de <strong>Karasuno</strong>, +1 a su parámetro según la fase. Si estás en <strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong>, además roba 1 carta.`
    }
  ),
  crearCarta("¡Ánimo!", // ======================================================================================= P01-076
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      if (jugador.mano.length > 4) {                            // comprobar 4 o menos cartas en mano
        log("Necesitas 4 o menos cartas en la mano.");
        return false;                                           // return false: habilidad no ejecutada
      }

      let zonasValidas = ["saque", "recepcion", "pase", "remate", "bloqueo"].filter(zona =>
        jugador.zonas[zona].length >= 2                        // buscar zonas con al menos 2 cartas en el GUTS
      );
      if (zonasValidas.length === 0) {                         // si no hay ninguna zona válida
        log(t("log.condicionNoCumplida"));
        return false;                                          // return false: habilidad no ejecutada
      }

      // elegir zona
      let eleccion = await mostrarEleccion(                    // mostrar selector de zonas
        zonasValidas.map(zona => ({ texto: zona }))            // convertir zonas a opciones
      );
      let zonaElegida = zonasValidas[eleccion];                // zona elegida por el jugador

      // elegir 2 cartas del GUTS de esa zona con el selector
      let cartasGuts = jugador.zonas[zonaElegida];  
      if (cartasGuts.length < 2) {                             // comprobar que hay al menos 2
        log(t("log.condicionNoCumplida"));
        return false;                                          // return false: habilidad no ejecutada
      }

      for (let i = 0; i < 2; i++) {                            // repetir 2 veces
        let disponibles = cartasGuts.filter(c =>               // filtrar las ya elegidas
          !jugador.mano.includes(c)                            // que no estén ya en la mano
        );
        let cartaElegida = await mostrarSelectorCartas(        // abrir selector
          "Elige una carta del GUTS de " + zonaElegida + " (" + (i + 1) + "/2):", // título
          disponibles                                          // cartas disponibles
        );
        if (!cartaElegida) {                                   // si cancela
          return false;                                        // return false: habilidad no ejecutada
        }
        let index = jugador.zonas[zonaElegida].indexOf(cartaElegida); // buscar en la zona
        jugador.zonas[zonaElegida].splice(index, 1);           // sacar de la zona
        añadirCartaAMano(jugador, cartaElegida);               // añadir a la mano
        log(cartaElegida.nombre + " añadida a la mano desde el GUTS de " + zonaElegida + ".");
      }

      renderMano();                                            // actualizar mano
      renderManoRival();                                       // actualizar mano rival
      renderCampo();                                           // actualizar campo
    },
    {
      tipo: "evento",
      id: "HV-P01-076",
      fases: ["recepcion"],
      escuela: "Karasuno",
      rareza: "N",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Si tienes 4 o menos cartas en la mano, elige una de tus zonas y añade 2 cartas de su GUTS a tu mano.`
    }
  ),
  crearCarta("¡Vamos a por ello!", // ============================================================================ P01-077
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {
      let receptor = jugador.zonas.recepcion.at(-1);            // buscar el receptor en juego
      if (!receptor || receptor.info?.escuela !== "Karasuno") { // comprobar que es de Karasuno
        log("Tu receptor debe ser de Karasuno.");
        return false;                                           // return false: habilidad no ejecutada
      }
      game.valorDefensa += 2;                                   // +2 a la recepción
      log("+2 a la recepción de " + receptor.nombre + ".");

      if (receptor.nombre === "Nishinoya Yu") {                 // si el receptor es Nishinoya
        robarCarta(jugador, 1, true);                           // roba 1 carta
      }
    },
    {
      tipo: "evento",
      id: "HV-P01-077",
      fases: ["recepcion"],
      escuela: "Karasuno",
      rareza: "N",
      unica: true,                                              // solo se puede jugar 1 por turno
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> <strong><span style="background:#e91e8c; color:white; padding:1px 4px; border-radius:2px;">Única</span></strong> +2 a la recepción de un personaje de <strong>Karasuno</strong>. Si ese personaje es <strong>Nishinoya Yu</strong>, roba 1 carta.</br><strong><span style="background:#e91e8c; font-size:0.85em; color:white; padding:1px 4px; border-radius:2px;">Única</span></strong><span style="font-size:0.85em"> : Solo puedes jugar 1 carta con este nombre por turno.</span>`
    }
  ),
  crearCarta("Ataque abierto", // ================================================================================ P01-078
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      robarCarta(jugador, 2, true);                                // roba 2 cartas
      if (jugador.mano.length === 0) {                             // comprobar que hay cartas en mano
        log("No tienes cartas en la mano para descartar.");
        return false;                                              // return false: habilidad no ejecutada
      }
      let cartaDescarte = await mostrarSelectorCartas(             // abrir selector de descarte
        "Elige una carta de tu mano para descartar:",              // título del selector
        jugador.mano                                               // mostrar toda la mano
      );
      if (!cartaDescarte) return false;                            // return false: si cancela

      let indexDescarte = jugador.mano.indexOf(cartaDescarte);     // buscar en la mano
      jugador.mano.splice(indexDescarte, 1);                       // sacar de la mano
      jugador.trash.push(cartaDescarte);                           // enviar al trash
      log(cartaDescarte.nombre + " descartada de la mano.");

      // comprobar cuántos "Ataque abierto" hay en la zona de eventos
      let ataquesAbiertos = jugador.zonas.eventos.filter(c =>      // filtrar zona de eventos
        c.nombre === "Ataque abierto"                              // solo "Ataque abierto"
      );
      if (ataquesAbiertos.length > 2) {                            // si hay más de 2
        log("Ya hay 2 o más Ataque abierto en tu zona de eventos. No se activa el efecto adicional.");
        return false;                                              // return false: habilidad no ejecutada
      }

      // buscar Hinata Shoyo en el trash
      let hinatasEnTrash = jugador.trash.filter(c =>               // filtrar trash
        c.nombre === "Hinata Shoyo"                                // solo Hinata
      );
      if (hinatasEnTrash.length === 0) {                           // si no hay ninguno
        log(t("log.condicionNoCumplida"));
        return false;                                              // return false: habilidad no ejecutada
      }

      let hinataElegido = await mostrarSelectorCartas(             // abrir selector
        "Elige un Hinata Shoyo del trash para colocar en remate:", // título del selector
        hinatasEnTrash                                             // solo Hinata
      );
      if (!hinataElegido) return false;                            // return false: si cancela

      let rematadorActual = jugador.zonas.remate.at(-1);           // buscar rematador actual
      if (rematadorActual && rematadorActual.recienJugada) {                                       // si hay rematador
        game.valorAtaque -= rematadorActual.stats.remate;          // restar su remate al ataque
        let indexActual = jugador.zonas.remate.indexOf(rematadorActual); // buscar en la zona
        jugador.zonas.remate.splice(indexActual, 1);               // sacar de la zona
        jugador.zonas.remate.unshift(rematadorActual);             // enviar al GUTS (principio)
      }

      let indexTrash = jugador.trash.indexOf(hinataElegido);       // buscar Hinata en el trash
      jugador.trash.splice(indexTrash, 1);                         // sacar del trash
      jugador.zonas.remate.push(hinataElegido);                    // colocar como último rematador
      hinataElegido.zonaActual = "remate";                         // actualizar zona
      hinataElegido.recienJugada = true;                           // marcar como recién jugado
      hinataElegido.habilidadUsada = false;                        // habilidad no usada
      game.ultimaCarta = hinataElegido;                            // actualizar última carta
      game.ultimoJugador = jugador;                                // actualizar último jugador

      game.valorAtaque += 1;          // sumar remate de Hinata + 1
      log("Hinata Shoyo traído del trash al remate con + 1 al remate.");

      renderMano();                                                // actualizar mano
      renderManoRival();                                           // actualizar mano rival
      renderCampo();                                               // actualizar campo
    },
    {
      tipo: "evento",
      id: "HV-P01-078",
      fases: ["remate"],
      escuela: "Karasuno",
      rareza: "S",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Roba 2 cartas y descarta 1 de tu mano. </br>Si hay 2 o menos <strong>Ataque abierto</strong> en tu zona de eventos, puedes traer un <strong>Hinata Shoyo</strong> del trash a la zona de remate y añadir +1 a su remate.`
    }
  ),
  crearCarta("Nunca pensé ni por un momento que podría ganar solo", // =========================================== P01-079
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      robarCarta(jugador, 1, true);                                  // roba 1 carta

      let bloqueador = game.bloqueoActual.central;                   // buscar el bloqueador central
      if (!bloqueador || bloqueador.info?.escuela !== "Karasuno") {  // comprobar que es de Karasuno
        log("Tu bloqueador central debe ser de Karasuno.");
        return false;                                                 // return false: habilidad no ejecutada
      }

      game.valorDefensa += 1;                                        // +1 al bloqueo
      log("Evento: +1 al bloqueo de " + bloqueador.nombre + ".");

      if (bloqueador.nombre === "Tsukishima Kei") {                  // si el bloqueador es Tsukishima
        let yamaguchisEnGuts = jugador.zonas.saque.filter(c =>       // buscar en toda la zona de saque
          c.nombre === "Yamaguchi Tadashi"                            // solo Yamaguchi
        );

        if (yamaguchisEnGuts.length > 0) {                           // si hay alguno
          let yamaguchi = await mostrarSelectorCartas(               // abrir selector directamente
            "Elige un Yamaguchi Tadashi del GUTS de saque (opcional) para devolver a la mano:", 
            yamaguchisEnGuts,                                        // solo Yamaguchi
            true                                                     // permite cancelar clicando fuera
          );
          if (yamaguchi) {                                           // si elige uno
            let index = jugador.zonas.saque.indexOf(yamaguchi);     // buscar en la zona
            jugador.zonas.saque.splice(index, 1);                   // sacar de la zona
            añadirCartaAMano(jugador, yamaguchi);                   // añadir a la mano
            log("Yamaguchi Tadashi añadido a la mano desde el saque.");
          }
        } else {
          log(t("log.condicionNoCumplida"));
        }

        debilitarReceptor(2);                                        // -2 al receptor rival
      }

      renderMano();                                                  // actualizar mano
      renderManoRival();                                             // actualizar mano rival
      renderCampo();                                                 // actualizar campo
    },
    {
      tipo: "evento",
      id: "HV-P01-079",
      fases: ["bloqueo"],
      escuela: "Karasuno",
      rareza: "N",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span></strong> Roba 1 carta y +1 al bloqueo de un personaje de <strong>Karasuno</strong>. </br>Si ese bloqueador es <strong>Tsukishima Kei</strong>, puedes añadir un <strong>Yamaguchi Tadashi</strong> del GUTS de saque a tu mano. Además, durante el siguiente turno rival, el receptor tendrá <strong>-2 a la recepción</strong>.`
    }
  ),
  crearCarta("Nekomata Yasufumi", // ============================================================================= P01-080 (POR PROBAR)
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {
      robarCarta(jugador, 1, true);                                          // roba 1 carta
      log("Nekomata Yasufumi: roba 1 carta.");

      game.valorDefensa += 1;                                                // +1 a la recepción
      log("Nekomata Yasufumi: +1 a la recepción.");

      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;        // índice del rival
      let rival = game.jugadores[rivalIndex];                                // jugador rival

      let cartasValidas = rival.zonas.eventos.filter(c =>                    // filtrar eventos del rival
        c.info?.fases?.includes("pase") ||                                   // jugables en pase
        c.info?.fases?.includes("remate")                                    // o en remate
      );

      if (cartasValidas.length >= 5) {                                       // si hay 5 o más
        game.valorDefensa += 2;                                              // +2 adicional a la recepción
        log("Efecto adicional Nekomata: +2 a la recepción por condición cumplida.");
      }
    },
    {
      tipo: "evento",
      subtipo: "entrenador",
      id: "HV-P01-080",
      fases: ["recepcion"],
      escuela: "Nekoma",
      rareza: "NP",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Roba 1 carta y +1 a la recepción. Si el rival tiene 5 o más cartas de eventos en <strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span></strong> o <strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> en su zona de eventos, +2 adicional a la recepción.`
    }
  ),
  crearCarta("Yamamoto Akane", // ============================================================== P01-081
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      robarCarta(jugador, 1, true);                                          // roba 1 carta
      log("Yamamoto Akane: roba 1 carta.");

      // comprobar que el rematador es de Nekoma
      let rematador = jugador.zonas.remate.at(-1);                           // último rematador
      if (!rematador || rematador.info?.escuela !== "Nekoma") {              // si no es de Nekoma
        log("Tu rematador no es de Nekoma. Efectos adicionales no activados.");
        return false;                                                        // return false: condición no cumplida
      }

      game.valorAtaque += 1;                                                 // +1 al remate
      log("Yamamoto Akane: +1 al remate.");

      // comprobar que todos los personajes en juego son de Nekoma
      let cartasEnJuego = [
        jugador.zonas.saque.at(-1),                                          // último sacador
        jugador.zonas.recepcion.at(-1),                                      // último receptor
        jugador.zonas.pase.at(-1),                                           // último colocador
        jugador.zonas.remate.at(-1),                                         // último rematador
        jugador.zonas.bloqueo.at(-1)                                         // último bloqueador
      ].filter(c => c !== null && c !== undefined);                           // filtrar zonas vacías

      let todasNekoma = cartasEnJuego.every(c => c.info?.escuela === "Nekoma"); // comprobar escuela
      if (!todasNekoma) {                                                    // si no todas son de Nekoma
        log("No todos tus personajes en juego son de Nekoma. Efecto adicional no activado.");
        return;                                                              // termina sin el bonus
      }

      // pagar 3 GUTS de recepción
      if (!await usarGuts(jugador, "recepcion", 3)) {                        // pagar 3 GUTS de recepción
        return;                                                              // return: GUTS insuficientes
      }

      game.valorAtaque += 1;                                                 // +1 adicional al remate
      log("Efecto adicional Yamamoto Akane: +1 al remate por condición cumplida.");
    },
    {
      tipo: "evento",
      id: "HV-P01-081",
      fases: ["remate"],
      escuela: "Nekoma",
      rareza: "N",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Roba 1 carta y +1 al remate de un personaje de <strong><span style="color:#c62828">Nekoma</span></strong>. </br>Si todos tus personajes en juego son de <strong>Nekoma</strong>, puedes gastar en <strong><span style="color:#1565c0">Recepción</span> GUTS - 3</strong> para añadir +1 adicional al remate.`
    }
  ),
  crearCarta("Esto es lo que significa conectar", // ================================================= P01-082
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      robarCarta(jugador, 1, true);                                          // roba 1 carta
      log("Evento: roba 1 carta.");

      // comprobar que el receptor es de Nekoma
      let receptor = jugador.zonas.recepcion.at(-1);                        // buscar receptor
      if (!receptor || receptor.info?.escuela !== "Nekoma") {               // comprobar que es de Nekoma
        log("Tu receptor no es de Nekoma.");
        return false;                                                        // return false: condición no cumplida
      }

      let eleccion = await mostrarEleccion([                                 // mostrar opciones
        { texto: "+1 a la recepción de un personaje de Nekoma." },          // opción 1
        { texto: "Fijar la recepción de un personaje de Nekoma con recepción 5 o más en 7." } // opción 2
      ]);

      if (eleccion === 0) {                                                  // opción 1: +1 a la recepción
        game.valorDefensa += 1;                                             // +1 a la recepción
        log("Evento: +1 a la recepción de " + receptor.nombre + ".");

      } else {                                                               // opción 2: fijar recepción en 7
        if (receptor.stats.recepcion < 5) {                                 // comprobar recepción base 5 o más
          log("Tu receptor no tiene recepción de base 5 o más.");
          return false;                                                      // return false: condición no cumplida
        }
        let recepcionActual = receptor.stats.recepcion + game.valorDefensa;  // recepción actual
        game.valorDefensa += 7 - recepcionActual;                            // ajustar para llegar a 7
        log("Evento: recepción de " + receptor.nombre + " fijada en 7.");
      }
    },
    {
      tipo: "evento",
      id: "HV-P01-082",
      fases: ["recepcion"],
      escuela: "Nekoma",
      rareza: "S",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Roba 1 carta. Elige: </br><strong>· +1 a la recepción</strong> de un personaje de <strong>Nekoma</strong>. </br><strong>· Fija la recepción en 7</strong> de un personaje de <strong>Nekoma</strong> con recepción de base 5 o más.`
    }
  ),
  crearCarta("Ataque sincronizado en primer tiempo", // ============================================== P01-083
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      robarCarta(jugador, 1, true);                                          // roba 1 carta
      log("Evento: roba 1 carta.");

      // comprobar que todos los personajes en juego son de Nekoma
      let cartasEnJuego = [
        jugador.zonas.saque.at(-1),
        jugador.zonas.recepcion.at(-1),
        jugador.zonas.pase.at(-1),
        jugador.zonas.remate.at(-1),
        jugador.zonas.bloqueo.at(-1)
      ].filter(c => c !== null && c !== undefined);                           // filtrar zonas vacías

      let todasNekoma = cartasEnJuego.every(c => c.info?.escuela === "Nekoma"); // comprobar escuela
      if (!todasNekoma) {                                                    // si no todas son de Nekoma
        log("No todos tus personajes en juego son del Nekoma.");
        return false;                                                        // return false: condición no cumplida
      }

      if (!await usarGutsMultiZona(jugador, 6)) return false;               // pagar 6 GUTS de cualquier zona

      game.valorAtaque += 3;                                                 // +3 al remate
      log("Evento 1st Tempo: +3 al remate.");

      renderMano();                                                          // actualizar mano
      renderManoRival();                                                     // actualizar mano rival
      renderCampo();                                                         // actualizar campo
    },
    {
      tipo: "evento",
      id: "HV-P01-083",
      fases: ["remate"],
      escuela: "Nekoma",
      rareza: "R",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Roba 1 carta. Si todos tus personajes en juego son de <strong>Nekoma</strong>, puedes gastar <strong>6 GUTS</strong> de cualquier zona de tu campo para añadir <strong>+3 al remate</strong>.`
    }
  ),
  crearCarta("Irihata Nobuteru", // ============================================================ P01-085
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      robarCarta(jugador, 1, true);                                        // roba 1 carta al final

      let eleccion = await mostrarEleccion([                               // preguntar si quiere activar
        { texto: "Gastar 8 GUTS para potenciar a los personajes de Aoba Jôsai este turno." },
        { texto: "No activar" }
      ]);
      if (eleccion !== 0) return;
    
      if (!await usarGutsMultiZona(jugador, 8)) return;             // pagar 8 GUTS de cualquier zona

      // activar los tres efectos de potenciar para Aoba Jôsai
      potenciarReceptor(1, "Aoba Jôsai");                                  // +1 a receptores de Aoba Jôsai
      potenciarColocador(1, "Aoba Jôsai");                                 // +1 a colocadores de Aoba Jôsai
      potenciarRematador(1, "Aoba Jôsai");                                 // +1 a rematadores de Aoba Jôsai

      renderMano();                                                        // actualizar mano
      renderManoRival();                                                   // actualizar mano rival
      renderCampo();                                                       // actualizar campo
    },
    {
      tipo: "evento",
      subtipo: "entrenador",
      id: "HV-P01-085",
      fases: ["recepcion"],
      escuela: "Aoba Jôsai",
      rareza: "N",
      descripcion: `<strong><span style="background:#6a1b9a; color:white; padding:1px 4px; border-radius:2px;">Robo</span> <span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Roba 1 carta. Gasta 8 cartas del GUTS de tu campo para activar. Durante este turno, cada personaje de <strong>Aoba Jôsai</strong> que coloques tendrá <strong>+1 a su parámetro activo</strong>.`
    }
  ),
  crearCarta("Cuando el director cambia, el sonido cambia", // ================================ P01-086
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      // buscar personajes de Aoba Jôsai en el trash
      let aobaEnTrash = jugador.trash.filter(c =>                        // filtrar trash
        c.info?.escuela === "Aoba Jôsai" &&                              // solo Aoba Jôsai
        c.info?.tipo === "personaje"                                     // solo personajes
      );
      if (aobaEnTrash.length === 0) {                                    // si no hay ninguno
        log(t("log.condicionNoCumplida"));
        return false;                                                    // return false: condición no cumplida
      }

      // elegir carta del trash
      let cartaElegida = await mostrarSelectorCartas(                    // abrir selector
        "Elige un personaje de Aoba Jôsai del trash para añadir a tu mano:", // título
        aobaEnTrash                                                      // solo Aoba Jôsai
      );
      if (!cartaElegida) return false;                                   // return false: cancelado

      let index = jugador.trash.indexOf(cartaElegida);                   // buscar en el trash
      jugador.trash.splice(index, 1);                                    // sacar del trash
      añadirCartaAMano(jugador, cartaElegida);                           // añadir a la mano
      log(cartaElegida.nombre + " añadido a la mano desde el trash.");

      if (modoOnline) enviarTrash(jugador);                              // sincronizar trash
      renderMano();                                                      // actualizar mano
      renderManoRival();                                                 // actualizar mano rival
      renderCampo();                                                     // actualizar campo
    },
    {
      tipo: "evento",
      id: "HV-P01-086",
      fases: ["recepcion"],                                              // recepción y robo → recepcion en nuestro sistema
      escuela: "Aoba Jôsai",
      rareza: "R",
      descripcion: `<strong><span style="background:#6a1b9a; color:white; padding:1px 4px; border-radius:2px;">Robo</span> <span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Añade 1 carta de personaje de <strong>Aoba Jôsai</strong> desde tu descarte a tu mano.`
    }
  ),
  crearCarta("Yo también lo pensé", // ================================================= P01-087
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {
      // comprobar que el sacador o colocador es Oikawa Toru
      let sacador = jugador.zonas.saque.at(-1);                          // último sacador
      let colocador = jugador.zonas.pase.at(-1);                         // último colocador
      let hayOikawa = sacador?.nombre === "Oikawa Toru" ||               // si sacador es Oikawa
                      colocador?.nombre === "Oikawa Toru";               // o colocador es Oikawa
      if (!hayOikawa) {                                                  // si no hay Oikawa
        log(t("log.condicionNoCumplida"));
        jugador.mano.push(carta);                                        // devolver carta a la mano
        jugador.zonas.eventos.splice(jugador.zonas.eventos.indexOf(carta), 1); // sacar de zona eventos
        renderMano();                                                    // actualizar mano
        renderManoRival();                                               // actualizar mano rival
        return false;                                                    // return false: condición no cumplida
      }

      robarCarta(jugador, 1, true);                                      // roba 1 carta

      // +1 al pase de un Oikawa Toru en el campo
      let oikawaEnPase = jugador.zonas.pase.at(-1);                      // buscar Oikawa en pase
      if (oikawaEnPase?.nombre === "Oikawa Toru") {                      // si hay Oikawa en pase
        game.valorAtaque += 1;                                           // +1 al pase
        log('"Yo también lo pensé": +1 al pase de Oikawa Toru.');
      } else if (sacador?.nombre === "Oikawa Toru") {                    // si hay Oikawa en saque
        game.valorAtaque += 1;                                           // +1 al saque
        log('"Yo también lo pensé": +1 al saque de Oikawa Toru.');
      }
      descartePorRobo();                                                 // activar efecto
    },
    {
      tipo: "evento",
      id: "HV-P01-087",
      fases: ["saque", "pase"],                                          // saque y pase
      escuela: "Aoba Jôsai",
      rareza: "N",
      descripcion: `<strong><span style="background:#e65100; color:white; padding:1px 4px; border-radius:2px;">Saque</span> <span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span></strong> Solo puedes jugar esta carta si tu sacador o colocador es <strong>Oikawa Toru</strong>. Roba 1 carta y +1 al parámetro activo de <strong>Oikawa Toru</strong>. Durante el siguiente turno rival, cada vez que el rival añada una carta a su mano por medios no estándar, deberá descartar 1 carta de su mano.`
    }
  ),
  crearCarta("Vosotros sois fuertes", // ===================================================== P01-088
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {
      robarCarta(jugador, 1, true);                                      // roba 1 carta

      // comprobar que hay un receptor de Aoba Jôsai en juego
      let receptor = jugador.zonas.recepcion.at(-1);                     // buscar receptor en juego
      if (!receptor || receptor.info?.escuela !== "Aoba Jôsai") {        // si no hay o no es de Aoba Jôsai
        log(t("log.condicionNoCumplida"));
        return false;                                                    // return false: condición no cumplida
      }

      game.valorDefensa += 1;                                            // +1 a la recepción
      log('"Vosotros sois fuertes": +1 a la recepción de ' + receptor.nombre + '.');

      if (jugador.mano.length <= 3) {                                    // si 3 o menos cartas en mano
        game.valorDefensa += 1;                                          // +1 adicional
        log('"Vosotros sois fuertes": +1 adicional a la recepción.');
      }
    },
    {
      tipo: "evento",
      id: "HV-P01-088",
      fases: ["recepcion"],                                              // solo en recepción
      escuela: "Aoba Jôsai",
      rareza: "N",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Roba 1 carta y +1 a la recepción de un personaje de <strong>Aoba Jôsai</strong> en juego. Si tienes 3 o menos cartas en la mano, +1 adicional a la recepción.`
    }
  ),

  // =================================================================================================================================== P02
  crearCarta("Miya Atsumu", // =================================================================================== P02-015
    {
      saque: 3,
      recepcion: 2,
      pase: 2,
      remate: 2,
      bloqueo: 1
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-015",
      escuela: "Inarizaki",
      posicion: "S",
      anyo: 2,
      rareza: "HI"
    }
  ),
  crearCarta("Miya Atsumu", // ============================================================ P02-016
    {
      saque: 5,
      recepcion: 0,
      pase: 1,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) { // GUTS - 3:  +2 al pase y roba 1 carta. Si evento: Niega OneTouch y Carta desde mano.
      if (carta.zonaActual !== "pase") {
        log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
        carta.habilidadUsada = false;
        return false;
      }
      if (!await usarGuts(jugador, "pase", 3)) {
        carta.habilidadUsada = false;
        return false;
      }
      robarCarta(jugador, 1, true);
      game.valorAtaque += 2;
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      // bonus si fue traído por el evento
      if (tieneEfecto("justoBlanco")) {
        negarOneTouch();
        negarCartaDesdeMano(["recepcion"]);
      }
      renderMano();
      renderManoRival()
      renderCampo();
    },
    {
      tipo: "personaje",
      id: "HV-P02-016",
      escuela: "Inarizaki",
      posicion: "S",
      anyo: 2,
      rareza: "TP",
      descripcion: `<strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span> GUTS - 3</strong>: Roba 1 carta y +2 al pase. </br>Si esta carta es jugada por el evento <strong>¡Justo donde tenía que ir!</strong>, el rival no podrá usar <span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>One Touch</strong></span> ni <span style="background:#6a1b9a; color:white; padding:1px 4px; border-radius:2px;"><strong>Desde la mano</strong></span> en su próxima recepción.`
    }
  ),
  crearCarta("Miya Atsumu", // ============================================================ P02-017
    {
      saque: 4,
      recepcion: 0,
      pase: 1,
      remate: 1,
      bloqueo: 0
    },
    async function(jugador, game, carta) { // GUTS - 3 : +2 remate. Si +6 Inarizakis distintos en el trash, añade un WS o MB a la mano
      if (carta.zonaActual !== "pase") {
        log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
        carta.habilidadUsada = false;
        return false;
      }
      if (contarNombresUnicosEnTrash(jugador, "Inarizaki") < 6) {
        log("Necesitas 6 nombres distintos de Inarizaki en el trash (tienes " + contarNombresUnicosEnTrash(jugador, "Inarizaki") + ") ❌");
        carta.habilidadUsada = false;
        return false;
      }

      if (!await usarGuts(jugador, "pase", 3)) {
        carta.habilidadUsada = false;
        return false;
      }

      game.valorAtaque += 2;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
      log("Condición habilidad Atsumu conseguida: Añade a tu mano un WS o MB desde tu descarte.");

      await buscarEnTrashAMano(jugador, { // llevar carta del trash a la mano
        escuela: "Inarizaki",
        posicion: ["WS", "MB"],
        tipo: "personaje"
      }, 1);
    },
    {
      tipo: "personaje",
      id: "HV-P02-017",
      escuela: "Inarizaki",
      posicion: "S",
      anyo: 2,
      rareza: "R",
      descripcion: `<strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span> GUTS - 3</strong> : Si hay 6 o más personajes distintos de <strong>Inarizaki</strong> en tu descarte, +2 al pase y añade a tu mano 1 carta de Inarizaki de posición <strong>WS</strong> o <strong>MB</strong> desde el descarte.`
    }
  ),
  crearCarta("Miya Atsumu", // ============================================================ P02-018
    {
      saque: 2,
      recepcion: 1,
      pase: 2,
      remate: 3,
      bloqueo: 1
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P02-018",
      escuela: "Inarizaki",
      posicion: "S",
      anyo: 2,
      rareza: "NP"
    }
  ),
  crearCarta("Miya Osamu", // ============================================================ P02-019
    {
      saque: 2,
      recepcion: 3,
      pase: 1,
      remate: 3,
      bloqueo: 1
    },
    null, 
    {
      tipo: "personaje",
      id: "HV-P02-019",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 2,
      rareza: "HI"
    }
  ),
  crearCarta("Miya Osamu", // ============================================================ P02-020
    {
      saque: 3,
      recepcion: 3,
      pase: 0,
      remate: 2,
      bloqueo: 1
    },
    async function(jugador, game, carta) { // GUTS - 3 : Remate +3. Si evento: +1 remate y niega 1 bloqueador
      if (carta.zonaActual !== "remate") {
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        carta.habilidadUsada = false;
        return false;
      }
      if (!await usarGuts(jugador, "remate", 3)) {
        carta.habilidadUsada = false;
        return false;
      }
      game.valorAtaque += 3;
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      // bonus si fue traído por el evento
      if (tieneEfecto("justoBlanco")) {
        game.valorAtaque += 1;
        limitarBloqueadores(2);
        log("Bonus evento: ¡Justo donde tenía que ir!: +1 adicional al remate.");
      }
      renderMano();
      renderManoRival()
      renderCampo();
    },
    {
      tipo: "personaje",
      id: "HV-P02-020",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 2,
      rareza: "TP",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS - 3</strong>: +3 al remate. </br>Si esta carta es jugada por el evento <strong>¡Justo donde tenía que ir!</strong>, +1 adicional al remate y el rival solo podrá colocar <strong>2 bloqueadores</strong> el próximo turno.`
    }
  ),
  crearCarta("Miya Osamu", // ============================================================ P02-021
    {
      saque: 3,
      recepcion: 1,
      pase: 0,
      remate: 2,
      bloqueo: 2
    },
    function(jugador, game, carta) {
      if (carta.zonaActual !== "remate") {
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        carta.habilidadUsada = false;
        return false;
      }
      if (jugador.mano.length > 2) {
        log("Necesitas 2 o menos cartas en mano ❌");
        carta.habilidadUsada = false;
        return false;
      }
      game.valorAtaque += 2;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P02-021",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 2,
      rareza: "R",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Si tienes 2 o menos cartas en tu mano, +2 al remate.`
    }
  ),
  crearCarta("Miya Osamu", // ============================================================ P02-022
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 3,
      bloqueo: 1
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-022",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 2,
      rareza: "N",
    }
  ),
  crearCarta("Kita Shinsuke", // ============================================================ P02-023
    {
      saque: 1,
      recepcion: 5,
      pase: 1,
      remate: 1,
      bloqueo: 0
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-023",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 3,
      rareza: "HI"
    }
  ),
  crearCarta("Kita Shinsuke", // ============================================================ P02-024
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "recepcion") {
        log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
        carta.habilidadUsada = false;
        return false;
      }

      // descarte obligatorio de 1 carta de la mano
      if (jugador.mano.length === 0) {
        log("No tienes cartas en la mano para descartar ❌");
        carta.habilidadUsada = false;
        return false;
      }
      let cartaDescarte = await mostrarSelectorCartas("Elige una carta de tu mano para descartar:", jugador.mano);
      if (!cartaDescarte) {
        carta.habilidadUsada = false;
        return false;
      }
      let indexDescarte = jugador.mano.indexOf(cartaDescarte);
      jugador.mano.splice(indexDescarte, 1);
      jugador.trash.push(cartaDescarte);
      enviarTrash(jugador);
      log(cartaDescarte.nombre + " descartada de la mano.");

      // GUTS-3
      if (!await usarGuts(jugador, "recepcion", 3)) {
        carta.habilidadUsada = false;
        return false;
      }

      game.valorDefensa += 1;
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      // buscar carta de Inarizaki en zona de eventos
      let elegibles = jugador.zonas.eventos.filter(c => c.info?.escuela === "Inarizaki");
      if (elegibles.length === 0) {
        log(t("log.condicionNoCumplida"));
        return;
      }

      let cartaElegida = await mostrarSelectorCartas("Elige una carta de Inarizaki de tu zona de eventos:", elegibles);
      if (!cartaElegida) return false;

      let index = jugador.zonas.eventos.indexOf(cartaElegida);
      jugador.zonas.eventos.splice(index, 1);
      enviarEventos(jugador);
      añadirCartaAMano(jugador, cartaElegida);
      log(cartaElegida.nombre + " añadida a la mano desde la zona de eventos.");
      renderMano();
      renderManoRival()
      renderCampo();
    },
    {
      tipo: "personaje",
      id: "HV-P02-024",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 3,
      rareza: "S",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> GUTS - 3</strong>: Descarta 1 carta de tu mano y gasta 3 GUTS de recepción para añadir +1 a la recepción y recuperar 1 carta de <strong>Inarizaki</strong> de tu zona de eventos a tu mano.`
    }
  ),
  crearCarta("Kita Shinsuke", // ============================================================ P02-025
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) { // GUTS - 2: Roba 1 y trash 1
      if (carta.zonaActual !== "recepcion") {
        log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
        carta.habilidadUsada = false;
        return false;
      }
      if (!await usarGuts(jugador, "recepcion", 2)) {
        carta.habilidadUsada = false;
        return false;
      }

      robarCarta(jugador, 1, true);
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      if (jugador.mano.length === 0) {
        log("No tienes cartas en la mano para descartar ❌");
        return;
      }

      let cartaDescarte = await mostrarSelectorCartas("Elige una carta de tu mano para descartar:", jugador.mano);
      if (!cartaDescarte) return false;

      let index = jugador.mano.indexOf(cartaDescarte);
      jugador.mano.splice(index, 1);
      jugador.trash.push(cartaDescarte);
      log(cartaDescarte.nombre + " descartada de la mano.");

      if (modoOnline) enviarTrash(jugador);                              // sincronizar trash

      renderMano();
      renderManoRival()
      renderCampo();
    },
    {
      tipo: "personaje",
      id: "HV-P02-025",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 3,
      rareza: "R",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> GUTS - 2</strong>: Roba 1 carta y descarta 1 carta de tu mano.`
    }
  ),
  crearCarta("Suna Rintaro", // ============================================================ P02-026
    {
      saque: 3,
      recepcion: 2,
      pase: 0,
      remate: 3,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-026",
      escuela: "Inarizaki",
      posicion: "MB",
      anyo: 2,
      rareza: "R"
    }
  ),
  crearCarta("Suna Rintaro", // ============================================================ P02-027
    {
      saque: 2,
      recepcion: 2,
      pase: 0,
      remate: 2,
      bloqueo: 2
    },
    function(jugador, game, carta) {
      if (carta.zonaActual !== "remate") {
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        carta.habilidadUsada = false;
        return false;
      }

      if (contarNombresUnicosEnTrash(jugador, "Inarizaki") < 6) {
        log("Necesitas 6 nombres distintos de Inarizaki en el trash (tienes " + contarNombresUnicosEnTrash(jugador, "Inarizaki") + ") ❌");
        carta.habilidadUsada = false;
        return false;
      }

      game.valorAtaque += 2;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
      anularBloqueadorCentral();
    },
    {
      tipo: "personaje",
      id: "HV-P02-027",
      escuela: "Inarizaki",
      posicion: "MB",
      anyo: 2,
      rareza: "S",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Si hay 6 o más nombres distintos de personajes de <strong>Inarizaki</strong> en tu descarte, +2 al remate. Durante el próximo turno rival, el bloqueador central tendrá su bloqueo anulado.`
    }
  ),
  crearCarta("Suna Rintaro", // ============================================================ P02-028
    {
      saque: 2,
      recepcion: 4,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-028",
      escuela: "Inarizaki",
      posicion: "MB",
      anyo: 2,
      rareza: "R"
    }
  ),
  crearCarta("Ojiro Aran", // ============================================================ P02-029
    {
      saque: 5,
      recepcion: 2,
      pase: 0,
      remate: 2,
      bloqueo: 0
    },
    async function(jugador, game, carta) { // Si 6 inarizaki distintos en el trash: remate +3 y anular habilidad receptor
      // ======================================== Comprobaciones
      if (carta.zonaActual !== "remate") {
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        carta.habilidadUsada = false;
        return false;
      }
      if (contarNombresUnicosEnTrash(jugador, "Inarizaki") < 6) {
        log("Necesitas 6 nombres distintos de Inarizaki en el trash (tienes " + contarNombresUnicosEnTrash(jugador, "Inarizaki") + ") ❌");
        carta.habilidadUsada = false;
        return false;
      }
      if (!await usarGuts(jugador, "remate", 3)) {
        carta.habilidadUsada = false;
        return false;
      }
      // ========================================= Efecto
      game.valorAtaque += 3;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
      anularHabilidadReceptor();

      renderMano();
      renderManoRival()
      renderCampo();
    },
    {
      tipo: "personaje",
      id: "HV-P02-029",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 3,
      rareza: "R",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span> GUTS - 3</strong>: Si hay 6 o más personajes distintos de <strong>Inarizaki</strong> en tu descarte, +3 al remate. Durante el próximo turno rival, la habilidad del receptor quedará anulada.`
    }
  ),
  crearCarta("Ojiro Aran", // ============================================================ P02-030
    {
      saque: 5,
      recepcion: 4,
      pase: 0,
      remate: 3,
      bloqueo: 0
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-030",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 3,
      rareza: "N"
    }
  ),
  crearCarta("Riseki Heisuke", // ============================================================ P02-031
    {
      saque: 0,
      recepcion: 2,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    async function(jugador, game, carta) { // GUTS - 1: Si Riseki descartado, +6 al saque
      if (carta.zonaActual !== "saque") {
        log(t("log.noEsFase", { zona: t("ui.zonaSaque") }));
        carta.habilidadUsada = false;
        return false;
      }
      if (!await usarGuts(jugador, "saque", 1)) {
        carta.habilidadUsada = false;
        return false;
      }

      if (game.gutsDescartados.some(c => c.nombre === "Riseki Heisuke")) {
        game.valorAtaque += 6;
        log(t("log.habilidadActivada", { carta: carta.nombre }));
        negarColocador();
      } else {
        log("La carta descartada no es Riseki Heisuke, no se activa el bonus ❌");
      }

      renderMano();
      renderManoRival()
      renderCampo();
    },
    {
      tipo: "personaje",
      id: "HV-P02-031",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 1,
      rareza: "N",
      descripcion: `<strong><span style="background:#e65100; color:white; padding:1px 4px; border-radius:2px;">Saque</span> GUTS - 1</strong>: Si la carta descartada es otro <strong>Riseki Heisuke</strong>, +6 al saque y el rival no podrá colocar un <strong>colocador (S)</strong> el próximo turno.`
    }
  ),
  crearCarta("Ginjima Hitoshi", // ============================================================ P02-032
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-032",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 2,
      rareza: "N"
    }
  ),
    crearCarta("Omimi Ren", // ============================================================ P02-033
    {
      saque: 2,
      recepcion: 3,
      pase: 0,
      remate: 3,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-033",
      escuela: "Inarizaki",
      posicion: "MB",
      anyo: 3,
      rareza: "N"
    }
  ),
  crearCarta("Akagi Michinari", // ============================================================ P02-034
    {
      saque: 0,
      recepcion: 6,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-034",
      escuela: "Inarizaki",
      posicion: "Li",
      anyo: 3,
      rareza: "N",
      zonasProhibidas: ["saque", "bloqueo"]
    }
  ),
  crearCarta("Kosaku Yuto", // ============================================================ P02-035
    {
      saque: 3,
      recepcion: 0,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    function(jugador, game, carta) {

      // buscar personajes de Inarizaki en juego
      let cartasEnJuego = [
        jugador.zonas.saque.at(-1),                                         // último sacador
        jugador.zonas.recepcion.at(-1),                                     // último receptor
        jugador.zonas.pase.at(-1),                                          // último colocador
        jugador.zonas.remate.at(-1),                                        // último rematador
        jugador.zonas.bloqueo.at(-1)                                        // último bloqueador
      ].filter(c => c !== null && c !== undefined                            // filtrar zonas vacías
                && c.info?.escuela === "Inarizaki");                         // solo Inarizaki

      if (cartasEnJuego.length === 0) {                                      // si no hay ninguno
        log(t("log.condicionNoCumplida"));
        return false;
      }

      game.valorDefensa += 2;                                                // +2 a la recepción
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      renderMano();                                                          // actualizar mano
      renderCampo();                                                         // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P02-035",
      escuela: "Inarizaki",
      posicion: "WS",
      anyo: 2,
      rareza: "N",
      activacionMano: true,                                                  // se activa desde la mano
      fases: ["recepcion"],                                                  // solo en recepción
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> <span style="background:#6a1b9a; color:white; padding:1px 4px; border-radius:2px;">Desde la mano</span></strong> Descarta esta carta desde tu mano para añadir +2 a la recepción de un personaje de <strong>Inarizaki</strong> en juego.`
    }
  ),
  crearCarta("Aone Takanobu", // ============================================================== P02-036
    {
      saque: 1,
      recepcion: 1,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    async function(jugador, game, carta) { // GUTS -2 : Si 3 bloqueos del date = Contraataque 7
      if (carta.zonaActual !== "bloqueo") {
        log(t("log.noEsFase", { zona: t("ui.zonaBloqueo") }));
        carta.habilidadUsada = false;
        return;
      }

      // comprobar 3 Date Kôgyô en bloqueo
      let todosBloqueo = [
        game.bloqueoActual.central,
        ...game.bloqueoActual.apoyos
      ].filter(c => c !== null);

      let dateTeches = todosBloqueo.filter(c => c?.info?.escuela === "Date Kôgyô");
      if (dateTeches.length < 3) {
        log("Necesitas 3 personajes de Date Kôgyô en bloqueo.");
        carta.habilidadUsada = false;
        return false;
      }

      if (!await usarGuts(jugador, "bloqueo", 2)) {
        log("Necesitas 2 GUTS en bloqueo.");
        carta.habilidadUsada = false;
        return false;
      }

      doshat(7);
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P02-036",
      escuela: "Date Kôgyô",
      posicion: "MB",
      anyo: 2,
      rareza: "T",
      descripcion: `Sólo puedes usar esta habilidad si hay <strong>3 personajes del Date Kôgyô</strong> en el bloqueo actual.</br><strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span> GUTS - 2</strong> :</br><span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>Bloqueo ofensivo (7)</strong></span> : Devuelve un contraataque con potencia de 7.`
    }
  ),
  crearCarta("Aone Takanobu", // ============================================================== P02-037
    {
      saque: 2,
      recepcion: 2,
      pase: 0,
      remate: 2,
      bloqueo: 2
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "bloqueoApoyo") {
        log(t("log.condicionNoCumplida"));
        carta.habilidadUsada = false;
        return;
      }

      // buscar todos los Aone Takanobu en el trash
      let aonesEnTrash = jugador.trash.filter(c => c.nombre === "Aone Takanobu");
      if (aonesEnTrash.length === 0) {
        log(t("log.condicionNoCumplida"));
        carta.habilidadUsada = false;
        return;
      }

      // mostrar selector si hay varios
      let aoneElegido = await mostrarSelectorCartas("Elige un Aone Takanobu del trash:", aonesEnTrash);
      if (!aoneElegido) {
        log("Habilidad cancelada ❌");
        return false;
      }

      // sacar el elegido del trash
      let indexTrash = jugador.trash.indexOf(aoneElegido);
      jugador.trash.splice(indexTrash, 1);

      // enviar esta carta al fondo del mazo
      let index = jugador.zonas.bloqueoApoyo.indexOf(carta);
      if (index !== -1) jugador.zonas.bloqueoApoyo.splice(index, 1);
      let indexApoyo = game.bloqueoActual.apoyos.indexOf(carta);
      if (indexApoyo !== -1) game.bloqueoActual.apoyos.splice(indexApoyo, 1);
      jugador.mazo.push(carta);
      log("Aone (P02-037) enviado al fondo del mazo.");

      // colocar el Aone elegido como bloqueador de apoyo
      jugador.zonas.bloqueoApoyo.push(aoneElegido);
      game.bloqueoActual.apoyos.push(aoneElegido);
      aoneElegido.zonaActual = "bloqueoApoyo";

      // ajustar valorDefensa: quitar bloqueo base, poner 3
      game.valorDefensa -= aoneElegido.stats.bloqueo;
      game.valorDefensa += 3;
      log("Aone del trash colocado como apoyo con bloqueo fijo de 3.");

      renderCampo();
      renderMano();
      renderManoRival()
    },
    {
      tipo: "personaje",
      id: "HV-P02-037",
      escuela: "Date Kôgyô",
      posicion: "MB",
      anyo: 2,
      rareza: "S",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span></strong> Si esta carta está como bloqueador de apoyo, puedes enviarla al fondo de tu mazo para buscar un <strong>Aone Takanobu</strong> en tu descarte, colocarlo como bloqueador de apoyo y fijar su bloqueo en 3.`
    }
  ),
  crearCarta("Futakuchi Kenji", // ============================================================== P02-038
    {
      saque: 1,
      recepcion: 4,
      pase: 0,
      remate: 0,
      bloqueo: 2
    },
    function(jugador, game, carta) {
      if (carta.zonaActual !== "bloqueoApoyo") {
        log(t("log.condicionNoCumplida"));
        carta.habilidadUsada = false;
        return;
      }
      doshat(4);
      debilitarReceptor(1);
    },
    {
      tipo: "personaje",
      id: "HV-P02-038",
      escuela: "Date Kôgyô",
      posicion: "WS",
      anyo: 2,
      rareza: "T",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span></strong> Si esta carta está como bloqueador de apoyo y el bloqueo es exitoso: <span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>Bloqueo Ofensivo (4)</strong></span>. Durante el siguiente turno rival, el receptor que coloque tendrá <strong>-1 a su recepción</strong>.`
    }
  ),
  crearCarta("Futakuchi Kenji", // ============================================================== P02-039
    {
      saque: 1,
      recepcion: 2,
      pase: 0,
      remate: 1,
      bloqueo: 3
    },
    function(jugador, game, carta) {
      if (carta.zonaActual !== "remate") {
        log(t("log.noEsFase", { zona: t("ui.zonaRemate") }));
        carta.habilidadUsada = false;
        return;
      }

      let colocador = jugador.zonas.pase.at(-1);
      if (!colocador || colocador.info?.escuela !== "Date Kôgyô" || colocador.info?.posicion !== "S") {
        log(t("log.condicionNoCumplida"));
        carta.habilidadUsada = false;
        return;
      }

      bloqueoMinimo(6);
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P02-039",
      escuela: "Date Kôgyô",
      posicion: "WS",
      anyo: 2,
      rareza: "S",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Si tu colocador es un <strong><span style="color:#2e7d32">colocador (S) del Date Kôgyô</span></strong>, durante el siguiente turno rival, si su defensa total de bloqueo es <strong>6 o menos</strong>, el bloqueo fallará automáticamente.`    }
  ),
  crearCarta("Koganegawa Kanji", // ============================================================== P02-040
    {
      saque: 2,
      recepcion: 2,
      pase: 1,
      remate: 1,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-040",
      escuela: "Date Kôgyô",
      posicion: "S",
      anyo: 1,
      rareza: "R"
    }
  ),
  crearCarta("Sakunami Kosuke", // ============================================================== P02-041
    {
      saque: 0,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) { // trashea 3 del deck, si son 3 Date, busca 1 date en el trash sin habilidad y ponlo en apoyo
      if (jugador.mazo.length < 3) {
        log("No hay suficientes cartas en el mazo ❌");
        carta.habilidadUsada = false;
        return;
      }

      // descartar las 3 primeras cartas del mazo
      let tresCartas = jugador.mazo.splice(0, 3);
      tresCartas.forEach(c => jugador.trash.push(c));
      log("Cartas descartadas del mazo: " + tresCartas.map(c => c.nombre).join(", "));

      // comprobar que todas son de Date Kôgyô
      let todasDate = tresCartas.every(c => c.info?.escuela === "Date Kôgyô");
      if (!todasDate) {
        log("No todas las cartas son de Date Kôgyô. Efecto cancelado.");
        return;
      }

      // buscar personajes sin habilidad de Date Kôgyô en el trash
      let elegibles = jugador.trash.filter(c =>
        c.info?.escuela === "Date Kôgyô" &&
        c.info?.tipo === "personaje" &&
        c.habilidad === null
      );

      if (elegibles.length === 0) {
        log(t("log.condicionNoCumplida"));
        return;
      }

      // mostrar selector
      let cartaElegida = await mostrarSelectorCartas("Elige un personaje de Date Kôgyô para colocar como bloqueador de apoyo:", elegibles);
      if (!cartaElegida) {
        log("Habilidad cancelada.");
        return;
      }

      // sacar del trash y colocar como bloqueador de apoyo
      let indexTrash = jugador.trash.indexOf(cartaElegida);
      jugador.trash.splice(indexTrash, 1);

      if (game.bloqueoActual.apoyos.length >= 2) {
        log("Ya hay 2 bloqueadores de apoyo.");
        jugador.trash.push(cartaElegida);
        return;
      }

      jugador.zonas.bloqueoApoyo.push(cartaElegida);
      game.bloqueoActual.apoyos.push(cartaElegida);
      cartaElegida.zonaActual = "bloqueoApoyo";
      log(cartaElegida.nombre + " colocado como bloqueador de apoyo desde el trash.");

      if (modoOnline) {
        enviarJugada("cartaJugada", {
          zona: "bloqueoApoyo",
          cartaId: cartaElegida.info?.id
        });
      }

      renderCampo();
      renderMano();
      renderManoRival()
    },
    {
      tipo: "personaje",
      id: "HV-P02-041",
      escuela: "Date Kôgyô",
      posicion: "Li",
      anyo: 1,
      rareza: "N",
      activacionMano: true,
      fases: ["bloqueo"],
      zonasProhibidas: ["saque", "bloqueo"],
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span> <span style="background:#6a1b9a; color:white; padding:1px 4px; border-radius:2px;">Desde la mano</span></strong> Descarta las 3 primeras cartas de tu mazo. Si todas son de <strong>Date Kôgyô</strong>, puedes colocar desde tu trash 1 personaje de Date Kôgyô sin habilidad como bloqueador de apoyo.`
    }
  ),
  crearCarta("Kamasaki Yasushi", // ============================================================== P02-042
    {
      saque: 1,
      recepcion: 0,
      pase: 0,
      remate: 2,
      bloqueo: 3
    },
    function(jugador, game, carta) {
      if (carta.zonaActual !== "bloqueo" && carta.zonaActual !== "bloqueoApoyo") {
        log(t("log.noEsFase", { zona: t("ui.zonaBloqueo") }));
        carta.habilidadUsada = false;
        return;
      }

      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;
      let rival = game.jugadores[rivalIndex];

      let cartasValidas = rival.zonas.eventos.filter(c =>
        c.info?.fases?.includes("pase") || c.info?.fases?.includes("remate")
      );

      if (cartasValidas.length < 4) {
        log("El rival no tiene suficientes cartas de evento en pase/remate (necesitas 4, tiene " + cartasValidas.length + ") ❌");
        carta.habilidadUsada = false;
        return;
      }

      game.valorDefensa += 5;
      log(t("log.habilidadActivada", { carta: carta.nombre }));
    },
    {
      tipo: "personaje",
      id: "HV-P02-042",
      escuela: "Date Kôgyô",
      posicion: "MB",
      anyo: 3,
      rareza: "N",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span></strong> Si el rival tiene 4 o más cartas de eventos de tipo <strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> o <strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span></strong> en su zona de eventos, añade +5 al bloqueo.`
    }
  ),
  crearCarta("Moniwa Kaname", // ============================================================== P02-043
    {
      saque: 2,
      recepcion: 1,
      pase: 2,
      remate: 0,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-043",
      escuela: "Date Kôgyô",
      posicion: "S",
      anyo: 3,
      rareza: "N"
    }
  ),
  crearCarta("Sasaya Takehito", // ============================================================== P02-044
    {
      saque: 2,
      recepcion: 3,
      pase: 0,
      remate: 3,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-044",
      escuela: "Date Kôgyô",
      posicion: "WS",
      anyo: 3,
      rareza: "N"
    }
  ),
  crearCarta("Obara Yutaka", // ============================================================== P02-045
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-045",
      escuela: "Date Kôgyô",
      posicion: "WS",
      anyo: 2,
      rareza: "N"
    }
  ),

  crearCarta("Oikawa Toru", // ================================================================= P02-056
    {
      saque: 1,
      recepcion: 1,
      pase: 1,
      remate: 0,
      bloqueo: 2
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "pase") {                                 // comprobar zona válida
        log(t("log.noEsFase", { zona: t("ui.zonaPase") }));
        return false;                                                    // return false: zona incorrecta
      }
      if (!await usarGuts(jugador, "pase", 3)) {                         // pagar 3 GUTS de pase
        return false;                                                    // return false: GUTS insuficientes
      }

      game.valorAtaque += 2;                                             // +2 al pase
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      // buscar Iwaizumi en el trash
      let iwaizumisEnTrash = jugador.trash.filter(c =>                   // filtrar trash
        c.nombre === "Iwaizumi Hajime"                                   // solo Iwaizumi
      );
      if (iwaizumisEnTrash.length === 0) {                               // si no hay ninguno
        log(t("log.condicionNoCumplida"));
        return;                                                          // termina sin robar
      }

      let iwaizumiElegido = await mostrarSelectorCartas(                 // abrir selector
        "Elige un Iwaizumi Hajime del trash para añadir a tu mano:",     // título
        iwaizumisEnTrash                                                 // solo Iwaizumi
      );
      if (!iwaizumiElegido) return;                                      // si cancela, ignorar

      let index = jugador.trash.indexOf(iwaizumiElegido);                // buscar en el trash
      jugador.trash.splice(index, 1);                                    // sacar del trash
      añadirCartaAMano(jugador, iwaizumiElegido);                        // añadir a la mano
      log("Iwaizumi Hajime añadido a la mano desde el trash.");

      if (modoOnline) enviarTrash(jugador);                              // sincronizar trash
      renderMano();                                                      // actualizar mano
      renderManoRival();                                                 // actualizar mano rival
      renderCampo();                                                     // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P02-056",
      escuela: "Aoba Jôsai",
      posicion: "S",
      anyo: 3,
      rareza: "S",
      descripcion: `<strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span> GUTS - 3</strong>: +2 al pase. Después, puedes añadir hasta 1 <strong>Iwaizumi Hajime</strong> desde tu descarte a tu mano.`
    }
  ),
  crearCarta("Iwaizumi Hajime", // ============================================================= P02-057
    {
      saque: 1,
      recepcion: 1,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "recepcion") {                            // comprobar zona válida
        log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
        return false;                                                    // return false: zona incorrecta
      }

      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;   // índice del rival
      let rival = game.jugadores[rivalIndex];                            // jugador rival
      if (rival.mano.length > 3) {                                       // comprobar cartas del rival
        log("El rival debe tener 3 o menos cartas en la mano.");
        return false;                                                    // return false: condición no cumplida
      }

      if (!await usarGuts(jugador, "recepcion", 3)) {                    // pagar 3 GUTS de recepción
        return false;                                                    // return false: GUTS insuficientes
      }

      game.valorDefensa += 7;                                            // +7 a la recepción
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      renderMano();                                                      // actualizar mano
      renderManoRival();                                                 // actualizar mano rival
      renderCampo();                                                     // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P02-057",
      escuela: "Aoba Jôsai",
      posicion: "WS",
      anyo: 3,
      rareza: "R",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> GUTS - 3</strong>: Solo puedes usar esta habilidad si el rival tiene 3 o menos cartas en la mano. +7 a la recepción.`
    }
  ),
  crearCarta("Kunimi Akira", // ================================================================ P02-058
    {
      saque: 1,
      recepcion: 5,
      pase: 0,
      remate: 0,
      bloqueo: 0
    },
    async function(jugador, game, carta) {
      if (carta.zonaActual !== "recepcion") {                            // comprobar zona válida
        log(t("log.noEsFase", { zona: t("ui.zonaRecepcion") }));
        return false;                                                    // return false: zona incorrecta
      }

      let cartasQueNecesita = 3 - jugador.mano.length;                  // cartas que faltan hasta 3
      if (cartasQueNecesita <= 0) {                                      // si ya tiene 3 o más
        log("Ya tienes 3 o más cartas en la mano.");
        return false;                                                    // return false: condición no cumplida
      }

      if (!await usarGuts(jugador, "recepcion", 2)) {                    // pagar 2 GUTS de recepción
        return false;                                                    // return false: GUTS insuficientes
      }

      robarCarta(jugador, cartasQueNecesita, true);                      // robar hasta tener 3
      log(t("log.habilidadActivada", { carta: carta.nombre }));

      renderMano();                                                      // actualizar mano
      renderManoRival();                                                 // actualizar mano rival
      renderCampo();                                                     // actualizar campo
    },
    {
      tipo: "personaje",
      id: "HV-P02-058",
      escuela: "Aoba Jôsai",
      posicion: "WS",
      anyo: 1,
      rareza: "R",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span> GUTS - 2</strong>: Roba cartas hasta tener 3 en la mano.`
    }
  ),
  crearCarta("Kyotani Kentaro", // ============================================================= P02-059
    {
      saque: 2,
      recepcion: 4,
      pase: 0,
      remate: 3,
      bloqueo: 2
    },
    null,
    {
      tipo: "personaje",
      id: "HV-P02-059",
      escuela: "Aoba Jôsai",
      posicion: "WS",
      anyo: 2,
      rareza: "N"
    }
  ),

  crearCarta("Kurosu Norimune", // ============================================================ P02-084
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {

      robarCarta(jugador, 1, true);                                          // roba 1 carta
      log("Kurosu: roba 1 carta.");

      // buscar personajes de Inarizaki en juego
      let elegibles = [
        jugador.zonas.saque.at(-1),                                         // último sacador
        jugador.zonas.recepcion.at(-1),                                     // último receptor
        jugador.zonas.pase.at(-1),                                          // último colocador
        jugador.zonas.remate.at(-1),                                        // último rematador
        jugador.zonas.bloqueo.at(-1)                                        // último bloqueador
      ].filter(c => c !== null && c !== undefined                            // filtrar zonas vacías
                && c.info?.escuela === "Inarizaki");                         // solo Inarizaki

      if (elegibles.length === 0) {                                          // si no hay ninguno
        log(t("log.condicionNoCumplida"));
        return false;
      }

      game.valorDefensa += 1;                                                // +1 a la recepción
      log("Kurosu: +1 a la recepción 💪");

      // contar cartas de Inarizaki en zona de eventos jugables en saque, pase o remate
      let cartasValidas = jugador.zonas.eventos.filter(c =>
        c.info?.escuela === "Inarizaki" &&                                   // solo Inarizaki
        (c.info?.fases?.includes("saque") ||                                 // jugable en saque
        c.info?.fases?.includes("pase") ||                                  // jugable en pase
        c.info?.fases?.includes("remate"))                                  // jugable en remate
      );

      if (cartasValidas.length >= 2) {                                       // si hay 2 o más
        game.valorDefensa += 1;                                              // +1 adicional
        log("Kurosu: +1 adicional a la recepción por eventos.");
      }
    },
    {
      tipo: "evento",
      subtipo: "entrenador",                                                 // subtipo entrenador
      id: "HV-P02-084",
      fases: ["recepcion"],                                                  // solo en recepción
      escuela: "Inarizaki",
      rareza: "N",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Roba 1 carta y +1 a la recepción. Si hay 2 o más cartas de <strong>Inarizaki</strong> jugables en <strong><span style="background:#e65100; color:white; padding:1px 4px; border-radius:2px;">Saque</span></strong>, <strong><span style="background:#2e7d32; color:white; padding:1px 4px; border-radius:2px;">Pase</span></strong> o <strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> en tu zona de eventos, +1 adicional a la recepción.`
    }
  ),
  crearCarta("Omimi Taro", // ============================================================================ P02-085
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {

      game.valorDefensa += 1;                                                // +1 a la recepción
      log("Omimi Taro: +1 a la recepción.");

      // filtrar cartas de Inarizaki en la mano
      let inarizakiEnMano = jugador.mano.filter(c =>                         // buscar en la mano
        c.info?.escuela === "Inarizaki"                                      // solo Inarizaki
      );

      if (inarizakiEnMano.length === 0) {                                    // si no hay ninguna
        log("No tienes cartas de Inarizaki en la mano para descartar.");
        return;                                                              // termina sin robar
      }

      // preguntar si quiere descartar
      let eleccion = await mostrarEleccion([                                 // mostrar opciones
        { texto: "Descartar 1 carta de Inarizaki para robar 2." },        // opción 1
        { texto: "No descartar" }                                           // opción 2
      ]);

      if (eleccion === 0) {                                                  // si quiere descartar
        let cartaDescarte = await mostrarSelectorCartas(                     // abrir selector
          "Elige una carta de Inarizaki para descartar:",
          inarizakiEnMano                                                    // solo muestra Inarizaki
        );
        if (!cartaDescarte) return false;                                    // si cancela

        let index = jugador.mano.indexOf(cartaDescarte);                    // buscar en la mano
        jugador.mano.splice(index, 1);                                      // sacar de la mano
        jugador.trash.push(cartaDescarte);                                  // enviar al trash
        log(cartaDescarte.nombre + " descartada de la mano.");
        if (modoOnline) enviarTrash(jugador);                               // sincronizar trash con el rival

        robarCarta(jugador, 2, true);                                        // robar 2 cartas
        log("Omimi Taro: roba 2 cartas.");
      }

      renderMano();                                                          // actualizar mano
      renderCampo();                                                         // actualizar campo
    },
    {
      tipo: "evento",
      subtipo: "entrenador",                                                 // subtipo entrenador
      id: "HV-P02-085",
      fases: ["recepcion"],                                                  // solo en recepción
      escuela: "Inarizaki",
      rareza: "N",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> +1 a la recepción. Si descartas 1 carta de <strong>Inarizaki</strong> de tu mano, roba 2 cartas.`
    }
  ),
  crearCarta("Hinchada de Inarizaki", // ================================================================= P02-086
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) { // comprobar que todos los personajes en juego son de Inarizaki
      let cartasEnJuego = [
        jugador.zonas.saque.at(-1),
        jugador.zonas.recepcion.at(-1),
        jugador.zonas.pase.at(-1),
        jugador.zonas.remate.at(-1),
        jugador.zonas.bloqueo.at(-1)
      ].filter(c => c !== null && c !== undefined);

      let todasInarizaki = cartasEnJuego.every(c => c.info?.escuela === "Inarizaki");
      if (!todasInarizaki) {
        log("Todos tus personajes en juego deben ser de Inarizaki ❌");
        return false;
      }

      robarCarta(jugador, 1, true);
      log("Hinchada de Inarizaki: roba 1 carta 🃏");

      if (game.fase === "saque") {
        // comprobar si Atsumu está en saque
        let sacador = jugador.zonas.saque.at(-1);
        let atsumuEnSaque = sacador?.nombre === "Miya Atsumu";

        debilitarReceptor(1, true); // solo sin habilidad
        log("Efecto activo: el próximo receptor rival sin habilidad tendrá -1 a la recepción 📉");

        if (atsumuEnSaque) {
          debilitarReceptor(1, true); // -1 adicional si Atsumu en saque
          log("Bonus Atsumu: -1 adicional al receptor rival sin habilidad.");
        }
      }
    },
    {
      tipo: "evento",
      id: "HV-P02-086",
      fases: ["saque", "recepcion"],
      escuela: "Inarizaki",
      rareza: "N",
      descripcion: `<strong><span style="background:#e65100; color:white; padding:1px 4px; border-radius:2px;">Saque</span> <span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Solo puedes jugar esta carta si todos tus personajes en juego son de <strong>Inarizaki</strong>. Roba 1 carta. Si estás en fase de saque, durante el próximo turno rival, cada receptor sin habilidad tendrá <strong>-1 a la recepción</strong>. Si tu sacador es <strong>Miya Atsumu</strong>, -1 adicional.`
    }
  ),
  crearCarta("¡Justo donde tenía que ir!", // ============================================================ P02-087
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      robarCarta(jugador, 1, true);
      log("Evento: roba 1 carta.");

      // comprobar que hay un Atsumu en pase y un Osamu en remate
      let atsumu = jugador.zonas.pase.at(-1);
      let osamu = jugador.zonas.remate.at(-1);
      if (!atsumu || atsumu.nombre !== "Miya Atsumu") {
        log("No hay ningún Miya Atsumu en pase ❌");
        return false;
      }
      if (!osamu || osamu.nombre !== "Miya Osamu") {
        log("No hay ningún Miya Osamu en remate ❌");
        return false;
      }

      // activar efecto justoBlanco
      game.efectosActivos.push({
        tipo: "justoBlanco",
        expira: game.turno + 1
      });
      log("Efecto activo: ¡Justo donde tenía que ir!");

      // ============================================================ OPCIÓN 1: traer Atsumu del GUTS de pase
      let atsumusEnGuts = jugador.zonas.pase.slice(0, -1).filter(c => c.nombre === "Miya Atsumu");
      if (atsumusEnGuts.length > 0) {
        let eleccion1 = await mostrarEleccion([
          { texto: "Traer un Miya Atsumu desde el GUTS de pase" },
          { texto: "No hacer esta acción" }
        ]);

        if (eleccion1 === 0) {
          let atsumuElegido = await mostrarSelectorCartas("Elige un Miya Atsumu del GUTS de pase:", atsumusEnGuts);
          if (atsumuElegido) {
            // restar pase del atsumu anterior
            game.valorAtaque -= atsumu.stats.pase;

            // atsumu anterior va al guts
            let indexActual = jugador.zonas.pase.indexOf(atsumu);
            jugador.zonas.pase.splice(indexActual, 1);
            jugador.zonas.pase.unshift(atsumu);

            // atsumu elegido pasa a ser el último
            let indexElegido = jugador.zonas.pase.indexOf(atsumuElegido);
            jugador.zonas.pase.splice(indexElegido, 1);
            jugador.zonas.pase.push(atsumuElegido);
            atsumuElegido.zonaActual = "pase";
            atsumuElegido.recienJugada = true;
            atsumuElegido.habilidadUsada = false;
            game.ultimaCarta = atsumuElegido;
            game.ultimoJugador = jugador;

            // sumar pase del nuevo atsumu
            game.valorAtaque += atsumuElegido.stats.pase;
            log("Miya Atsumu traído desde el GUTS de pase. Valor de ataque actualizado: " + game.valorAtaque + ".");
            if (modoOnline) {
              enviarJugada("cartaMovida", {                              // avisar al rival del movimiento
                zona: "pase",                                           // zona donde se movió
                cartaId: atsumuElegido.info.id,                         // id de la carta movida
                posicion: "ultimo"                                      // va al final del array (arriba visual)
              });
            }

            // preguntar si usar habilidad
            if (atsumuElegido.habilidad) {
              let eleccionHab = await mostrarEleccion([
                { texto: "Usar habilidad de Atsumu" },
                { texto: "No usar habilidad" }
              ]);
              if (eleccionHab === 0) {
                let resultado = await atsumuElegido.habilidad(jugador, game, atsumuElegido);
                if (resultado !== false) atsumuElegido.habilidadUsada = true;
              }
            }
          }
        }
      } else {
        log("No hay Miya Atsumu en el GUTS de pase.");
      }

      // ============================================================ OPCIÓN 2: traer Osamu del GUTS de remate
      let osamusEnGuts = jugador.zonas.remate.slice(0, -1).filter(c => c.nombre === "Miya Osamu");
      if (osamusEnGuts.length > 0) {
        let eleccion2 = await mostrarEleccion([
          { texto: "Traer un Miya Osamu desde el GUTS de remate" },
          { texto: "No hacer esta acción" }
        ]);

        if (eleccion2 === 0) {
          let osamuElegido = await mostrarSelectorCartas("Elige un Miya Osamu del GUTS de remate:", osamusEnGuts);
          if (osamuElegido) {
            // restar remate del osamu anterior
            game.valorAtaque -= osamu.stats.remate;

            // osamu anterior va al guts
            let indexActual = jugador.zonas.remate.indexOf(osamu);
            jugador.zonas.remate.splice(indexActual, 1);
            jugador.zonas.remate.unshift(osamu);

            // osamu elegido pasa a ser el último
            let indexElegido = jugador.zonas.remate.indexOf(osamuElegido);
            jugador.zonas.remate.splice(indexElegido, 1);
            jugador.zonas.remate.push(osamuElegido);
            osamuElegido.zonaActual = "remate";
            osamuElegido.recienJugada = true;
            osamuElegido.habilidadUsada = false;
            game.ultimaCarta = osamuElegido;
            game.ultimoJugador = jugador;

            // sumar remate del nuevo osamu
            game.valorAtaque += osamuElegido.stats.remate;
            log("Miya Osamu traído desde el GUTS de remate. Valor de ataque actualizado: " + game.valorAtaque + ".");
            if (modoOnline) {
              enviarJugada("cartaMovida", {                              // avisar al rival del movimiento
                zona: "remate",                                         // zona donde se movió
                cartaId: osamuElegido.info.id,                          // id de la carta movida
                posicion: "ultimo"                                      // va al final del array
              });
            }

            // preguntar si usar habilidad
            if (osamuElegido.habilidad) {
              let eleccionHab = await mostrarEleccion([
                { texto: "Usar habilidad de Osamu" },
                { texto: "No usar habilidad" }
              ]);
              if (eleccionHab === 0) {
                let resultado = await osamuElegido.habilidad(jugador, game, osamuElegido);
                if (resultado !== false) osamuElegido.habilidadUsada = true;
              }
            }
          }
        }
      } else {
        log("No hay Miya Osamu en el GUTS de remate.");
      }

      // ============================================================ OPCIÓN 3: +1 al valorAtaque
      let eleccion3 = await mostrarEleccion([
        { texto: "+1 al ataque de esta jugada." },
        { texto: "No hacer esta acción" }
      ]);

      if (eleccion3 === 0) {
        game.valorAtaque += 1;
        log("Evento: +1 al ataque de la jugada.");
      }
      renderMano();
      renderManoRival()
      renderCampo();
    },
    {
      tipo: "evento",
      id: "HV-P02-087",
      fases: ["remate"],
      escuela: "Inarizaki",
      rareza: "S",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Roba 1 carta. Si tu colocador es <strong>Miya Atsumu</strong> y tu rematador es <strong>Miya Osamu</strong>, puedes: </br>· Buscar 1 <strong>Miya Atsumu</strong> del GUTS de pase y añadirlo a la jugada actual.</br>· Buscar 1 <strong>Miya Osamu</strong> del GUTS de remate y añadirlo a la jugada actual.</br>· Añade +1 al ataque de esta jugada.`
    }
  ),
  crearCarta("Ataque rápido de los gemelos: Tempo negativo!!!", // ============================================================ P02-088
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {

      robarCarta(jugador, 1, true);                                          // roba 1 carta
      log("Tempo negativo: roba 1 carta.");
      game.valorAtaque += 1;                                                 // +1 al ataque
      log("Tempo negativo: +1 al ataque.");

      // comprobar si colocador es Osamu y rematador es Atsumu
      let colocador = jugador.zonas.pase.at(-1);                            // último colocador
      let rematador = jugador.zonas.remate.at(-1);                          // último rematador

      if (colocador?.nombre === "Miya Osamu" && rematador?.nombre === "Miya Atsumu") {  // si colocador es Osamu y rematador es Atsumu
        negarEventos("bloqueo");                                             // activar efecto
      }
    },
    {
      tipo: "evento",
      id: "HV-P02-088",
      fases: ["remate"],                                                     // solo en remate
      escuela: "Inarizaki",
      rareza: "N",
      descripcion: `<strong><span style="background:#c62828; color:white; padding:1px 4px; border-radius:2px;">Remate</span></strong> Roba 1 carta y +1 al ataque. Si tu colocador es <strong>Miya Osamu</strong> y tu rematador es <strong>Miya Atsumu</strong>, durante el próximo turno rival, el rival no podrá jugar eventos de <strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span></strong>.`
    }
  ),
  crearCarta("¡Oye, ¿no os dije que mis compañeros eran increíbles?!", // ============================================================ P02-089
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) { // async porque tiene selector
      let cartasRobadas = 0;                                                 // contador de robos
      // ========================================================================================= PASO 1: buscar Atsumu en el trash
      let atsumusEnTrash = jugador.trash.filter(c =>                         // filtrar trash
        c.nombre === "Miya Atsumu"                                           // solo Atsumu
      );
      if (atsumusEnTrash.length > 0) {                                       // si hay alguno
        let eleccion1 = await mostrarEleccion([                              // preguntar
          { texto: "Añadir 1 Miya Atsumu del trash a la mano." },         // opción sí
          { texto: "No" }                                                    // opción no
        ]);
        if (eleccion1 === 0) {                                               // si quiere robar
          let elegido = await mostrarSelectorCartas(                         // abrir selector
            "Elige un Miya Atsumu del trash:", atsumusEnTrash                // solo Atsumu
          );
          if (elegido) {                                                     // si elige uno
            let index = jugador.trash.indexOf(elegido);                     // buscar en trash
            jugador.trash.splice(index, 1);                                 // sacar del trash
            añadirCartaAMano(jugador, elegido);                             // añadir a la mano
            log("Miya Atsumu añadido a la mano desde el trash.");
            cartasRobadas++;                                                 // incrementar contador
          }
        }
      } else {
        log("No hay Miya Atsumu en el trash.");
      }

      // ======================================================================================= PASO 2: buscar Osamu en el trash
      let osamusEnTrash = jugador.trash.filter(c =>                          // filtrar trash
        c.nombre === "Miya Osamu"                                            // solo Osamu
      );

      if (osamusEnTrash.length > 0) {                                        // si hay alguno
        let eleccion2 = await mostrarEleccion([                              // preguntar
          { texto: "Añadir 1 Miya Osamu del trash a la mano." },          // opción sí
          { texto: "No" }                                                    // opción no
        ]);
        if (eleccion2 === 0) {                                               // si quiere robar
          let elegido = await mostrarSelectorCartas(                         // abrir selector
            "Elige un Miya Osamu del trash:", osamusEnTrash                  // solo Osamu
          );
          if (elegido) {                                                     // si elige uno
            let index = jugador.trash.indexOf(elegido);                     // buscar en trash
            jugador.trash.splice(index, 1);                                 // sacar del trash
            añadirCartaAMano(jugador, elegido);                             // añadir a la mano
            log("Miya Osamu añadido a la mano desde el trash.");
            cartasRobadas++;                                                 // incrementar contador
          }
        }
      } else {
        log("No hay Miya Osamu en el trash.");
      }

      // ===================================================================================== PASO 3: buscar cualquier Miya en el trash
      let miyasEnTrash = jugador.trash.filter(c =>                           // filtrar trash
        c.nombre.includes("Miya")                                            // cualquier Miya
      );
      if (miyasEnTrash.length > 0) {                                         // si hay alguno
        let eleccion3 = await mostrarEleccion([                              // preguntar
          { texto: "Añadir 1 carta Miya del trash a la mano." },             // opción sí
          { texto: "No" }                                                    // opción no
        ]);
        if (eleccion3 === 0) {                                               // si quiere robar
          let elegido = await mostrarSelectorCartas(                         // abrir selector
            "Elige una carta Miya del trash:", miyasEnTrash                  // cualquier Miya
          );
          if (elegido) {                                                     // si elige uno
            let index = jugador.trash.indexOf(elegido);                     // buscar en trash
            jugador.trash.splice(index, 1);                                 // sacar del trash
            añadirCartaAMano(jugador, elegido);                             // añadir a la mano
            log("Carta Miya añadida a la mano desde el trash 🃏");
            cartasRobadas++;                                                 // incrementar contador
          }
        }
      } else {
        log("No hay cartas Miya en el trash.");
      }

      // ===================================================================================== DESCARTAR si robó 3
      if (cartasRobadas === 3) {                                             // si robó las 3
        if (jugador.mano.length === 0) {                                     // si no hay cartas
          log("No tienes cartas en la mano para descartar ❌");
          return;
        }
        let cartaDescarte = await mostrarSelectorCartas(                     // abrir selector
          "Has añadido 3 cartas del trash. Descarta 1 carta de tu mano:",    // título
          jugador.mano                                                       // toda la mano
        );
        if (cartaDescarte) {                                                 // si elige una
          let index = jugador.mano.indexOf(cartaDescarte);                  // buscar en mano
          jugador.mano.splice(index, 1);                                    // sacar de la mano
          jugador.trash.push(cartaDescarte);                                // enviar al trash
          log(cartaDescarte.nombre + " descartada de la mano.");
        }
      }
      renderMano();                                                          // actualizar mano
      renderCampo();                                                         // actualizar campo
    },
    {
      tipo: "evento",
      id: "HV-P02-089",
      fases: ["recepcion"],                                                  // solo en recepción
      escuela: "Inarizaki",
      rareza: "SP",
      descripcion: `<strong><span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Desde tu descarte, puedes añadir a tu mano: hasta 1 <strong>Miya Atsumu</strong>, hasta 1 <strong>Miya Osamu</strong> y hasta 1 carta con <strong>Miya</strong> en el nombre. Si añades las 3, descarta 1 carta de tu mano.`
    }
  ),
  crearCarta("Oiwake Takuro", // ============================================================== P02-090
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) { // función que será interrumpida por los await y continuada con el promise del selector de carta
      robarCarta(jugador, 1, true);
      let eleccion = await mostrarEleccion([ // await : para la función
        { texto: "+1 al bloqueo de un personaje de Date Kôgyô con bloqueo 3 🧱" },
        { texto: "+1 a la recepción de tu receptor de Date Kôgyô 💪" }
      ]);

      if (eleccion === 0) { // OPCION 1 : buscar personajes Date Kôgyô con bloqueo 3 en el campo
        let elegibles = []; // meterlos en la variable elegibles
        for (let zona of ["bloqueo", "bloqueoApoyo"]) {
          jugador.zonas[zona].forEach(c => {
            if (c.info?.escuela === "Date Kôgyô" && c.stats.bloqueo === 3) {
              elegibles.push(c);
            }
          });
        }
        if (elegibles.length === 0) { // si no hay ninguno 
          log("No hay personajes de Date Kôgyô con bloqueo 3 en el campo ❌");
          return false;
        }
        let cartaElegida = await mostrarSelectorCartas("Elige un personaje para +1 al bloqueo:", elegibles); // mostrar selector
          if (!cartaElegida) return false; // si no se selecciona nada
        game.valorDefensa += 1;
        log("Oiwake: +1 al bloqueo de " + cartaElegida.nombre + ".");
      } 

      else { // // OPCION 2 : +1 a la recepción
        let receptor = jugador.zonas.recepcion.at(-1);
        if (!receptor || !receptor.recienJugada) {
          log("No hay receptor colocado este turno ❌");
          return false;
        }
        if (receptor.info?.escuela !== "Date Kôgyô") {
          log("El receptor no es de Date Kôgyô ❌");
          return false;
        }
        game.valorDefensa += 1;
        log("Oiwake: +1 a la recepción de " + receptor.nombre + ".");
      }
    },
    {
      tipo: "evento",
      subtipo: "entrenador",
      id: "HV-P02-090",
      fases: ["bloqueo", "recepcion"],
      escuela: "Date Kôgyô",
      rareza: "N",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span> <span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Roba 1 carta. Elige: </br><strong>· +1 al bloqueo</strong> de un personaje de <strong>Date Kôgyô</strong> con bloqueo de 3. </br><strong>· +1 a la recepción</strong> de tu receptor de <strong>Date Kôgyô</strong>.`
    }
  ),
  crearCarta("La defensa más fuerte es el ataque más rápido, eso es el bloqueo", // ============================================================== P02-091
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {
      robarCarta(jugador, 1, true);
      game.valorDefensa += 1;
      log("Evento: +1 al bloqueo.");

      let rivalIndex = game.jugadores.indexOf(jugador) === 0 ? 1 : 0;
      let rival = game.jugadores[rivalIndex];

      let cartasValidas = rival.zonas.eventos.filter(c =>
        c.info?.fases?.includes("pase") || c.info?.fases?.includes("remate")
      );

      if (cartasValidas.length >= 4) {
        game.valorDefensa += 6;
        log("Evento efecto adicional por condición cumplida: +6 al bloqueo.");
        doshat(7);
      }
    },
    {
      tipo: "evento",
      id: "HV-P02-091",
      fases: ["bloqueo"],
      escuela: "Date Kôgyô",
      rareza: "N",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span></strong> Roba 1 carta y añade +1 al bloqueo. </br>Si el rival tiene 4 o más cartas de eventos de tipo <strong><span style=color:#c62828>Remate</span></strong> o <strong><span style=color:#2e7d32>Pase</span></strong> en su zona de eventos, añade +6 adicional al bloqueo y si el bloqueo es exitoso: <span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>Bloqueo Ofensivo (7)</strong></span>.`
    }
  ),
  crearCarta("La muralla del año que viene no caerá jamás", // ============================================================== P02-092
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    async function(jugador, game, carta) {
      robarCarta(jugador, 1, true);

      // comprobar bloqueador central de Date Kôgyô año 3
      let central = game.bloqueoActual.central;
      if (!central || central.info?.escuela !== "Date Kôgyô" || central.info?.anyo !== 3) {
        log("Tu bloqueador central debe ser de Date Kôgyô de año 3 ❌");
        return false;
      }

      // buscar personajes de Date Kôgyô año 1 o 2 en todas las zonas GUTS
      let elegibles = [];
      ["saque", "recepcion", "pase", "remate", "bloqueo"].forEach(zona => {
        jugador.zonas[zona].forEach(c => {
          if (c.info?.escuela === "Date Kôgyô" && (c.info?.anyo === 1 || c.info?.anyo === 2)) {
            elegibles.push(c);
          }
        });
      });
        if (elegibles.length === 0) {
          log("No hay personajes de Date Kôgyô de año 1 o 2 en el campo ❌");
          return false;
        }

      // mostrar selector para recuperar carta
      let cartaElegida = await mostrarSelectorCartas("Elige un personaje de Date Kôgyô de año 1 o 2:", elegibles);
      if (!cartaElegida) return false;
      // sacar la carta de su zona
        for (let zona of ["saque", "recepcion", "pase", "remate", "bloqueo"]) {
          let index = jugador.zonas[zona].indexOf(cartaElegida);
          if (index !== -1) {
            jugador.zonas[zona].splice(index, 1);
            break;
          }
        }

      añadirCartaAMano(jugador, cartaElegida);
      log(cartaElegida.nombre + " añadido a la mano desde el campo.");
      renderMano();
      renderManoRival()
      renderCampo();

      // descartar 1 carta de la mano con selector
      let cartaDescarte = await mostrarSelectorCartas("Elige una carta de tu mano para descartar:", jugador.mano);
      if (!cartaDescarte) return false;

      let indexDescarte = jugador.mano.indexOf(cartaDescarte);
      jugador.mano.splice(indexDescarte, 1);
      jugador.trash.push(cartaDescarte);
      log(cartaDescarte.nombre + " descartada de la mano.");

      renderMano();
      renderManoRival()
      renderCampo();
    },
    {
      tipo: "evento",
      id: "HV-P02-092",
      fases: ["bloqueo", "recepcion"],
      escuela: "Date Kôgyô",
      rareza: "N",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span> <span style="background:#1565c0; color:white; padding:1px 4px; border-radius:2px;">Recepción</span></strong> Roba 1 carta. Si tu bloqueador central es de <strong>Date Kôgyô</strong> de año 3, puedes añadir a tu mano 1 personaje de <strong>Date Kôgyô</strong> de año 1 o 2 desde tu campo. Si lo haces, descarta 1 carta de tu mano.`
    }
  ),
  crearCarta("Bloqueo en grupo coordinado", // ============================================================== P02-093
    { saque: 0, recepcion: 0, pase: 0, remate: 0, bloqueo: 0 },
    function(jugador, game, carta) {
      robarCarta(jugador, 1, true);
      game.valorDefensa += 1;
      log("Evento: +1 al bloqueo.");

      // contar personajes de Date Kôgyô en bloqueo
      let bloqueadores = [
        game.bloqueoActual.central,
        ...game.bloqueoActual.apoyos
      ].filter(c => c?.info?.escuela === "Date Kôgyô");

      if (bloqueadores.length >= 2) {
        doshat(5);
        log("Evento: 2 o más Date Kôgyô en bloqueo: Bloqueo ofensivo (5) activado.");
      }

      if (bloqueadores.length >= 3) {
        debilitarReceptor(1);
        log("Evento: 3 Date Kôgyô en bloqueo: el próximo receptor rival tendrá -1 a la recepción.");
      }
    },
    {
      tipo: "evento",
      id: "HV-P02-093",
      fases: ["bloqueo"],
      escuela: "Date Kôgyô",
      rareza: "R",
      descripcion: `<strong><span style="background:#424242; color:white; padding:1px 4px; border-radius:2px;">Bloqueo</span></strong> Roba 1 carta y añade +1 al bloqueo. </br>Si hay 2 o más personajes de <strong>Date Kôgyô</strong> en tu bloqueo y el bloqueo es exitoso: <span style="background:#29b6f6; color:white; padding:1px 4px; border-radius:2px;"><strong>Bloqueo Ofensivo (5)</strong></span>. </br>Si hay 3, además el próximo receptor rival tendrá <strong>-1 a su recepción</strong>.`
    }
  ),  
  // ===================================================================================================================== PROMOS
  crearCarta("Hinata Shoyo", // ============================================================== PR-005
    {
      saque: 2,
      recepcion: 3,
      pase: 0,
      remate: 3,
      bloqueo: 3
    },
    null,
    {
      tipo: "personaje",
      id: "HV-PR-005",
      escuela: "Karasuno",
      posicion: "MB",
      anyo: 1,
      rareza: "P",
    }
  )    
  // aquí irán las demás cartas separadas por coma
  ];
}