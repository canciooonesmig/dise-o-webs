// Contenido de AFyV Legal. Editar aquí y volver a generar el sitio con: node afyv-legal/_src/build.mjs
// Criterios de redacción: AFyV Legal se nombra como "el estudio" o "AFyV Legal"; no se nombra al
// proveedor de IA (se informa en la cláusula de uso de IA); no se exponen procedimientos internos.

export const REGLA = { ia: 'La IA prepara.', equipo: 'Nuestro equipo analiza, decide, firma y responde.' };
export const REGLA_DE_ORO = `${REGLA.ia} ${REGLA.equipo}`;

// Aviso breve de IA (sitio y contratación)
export const AVISO_IA = 'Usamos inteligencia artificial para preparar borradores con más rapidez. Nuestro equipo revisa, corrige y firma cada entrega, y verifica cada fuente en su origen oficial. Tu información no se usa para entrenar modelos. Si prefieres que tu encargo se trabaje sin IA, te informamos precio y plazo antes de contratar.';

// Virtudes de la IA en el estudio
export const VIRTUDES = [
  { k: 'Rapidez', t: 'Respuestas en horas, no en semanas', d: 'La IA ordena antecedentes y prepara el primer borrador. El equipo dedica su tiempo a analizar y decidir.' },
  { k: 'Precio', t: 'Precio fijo y conocido', d: 'Menos horas en tareas mecánicas permiten publicar precios claros antes de empezar.' },
  { k: 'Rigor', t: 'Más tiempo para lo que importa', d: 'Con el borrador resuelto, el análisis, la estrategia y la revisión ganan profundidad.' },
  { k: 'Criterio', t: 'Decisiones siempre humanas', d: 'La IA sugiere; el equipo valora los argumentos, define la estrategia y firma.' },
];

// Compromisos publicados
export const PROMESAS = [
  { t: 'Revisamos y firmamos cada entrega', d: 'Nada sale del estudio sin una lectura completa y la firma de quien responde por el encargo.' },
  { t: 'Precio fijo conocido antes de empezar', d: 'Cada servicio tiene un alcance definido. Lo que quede fuera, te lo cotizamos antes y solo se hace si lo aceptas.' },
  { t: 'Plazos en horas hábiles', d: 'Contados desde que recibimos la información completa.' },
  { t: 'Tu información no entrena modelos de IA', d: 'Trabajamos con herramientas que no usan tus datos para entrenar y con un expediente reservado para cada cliente.' },
  { t: 'Con o sin IA, tú eliges', d: 'Si prefieres que tu encargo se trabaje sin IA, te informamos precio y plazo antes de contratar.' },
];

// Principios
export const PRINCIPIOS = [
  ['Responsabilidad indelegable', 'El estudio responde por cada entrega, se haya usado IA o no.'],
  ['Verificación antes de confiar', 'Nada de lo que produce la IA se da por cierto: cada cita, dato y conclusión se comprueba.'],
  ['Secreto profesional primero', 'La información de cada cliente se trata con estricta reserva y con los resguardos adecuados.'],
  ['Transparencia', 'Antes de contratar sabes cómo usamos la IA y que puedes optar por un servicio sin ella.'],
  ['Separación por cliente', 'El expediente de un cliente nunca se mezcla con el de otro.'],
];

// Límites que no admiten excepción
export const LIMITES = [
  { t: 'Nada se entrega sin revisión', d: 'Ningún borrador sale del estudio sin revisión completa y firma.' },
  { t: 'Nada se cita sin verificar', d: 'Normas, fallos y doctrina se contrastan con su fuente oficial. Lo que no se puede verificar, no se usa.' },
  { t: 'Solo herramientas autorizadas', d: 'La información de clientes nunca entra en cuentas personales ni gratuitas.' },
  { t: 'Expedientes separados', d: 'La información de un cliente nunca se usa en el encargo de otro.' },
  { t: 'Siempre decide una persona', d: 'Ninguna decisión con efectos jurídicos la toma la IA.' },
];

// Qué hace la IA y qué hace el equipo
export const USOS_IA = ['Ordena y resume documentos', 'Prepara primeros borradores', 'Propone cláusulas desde modelos aprobados', 'Asiste en las búsquedas, incluida la de marcas', 'Revisa coherencia, ortografía y numeración'];
export const USOS_EQUIPO = ['Valora los argumentos y define la estrategia', 'Decide qué entra y qué no en cada documento', 'Verifica cada fuente y cada dato', 'Firma y responde por la entrega', 'Te explica el resultado, sus riesgos y alternativas'];

