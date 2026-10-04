// Contenido de AFyV 2.0 tomado del plan ejecutivo, el reglamento interno (arts. citados)
// y el tarifario del 4 de octubre de 2026. Editar aquí y volver a generar el sitio.
//
// PENDIENTES: datos que los socios deben definir antes de publicar (decisiones del plan ejecutivo).
// Mientras estén en null, el sitio muestra una marca visible "por confirmar".
export const PENDIENTES = {
  proveedorIA: null,        // Decisión 3: proveedor de IA principal y plan empresarial (art. 17 y 18)
  razonSocial: null,        // Art. 43: razón social del estudio
  rut: null,                // Art. 43: RUT del estudio
  sinIA: null,              // Decisión 8: precio y plazo del servicio sin IA (arts. 29 y 45)
  retencionIA: null,        // Decisión 4: borrado de la memoria de IA tras el cierre (art. 41), propuesta 30 días
};

export const REGLA_DE_ORO = 'La IA prepara; un abogado verifica, decide, firma y responde.';

// Frases permitidas por el art. 54 (solo si se cumplen y se miden)
export const PROMESAS = [
  { k: 'Firma', t: 'Un abogado revisa y firma cada entrega', d: 'Lectura completa, checklist de verificación y firma del abogado responsable. Doble revisión en escritos judiciales, oposiciones y pactos de socios.', ref: 'Arts. 23 a 25' },
  { k: 'Precio', t: 'Precio fijo conocido antes de empezar', d: 'Cada servicio tiene una ficha de alcance. Nada fuera de alcance se cobra sin tu aceptación escrita.', ref: 'Arts. 28 y 46' },
  { k: 'Plazos', t: 'Plazos en horas hábiles', d: 'Contados desde que recibimos la información completa, y controlados cada mes.', ref: 'Arts. 54 y 62' },
  { k: 'Datos', t: 'Tu información no se usa para entrenar IA', d: 'Solo herramientas con contrato empresarial que lo prohíbe, y una ficha aislada por cliente.', ref: 'Arts. 14, 15 y 18' },
  { k: 'Opción', t: 'Puedes pedir el servicio sin IA', d: 'Te informamos el precio y el plazo antes de contratar. El consentimiento sobre IA es expreso y se da con una casilla propia.', ref: 'Arts. 29, 44 y 45' },
];

// Siete principios rectores (art. 6)
export const PRINCIPIOS = [
  ['Responsabilidad indelegable', 'El abogado responsable responde personalmente por cada entregable, haya o no usado IA.'],
  ['Verificación antes de confiar', 'Nada de lo que produce la IA se da por cierto: toda cita, dato y conclusión se comprueba.'],
  ['Secreto profesional primero', 'La información del cliente solo entra a sistemas con salvaguardas contractuales y técnicas aprobadas.'],
  ['Transparencia con el cliente', 'El cliente sabe, antes de contratar, qué sistema se usa, qué riesgos tiene y que puede optar por un servicio sin IA.'],
  ['Separación por cliente', 'El contexto de un cliente nunca se mezcla con el de otro.'],
  ['Veracidad comercial', 'Solo se promete lo que el estudio mide y cumple.'],
  ['Trazabilidad', 'Si no está registrado, no se hizo.'],
];

// Cinco límites absolutos (arts. 12 a 16): no admiten excepción, ni con autorización del cliente
export const LIMITES = [
  { art: 12, t: 'Nada se entrega sin revisión', d: 'Ningún borrador de IA sale del estudio sin registro de revisión completo y firma del abogado responsable.' },
  { art: 13, t: 'Nada se cita sin verificar', d: 'Ninguna norma, fallo o doctrina se cita sin leerla en su fuente oficial. Lo que no se puede verificar se elimina.' },
  { art: 14, t: 'Solo sistemas autorizados', d: 'Ninguna información de clientes entra en cuentas personales, gratuitas o no autorizadas.' },
  { art: 15, t: 'Nunca se mezclan clientes', d: 'No se usa información de un cliente en el encargo de otro, ni se activa memoria compartida.' },
  { art: 16, t: 'Siempre decide una persona', d: 'Ninguna decisión con efectos jurídicos la toma la IA sola, y ningún bot simula ser una persona.' },
];

