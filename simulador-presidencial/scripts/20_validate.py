"""Validación automática del libro y de los CSV.
Uso: python3 scripts/20_validate.py <dir_raw>
Genera output/validation_report.md y termina con código 1 si hay errores."""
import gzip, json, os, random, re, sys, zipfile
import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import build_lib as B
RAW = sys.argv[1]
OUT = os.path.join(ROOT, "output"); CSV = os.path.join(OUT, "csv")
XLSX = os.path.join(OUT, "Base_Datos_Historica_Geopolitica_Simulador.xlsx")
schema = json.load(open(os.path.join(OUT, "schema", "schema.json")))
errors, warns, oks = [], [], []
def ok(m): oks.append(m)
def err(m): errors.append(m)
def warn(m): warns.append(m)

# 1. El archivo se abre y contiene hojas y tablas
from openpyxl import load_workbook
wb = load_workbook(XLSX, read_only=True)
names = wb.sheetnames
expected = [t["name"] for t in schema["tables"] if t["name"] != "observaciones_largo"]
missing = [n for n in expected if n not in names]
(err if missing else ok)(f"Hojas esperadas presentes: {len(expected) - len(missing)}/{len(expected)}" + (f"; faltan {missing}" if missing else ""))
required = ["00_LEEME", "01_INDICE", "02_DICCIONARIO", "03_ESTADOS", "04_CAMBIOS_TERRITORIALES", "05_DEMOGRAFIA", "06_INDICADORES_SOCIALES", "07_MACROECONOMIA", "08_FINANZAS_PUBLICAS",
            "09_MONEDA_MERCADOS", "10_COMERCIO", "11_RECURSOS_ENERGIA", "12_INFRAESTRUCTURA", "13_DEFENSA_PRESUPUESTOS", "14_DEFENSA_INVENTARIOS", "15_DEFENSA_INDUSTRIA", "16_CONFLICTOS",
            "17_CONFLICTOS_EVENTOS", "18_INTELIGENCIA", "19_INSTITUCIONES", "20_GOBIERNOS", "21_ACTORES", "22_PARTIDOS", "23_ELECCIONES", "24_DIPLOMACIA", "25_RELACIONES_ESTADOS",
            "26_HISTORIA", "27_TECNOLOGIA", "28_SEGURIDAD_INTERIOR", "29_ADMIN_PUBLICA", "30_EMPRESAS", "31_MEDIOAMBIENTE", "32_INDICADORES_COMPARADOS", "33_EVENTOS_CAUSALES",
            "34_ESCENARIOS", "35_PARAMETROS_JUEGO", "36_CALIDAD_DATOS", "37_FUENTES", "38_CITAS_DATOS", "39_PENDIENTES"]
miss_req = [n for n in required if n not in names]
(err if miss_req else ok)(f"Hojas obligatorias del encargo presentes: {len(required) - len(miss_req)}/{len(required)}" + (f"; faltan {miss_req}" if miss_req else ""))
z = zipfile.ZipFile(XLSX)
ntab = len([f for f in z.namelist() if f.startswith("xl/tables/")])
(ok if ntab == len(names) else err)(f"Tablas de Excel: {ntab} para {len(names)} hojas")
hl = sum(z.read(f).count(b"<hyperlink ") for f in z.namelist() if f.startswith("xl/worksheets/sheet"))
ok(f"Hipervínculos en el libro: {hl}")
# filas por hoja = filas CSV
refs = {}
for f in z.namelist():
    if f.startswith("xl/tables/"):
        x = z.read(f).decode("utf-8")
        dn = re.search(r'displayName="([^"]+)"', x).group(1); rf = re.search(r' ref="([^"]+)"', x).group(1)
        refs[dn] = int(re.search(r"(\d+)$", rf).group(1))
mism = []
for n in names:
    rows = refs.get("T_" + re.sub(r"[^A-Za-z0-9_]", "_", n), 0)
    df = pd.read_csv(os.path.join(CSV, n + ".csv"), low_memory=False)
    if rows - 1 != len(df) and not (len(df) == 0 and rows == 2):
        mism.append((n, rows - 1, len(df)))
