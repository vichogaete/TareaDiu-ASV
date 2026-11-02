// Datos ficticios del prototipo académico USM Denuncias

export type Estado = "Recibida" | "En revisión" | "Derivada al área responsable" | "Resuelta";

export const ESTADOS: Estado[] = ["Recibida", "En revisión", "Derivada al área responsable", "Resuelta"];

export const CATEGORIAS = [
  { id: "infraestructura", nombre: "Infraestructura", descripcion: "Puertas, techos, escaleras, iluminación" },
  { id: "banos", nombre: "Baños y aseo", descripcion: "Papel, jabón, limpieza, filtraciones" },
  { id: "conectividad", nombre: "Conectividad e internet", descripcion: "eduroam, Wi-Fi, red cableada" },
  { id: "salas", nombre: "Salas y equipamiento", descripcion: "Proyectores, enchufes, computadores" },
  { id: "casino", nombre: "Casino y alimentación", descripcion: "Higiene, microondas, atención" },
  { id: "administracion", nombre: "Administración", descripcion: "Trámites, atención, horarios" },
  { id: "otros", nombre: "Otros", descripcion: "Algo que no está en la lista" },
] as const;

export const CAMPUS = [
  "Casa Central Valparaíso",
  "Campus Santiago San Joaquín",
  "Campus Santiago Vitacura",
  "Sede Viña del Mar",
  "Sede Concepción",
];

export function nombreCategoria(id: string) {
  return CATEGORIAS.find((c) => c.id === id)?.nombre ?? "Otros";
}

export interface EventoSeguimiento {
  estado: Estado;
  fecha: string;
  detalle: string;
}

export interface Denuncia {
  codigo: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  campus: string;
  ubicacion: string;
  fecha: string;
  imagen?: string | undefined;
  estado: Estado;
  historial: EventoSeguimiento[];
  solucion?: string | undefined;
}

export const DENUNCIAS_EJEMPLO: Denuncia[] = [
  {
    codigo: "USM-1031",
    titulo: "Proyector de la sala A-201 no enciende",
    descripcion: "El proyector no enciende desde hace una semana. El profesor tuvo que hacer la clase sin presentación.",
    categoria: "salas",
    campus: "Casa Central Valparaíso",
    ubicacion: "Edificio A, sala A-201",
    fecha: "2026-10-12T10:20:00",
    estado: "Resuelta",
    historial: [
      { estado: "Recibida", fecha: "2026-10-12T10:20:00", detalle: "Tu denuncia fue registrada." },
      { estado: "En revisión", fecha: "2026-10-13T09:00:00", detalle: "El equipo revisó la información enviada." },
      { estado: "Derivada al área responsable", fecha: "2026-10-13T15:40:00", detalle: "Se derivó a Soporte Audiovisual." },
      { estado: "Resuelta", fecha: "2026-10-16T11:10:00", detalle: "Se cambió la lámpara del proyector." },
    ],
    solucion: "Soporte Audiovisual reemplazó la lámpara del proyector y probó el equipo con un computador. La sala quedó operativa.",
  },
  {
    codigo: "USM-1036",
    titulo: "Baño sin papel ni jabón en edificio C",
    descripcion: "El baño del segundo piso lleva varios días sin papel higiénico ni jabón.",
    categoria: "banos",
    campus: "Campus Santiago San Joaquín",
    ubicacion: "Edificio C, 2° piso",
    fecha: "2026-10-24T13:05:00",
    estado: "Derivada al área responsable",
    historial: [
      { estado: "Recibida", fecha: "2026-10-24T13:05:00", detalle: "Tu denuncia fue registrada." },
      { estado: "En revisión", fecha: "2026-10-25T08:30:00", detalle: "Se confirmó la información." },
      { estado: "Derivada al área responsable", fecha: "2026-10-25T10:00:00", detalle: "Se derivó al equipo de Aseo." },
    ],
  },
  {
    codigo: "USM-1040",
    titulo: "Enchufes sin energía en biblioteca",
    descripcion: "Los enchufes de las mesas del fondo de la biblioteca no funcionan.",
    categoria: "infraestructura",
    campus: "Casa Central Valparaíso",
    ubicacion: "Biblioteca central, sector mesas grupales",
    fecha: "2026-10-30T17:45:00",
    estado: "En revisión",
    historial: [
      { estado: "Recibida", fecha: "2026-10-30T17:45:00", detalle: "Tu denuncia fue registrada." },
      { estado: "En revisión", fecha: "2026-10-31T09:15:00", detalle: "El equipo está revisando tu reporte." },
    ],
  },
];

