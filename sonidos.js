// ============================================================= HINCHADAS DISPONIBLES
// id     = nombre del archivo dentro de audio/ (sin el .mp3)
// nombre = texto que verá el jugador en la lista de Settings
const HINCHADAS = [
  { id: "karasuno", nombre: "Karasuno" },
  { id: "dateko",     nombre: "Date Kôgyo" },
  { id: "nekoma",     nombre: "Nekoma" },
  { id: "inarizaki",     nombre: "Inarizaki" },
  { id: "seijo",     nombre: "Aoba Jôsai" },
  { id: "shiratorizawa",     nombre: "Shiratorizawa" },
];

const HINCHADA_DEFECTO = "karasuno";   // la que suena si el jugador aún no ha elegido nada
const VOLUMEN_DEFECTO  = 0.6;          // volumen por defecto (de 0 a 1)

// ============================================================= LEER LA ELECCIÓN GUARDADA DEL JUGADOR
// devuelve el id de la hinchada, o "ninguna" si ha elegido "Sin sonido"
function obtenerHinchada() {
  return localStorage.getItem("hv-hinchada") || HINCHADA_DEFECTO;
}

// devuelve el volumen guardado como número entre 0 y 1
function obtenerVolumen() {
  const guardado = localStorage.getItem("hv-volumen");
  return guardado !== null ? parseFloat(guardado) : VOLUMEN_DEFECTO;
}