// Usos permitidos de la IA (art. 10)
export const USOS_IA = ['Preparar primeros borradores', 'Resumir y ordenar documentos', 'Proponer cláusulas desde la biblioteca aprobada del estudio', 'Asistir búsquedas, incluida la de anterioridad de marcas', 'Revisar coherencia, ortografía y numeración', 'Tareas administrativas sin datos sustantivos de clientes'];
export const USOS_ABOGADO = ['Verifica cada cita en su fuente oficial', 'Coteja datos, partes, montos y fechas con los documentos', 'Lee el entregable completo en su versión final', 'Decide, firma y responde por lo que se entrega', 'Te explica el resultado, sus riesgos y alternativas', 'Calcula y registra los plazos judiciales y de INAPI'];

// Flujo del encargo (art. 22): nueve etapas, dos desvíos
export const FLUJO = [
  { n: 1, t: 'Ingreso', s: 'El bot se identifica', d: 'Recibimos tu consulta por el sitio, correo o WhatsApp. Si te atiende un asistente automatizado, se presenta como tal. Solo pedimos lo necesario para cotizar.', who: 'Asistente' },
  { n: 2, t: 'Conflictos', s: 'Si hay conflicto, no se acepta', d: 'Cruzamos tu nombre y el de las contrapartes con nuestra base de clientes actuales y anteriores.', who: 'Abogado responsable' },
  { n: 3, t: 'Cotización', s: 'Precio y alcance', d: 'Precio fijo con alcance cerrado. Te informamos por escrito lo que incluye y lo que no.', who: 'Abogado responsable' },
  { n: 4, t: 'Contratación', s: 'Consentimiento sobre IA', d: 'Carta de encargo, aceptación separada de la cláusula de IA con casilla propia y opción de servicio sin IA.', who: 'Asistente' },
  { n: 5, t: 'Apertura', s: 'Ficha aislada', d: 'Abrimos una ficha solo para tu encargo, asignamos al abogado y registramos los plazos en una agenda llevada por dos personas.', who: 'Asistente y abogado' },
  { n: 6, t: 'Borrador IA', s: 'Sistemas aprobados', d: 'La IA prepara un primer borrador, solo dentro de tu ficha y con sistemas autorizados. Si elegiste servicio sin IA, esta etapa no ocurre.', who: 'Abogado', ai: true },
  { n: 7, t: 'Verificación', s: 'Checklist y registro', d: 'El abogado verifica cada cita en su fuente oficial y completa el checklist. Si falla un ítem, el encargo vuelve al borrador.', who: 'Abogado responsable', key: true },
  { n: 8, t: 'Firma y entrega', s: 'Lectura completa', d: 'Te explicamos el resultado, sus riesgos y alternativas. El abogado lee el documento completo y lo firma.', who: 'Abogado responsable', key: true },
  { n: 9, t: 'Cierre', s: 'Archivo y borrado de IA', d: 'Archivamos el expediente y borramos la memoria de IA de tu ficha.', who: 'Asistente y socio de cumplimiento' },
];

// Protocolo de verificación (art. 23)
export const CHECKLIST = [
  'Datos del cliente, partes, RUT, montos y fechas cotejados con documentos fuente',
  'Cada norma citada abierta en LeyChile, en la versión vigente a la fecha',
  'Cada fallo citado abierto en el Poder Judicial u otra fuente oficial, con rol, fecha y pasaje literal',
  'Cada cita doctrinaria verificada en la obra; si no se puede, se elimina',
  'Ninguna información de otro cliente',
  'Coherencia interna: definiciones, numeración y remisiones',
  'Registro completo: versión IA, versión final, cambios, revisor, fecha y hora',
];

// Requisitos mínimos de un proveedor de IA (art. 18)
export const PROVEEDOR = [
  'Prohibición de usar los datos para entrenar o mejorar modelos',
  'Retención cero o mínima, con plazo escrito y borrado a pedido',
  'Revisión humana del proveedor limitada y documentada',
  'Ubicación de los datos y lista de subprocesadores, con aviso de cambios',
  'Cifrado en tránsito y en reposo; inicio de sesión con doble factor',
  'Notificación de brechas en un plazo definido',
  'Política ante requerimientos de autoridades extranjeras',
  'Cláusulas de encargo de tratamiento y de transferencia internacional',
  'Exportación y borrado certificado al terminar',
  'Certificación de seguridad verificable',
];