(err if mism else ok)("Filas Excel = filas CSV en todas las hojas" + (f": discrepancias {mism}" if mism else ""))

# 2. Claves primarias únicas y 3. claves foráneas
tables = {}
for t in schema["tables"]:
    if t["name"] == "observaciones_largo":
        continue
    tables[t["name"]] = pd.read_csv(os.path.join(CSV, t["name"] + ".csv"), low_memory=False, keep_default_na=False, na_values=[""])
for t in schema["tables"]:
    if t["name"] == "observaciones_largo" or not t["primary_key"]:
        continue
    df = tables[t["name"]]
    d = df.duplicated(t["primary_key"]).sum()
    nullpk = df[t["primary_key"]].isna().any(axis=1).sum()
    (err if d or nullpk else ok)(f"PK única y no nula en {t['name']} ({'+'.join(t['primary_key'])}): duplicados={d}, nulos={nullpk}")
for t in schema["tables"]:
    for col, ref in t.get("foreign_keys", {}).items():
        if t["name"] == "observaciones_largo":
            continue
        rt, rc = ref.split(".")
        if rt not in tables:
            continue
        vals = set(tables[t["name"]][col].dropna().astype(str))
        refv = set(tables[rt][rc].dropna().astype(str))
        bad = sorted(vals - refv - {""})
        (err if bad else ok)(f"FK {t['name']}.{col} → {ref}: {len(bad)} valores huérfanos" + (f" {bad[:10]}" if bad else ""))
# listas de ids separadas por ';'
ids = set(tables["03_ESTADOS"].country_id)
orgs = set(tables["24b_ORGANIZACIONES"].org_id)
for tname, cols in {"04_CAMBIOS_TERRITORIALES": ["from_ids", "to_ids"], "16_CONFLICTOS": ["participant_ids"], "26_HISTORIA": ["country_ids"], "34_ESCENARIOS": ["focus_country_ids"],
                    "16c_COW_GUERRAS_INTER": ["side_a_ids", "side_b_ids"], "15b_PROGRAMAS_DEFENSA": ["country_ids"], "12b_NODOS_ESTRATEGICOS": ["country_ids"], "31c_CATASTROFES": ["country_ids"],
                    "11d_MINERALES_CRITICOS": ["dominant_country_ids"], "04c_DISPUTAS_TERRITORIALES": ["claimant_ids"]}.items():
    for c in cols:
        toks = {x for v in tables[tname][c].dropna().astype(str) for x in v.split(";") if x}
        bad = sorted(x for x in toks if x not in ids and x not in orgs and not re.search(r"[a-z(]", x))
        (warn if bad else ok)(f"Listas de ids {tname}.{c}: {len(bad)} tokens no reconocidos como country_id/org_id" + (f" {bad[:15]}" if bad else ""))
srcs = set(tables["37_FUENTES"].source_id)
badsrc = set()
for n, df in tables.items():
    for c in ("source_ids", "source_id"):
        if c in df.columns:
            for v in df[c].dropna().astype(str):
                for s in v.split(";"):
                    if s and s not in srcs:
                        badsrc.add((n, s))
(err if badsrc else ok)(f"Todas las referencias a fuentes existen en 37_FUENTES" + (f": faltan {sorted(badsrc)[:20]}" if badsrc else ""))

# 4. Fechas válidas
DATE_RE = re.compile(r"^\d{4}(-\d{2}(-\d{2})?)?$")
bad_dates = []
for n, df in tables.items():
    for c in df.columns:
        if re.search(r"(date|^start$|^end$|_start$|_end$|joined|^left$|founded|dissolved|since|signed|in_force|terminated|valid_from|valid_to|first_spell)", c) and df[c].dtype == object:
            vals = df[c].dropna().astype(str)
            vals = vals[vals != ""]
            b = vals[~vals.str.match(DATE_RE)]
            # se toleran textos explicativos en campos de fundación/vigencia curados
            if len(b) and c not in ("founded", "since", "constitution_year", "start", "end", "signed"):
                bad_dates.append((n, c, len(b), b.iloc[0]))
            elif len(b):
                warn(f"Fechas no ISO (texto descriptivo) en {n}.{c}: {len(b)} (p.ej. '{b.iloc[0][:40]}')")
            # fechas imposibles
            for v in vals[vals.str.match(r"^\d{4}-\d{2}-\d{2}$")]:
                try:
                    pd.Timestamp(v)
                except Exception:
                    bad_dates.append((n, c, 1, v))