// Cómo trabajamos un encargo: el equipo conduce, la IA asiste
export const FLUJO = [
  { n: 1, t: 'Escuchamos', d: 'Conversamos contigo para entender qué necesitas y qué está en juego.', who: 'Equipo' },
  { n: 2, t: 'Proponemos', d: 'Te enviamos un precio fijo con un alcance claro, antes de empezar.', who: 'Equipo' },
  { n: 3, t: 'Acordamos', d: 'Firmas la carta de encargo y eliges si trabajamos con o sin IA.', who: 'Tú y el equipo' },
  { n: 4, t: 'Preparamos', d: 'La IA agiliza la búsqueda de antecedentes y el primer borrador, guiada por el equipo.', who: 'Equipo + IA', ai: true },
  { n: 5, t: 'Analizamos y decidimos', d: 'El equipo valora argumentos, riesgos y alternativas, y define la estrategia.', who: 'Equipo', key: true },
  { n: 6, t: 'Verificamos y entregamos', d: 'Contrastamos cada fuente, firmamos y te explicamos el resultado.', who: 'Equipo', key: true },
];

// Antes de cada entrega
export const CHECKLIST = [
  ['Hechos y antecedentes', 'Partes, fechas, montos y documentos, contrastados con su origen.'],
  ['Normativa vigente', 'Cada norma, en su versión vigente y aplicable a tu caso.'],
  ['Fuentes verificadas', 'Jurisprudencia y doctrina revisadas en sus fuentes oficiales.'],
  ['Estrategia y argumentos', 'Que la solución sea la adecuada para tus objetivos.'],
  ['Riesgos y alternativas', 'Identificados y explicados antes de que decidas.'],
  ['Forma y plazos', 'Requisitos formales y plazos legales bajo control.'],
  ['Claridad', 'Un documento coherente y fácil de entender.'],
  ['Confidencialidad', 'Tu información, resguardada en cada etapa.'],
];

// Requisitos de seguridad para el uso de IA (compatibles con el reglamento interno)
export const SEGURIDAD_IA = [
  'No ingresamos información de clientes en herramientas de IA que permitan usar las conversaciones para entrenar o mejorar sus modelos.',
  'Cuando la herramienta lo permite, usamos el modo temporal o equivalente y no conservamos conversaciones más allá de lo necesario.',
  'Anonimizamos los datos personales y antecedentes identificatorios del cliente siempre que es posible.',
  'No introducimos en herramientas de IA datos especialmente sensibles, secretos empresariales, credenciales, información financiera no pública ni antecedentes cuya divulgación pueda afectar al cliente, salvo autorización expresa y uso de una herramienta con garantías adecuadas.',
  'Todo contenido generado por IA es revisado y validado por nuestro equipo antes de usarse o comunicarse como parte del servicio.',
];

// Pilares de protección de la información
export const RESGUARDOS = [
  { t: 'Expediente reservado', d: 'Cada cliente tiene un espacio propio. Nunca se mezcla con el de otro.' },
  { t: 'Sin entrenamiento', d: 'Tu información no se usa para entrenar ni mejorar modelos de IA.' },
  { t: 'Datos mínimos', d: 'A la IA solo llega lo necesario y, cuando se puede, anonimizado.' },
  { t: 'Borrado al cierre', d: 'Al terminar el encargo eliminamos el historial de IA asociado.' },
];

// Marco normativo que respetamos
export const MARCO = [
  ['Código Civil, art. 2129', 'El mandatario responde hasta de la culpa leve, y más estrictamente si es remunerado. Con IA, el estándar es el mismo que sin ella.'],
  ['Código de Ética Profesional', 'Confidencialidad, información clara al cliente y publicidad veraz.'],
  ['Guía del Colegio de Abogados sobre IA', 'Responsabilidad personal, consentimiento informado y verificación de las fuentes.'],
  ['Leyes 19.628 y 21.719', 'Protección de datos personales. La Ley 21.719, que rige desde diciembre de 2026, agrega el derecho a no ser objeto de decisiones automatizadas.'],
];