// Rutina de control (art. 62)
export const CONTROL = [
  ['Cada entrega', 'Registro de revisión completo antes de firmar', 'Abogado responsable'],
  ['Semanal', 'Agenda de plazos cotejada por dos personas', 'Asistente y socio de línea'],
  ['Mensual', 'Registro de incidentes y cumplimiento de plazos publicados', 'Socio de cumplimiento'],
  ['Trimestral', 'Auditoría de 20 entregables al azar contra el protocolo de verificación', 'Un socio que no firmó esos entregables'],
  ['Anual', 'Contratos de proveedores, biblioteca de modelos y reglamento', 'Socio de cumplimiento y socios'],
];

// Marco que respeta el método (anexo del reglamento)
export const MARCO = [
  ['Código Civil', 'El mandatario remunerado responde de su diligencia; el estándar con IA es el mismo que sin ella.'],
  ['Código de Ética Profesional', 'Confidencialidad, supervisión de colaboradores, información al cliente y publicidad veraz.'],
  ['Guía del Colegio de Abogados sobre IA', 'Responsabilidad personal e indelegable, consentimiento expreso e informado y verificación de toda cita (6 de julio de 2026).'],
  ['Ley 19.628, reformada por la Ley 21.719', 'Protección de datos personales, encargados de tratamiento y derecho a no ser objeto de decisiones automatizadas. Vigente desde el 1 de diciembre de 2026.'],
];

// Tarifario del 4-oct-2026, solo servicios activos, con los ajustes del reglamento (arts. 30, 46, 47, 54)
export const LINEAS = [
  { id: 'marcas', nombre: 'Marcas', bajada: 'Te decimos el riesgo antes de que pagues las tasas.' },
  { id: 'corporativo', nombre: 'Corporativo pyme', bajada: 'Tu empresa constituida, ordenada y con contratos revisados.' },
  { id: 'litigios', nombre: 'Litigios y cobranza', bajada: 'Cobrar lo que te deben, con un plan de causa claro.' },
  { id: 'suscripcion', nombre: 'Abogado de tu Pyme', bajada: 'Asesoría mensual con alcance definido por escrito.' },
];