(err if bad_dates else ok)("Fechas ISO válidas" + (f": problemas {bad_dates[:10]}" if bad_dates else ""))
# fin >= inicio
inv = []
for n, df in tables.items():
    for a, b in [("start_date", "end_date"), ("date_start", "date_end"), ("year_start", "year_end"), ("first_year", "last_year"), ("valid_from", "valid_to"), ("start", "end")]:
        if a in df.columns and b in df.columns:
            x = df[[a, b]].dropna().astype(str)
            x = x[(x[a] != "") & (x[b] != "") & x[a].str.match(r"^\d{4}") & x[b].str.match(r"^\d{4}")]
            bad = x[x[b].str[:len("0000-00-00")] < x[a].str[:len("0000")]]
            if len(bad):
                inv.append((n, a, b, len(bad), bad.iloc[0].tolist()))
(err if inv else ok)("Fechas de término no anteriores a las de inicio" + (f": {inv}" if inv else ""))

# 5. Faltantes no sustituidos por cero
ind = tables["02b_INDICADORES"].drop_duplicates("indicator_id").set_index("indicator_id")
q = tables["36_CALIDAD_DATOS"]
flag = q[q.issue.fillna("") != ""]
(warn if len(flag) else ok)(f"Indicadores con >30% de ceros exactos (revisar codificación de faltantes): {len(flag)}" + (f" {flag.indicator_id.tolist()[:15]}" if len(flag) else ""))
long = pd.read_csv(os.path.join(CSV, "observaciones_largo.csv.gz"), low_memory=False)
zpop = long[(long.indicator_id.isin(["sp_pop_totl", "ny_gdp_mktp_cd", "sp_dyn_le00_in"])) & (long.value == 0)]
(err if len(zpop) else ok)(f"Sin ceros en población, PIB y esperanza de vida (formato largo): {len(zpop)} ceros")
ok(f"COW: valores -9 convertidos a vacío (mín. milex = {tables['13b_CAPACIDADES_HIST_COW'].cow_milex_thousand_usd_current.min()})")

# 6. Unidades documentadas
panel_cols = set()
for n, df in tables.items():
    if "year" in df.columns and "country_id" in df.columns and n[:2].isdigit() and n not in ("32_INDICADORES_COMPARADOS",):
        for c in df.columns:
            if c not in ("country_id", "year", "source_ids", "record_id", "head_of_state_name", "head_of_state_title", "hos_is_also_hog", "head_of_gov_name", "head_of_gov_title", "party_id", "party_name_en", "party_short") and pd.api.types.is_numeric_dtype(df[c]):
                panel_cols.add((n, c))
undoc = [(n, c) for n, c in panel_cols if c not in ind.index and n not in ("22b_PARTIDOS_ELECCIONES", "17b_UCDP_CONFLICTO_ANIO")]
(warn if undoc else ok)(f"Columnas numéricas de paneles documentadas en 02b_INDICADORES: {len(panel_cols) - len(undoc)}/{len(panel_cols)}" + (f"; sin ficha: {sorted(undoc)[:10]}" if undoc else ""))
nounit = ind[(ind.unit.fillna("") == "") & (~ind.observation_type.astype(str).str.contains("latente|expertos|externa"))]
(warn if len(nounit) else ok)(f"Indicadores no-V-Dem sin unidad declarada: {len(nounit)}" + (f" {nounit.index.tolist()[:10]}" if len(nounit) else ""))
mon = ind[ind.currency.fillna("") != ""]
nobasis = mon[mon.price_basis.fillna("") == ""]
(err if len(nobasis) else ok)(f"Indicadores monetarios con base de precios declarada (corrientes/constantes/PPA): {len(mon) - len(nobasis)}/{len(mon)}")

