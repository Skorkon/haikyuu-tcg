
const I18N = {
    es: {
        ui: {
            zonaSaque:     "Saque",
            zonaRecepcion: "Recepción",
            zonaPase:      "Pase",
            zonaRemate:    "Remate",
            zonaBloqueo:   "Bloqueo",
            zonaPuntos:    "Puntos",
            zonaApoyo:     "Apoyo",
            zonaEventos:   "Eventos",
            zonaMazo:      "Mazo",
            zonaTrash:     "Trash",
            btnEvento:     "Jugar Evento",
            btnSaque:      "Saque",
            btnRecepcion:  "Recepción",
            btnPase:       "Pase",
            btnRemate:     "Remate",
            btnBloqueo:    "Bloqueo",
            panelBotones:        "Botones",
            panelAcciones:       "Acciones",
            btnHabilidad:        "Usar habilidad",
            btnHabilidadMano:    "Habilidad desde mano",
            btnConcederPunto:    "Conceder punto",
            btnDeseleccionar:    "Deseleccionar carta",
            btnMulligan:         "Confirmar mulligan",
            btnEstado:           "Mostrar estado",
            btnJugarCarta:       "Jugar carta",
            etiquetaJugador:     "Jugador: ",
            tituloLog:        "Log",
            elegirCarta:      "Elige una carta:",
            elegirOpcion:     "Elige una opción:",
            cancelar:         "Cancelar",
            volverLobby:      "Volver al lobby",
          }
    },    
    en: {
        ui: {
            zonaSaque:     "Serve",
            zonaRecepcion: "Reception",
            zonaPase:      "Set",
            zonaRemate:    "Spike",
            zonaBloqueo:   "Block",
            zonaPuntos:    "Points",
            zonaApoyo:     "Support",
            zonaEventos:   "Events",
            zonaMazo:      "Deck",
            zonaTrash:     "Trash",
            btnEvento:     "Play Event",
            btnSaque:      "Serve",
            btnRecepcion:  "Receive",
            btnPase:       "Set",
            btnRemate:     "Spike",
            btnBloqueo:    "Block",
            panelBotones:        "Buttons",
            panelAcciones:       "Actions",
            btnHabilidad:        "Use ability",
            btnHabilidadMano:    "Ability from hand",
            btnConcederPunto:    "Concede point",
            btnDeseleccionar:    "Deselect card",
            btnMulligan:         "Confirm mulligan",
            btnEstado:           "Show state",
            btnJugarCarta:       "Play card",
            etiquetaJugador:     "Player: ",
            tituloLog:        "Log",
            elegirCarta:      "Choose a card:",
            elegirOpcion:     "Choose an option:",
            cancelar:         "Cancel",
            volverLobby:      "Back to lobby",
        }
    },
    fr: {
        ui: {
            zonaSaque:     "Service",
            zonaRecepcion: "Réception",
            zonaPase:      "Passe",
            zonaRemate:    "Attaque",
            zonaBloqueo:   "Bloc",
            zonaPuntos:    "Points",
            zonaApoyo:     "Soutien",
            zonaEventos:   "Événements",
            zonaMazo:      "Deck",
            zonaTrash:     "Défausse",
            btnEvento:     "Jouer Événement",
            btnSaque:      "Service",
            btnRecepcion:  "Réception",
            btnPase:       "Passe",
            btnRemate:     "Attaque",
            btnBloqueo:    "Bloc",
            panelBotones:        "Boutons",
            panelAcciones:       "Actions",
            btnHabilidad:        "Utiliser capacité",
            btnHabilidadMano:    "Capacité depuis la main",
            btnConcederPunto:    "Concéder le point",
            btnDeseleccionar:    "Désélectionner carte",
            btnMulligan:         "Confirmer mulligan",
            btnEstado:           "Afficher état",
            btnJugarCarta:       "Jouer carte",
            etiquetaJugador:     "Joueur: ",
            tituloLog:        "Log",
            elegirCarta:      "Choisissez une carte :",
            elegirOpcion:     "Choisissez une option :",
            cancelar:         "Annuler",
            volverLobby:      "Retour au lobby",
        }
    }
};
function fusionarTraducciones() {
  for (let lang in TRADUCCIONES) {
    if (!I18N[lang]) I18N[lang] = {};
    for (let seccion in TRADUCCIONES[lang]) {
      if (!I18N[lang][seccion]) I18N[lang][seccion] = {};
      Object.assign(I18N[lang][seccion], TRADUCCIONES[lang][seccion]);
    }
  }
}

// Ejecutar la fusión al cargar
fusionarTraducciones();


let idiomaActivo = "es"; // variable que guarda el idioma del jugador 

function t(clave, tokens = {}) {
  // Separa la clave por puntos: "log.mulliganConfirmado" → ["log", "mulliganConfirmado"]
  const partes = clave.split(".");
  
  // Empieza a buscar desde el idioma activo
  let texto = I18N[idiomaActivo];
  
  // Recorre cada parte para ir entrando en el objeto
  for (const parte of partes) {
    texto = texto?.[parte];
  }
  
  // Si no encuentra nada, avisa en la consola y devuelve la clave
  if (texto === undefined) {
    console.warn(`[i18n] Clave no encontrada: "${clave}"`);
    return clave;
  }
  
  // Reemplaza los tokens: {jugador} → el valor que venga en el objeto tokens
  for (const [token, valor] of Object.entries(tokens)) {
    texto = texto.replaceAll(`{${token}}`, valor);
  }
  
  return texto;
}

function setLang(lang) {
  // Comprueba que el idioma existe en I18N
  if (!I18N[lang]) {
    console.warn(`[i18n] Idioma no disponible: "${lang}"`);
    return;
  }
  // Cambia el idioma activo
  idiomaActivo = lang;
  console.log(`[i18n] Idioma cambiado a: ${lang}`);
  aplicarIdioma(); 
}

function aplicarIdioma() {
  const elementos = document.querySelectorAll("[data-i18n]");
  for (const elemento of elementos) {
    // Saltar las zonas del campo — renderCampo() las gestiona
    if (elemento.classList.contains("zona")) continue;
    const clave = elemento.getAttribute("data-i18n");
    elemento.textContent = t(clave);
  }
}