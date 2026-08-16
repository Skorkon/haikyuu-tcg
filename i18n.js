
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
            zonaRobo:      "Robo",
            btnEvento:     "Jugar Evento",
            btnSaque:      "Saque",
            btnRecepcion:  "Recepción",
            btnPase:       "Pase",
            btnRemate:     "Remate",
            btnBloqueo:    "Bloqueo",
            btnNoBloquear: "No bloquear",
            manoRival:           "Mano rival: {cantidad}",
            panelBotones:        "Botones",
            panelAcciones:       "Acciones",
            btnHabilidad:        "Usar habilidad",
            btnHabilidadMano:    "Habilidad desde mano",
            btnConcederPunto:    "Conceder punto",
            confirmarConcederPunto: "¿Seguro que quieres conceder el punto?",
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
            contadorTurno: "Turno {turno}",
          },
        menu: {                                           // ← para index.html
          labelNombre:      "Tu nombre",
          placeholderNombre:"Ej: Perro loco",
          labelIdioma:      "Idioma",
          btnContinuar:     "Continuar",
          btnJugar:         "JUGAR",
          btnDeckbuilder:   "DECKBUILDER",
          btnSettings:      "AJUSTES",
          tituloSettings:   "Ajustes",
          labelNombreSettings: "Nombre",
          btnGuardar:       "GUARDAR",
          btnVolver:        "VOLVER",
          colorSecundario:  "Color secundario",
        },
        lobby: {                                          // ← para lobby.html
          volverInicio:     "← Volver a inicio",
          tituloMazo:       "Tu mazo",
          mazoNoCargado:    "Ningún mazo cargado",
          tituloCrear:      "Crear partida",
          btnCrear:         "NUEVA PARTIDA",
          esperandoRival:   "Esperando rival...",
          tituloPartidas:   "Partidas abiertas",
          buscandoPartidas: "Buscando partidas...",
          tituloUnirse:     "Unirse con código",
          placeholderCodigo:"Ej: XK7F2A",
          btnUnirse:        "UNIRSE",
          alertMazo:        "Primero carga tu mazo",
          alertCodigo:      "El código debe tener 6 caracteres",
          uniendoPartida:   "Uniéndose a la partida ",
          elegirMazoGuardado: "Elige un mazo guardado...",
          oImportarArchivo:   "...o importa un archivo",
          sinPartidas:      "No hay partidas abiertas.",
        },
        deckbuilder: {                                    // ← para deckbuilder.html
          tabConstructor:     "Constructor",
          tabPredefinidos:    "Decks predefinidos",
          buscarPlaceholder:  "Buscar carta...",
          todasEscuelas:      "Todas las escuelas",
          todasPosiciones:    "Todas las posiciones",
          todasRarezas:       "Todas las rarezas",
          pillPersonaje:      "Personaje",
          pillEvento:         "Evento",
          pillHabilidad:      "Con habilidad",
          pillSinHabilidad:   "Sin habilidad",
          resetearFiltros:    "Resetear filtros",
          filtrarPorStat:  "Filtrar por estadística...",
          statSaque:       "Saque",
          statRecepcion:   "Recepción",
          statPase:        "Pase",
          statRemate:      "Remate",
          statBloqueo:     "Bloqueo",
          statSaqueCorto:     "SAQ",
          statRecepcionCorto: "REC",
          statPaseCorto:      "PAS",
          statRemateCorto:    "REM",
          statBloqueoCorto:   "BLQ",
          nombreMazoLabel:    "Nombre del mazo",
          deckNamePlaceholder:"Mi deck",
          statPersonajes:     "Personajes",
          statEventos:        "eventos",
          statEscuelas:       "escuelas",
          btnVaciar:          "Vaciar",
          btnGuardarMazo:     "Guardar",
          btnExportar:        "Exportar",
          btnImportar:        "Importar",
          deckVacioTexto:     "Haz clic en + para añadir cartas",
          seccionPersonajes:  "Personajes",
          seccionEventos:     "Eventos",
          quitarUna:          "Quitar una",
          quitarTodas:        "Quitar todas",
          decksGuardados:     "Decks guardados",
          sinDecksGuardados:  "No hay decks guardados",
          eliminarDeck:       "Eliminar",
          errorTotalCartas: "El mazo debe tener exactamente 40 cartas (tienes {total}).",
          errorMaxEventos:  "El mazo no puede tener más de 8 eventos (tienes {eventos}).",
          confirmarEliminar: "¿Seguro que quieres eliminar el mazo \"{nombre}\"?",
          cargarPredefinido: "Cargar en constructor →",
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
            zonaRobo:      "Draw",
            btnEvento:     "Play Event",
            btnSaque:      "Serve",
            btnRecepcion:  "Receive",
            btnPase:       "Set",
            btnRemate:     "Spike",
            btnBloqueo:    "Block",
            btnNoBloquear: "Don't block",
            manoRival:           "Opponent's hand: {cantidad}",
            panelBotones:        "Buttons",
            panelAcciones:       "Actions",
            btnHabilidad:        "Use ability",
            btnHabilidadMano:    "Ability from hand",
            btnConcederPunto:    "Concede point",
            confirmarConcederPunto: "Are you sure you want to concede the point?",
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
            contadorTurno:    "Turn {turno}",
        },
        menu: {
          labelNombre:      "Your name",
          placeholderNombre:"E.g: Mad dog",
          labelIdioma:      "Language",
          btnContinuar:     "Continue",
          btnJugar:         "PLAY",
          btnDeckbuilder:   "DECKBUILDER",
          btnSettings:      "SETTINGS",
          tituloSettings:   "Settings",
          labelNombreSettings: "Name",
          btnGuardar:       "SAVE",
          btnVolver:        "BACK",
          colorSecundario:  "Secondary colour",
        },
        lobby: {
          volverInicio:     "← Back to home",
          tituloMazo:       "Your deck",
          mazoNoCargado:    "No deck loaded",
          tituloCrear:      "Create match",
          btnCrear:         "NEW MATCH",
          esperandoRival:   "Waiting for opponent...",
          tituloPartidas:   "Open matches",
          buscandoPartidas: "Searching for matches...",
          tituloUnirse:     "Join with code",
          placeholderCodigo:"E.g: XK7F2A",
          btnUnirse:        "JOIN",
          alertMazo:        "Load your deck first",
          alertCodigo:      "The code must be 6 characters",
          uniendoPartida:   "Joining match ",
          elegirMazoGuardado: "Choose a saved deck...",
          oImportarArchivo:   "...or import a file",
          sinPartidas: "No open matches.",
        },
        deckbuilder: {
          tabConstructor:     "Builder",
          tabPredefinidos:    "Preset decks",
          buscarPlaceholder:  "Search card...",
          todasEscuelas:      "All schools",
          todasPosiciones:    "All positions",
          todasRarezas:       "All rarities",
          pillPersonaje:      "Character",
          pillEvento:         "Event",
          pillHabilidad:      "With ability",
          pillSinHabilidad:   "Without ability",
          resetearFiltros:    "Reset filters",
          filtrarPorStat:  "Filter by stat...",
          statSaque:       "Serve",
          statRecepcion:   "Reception",
          statPase:        "Set",
          statRemate:      "Spike",
          statBloqueo:     "Block",
          statSaqueCorto:     "SRV",
          statRecepcionCorto: "REC",
          statPaseCorto:      "SET",
          statRemateCorto:    "SPK",
          statBloqueoCorto:   "BLK",
          nombreMazoLabel:    "Deck name",
          deckNamePlaceholder:"My deck",
          statPersonajes:     "Characters",
          statEventos:        "events",
          statEscuelas:       "schools",
          btnVaciar:          "Clear",
          btnGuardarMazo:     "Save",
          btnExportar:        "Export",
          btnImportar:        "Import",
          deckVacioTexto:     "Click + to add cards",
          seccionPersonajes:  "Characters",
          seccionEventos:     "Events",
          quitarUna:          "Remove one",
          quitarTodas:        "Remove all",
          decksGuardados:     "Saved decks",
          sinDecksGuardados:  "No saved decks",
          eliminarDeck:       "Delete",
          errorTotalCartas: "The deck must have exactly 40 cards (you have {total}).",
          errorMaxEventos:  "The deck can't have more than 8 events (you have {eventos}).",
          confirmarEliminar: "Are you sure you want to delete the deck \"{nombre}\"?",
          cargarPredefinido: "Load into builder →",
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
            zonaRobo:      "Pioche",
            btnEvento:     "Jouer Événement",
            btnSaque:      "Service",
            btnRecepcion:  "Réception",
            btnPase:       "Passe",
            btnRemate:     "Attaque",
            btnBloqueo:    "Bloc",
            btnNoBloquear: "Ne pas bloquer",
            manoRival:           "Main adverse : {cantidad}",
            panelBotones:        "Boutons",
            panelAcciones:       "Actions",
            btnHabilidad:        "Utiliser capacité",
            btnHabilidadMano:    "Capacité depuis la main",
            btnConcederPunto:    "Concéder le point",
            confirmarConcederPunto: "Es-tu sûr de vouloir concéder le point ?",
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
            contadorTurno:    "Tour {turno}",
        },
        menu: {
          labelNombre:      "Ton nom",
          placeholderNombre:"Ex : Enragé",
          labelIdioma:      "Langue",
          btnContinuar:     "Continuer",
          btnJugar:         "JOUER",
          btnDeckbuilder:   "DECKBUILDER",
          btnSettings:      "PARAMÈTRES",
          tituloSettings:   "Paramètres",
          labelNombreSettings: "Nom",
          btnGuardar:       "ENREGISTRER",
          btnVolver:        "RETOUR",
          colorSecundario:  "Couleur secondaire",
        },
        lobby: {
          volverInicio:     "← Retour à l'accueil",
          tituloMazo:       "Ton deck",
          mazoNoCargado:    "Aucun deck chargé",
          tituloCrear:      "Créer une partie",
          btnCrear:         "NOUVELLE PARTIE",
          esperandoRival:   "En attente d'un adversaire...",
          tituloPartidas:   "Parties ouvertes",
          buscandoPartidas: "Recherche de parties...",
          tituloUnirse:     "Rejoindre avec un code",
          placeholderCodigo:"Ex : XK7F2A",
          btnUnirse:        "REJOINDRE",
          alertMazo:        "Charge d'abord ton deck",
          alertCodigo:      "Le code doit comporter 6 caractères",
          uniendoPartida:   "Connexion à la partie ",
          elegirMazoGuardado: "Choisis un deck enregistré...",
          oImportarArchivo:   "...ou importe un fichier",
          sinPartidas: "Aucune partie ouverte.",
        },
        deckbuilder: {
          tabConstructor:     "Constructeur",
          tabPredefinidos:    "Decks prédéfinis",
          buscarPlaceholder:  "Rechercher une carte...",
          todasEscuelas:      "Toutes les écoles",
          todasPosiciones:    "Toutes les positions",
          todasRarezas:       "Toutes les raretés",
          pillPersonaje:      "Personnage",
          pillEvento:         "Événement",
          pillHabilidad:      "Avec capacité",
          pillSinHabilidad:   "Sans capacité",
          resetearFiltros:    "Réinitialiser les filtres",
          filtrarPorStat:  "Filtrer par statistique...",
          statSaque:       "Service",
          statRecepcion:   "Réception",
          statPase:        "Passe",
          statRemate:      "Attaque",
          statBloqueo:     "Bloc",
          statSaqueCorto:     "SRV",
          statRecepcionCorto: "RÉC",
          statPaseCorto:      "PAS",
          statRemateCorto:    "ATQ",
          statBloqueoCorto:   "BLC",
          nombreMazoLabel:    "Nom du deck",
          deckNamePlaceholder:"Mon deck",
          statPersonajes:     "Personnages",
          statEventos:        "événements",
          statEscuelas:       "écoles",
          btnVaciar:          "Vider",
          btnGuardarMazo:     "Enregistrer",
          btnExportar:        "Exporter",
          btnImportar:        "Importer",
          deckVacioTexto:     "Clique sur + pour ajouter des cartes",
          seccionPersonajes:  "Personnages",
          seccionEventos:     "Événements",
          quitarUna:          "Retirer un",
          quitarTodas:        "Retirer tout",
          decksGuardados:     "Decks enregistrés",
          sinDecksGuardados:  "Aucun deck enregistré",
          eliminarDeck:       "Supprimer",
          errorTotalCartas: "Le deck doit contenir exactement 40 cartes (tu en as {total}).",
          errorMaxEventos:  "Le deck ne peut pas contenir plus de 8 événements (tu en as {eventos}).",
          confirmarEliminar: "Es-tu sûr de vouloir supprimer le deck « {nombre} » ?",
          cargarPredefinido: "Charger dans le constructeur →",
        }
    }
};
function fusionarTraducciones() {
  if (typeof TRADUCCIONES === "undefined") return;
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


let idiomaActivo = localStorage.getItem("hv-idioma") || "en"; // idioma guardado, o inglés por defecto

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
  localStorage.setItem("hv-idioma", lang); // recordarlo para la próxima vez
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

  // -- Traducir placeholders de inputs (para index.html)
  const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  for (const elemento of placeholders) {
    const clave = elemento.getAttribute("data-i18n-placeholder");
    elemento.placeholder = t(clave);
  }

  // -- Traducir atributos title (tooltips para deckbuilder.html)
  const titles = document.querySelectorAll("[data-i18n-title]");
  for (const elemento of titles) {
    const clave = elemento.getAttribute("data-i18n-title");
    elemento.title = t(clave);
  }
}
aplicarIdioma(); // aplica el idioma guardado nada más cargar la página