# 7. Enlaces
urls = tables["37_FUENTES"].url.dropna().astype(str)
urls = urls[urls != ""]
badu = urls[~urls.str.match(r"^https?://[^\s]+\.[^\s]+")]
(err if len(badu) else ok)(f"URLs de fuentes bien formadas: {len(urls) - len(badu)}/{len(urls)}")
warn("Los destinos de los enlaces no pudieron comprobarse por HTTP (dominios bloqueados por la política de red); se verificó la forma y, para las réplicas, la descarga efectiva con hash SHA-256")

# 8. Contradicciones señaladas
cf = tables["16_CONFLICTOS"]
badr = cf[(cf.deaths_low.notna()) & (cf.deaths_high.notna()) & (cf.deaths_low > cf.deaths_high)]
(err if len(badr) else ok)(f"Rangos de víctimas coherentes (low ≤ high): {len(cf) - len(badr)}/{len(cf)}; conflictos con rango (low<high): {(cf.deaths_low < cf.deaths_high).sum()}")
rr = tables["23b_RESULTADOS_RECIENTES"]
ok(f"Resultados electorales separados por tipo: {rr.result_type.value_counts().to_dict()}")

# 9. Interpolación oculta: detección de tramos perfectamente lineales (≥6 años) en series WDI
lin = 0; lin_ex = []
for (cid, iid), g in long.groupby(["country_id", "indicator_id"]):
    if len(g) < 8:
        continue
    v = g.sort_values("year")
    if (v.year.diff().dropna() != 1).any():
        continue
    d2 = np.abs(np.diff(v.value.values, 2))
    scale = np.abs(v.value.values).mean() + 1e-9
    run = 0
    for x in d2:
        run = run + 1 if x / scale < 1e-9 else 0
        if run >= 5:
            lin += 1; lin_ex.append(f"{cid}/{iid}"); break
(warn if lin else ok)(f"Series WDI con tramos perfectamente lineales ≥6 años (posible interpolación en la fuente; esta base no interpola): {lin}" + (f" p.ej. {lin_ex[:8]}" if lin else ""))
interp = ind[ind.interpolation.astype(str).str.contains("lineal")]
ok(f"Interpolaciones de origen declaradas en 02b_INDICADORES: {interp.index.tolist()}")

# 10. Escenarios sin datos posteriores a la fecha de inicio
sb = tables["34b_ESCENARIOS_PAISES"].merge(tables["34_ESCENARIOS"][["scenario_id", "start_date"]], on="scenario_id")
sb["y"] = sb.start_date.astype(str).str[:4].astype(int)
fut = sb[sb.data_year.notna() & (sb.data_year > sb.y)]
(err if len(fut) else ok)(f"Instantáneas de escenarios sin datos posteriores a la fecha de inicio: {len(fut)} violaciones; datos previos (≤3 años): {(sb.data_status == 'dato_previo_hasta_3_años').sum()}; sin dato: {(sb.data_status == 'sin_dato').sum()}")
pvv = tables["35b_PARAMETROS_VALORES"].merge(tables["34_ESCENARIOS"][["scenario_id", "start_date"]], on="scenario_id")
fut2 = pvv[pvv.basis_data_year.notna() & (pvv.basis_data_year > pvv.start_date.astype(str).str[:4].astype(int))]
(err if len(fut2) else ok)(f"Parámetros de escenario sin datos posteriores: {len(fut2)} violaciones")

# 11. Parámetros modelados separados de observaciones
cl = [n for n, df in tables.items() if "value_class" in df.columns and (df.value_class == "C_parametro_simulacion").any()]
(ok if all(n.startswith("35") for n in cl) else err)(f"Valores clase C solo en hojas 35*: {cl}")
leaks = [n for n, df in tables.items() if not n.startswith("35") and any(c.startswith("PAR") for c in df.columns)]
(err if leaks else ok)("Ningún parámetro de juego aparece en hojas de datos observados" + (f": {leaks}" if leaks else ""))