// Tarifario del 4 de octubre de 2026 (servicios activos)
export const LINEAS = [
  { id: 'marcas', nombre: 'Marcas', bajada: 'Te decimos el riesgo antes de que pagues las tasas.', ia: 'La IA amplía la búsqueda de marcas similares; el equipo califica el riesgo.' },
  { id: 'corporativo', nombre: 'Corporativo pyme', bajada: 'Tu empresa constituida, ordenada y con contratos claros.', ia: 'Borradores en horas a partir de modelos revisados por el equipo.' },
  { id: 'litigios', nombre: 'Litigios y cobranza', bajada: 'Cobrar lo que te deben, con un plan claro.', ia: 'La IA ordena los antecedentes; la estrategia la define el equipo.' },
  { id: 'suscripcion', nombre: 'Abogado de tu Pyme', bajada: 'Asesoría mensual con alcance definido.', ia: 'Respuestas ágiles, siempre revisadas antes de enviarse.' },
];

const H = 'desde que recibimos la información completa';
export const SIN_IA = 'Si prefieres que tu encargo se trabaje sin IA, te informamos precio y plazo antes de contratar.';
export const SERVICIOS = [
  { linea: 'marcas', nombre: 'Diagnóstico de marca', precio: 29990, modo: 'Precio fijo', plazo: `24 horas hábiles ${H}`, desc: 'Búsqueda de marcas similares en INAPI e informe de riesgo bajo, medio o alto, con las clases recomendadas.', incluye: ['Búsqueda de marcas idénticas y similares, y de clases relacionadas', 'Informe escrito con lo buscado, las clases y sus límites', 'Calificación del riesgo y recomendación de clases'], nota: 'Se descuenta si luego contratas el registro.', destacado: true },
  { linea: 'marcas', nombre: 'Marca protegida (1 clase)', precio: 100000, tasas: true, modo: 'Precio fijo', plazo: `Presentación en 48 horas hábiles ${H}`, desc: 'Solicitud de registro ante INAPI y seguimiento hasta su resolución.', incluye: ['Solicitud ante INAPI', 'Seguimiento del trámite', 'Respuesta a observaciones de forma'], nota: 'Tasas INAPI aparte: 3 UTM por clase (1 al presentar y 2 al registrarse) más la publicación en el Diario Oficial.' },
  { linea: 'marcas', nombre: 'Vigilancia de marca', precio: 10000, mensual: true, modo: 'Mensual', plazo: 'Reporte mensual', desc: 'Alertas de solicitudes similares a tu marca y aviso de renovaciones.', incluye: ['Reporte mensual de solicitudes similares', 'Evaluación de cada alerta por el equipo'] },
  { linea: 'marcas', nombre: 'Defensa ante observaciones de fondo', cotizacion: 'A cotizar', modo: 'Cotización previa', plazo: 'Dentro del plazo legal de respuesta', desc: 'Respuesta a las observaciones de fondo de INAPI, con los argumentos y antecedentes que sostienen tu solicitud.', incluye: ['Análisis de la resolución y de las marcas citadas', 'Escrito de respuesta con argumentos y antecedentes', 'Seguimiento hasta la resolución'] },
  { linea: 'marcas', nombre: 'Oposiciones', cotizacion: 'A cotizar', modo: 'Cotización previa', plazo: 'Dentro de los plazos legales', desc: 'Presentamos tu oposición a una solicitud que afecta tu marca, o defendemos la tuya cuando un tercero se opone.', incluye: ['Evaluación de fundamentos y riesgos', 'Escrito de oposición o de contestación', 'Prueba y seguimiento hasta la sentencia'] },
  { linea: 'marcas', nombre: 'Apelación ante el TDPI', cotizacion: 'A cotizar', modo: 'Cotización previa', plazo: 'Dentro del plazo legal para apelar', desc: 'Recurso ante el Tribunal de Propiedad Industrial contra las resoluciones de INAPI que afectan tu marca.', incluye: ['Análisis de la resolución apelada', 'Escrito de apelación con sus fundamentos', 'Seguimiento hasta el fallo'] },
  { linea: 'corporativo', nombre: 'Empresa lista (RES)', precio: 119000, modo: 'Precio fijo', plazo: `72 horas hábiles ${H}`, desc: 'Constitución en el Registro de Empresas y Sociedades, con estatutos a tu medida.', incluye: ['Estatutos', 'Constitución en el RES', 'Inicio de actividades'] },
  { linea: 'corporativo', nombre: 'Pack Empresa + Marca', precio: 189000, tasas: true, modo: 'Precio fijo', plazo: `72 horas hábiles ${H}`, desc: 'Constitución de tu empresa y registro de su marca en una clase.', incluye: ['Empresa lista (RES)', 'Marca protegida (1 clase)'], nota: 'Tasas INAPI aparte.', destacado: true },
  { linea: 'corporativo', nombre: 'Pacto de socios', precio: 100000, modo: 'Precio fijo', plazo: `5 días hábiles ${H}`, desc: 'Pacto de socios o accionistas coherente con tus estatutos, con reglas claras de mayorías, salida y resolución de conflictos.', incluye: ['Redacción', 'Dos rondas de ajustes', 'Doble revisión'] },
  { linea: 'corporativo', nombre: 'Contrato comercial: revisión', precio: 85000, modo: 'Precio fijo', plazo: `24 a 48 horas hábiles ${H}`, desc: 'Revisión de un contrato comercial, con comentarios y propuesta de cambios.', incluye: ['Informe', 'Versión con cambios marcados'] },
  { linea: 'corporativo', nombre: 'Contrato comercial: redacción', precio: 100000, desde: true, modo: 'Desde', plazo: `24 a 48 horas hábiles ${H}`, desc: 'Redacción de un contrato comercial a medida.', incluye: ['Borrador', 'Una ronda de ajustes'] },
  { linea: 'litigios', nombre: 'Carta de cobro y negociación', precio: 39000, modo: 'Precio fijo', plazo: `24 horas hábiles ${H}`, desc: 'Carta dirigida al deudor, revisada en monto, intereses y tono antes de enviarse.', incluye: ['Carta de cobro'] },
  { linea: 'litigios', nombre: 'Cobranza judicial', precio: 300000, tasas: true, exito: true, modo: 'Fijo + % de éxito', plazo: `Presentación en 5 días hábiles ${H}`, desc: 'Demanda ejecutiva o monitoria, según el título, con tramitación hasta la sentencia.', incluye: ['Demanda', 'Tramitación hasta la sentencia', 'Doble revisión de cada escrito'], nota: 'Más 10% de lo recuperado. La base de cálculo y el momento de pago se acuerdan por escrito antes de iniciar.' },
  { linea: 'litigios', nombre: 'Precario (Ley Devuélveme mi Casa) o cobro de rentas', precio: 300000, desde: true, tasas: true, modo: 'Desde', plazo: `Plan de causa en 72 horas hábiles ${H}`, desc: 'Procedimiento monitorio. Si la causa pasa a juicio sumario, $200.000 adicionales.', incluye: ['Plan de causa', 'Cotización fija por etapa'] },
  { linea: 'litigios', nombre: 'Civil en general', cotizacion: true, tasas: true, modo: 'Por etapa', plazo: 'Según la causa', desc: 'Juicios sumarios, ordinarios y otros procedimientos civiles.', incluye: ['Cotización fija por etapa antes de iniciar', 'Riesgos, costos y alternativas, explicados por escrito'] },
];