export interface Articulo {
  id: string;
  titulo: string;
  categoria: string;
  resumen: string;
  pasos: string[];
  nota?: string | undefined;
}

export const ARTICULOS: Articulo[] = [
  {
    id: "eduroam-no-conecta",
    titulo: "No puedo conectarme a eduroam",
    categoria: "conectividad",
    resumen: "Guía de diagnóstico general si tu equipo no se conecta a la red eduroam.",
    pasos: [
      "Verifica que el Wi-Fi de tu equipo esté activado y que el modo avión esté apagado.",
      "Comprueba si otras personas cerca tuyo tienen el mismo problema. Si a nadie le funciona, puede ser una falla de la zona.",
      "Olvida la red eduroam en tu equipo y vuelve a conectarte, ingresando nuevamente tus datos.",
      "Revisa que estés usando tu usuario y contraseña institucional vigentes, escritos sin espacios.",
      "Reinicia tu equipo y vuelve a intentarlo.",
      "Consulta la configuración oficial publicada por la Dirección de Tecnologías de la Información de la USM.",
    ],
    nota: "Esta es una guía general. Para la configuración técnica oficial, consulta los canales de la universidad.",
  },
  {
    id: "wifi-universitario",
    titulo: "Cómo configurar el Wi-Fi universitario",
    categoria: "conectividad",
    resumen: "Recomendaciones generales antes de configurar la red en un equipo nuevo.",
    pasos: [
      "Ten a mano tus credenciales institucionales.",
      "Busca la red disponible en tu campus desde la configuración Wi-Fi.",
      "Sigue las instrucciones oficiales publicadas por la universidad para tu sistema operativo.",
      "Si tu equipo pide aceptar un certificado, verifica que provenga de la institución.",
    ],
    nota: "No compartas tu contraseña con terceros ni en formularios no oficiales.",
  },
  {
    id: "proyector",
    titulo: "El proyector de la sala no funciona",
    categoria: "salas",
    resumen: "Revisa estos puntos antes de reportar un proyector con falla.",
    pasos: [
      "Confirma que el proyector esté enchufado y que el botón de encendido tenga luz.",
      "Revisa que el cable HDMI o VGA esté bien conectado al computador.",
      "Cambia la fuente de entrada del proyector con el control o los botones del equipo.",
      "Si aparece una luz roja de advertencia o el equipo no enciende, crea una denuncia indicando la sala.",
    ],
  },
  {
    id: "infraestructura",
    titulo: "Daños en infraestructura",
    categoria: "infraestructura",
    resumen: "Qué información incluir al reportar puertas, luces o filtraciones.",
    pasos: [
      "Si existe un riesgo inmediato, aléjate de la zona y avisa al personal de seguridad del campus.",
      "Anota la ubicación exacta: edificio, piso y sala o sector.",
      "Toma una foto del problema si es seguro hacerlo.",
      "Crea una denuncia en la categoría Infraestructura.",
    ],
  },
  {
    id: "insumos-banos",
    titulo: "Faltan insumos en los baños",
    categoria: "banos",
    resumen: "Cómo reportar falta de papel, jabón o problemas de limpieza.",
    pasos: [
      "Revisa si hay otro baño cercano disponible mientras se soluciona.",
      "Indica el edificio y piso del baño afectado.",
      "Señala qué falta: papel, jabón, toallas o limpieza.",
      "Crea una denuncia en la categoría Baños y aseo.",
    ],
  },
  {
    id: "computadores-laboratorio",
    titulo: "Computadores del laboratorio con fallas",
    categoria: "salas",
    resumen: "Pasos básicos si un computador del laboratorio no funciona.",
    pasos: [
      "Reinicia el computador y verifica que el monitor esté encendido.",
      "Prueba en otro computador para descartar un problema con tu cuenta.",
      "Anota el número o etiqueta del equipo con falla.",
      "Informa al ayudante o encargado del laboratorio, o crea una denuncia.",
    ],
  },
];

export const PREGUNTAS = [
  { p: "¿Qué es una denuncia?", r: "Es un reporte de un problema que encontraste en el campus, para que el área responsable pueda solucionarlo." },
  { p: "¿Cómo sé si mi denuncia fue enviada?", r: "Al enviarla verás una pantalla de confirmación con tu número de seguimiento. También aparecerá en Mis denuncias." },
  { p: "¿Cuánto demora una respuesta?", r: "Depende del tipo de problema. Puedes revisar el estado en cualquier momento desde Mis denuncias." },
  { p: "¿Puedo adjuntar una foto?", r: "Sí, es opcional y ayuda a entender mejor el problema." },
];
