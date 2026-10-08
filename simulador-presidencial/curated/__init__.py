"""Tablas curadas manualmente por el equipo de investigación.

Convenciones comunes:
- verification_status:
    VERIF_SESION  -> cifra/hecho contrastado durante la sesión de construcción con búsqueda web (ver nota).
    CONOC_EXPERTO -> hecho histórico ampliamente documentado compilado por el equipo a partir de la
                     historiografía de referencia citada en source_ids; NO se contrastó línea a línea contra
                     la fuente durante la construcción. Requiere verificación antes de usos críticos.
    DATASET       -> derivado directamente de un conjunto de datos descargado.
- certainty / confidence: Alta | Media | Baja (ver 02_DICCIONARIO).
- Fechas ISO 8601 (AAAA-MM-DD; si sólo se conoce el año, AAAA o AAAA-MM).
"""