export const PLANES = [
  { nombre: 'Esencial', precio: 49000, items: ['Hasta 3 consultas por chat cada día hábil', '3 revisiones de contrato al mes', 'Vigilancia de 1 marca'] },
  { nombre: 'Pyme', precio: 119000, destacado: true, items: ['Todo lo de Esencial', 'Hasta 5 contratos simples al mes', 'Actas y juntas', '15% de descuento en marcas y litigios'] },
  { nombre: 'Crecimiento', precio: 249000, items: ['Todo lo de Pyme', 'Hasta 10 contratos simples al mes', 'Responsable asignado', 'Reunión mensual'] },
];
export const PLANES_REGLAS = {
  respuesta: 'Respuesta en 24 horas hábiles',
  definiciones: [
    ['Consulta', 'Una pregunta sobre un tema, respondida por escrito, sin redactar documentos ni revisar más de 5 páginas. Lo que exceda se cotiza aparte.'],
    ['Contrato simple', 'Contrato de hasta 10 páginas entre dos partes, basado en un modelo del estudio, sin negociación con la contraparte y con una ronda de ajustes. Por ejemplo: NDA, prestación de servicios, arriendo comercial simple, compraventa de bienes muebles o mandato.'],
    ['Sin acumulación', 'Las consultas y documentos no usados no pasan al mes siguiente.'],
  ],
  excluido: 'Escritos judiciales, oposiciones ante INAPI, contratos con negociación, due diligence y asuntos laborales.',
  baja: 'Te das de baja por el mismo medio en que contrataste, sin trámites, con efecto al final del período pagado.',
};
