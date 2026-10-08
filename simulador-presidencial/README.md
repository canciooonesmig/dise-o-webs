# Base de datos histórica, económica, militar y geopolítica para un simulador presidencial

Entregable principal: **`output/Base_Datos_Historica_Geopolitica_Simulador.xlsx`**

| Ruta | Contenido |
|---|---|
| `output/Base_Datos_Historica_Geopolitica_Simulador.xlsx` | Libro con todas las hojas (tablas de Excel con filtros, cabecera inmovilizada, validaciones, formato condicional, hipervínculos) |
| `output/csv/*.csv` | Una tabla CSV UTF-8 por hoja (mismo contenido) |
| `output/csv/observaciones_largo.csv.gz` | Todas las observaciones WDI en formato largo con metadatos completos por registro |
| `output/schema/schema.json` | Esquema: columnas, tipos, claves primarias y foráneas |
| `output/validation_report.md` | Resultado de la validación automática |
| `curated/*.py` | Tablas curadas manualmente (conflictos, tratados, inteligencia, instituciones, historia, causalidad, escenarios…) |
| `scripts/` | Descarga reproducible, construcción, validación y exportación a SQLite |

## Reconstrucción

```bash
RAW=/ruta/a/datos_brutos
python3 scripts/02_download_sources.py $RAW     # réplicas de V-Dem, COW, UCDP, Archigos, REIGN, OWID...
python3 scripts/03_vdem_subset.py $RAW          # subconjunto de columnas V-Dem
python3 scripts/01_download_wdi.py $RAW         # indicadores WDI
python3 scripts/10_build.py $RAW                # construye el libro, CSV y esquema
python3 scripts/20_validate.py $RAW             # validación (informe en output/validation_report.md)
python3 scripts/30_export_sqlite.py             # opcional: base SQLite
```

Dependencias: `pandas`, `openpyxl`, `pyreadr`, `rdata`.


## Principios

* Datos **observados** (A), **estimaciones** (B) y **parámetros de simulación** (C) separados (`observation_type`, hojas `35_*`).
* Celda vacía = sin dato; nunca se imputan ceros ni se interpola.
* Trazabilidad: `37_FUENTES` (con URL de la réplica descargada y hash SHA-256) y `38_CITAS_DATOS` (columna/registro → fuente).
* Los registros curados indican `verification_status` (`VERIF_SESION`, `CONOC_EXPERTO`, `DATASET`).

Consulte la hoja `00_LEEME` para la metodología completa y `36_CALIDAD_DATOS` / `39_PENDIENTES` para limitaciones.