const H = 'desde que recibimos la información completa';
export const SERVICIOS = [
  { linea: 'marcas', nombre: 'Diagnóstico de marca', precio: 29990, modo: 'Precio fijo', plazo: `24 horas hábiles ${H}`, desc: 'Búsqueda de anterioridades en INAPI revisada por un abogado e informe de riesgo bajo, medio o alto, con clases recomendadas.', incluye: ['Búsqueda de marcas idénticas, fonéticamente y conceptualmente similares, y clases conexas', 'Informe escrito: qué se buscó, en qué clases, en qué fecha y con qué límites', 'Calificación del riesgo y recomendación de clases'], nota: 'Se descuenta si contratas el registro. Nunca calificamos una marca de "registrable".', destacado: true },
  { linea: 'marcas', nombre: 'Marca protegida (1 clase)', precio: 100000, tasas: true, modo: 'Precio fijo', plazo: `Presentación en 48 horas hábiles ${H}`, desc: 'Solicitud de registro de marca ante INAPI y seguimiento hasta su resolución.', incluye: ['Solicitud ante INAPI', 'Seguimiento del trámite', 'Respuesta a observaciones de forma'], nota: 'Tasas INAPI aparte: 3 UTM por clase (1 al presentar y 2 al aceptarse el registro) más publicación en el Diario Oficial.' },
  { linea: 'marcas', nombre: 'Vigilancia de marca', precio: 10000, mensual: true, modo: 'Mensual', plazo: 'Reporte mensual', desc: 'Alertas de solicitudes similares y aviso de renovaciones.', incluye: ['Reporte mensual de solicitudes similares', 'Cada alerta la evalúa un abogado'] },
  { linea: 'corporativo', nombre: 'Empresa lista (RES)', precio: 119000, modo: 'Precio fijo', plazo: `72 horas hábiles ${H}`, desc: 'Constitución en el Registro de Empresas y Sociedades con estatutos a medida.', incluye: ['Estatutos', 'Constitución en el RES', 'Inicio de actividades'] },
  { linea: 'corporativo', nombre: 'Pack Empresa + Marca', precio: 189000, tasas: true, modo: 'Precio fijo', plazo: `72 horas hábiles ${H}`, desc: 'Constitución de la empresa y registro de su marca en una clase.', incluye: ['Empresa lista (RES)', 'Marca protegida (1 clase)'], nota: 'Tasas INAPI aparte.', destacado: true },
  { linea: 'corporativo', nombre: 'Pacto de socios', precio: 100000, modo: 'Precio fijo', plazo: `5 días hábiles ${H}`, desc: 'Pacto de accionistas coherente con los estatutos, con reglas de mayorías, salida y resolución de conflictos explicadas.', incluye: ['Redacción', 'Dos rondas de ajustes', 'Doble revisión de abogados'] },
  { linea: 'corporativo', nombre: 'Contrato comercial: revisión', precio: 85000, modo: 'Precio fijo', plazo: `24 a 48 horas hábiles ${H}`, desc: 'Revisión de un contrato comercial con comentarios y propuesta de cambios.', incluye: ['Informe', 'Versión con cambios marcados'] },
  { linea: 'corporativo', nombre: 'Contrato comercial: redacción', precio: 100000, desde: true, modo: 'Desde', plazo: `24 a 48 horas hábiles ${H}`, desc: 'Redacción de un contrato comercial a medida.', incluye: ['Borrador', 'Una ronda de ajustes'] },
  { linea: 'litigios', nombre: 'Carta de cobro y negociación', precio: 39000, modo: 'Precio fijo', plazo: `24 horas hábiles ${H}`, desc: 'Carta de abogado dirigida al deudor, revisada en monto, intereses, título y tono antes de enviarse.', incluye: ['Carta de cobro'] },
  { linea: 'litigios', nombre: 'Cobranza judicial', precio: 300000, tasas: true, exito: true, modo: 'Fijo + % de éxito', plazo: `Presentación en 5 días hábiles ${H}`, desc: 'Demanda ejecutiva o monitoria según el título, con tramitación hasta sentencia.', incluye: ['Demanda', 'Tramitación hasta sentencia', 'Revisión y firma de un socio patrocinante'], nota: 'Más 10% de lo recuperado. La base de cálculo y el momento de pago se pactan por escrito antes de iniciar.' },
  { linea: 'litigios', nombre: 'Precario (Ley Devuélveme mi Casa) o cobro de rentas', precio: 300000, desde: true, tasas: true, modo: 'Desde', plazo: `Plan de causa en 72 horas hábiles ${H}`, desc: 'Procedimiento monitorio. Si la causa pasa a juicio sumario, $200.000 adicionales.', incluye: ['Plan de causa', 'Cotización fija por etapa'] },
  { linea: 'litigios', nombre: 'Civil en general', cotizacion: true, tasas: true, modo: 'Por etapa', plazo: 'Según la causa', desc: 'Juicios sumarios, ordinarios y otros procedimientos civiles.', incluye: ['Cotización fija por etapa antes de iniciar', 'Riesgos, costos y alternativas informados por escrito'] },
];

export const PLANES = [
  { nombre: 'Esencial', precio: 49000, items: ['Consultas por chat: hasta 3 por día hábil', '3 revisiones de contrato al mes', 'Vigilancia de 1 marca'] },
  { nombre: 'Pyme', precio: 119000, destacado: true, items: ['Todo lo de Esencial', '5 contratos al mes', 'Actas y juntas', '15% de descuento en marcas y litigios'] },
  { nombre: 'Crecimiento', precio: 249000, items: ['Todo lo de Pyme', 'Hasta 10 contratos simples al mes', 'Abogado asignado', 'Reunión mensual'] },
];
export const PLANES_REGLAS = {
  respuesta: 'Respuesta en 24 horas hábiles',
  definiciones: [
    ['Consulta', 'Una pregunta sobre un solo tema que se responde por escrito, sin redactar documentos ni revisar más de 5 páginas. Lo que exceda se cotiza aparte.'],
    ['Contrato simple', 'Contrato basado en un modelo de la biblioteca del estudio, de hasta 10 páginas, entre dos partes, sin negociación con la contraparte y con una ronda de ajustes. Por ejemplo: NDA, prestación de servicios, arriendo comercial simple, compraventa de bienes muebles o mandato.'],
    ['Sin acumulación', 'Las consultas y documentos no usados no pasan al mes siguiente.'],
  ],
  excluido: 'Escritos judiciales, oposiciones ante INAPI, contratos con negociación, due diligence y asuntos laborales.',
  baja: 'Te das de baja por el mismo medio en que contrataste, sin barreras, con efecto al fin del período pagado.',
};