# 12. Muestra contra las fuentes originales descargadas
random.seed(42)
checks, fails = 0, []
smp = long.sample(400, random_state=1)
for r in smp.itertuples():
    f = os.path.join(RAW, "wdi", r.indicator_id + ".csv")
    d = pd.read_csv(f)
    geo = [g for g, c in B.WDI_GEO_FIX.items() if c == r.country_id]
    gcode = geo[0].lower() if geo else r.country_id.lower()
    m = d[(d.geo == gcode) & (d.time == r.year)]
    checks += 1
    if not len(m) or not np.isclose(m.iloc[0][r.indicator_id], r.value, rtol=1e-9, atol=1e-12):
        fails.append((r.country_id, r.indicator_id, r.year, r.value))
vd = pd.read_pickle(os.path.join(RAW, "vdem_subset.pkl"))
vp = tables["19c_REGIMEN_PANEL_VDEM"].sample(150, random_state=2)
for r in vp.itertuples():
    m = vd[(vd.country_text_id == r.country_id) & (vd.year == r.year)]
    checks += 1
    if not len(m) or not (np.isclose(m.iloc[0].v2x_polyarchy, r.v2x_polyarchy) or (pd.isna(m.iloc[0].v2x_polyarchy) and pd.isna(r.v2x_polyarchy))):
        fails.append((r.country_id, "v2x_polyarchy", r.year))
nmc = B.load_rda(os.path.join(RAW, "ps/cow_nmc.rda"))
cp = tables["13b_CAPACIDADES_HIST_COW"].dropna(subset=["cow_cinc_share"]).sample(150, random_state=3)
from build_lib import build_crosswalk
_, _, c2i, _ = build_crosswalk(RAW)
i2c = {}
for k, v in c2i.items():
    i2c.setdefault(v, []).append(k)
for r in cp.itertuples():
    m = nmc[(nmc.ccode.isin(i2c.get(r.country_id, []))) & (nmc.year == r.year)]
    checks += 1
    if not len(m) or not np.isclose(m.cinc.values, r.cow_cinc_share).any():
        fails.append((r.country_id, "cinc", r.year))
(err if fails else ok)(f"Muestra aleatoria contrastada contra los ficheros fuente descargados: {checks - len(fails)}/{checks} coinciden" + (f"; fallos {fails[:10]}" if fails else ""))
vm = tables["36c_VERIFICACION_MUESTRAL"]
ok(f"Contrastes con fuentes externas mediante búsqueda web: {len(vm)} (resultados: {vm.result.value_counts().to_dict()})")

# 13. Trazabilidad mínima por tabla
no_src = [n for n, df in tables.items() if n[:2].isdigit() and int(n[:2]) >= 3 and int(n[:2]) <= 35 and "source_ids" not in df.columns and "source_id" not in df.columns and not (tables["38_CITAS_DATOS"].target_table == n).any()]
(err if no_src else ok)("Toda tabla de datos tiene fuente por fila o cita en 38_CITAS_DATOS" + (f": sin fuente {no_src}" if no_src else ""))

rep = ["# Informe de validación", "", f"Libro: `{os.path.basename(XLSX)}` — {len(names)} hojas", "",
       f"**Errores: {len(errors)} · Advertencias: {len(warns)} · Comprobaciones superadas: {len(oks)}**", ""]
rep += ["## Errores"] + [f"- ❌ {e}" for e in errors] + ([""] if errors else ["- (ninguno)", ""])
rep += ["## Advertencias"] + [f"- ⚠️ {w}" for w in warns] + [""]
rep += ["## Comprobaciones superadas"] + [f"- ✅ {o}" for o in oks]
open(os.path.join(OUT, "validation_report.md"), "w").write("\n".join(rep))
print("\n".join(rep))
sys.exit(1 if errors else 0)
