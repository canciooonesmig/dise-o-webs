"""Construye Base_Datos_Historica_Geopolitica_Simulador.xlsx y los CSV complementarios.
Uso: python3 scripts/10_build.py <dir_raw>
"""
import gzip, json, os, re, sys, hashlib
import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, ROOT)
import build_lib as B
from curated import sources_curated, geo, conflicts, intel, diplomacy, institutions, history, defense, economy, causal, scenarios, elections_actors

RAW = sys.argv[1]
OUT = os.path.join(ROOT, "output")
CSV = os.path.join(OUT, "csv")
os.makedirs(CSV, exist_ok=True)
XLSX = os.path.join(OUT, "Base_Datos_Historica_Geopolitica_Simulador.xlsx")
P = lambda *a: os.path.join(RAW, *a)
TODAY = B.BUILD_DATE

master, ext_ids, COW2ID, GW2ID = B.build_crosswalk(RAW)
IDS = set(master.country_id)
cow_id = lambda c: COW2ID.get(int(c), "") if pd.notna(c) and c not in (-8, -9) else ""
gw_id = lambda c: GW2ID.get(int(c), COW2ID.get(int(c), "")) if pd.notna(c) and c not in (-8, -9) else ""

TABLES = []      # (orden) dict(name, df, desc, category, status, pk, fks, sources, notes)
CITES = []       # filas para 38_CITAS_DATOS
INDICATORS = []  # filas para 02b_INDICADORES
DICT = []        # filas para 02_DICCIONARIO


def add(name, df, desc, category, status, pk=None, fks=None, sources="", notes="", required=(), freeze_col=False):
    df = df.copy()
    for c in df.columns:
        if df[c].dtype == object:
            df[c] = df[c].map(lambda v: "" if v is None or (isinstance(v, float) and np.isnan(v)) else (B.ILLEGAL_CHARACTERS_RE.sub("", v).strip() if isinstance(v, str) else v))
    TABLES.append(dict(name=name, df=df, desc=desc, category=category, status=status, pk=pk or [], fks=fks or {},
                       sources=sources, notes=notes, required_cols=list(required), freeze_col=freeze_col))


def tup(rows, cols):
    return pd.DataFrame([list(r) for r in rows], columns=cols)


# =============================================================================
# FUENTES
# =============================================================================
manifest = json.load(open(P("manifest.json")))
wdi_status = json.load(open(P("wdi_status.json")))
SRC = []
def src(sid, title, org, url, stype, pub, period, accessed, method, variables, coverage, limits, obs, file_key=None):
    m = manifest.get(file_key, {}) if file_key else {}
    SRC.append(dict(source_id=sid, title=title, author_org=org, url=url, source_type=stype, publication_date=pub,
                    period_covered=period, access_date=TODAY if accessed else "", accessed_in_session=accessed,
                    access_route=(f"Descarga directa de réplica: {m.get('url','')}" if m else ("busqueda_web" if accessed == "busqueda_web" else "")),
                    file_sha256=m.get("sha256", ""), methodology=method, variables_supported=variables,
                    countries_covered=coverage, known_limitations=limits, observations=obs))

src("SRC_WDI", "World Development Indicators (copia DDF de Gapminder/Open Numbers, versión 1.1.0 del datapackage, creada 2026-05-06)", "Banco Mundial (vía Gapminder Open Numbers)", "https://databank.worldbank.org/source/world-development-indicators", "base_datos_oficial_org_internacional", "2026-05", "1960-2024", "descarga", "Compilación de estadísticas oficiales nacionales e internacionales (cuentas nacionales, FMI, ONU, OIT, SIPRI...). Metadatos por serie en 02b_INDICADORES.", "Demografía, sociedad, macroeconomía, finanzas públicas, comercio, energía, infraestructura, defensa, tecnología, seguridad, medio ambiente", "~217 economías + territorios", "La API oficial no era accesible; se usó la réplica en GitHub declarada 'copia directa' por Gapminder. Las series se revisan retroactivamente en cada edición del WDI.", "Códigos de serie WDI en minúsculas con '_' en lugar de '.'.", "wdi_dp.json")
src("SRC_SIPRI_MILEX", "SIPRI Military Expenditure Database (difundida en WDI: MS.MIL.XPND.*)", "SIPRI", "https://www.sipri.org/databases/milex", "base_datos_instituto_investigacion", "anual", "1960-2024", "descarga", "Definición OTAN de gasto militar; estimaciones de SIPRI cuando faltan datos oficiales", "Gasto militar (USD corrientes, % PIB, % gasto público)", "Global", "Estimaciones para países opacos; no incluye necesariamente gastos paramilitares o extrapresupuestarios", "Consultada a través de WDI", "wdi_dp.json")
src("SRC_SIPRI_AT", "SIPRI Arms Transfers Database (TIV; difundida en WDI: MS.MIL.XPRT/MPRT.KD)", "SIPRI", "https://www.sipri.org/databases/armstransfers", "base_datos_instituto_investigacion", "anual", "1960-2024", "descarga", "Trend Indicator Value (TIV): volumen de transferencias, no valor financiero", "Importaciones/exportaciones de armas mayores", "Global", "TIV no es un precio; no comparable con valores monetarios", "", "wdi_dp.json")
src("SRC_VDEM", "V-Dem Country-Year Dataset v16 (paquete R vdemdata 16.0)", "V-Dem Institute (Universidad de Gotemburgo)", "https://www.v-dem.net/data/the-v-dem-dataset/", "base_datos_academica", "2026-03", "1789-2025", "descarga", "Encuestas a expertos agregadas con modelo bayesiano de medición (IRT); índices compuestos; variables externas e_*", "Régimen político, elecciones, poder judicial, legislativo, libertades, corrupción, capacidad estatal, nombres de jefes de Estado y de Gobierno, variables externas (Polity, Freedom House, WGI, PIB modelado)", "~200 países e históricos", "Estimaciones latentes con intervalos (no incluidos aquí); variables e_* tienen fuentes propias; e_miinflat interpolado linealmente según el codebook", "", "vdem.RData")
src("SRC_VDEM_CODEBOOK", "V-Dem Codebook v16 (codebook.RData)", "V-Dem Institute", "https://www.v-dem.net/documents/", "codebook", "2026", "", "descarga", "Definiciones de variables usadas en 02_DICCIONARIO", "", "", "", "", "codebook.RData")
src("SRC_VPARTY", "V-Party Dataset (paquete vdemdata)", "V-Dem Institute", "https://www.v-dem.net/data/v-party-dataset/", "base_datos_academica", "2022", "1900-2019", "descarga", "Codificación por expertos de partidos con >5% de voto", "Partidos, voto, escaños, ideología, populismo", "~178 países", "Solo partidos con >5% en alguna elección; termina en 2019", "", "vparty.RData")
src("SRC_COW_NMC", "COW National Material Capabilities v6.0 (vía peacesciencer 1.2.9)", "Correlates of War Project", "https://correlatesofwar.org/data-sets/national-material-capabilities/", "base_datos_academica", "2021", "1816-2016", "descarga", "Seis indicadores de capacidad material e índice CINC", "milex (miles USD corrientes), milper (miles), irst (miles t), pec (miles t equiv. carbón), tpop, upop (miles), cinc", "Estados del sistema COW", "Fuentes heterogéneas; milex pre-1914 aproximado", "", "ps/cow_nmc.rda")
src("SRC_COW_STATES", "COW State System Membership v2016", "Correlates of War Project", "https://correlatesofwar.org/data-sets/state-system-membership/", "base_datos_academica", "2017", "1816-2016", "descarga", "Criterios de pertenencia al sistema interestatal", "Fechas de entrada/salida", "Global", "Criterios de reconocimiento discutibles para algunos casos", "", "ps/cow_states.rda")
src("SRC_GW_STATES", "Gleditsch & Ward list of independent states (vía peacesciencer)", "Gleditsch, K.S.; Ward, M.D.", "http://ksgleditsch.com/data-4.html", "base_datos_academica", "2017", "1816-2017", "descarga", "Lista alternativa de Estados independientes", "Fechas de independencia", "Global", "", "", "ps/gw_states.rda")
src("SRC_COW_CONTDIR", "COW Direct Contiguity v3.2", "Correlates of War Project", "https://correlatesofwar.org/data-sets/direct-contiguity/", "base_datos_academica", "2017", "1816-2016", "descarga", "Contigüidad terrestre y marítima (≤12, 24, 150, 400 millas)", "Fronteras", "Global", "", "", "ps/cow_contdir.rda")
src("SRC_COW_WAR", "COW War Data v4.0 (inter e intraestatales; vía peacesciencer)", "Sarkees & Wayman / COW", "https://correlatesofwar.org/data-sets/cow-war/", "base_datos_academica", "2010", "1816-2007", "descarga", "Guerras con ≥1.000 muertes en batalla", "Guerras, participantes, muertes en batalla, resultado", "Global", "Termina en 2007; muertes -9 = desconocidas", "", "ps/cow_war_inter.rda")
src("SRC_COW_TRADE", "COW Trade v4.0 (nivel Estado-año)", "Barbieri & Keshk / COW", "https://correlatesofwar.org/data-sets/bilateral-trade/", "base_datos_academica", "2016", "1870-2014", "descarga", "Importaciones y exportaciones totales", "Comercio (millones USD corrientes)", "Global", "", "", "ps/cow_trade_sy.rda")
src("SRC_COW_IGO", "COW Intergovernmental Organizations v3 (agregado Estado-año)", "Pevehouse et al. / COW", "https://correlatesofwar.org/data-sets/igos/", "base_datos_academica", "2020", "1816-2014", "descarga", "Pertenencia a OIG", "Número de OIG por Estado", "Global", "", "", "ps/cow_igo_sy.rda")
src("SRC_ATOP", "ATOP Alliance Treaty Obligations and Provisions v5 (díada-año, vía peacesciencer)", "Leeds et al.", "http://www.atopdata.org/", "base_datos_academica", "2020", "1815-2018", "descarga", "Obligaciones de alianza por díada-año", "Defensa, ofensiva, neutralidad, no agresión, consulta", "Global", "", "", "ps/atop_alliance.rda")
src("SRC_UCDP_ACD", "UCDP/PRIO Armed Conflict Dataset (versión incluida en peacesciencer 1.2.9, años 1946-2024)", "UCDP / PRIO", "https://ucdp.uu.se/downloads/", "base_datos_academica", "2025", "1946-2024", "descarga", "Conflictos con ≥25 muertes en batalla/año en los que al menos una parte es un gobierno", "Conflictos armados estatales", "Global", "Sin nombres de actores en esta versión; nombres tomados de la versión antigua cuando coincide conflict_id", "", "ps/ucdp_acd.rda")
src("SRC_UCDP_ACD_OLD", "UCDP/PRIO Armed Conflict Dataset (versión antigua con nombres, paquete PoliticalDatasets de X. Márquez)", "UCDP / PRIO; X. Márquez", "https://github.com/xmarquez/PoliticalDatasets", "base_datos_academica_replica", "2015", "1946-2014", "descarga", "", "Nombres de lados y localización", "Global", "Versión antigua", "", "pd/ucdpConflict.rda")
src("SRC_ARCHIGOS", "Archigos 4.1 – A Data Set on Leaders 1875-2015 (vía peacesciencer)", "Goemans, Gleditsch & Chiozza", "http://ksgleditsch.com/archigos.html", "base_datos_academica", "2016", "1875-2015", "descarga", "Líderes efectivos, entrada y salida del poder", "Líderes, forma de entrada/salida", "Global", "Termina en 2015; nombres a veces abreviados", "", "ps/archigos.rda")
src("SRC_LEAD", "LEAD – Leader Experience and Attribute Descriptions (Ellis, Horowitz & Stam)", "Ellis, Horowitz & Stam", "https://doi.org/10.1177/0022002714540470", "base_datos_academica", "2015", "1875-2004", "descarga", "Atributos biográficos de líderes", "Educación, servicio militar, combate, rebelde", "Global", "", "", "ps/LEAD.rda")
src("SRC_REIGN", "REIGN – Rulers, Elections, and Irregular Governance (edición 2021-08)", "Bell, Besaw & Frank (One Earth Future)", "https://oefdatascience.github.io/REIGN.github.io/", "base_datos_academica", "2021-08", "1950-2021", "descarga", "País-mes: líder, tipo de gobierno, elecciones, eventos irregulares", "Gobiernos, líderes, tipos de régimen", "~200 países", "Termina en agosto de 2021", "", "reign.csv")
src("SRC_PT_COUPS", "Global Instances of Coups (Powell & Thyne; versión en PoliticalDatasets)", "Powell, J.; Thyne, C.", "https://www.uky.edu/~clthyn2/coup_data/home.htm", "base_datos_academica", "2015", "1950-2015", "descarga", "Golpes e intentos de golpe", "Golpes", "Global", "Versión de ~2015; para años posteriores ver e_pt_coup de V-Dem y 26_HISTORIA", "", "pd/PowellThyne.rda")
src("SRC_NELDA", "NELDA – National Elections Across Democracy and Autocracy (versión en PoliticalDatasets)", "Hyde & Marinov", "https://nelda.co/", "base_datos_academica", "2015", "1945-2012", "descarga", "Elección-nivel; preguntas sí/no sobre competencia y calidad", "Elecciones", "Global", "La redacción exacta de cada pregunta nelda1...nelda58 está en el codebook oficial", "", "pd/nelda.rda")
src("SRC_ICOW_COL", "ICOW Colonial History Data Set v1.1", "Hensel, P.", "http://www.paulhensel.org/icowcol.html", "base_datos_academica", "2018", "1816-2002", "descarga", "Historia colonial y forma de independencia", "Independencias", "Global", "", "", "pd/colonial.rda")
src("SRC_GWF", "Autocratic Regimes Data Set (Geddes, Wright & Frantz; versión en PoliticalDatasets)", "Geddes, Wright & Frantz", "https://sites.psu.edu/dictators/", "base_datos_academica", "2014", "1946-2010", "descarga", "Periodos de régimen autocrático, tipo y forma de terminación", "Regímenes", "Global", "Termina en 2010", "", "pd/all_gwf_periods.rda")
src("SRC_TD_RIV", "Strategic Rivalries (Thompson & Dreyer 2011)", "Thompson, W.; Dreyer, D.", "https://doi.org/10.4135/9781608714865", "base_datos_academica", "2011", "1494-2010", "descarga", "Rivalidades estratégicas percibidas", "Rivalidades", "Global", "", "", "ps/td_rivalries.rda")
src("SRC_TSS_RIV", "Interstate rivalries (Thompson, Sakuwa & Suhas 2022)", "Thompson, Sakuwa & Suhas", "https://doi.org/10.1093/oso/9780197638439.001.0001", "base_datos_academica", "2022", "1816-2020", "descarga", "Rivalidades con tipología (posicional, espacial, ideológica, intervencionista)", "Rivalidades", "Global", "", "", "ps/tss_rivalries.rda")
src("SRC_GRH_ARMS", "Arms races (Gibler, Rider & Hutchison 2005)", "Gibler, Rider & Hutchison", "https://doi.org/10.1177/0022343305049667", "base_datos_academica", "2005", "1816-1993", "descarga", "", "Carreras armamentistas", "Global", "", "", "ps/grh_arms_races.rda")
src("SRC_GML_MID", "MID data (Gibler, Miller & Little), disputas y participantes", "Gibler, Miller & Little", "https://doi.org/10.1093/isq/sqw045", "base_datos_academica", "2016", "1816-2010", "descarga", "Disputas interestatales militarizadas corregidas", "MIDs", "Global", "", "", "ps/gml_mid_disps.rda")
src("SRC_CREG", "Composition of Religious and Ethnic Groups (CREG)", "Nardulli et al.", "https://clinecenter.illinois.edu/project/research-themes/democracy-and-development/creg", "base_datos_academica", "2012", "1945-2013", "descarga", "Fraccionalización y polarización", "Etnicidad, religión", "Global", "", "", "ps/creg.rda")
src("SRC_HIEF", "Historical Index of Ethnic Fractionalization (Drazanova)", "Drazanova, L.", "https://doi.org/10.7910/DVN/4JQRCL", "base_datos_academica", "2019", "1945-2013", "descarga", "", "Fraccionalización étnica", "Global", "", "", "ps/hief.rda")
src("SRC_TERRTHREAT", "Latent territorial threat (Miller 2022, vía peacesciencer)", "Miller, S.", "https://doi.org/10.1177/00220027211070378", "base_datos_academica", "2022", "1816-2010", "descarga", "Modelo latente de amenaza territorial externa", "Amenaza territorial", "Global", "Estimación modelada", "", "ps/terrthreat.rda")
src("SRC_RUGGED", "Ruggedness (Nunn & Puga 2012; vía peacesciencer)", "Nunn & Puga", "https://diegopuga.org/data/rugged/", "base_datos_academica", "2012", "", "descarga", "Índice de rugosidad del terreno y % montañoso", "Geografía", "Global", "", "", "ps/rugged.rda")
src("SRC_MAOZ", "Potencias regionales y globales (Maoz)", "Maoz, Z.", "", "base_datos_academica", "2010", "1816-2010", "descarga", "", "Estatus de potencia", "Global", "", "", "ps/maoz_powers.rda")
src("SRC_COW_MAJORS", "COW Major Powers", "Correlates of War Project", "https://correlatesofwar.org/data-sets/state-system-membership/", "base_datos_academica", "2017", "1816-2016", "descarga", "", "Grandes potencias", "Global", "", "", "ps/cow_majors.rda")
src("SRC_OWID_ENERGY", "Our World in Data – energy-data (Energy Institute Statistical Review, Ember, EIA)", "Our World in Data", "https://github.com/owid/energy-data", "compilacion_academica", "2025", "1900-2024", "descarga", "Compilación documentada de fuentes primarias", "Producción y consumo de energía, matriz eléctrica", "Global", "Algunas series combinan fuentes con definiciones distintas", "", "owid-energy.csv")
src("SRC_OWID_CO2", "Our World in Data – co2-data (Global Carbon Project y otros)", "Our World in Data", "https://github.com/owid/co2-data", "compilacion_academica", "2025", "1750-2024", "descarga", "", "Emisiones", "Global", "", "", "owid-co2.csv")
src("SRC_MLEDOZE", "World countries in JSON (mledoze/countries)", "M. Ledoze y colaboradores", "https://github.com/mledoze/countries", "dataset_colaborativo", "2025", "actual", "descarga", "Nombres, ISO, capitales, fronteras terrestres, superficie", "Identidad y geografía actuales", "250 entidades", "Fronteras y superficies actuales; no históricas", "", "countries.json")
src("SRC_DATAHUB_CC", "Country codes (datasets/country-codes)", "DataHub", "https://github.com/datasets/country-codes", "dataset_colaborativo", "2024", "actual", "descarga", "", "Códigos", "Global", "", "", "country-codes.csv")
for s in sources_curated.SOURCES:
    sid, title, org, url, stype, pub, period, acc, notes = s
    SRC.append(dict(source_id=sid, title=title, author_org=org, url=url, source_type=stype, publication_date=pub,
                    period_covered=period, access_date=TODAY if acc == "busqueda_web" else "", accessed_in_session=acc,
                    access_route="busqueda_web (resumen de resultados)" if acc == "busqueda_web" else "referencia citada, no consultada en la sesión",
                    file_sha256="", methodology="", variables_supported="", countries_covered="", known_limitations="", observations=notes))
SRCDF = pd.DataFrame(SRC)
SRC_IDS = set(SRCDF.source_id)

# =============================================================================
# 03 ESTADOS
# =============================================================================
rug = B.load_rda(P("ps/rugged.rda"))
rug["country_id"] = rug.ccode.map(cow_id)
master = master.merge(rug.groupby("country_id")[["rugged", "newlmtnest"]].first().rename(columns={"rugged": "ruggedness_index", "newlmtnest": "pct_mountainous"}), left_on="country_id", right_index=True, how="left")
col = B.load_rda(P("pd/colonial.rda"))
col["country_id"] = col.State.map(lambda x: cow_id(x) if pd.notna(x) else "")
def ym(x):
    if hasattr(x, "strftime"):
        return x.strftime("%Y-%m")
    try:
        x = int(x)
        if x < 0:
            return ""
        return f"{x//100:04d}-{x%100:02d}" if x > 9999 else str(x)
    except Exception:
        return str(x) if isinstance(x, str) and x != "-9" else ""
colm = col.groupby("country_id").agg(colonial_ruler_cow=("ColRuler", "first"), independence_from_cow=("IndFrom", "first"), independence_date_icow=("IndDate", "first"), independence_violent=("IndViol", "first"), independence_type_icow=("IndType", "first"))
colm["colonial_ruler"] = colm.colonial_ruler_cow.map(lambda x: cow_id(x) if pd.notna(x) and x > 0 else "")
colm["independence_from"] = colm.independence_from_cow.map(lambda x: cow_id(x) if pd.notna(x) and x > 0 else "")
colm["independence_date_icow"] = colm.independence_date_icow.map(ym)
master = master.merge(colm[["colonial_ruler", "independence_from", "independence_date_icow", "independence_violent", "independence_type_icow"]], left_on="country_id", right_index=True, how="left")
CONT_NOTES = {"RUS": "Incluye la URSS (1922-1991) como continuidad (COW 365, V-Dem RUS).", "SRB": "Incluye Serbia (1878-1918), Yugoslavia (1918-2003) y Serbia y Montenegro (2003-2006) como continuidad (COW 345).",
              "CZE": "Incluye Checoslovaquia (1918-1992) como continuidad (COW 315/316, V-Dem CZE).", "YEM": "Incluye Yemen del Norte (RAY) hasta 1990 (COW 678/679).",
              "DEU": "Incluye Alemania (1816-1945), RFA (1949-1990, COW 260) y Alemania unificada.", "VNM": "Incluye Vietnam del Norte (RDV) hasta 1976 (COW 816).",
              "PAK": "Incluye Pakistán Oriental hasta 1971.", "ETH": "Incluye Eritrea hasta 1993.", "SDN": "Incluye Sudán del Sur hasta 2011.", "IDN": "Incluye Timor Oriental 1976-1999 de facto."}
master["entity_note"] = master.apply(lambda r: CONT_NOTES.get(r.country_id, r.get("entity_note", "") if isinstance(r.get("entity_note", ""), str) else ""), axis=1)
maj = B.load_rda(P("ps/cow_majors.rda"))
maj["country_id"] = maj.ccode.map(cow_id)
majs = maj.groupby("country_id").apply(lambda g: ";".join(f"{int(a)}-{int(b)}" for a, b in zip(g.styear, g.endyear)))
master["cow_major_power_periods"] = master.country_id.map(majs)
mz = B.load_rda(P("ps/maoz_powers.rda"))
mz["country_id"] = mz.ccode.map(cow_id)
mzs = mz.groupby("country_id").apply(lambda g: ";".join(f"regional {B.r_date(a)[:4]}-{B.r_date(b)[:4]}" for a, b in zip(g.regstdate, g.regenddate) if B.r_date(a)) )
master["maoz_regional_power"] = master.country_id.map(mzs)
order = ["country_id", "name_es", "name_official_es", "name_en", "entity_type", "entity_note", "iso_alpha2", "iso_alpha3", "iso_numeric",
         "cow_codes", "gw_codes", "vdem_id", "vdem_country_num", "un_member", "cow_first", "cow_last", "gw_first", "gw_last",
         "sovereignty_start_curated", "sovereignty_end_curated", "colonial_ruler", "independence_from", "independence_date_icow", "independence_violent", "independence_type_icow",
         "capital", "lat", "lon", "region", "subregion", "region_vdem6", "area_km2", "landlocked", "borders", "n_land_borders",
         "ruggedness_index", "pct_mountainous", "currencies", "languages", "cow_major_power_periods", "maoz_regional_power", "vdem_first_year", "vdem_last_year", "geo_source"]
for c in order:
    if c not in master.columns:
        master[c] = ""
master = master[order].sort_values("country_id").reset_index(drop=True)
master["landlocked"] = master.landlocked.map(lambda x: "" if x is None or (isinstance(x, float) and np.isnan(x)) else ("si" if x else "no"))
master["un_member"] = master.un_member.map(lambda x: "si" if x is True else ("no" if x is False else ""))
master["source_ids"] = "SRC_MLEDOZE;SRC_VDEM;SRC_COW_STATES;SRC_GW_STATES;SRC_ICOW_COL;SRC_RUGGED"

# =============================================================================
# WDI (paneles temáticos)
# =============================================================================
concepts = pd.read_csv(P("wdi_concepts.csv"))
concepts = concepts.set_index("concept")
geo_wdi = pd.read_csv(P("wdi_geo.csv"))
geo_wdi = geo_wdi[geo_wdi["is--country"] == True]
WDIMAP = {}
for g in geo_wdi.country:
    G = g.upper()
    WDIMAP[g] = B.WDI_GEO_FIX.get(G, G)
WDI_THEMES = {
    "05_DEMOGRAFIA": "sp_pop_totl sp_urb_totl_in_zs sp_rur_totl_zs en_pop_dnst sp_dyn_cbrt_in sp_dyn_cdrt_in sp_dyn_imrt_in sp_dyn_le00_in sp_dyn_tfrt_in sm_pop_netm sp_pop_0014_to_zs sp_pop_1564_to_zs sp_pop_65up_to_zs sp_pop_dpnd",
    "06_INDICADORES_SOCIALES": "sl_tlf_totl_in sl_tlf_cact_zs sl_uem_totl_zs sl_uem_1524_zs sl_emp_vuln_zs se_adt_litr_zs se_prm_enrr se_sec_enrr se_ter_enrr se_xpd_totl_gd_zs si_pov_gini si_pov_dday si_dst_10th_10 sh_xpd_chex_gd_zs sh_med_phys_zs sh_med_beds_zs sh_sta_mmrt eg_elc_accs_zs sh_h2o_smdw_zs sh_sta_smss_zs it_net_user_zs it_cel_sets_p2 sn_itk_defc_zs",
    "07_MACROECONOMIA": "ny_gdp_mktp_cd ny_gdp_mktp_kd ny_gdp_mktp_kd_zg ny_gdp_pcap_cd ny_gdp_pcap_kd_zg ny_gdp_pcap_pp_cd ny_gdp_pcap_pp_kd ny_gdp_mktp_pp_cd ny_gdp_mktp_pp_kd ny_gnp_pcap_cd nv_agr_totl_zs nv_ind_totl_zs nv_ind_manf_zs nv_srv_totl_zs ne_gdi_totl_zs ne_gdi_ftot_zs ne_con_govt_zs ne_con_prvt_zs ny_gns_ictr_zs fp_cpi_totl_zg ny_gdp_defl_kd_zg sl_gdp_pcap_em_kd",
    "08_FINANZAS_PUBLICAS": "gc_rev_xgrt_gd_zs gc_tax_totl_gd_zs gc_xpn_totl_gd_zs gc_nld_totl_gd_zs gc_dod_totl_gd_zs gc_dod_totl_cn gc_tax_gsrv_rv_zs gc_tax_intt_rv_zs gc_xpn_intp_zs gc_xpn_intp_rv_zs gc_xpn_comp_zs gc_xpn_trft_zs",
    "09_MONEDA_MERCADOS": "pa_nus_fcrf pa_nus_ppp fr_inr_lend fr_inr_dpst fr_inr_rinr fi_res_totl_cd fi_res_totl_mo fm_lbl_bmny_gd_zs fm_lbl_bmny_zg fs_ast_prvt_gd_zs cm_mkt_lcap_gd_zs",
    "10_COMERCIO": "ne_exp_gnfs_cd ne_imp_gnfs_cd ne_exp_gnfs_zs ne_imp_gnfs_zs ne_trd_gnfs_zs bn_cab_xoka_cd bn_cab_xoka_gd_zs bx_klt_dinv_cd_wd bx_klt_dinv_wd_gd_zs dt_dod_dect_cd dt_dod_dect_gn_zs dt_tds_dect_ex_zs tm_tax_mrch_wm_ar_zs tx_val_fuel_zs_un tx_val_manf_zs_un tx_val_food_zs_un tx_val_mmtl_zs_un tx_val_agri_zs_un tm_val_fuel_zs_un tm_val_food_zs_un tm_val_manf_zs_un bx_trf_pwkr_dt_gd_zs dt_oda_odat_gn_zs",
    "11_RECURSOS_ENERGIA": "eg_imp_cons_zs eg_use_pcap_kg_oe eg_use_elec_kh_pc ny_gdp_totl_rt_zs ny_gdp_petr_rt_zs ny_gdp_ngas_rt_zs ny_gdp_coal_rt_zs ny_gdp_minr_rt_zs ny_gdp_frst_rt_zs eg_elc_rnew_zs eg_fec_rnew_zs eg_elc_nucl_zs eg_elc_hyro_zs eg_elc_ngas_zs eg_elc_coal_zs eg_elc_petr_zs ag_lnd_totl_k2 ag_srf_totl_k2 ag_lnd_agri_zs ag_lnd_arbl_zs ag_lnd_frst_zs er_h2o_intr_pc er_h2o_fwtl_zs er_h2o_fwst_zs ag_prd_food_xd ag_yld_crel_kg",
    "12_INFRAESTRUCTURA": "is_air_psgr is_air_dprt is_air_good_mt_k1 is_rrs_totl_km is_rrs_good_mt_k6 is_shp_good_tu it_net_bbnd_p2 lp_lpi_ovrl_xq eg_elc_loss_zs",
    "13_DEFENSA_PRESUPUESTOS": "ms_mil_xpnd_cd ms_mil_xpnd_cn ms_mil_xpnd_gd_zs ms_mil_xpnd_zs ms_mil_totl_p1 ms_mil_totl_tf_zs",
    "15c_COMERCIO_ARMAS": "ms_mil_xprt_kd ms_mil_mprt_kd",
    "27_TECNOLOGIA": "gb_xpd_rsdv_gd_zs sp_pop_scie_rd_p6 ip_pat_resd ip_pat_nres ip_jrn_artc_sc tx_val_tech_cd tx_val_tech_mf_zs bm_gsr_royl_cd bx_gsr_royl_cd",
    "28_SEGURIDAD_INTERIOR": "vc_ihr_psrc_p5 vc_btl_deth vc_idp_nwcv vc_idp_nwds",
    "31_MEDIOAMBIENTE": "en_ghg_co2_pc_ce_ar5 en_ghg_all_mt_ce_ar5 en_atm_pm25_mc_m3 en_clc_mdat_zs ag_lnd_frst_k2 en_pop_el5m_zs",
}
# clasificación del tipo de observación y confianza base por indicador (criterio documentado en 00_LEEME)
MODELED_KEYS = ("modeled", "estimate", "estimación")
CONF_MEDIA = {"si_pov_gini", "si_pov_dday", "si_dst_10th_10", "se_adt_litr_zs", "sl_emp_vuln_zs", "ms_mil_xpnd_cd", "ms_mil_xpnd_cn", "ms_mil_xpnd_gd_zs", "ms_mil_xpnd_zs",
              "ms_mil_totl_p1", "ms_mil_totl_tf_zs", "ms_mil_xprt_kd", "ms_mil_mprt_kd", "vc_ihr_psrc_p5", "vc_btl_deth", "vc_idp_nwcv", "vc_idp_nwds", "sm_pop_netm",
              "er_h2o_intr_pc", "er_h2o_fwtl_zs", "er_h2o_fwst_zs", "sn_itk_defc_zs", "sh_sta_mmrt", "en_clc_mdat_zs", "gc_dod_totl_gd_zs", "gc_dod_totl_cn", "lp_lpi_ovrl_xq",
              "ny_gdp_totl_rt_zs", "ny_gdp_petr_rt_zs", "ny_gdp_ngas_rt_zs", "ny_gdp_coal_rt_zs", "ny_gdp_minr_rt_zs", "ny_gdp_frst_rt_zs", "pa_nus_ppp", "ny_gdp_pcap_pp_cd", "ny_gdp_pcap_pp_kd", "ny_gdp_mktp_pp_cd", "ny_gdp_mktp_pp_kd",
              "en_ghg_co2_pc_ce_ar5", "en_ghg_all_mt_ce_ar5", "en_atm_pm25_mc_m3", "sp_pop_scie_rd_p6", "dt_dod_dect_cd", "dt_dod_dect_gn_zs", "dt_tds_dect_ex_zs"}
def unit_meta(code):
    r = concepts.loc[code] if code in concepts.index else None
    name = r["name"] if r is not None else code
    unit = (r["unit_of_measure"] if r is not None and isinstance(r["unit_of_measure"], str) else "")
    nm = name.lower()
    if not unit:
        par = re.findall(r"\(([^()]*)\)", name)
        unit = par[-1] if par else "número (recuento)"
    currency = "USD" if ("us$" in nm or "usd" in nm) else ("LCU" if "lcu" in nm or "local currency" in nm else "")
    if "exchange rate" in nm:
        price = "tipo_de_cambio_nominal_promedio_periodo"
    elif "ppp" in nm:
        price = "PPA (" + ("constantes" if "constant" in nm else "corrientes") + ")"
    elif "constant" in nm:
        price = "constantes"
    elif "current" in nm:
        price = "corrientes"
    else:
        price = "no_monetario" if not currency else ""
    obs = "estimacion_modelada" if any(k in nm for k in MODELED_KEYS) else ("indice_derivado" if "index" in nm else "dato_oficial_compilado")
    if code in ("sp_pop_totl", "sp_dyn_le00_in", "sp_dyn_tfrt_in", "sp_dyn_cbrt_in", "sp_dyn_cdrt_in", "sp_dyn_imrt_in", "sm_pop_netm", "sp_pop_0014_to_zs", "sp_pop_1564_to_zs", "sp_pop_65up_to_zs", "sp_pop_dpnd"):
        obs = "estimacion_demografica_ONU_WPP"
    if code.startswith("ms_mil_x") or code.startswith("ms_mil_m"):
        obs = "indice_volumen_TIV"
    conf = "Media" if (code in CONF_MEDIA or obs.startswith("estimacion")) else "Alta"
    src_id = "SRC_SIPRI_MILEX" if code.startswith("ms_mil_xpnd") else ("SRC_SIPRI_AT" if code.startswith("ms_mil_x") or code.startswith("ms_mil_m") else "SRC_WDI")
    return dict(name=name, unit=unit, currency=currency, price_basis=price, obs=obs, conf=conf, src=src_id,
                series_code=(r["series_code"] if r is not None else code.upper().replace("_", ".")),
                source_text=(r["source"] if r is not None else ""), definition=(r["description"] if r is not None else ""),
                limitations=(r["limitations_and_exceptions"] if r is not None else ""))

vd = pd.read_pickle(P("vdem_subset.pkl"))
vd["country_id"] = vd.country_text_id
vd["year"] = vd.year.astype(int)
REG = vd[["country_id", "year", "v2x_regime"]]
LONG_PARTS = []
rec_counter = [0]
for sheet, codes in WDI_THEMES.items():
    frames = []
    for code in codes.split():
        if wdi_status.get(code) != "OK":
            continue
        d = pd.read_csv(P("wdi", code + ".csv"))
        d = d[d.geo.isin(WDIMAP)]
        d["country_id"] = d.geo.map(WDIMAP)
        d = d.rename(columns={"time": "year"})[["country_id", "year", code]].set_index(["country_id", "year"])
        frames.append(d)
        m = unit_meta(code)
        INDICATORS.append(dict(indicator_id=code, sheet=sheet, name_en=m["name"], series_code_original=m["series_code"], unit=m["unit"],
                               currency=m["currency"], price_basis=m["price_basis"], observation_type=m["obs"], base_confidence=m["conf"],
                               source_id=m["src"], original_source_text=m["source_text"], definition=m["definition"], limitations=m["limitations"],
                               table_format="panel_ancho (columna)", interpolation="ninguna aplicada por esta base"))
        CITES.append(dict(target_table=sheet, target_column=code, target_records="todas las filas", source_id=m["src"],
                          locator=f"Serie WDI {m['series_code']}; fichero datapoints/ddf--datapoints--{code}--by--geo--time.csv",
                          note=m["source_text"][:300] if isinstance(m["source_text"], str) else ""))
        # formato largo con metadatos completos por observación
        dl = d.reset_index().rename(columns={code: "value"})
        dl = dl[dl.value.notna()]
        dl = dl.merge(REG, on=["country_id", "year"], how="left")
        downgrade = (dl.v2x_regime == 0) & (m["src"] == "SRC_WDI") & code.startswith(("ny_", "nv_", "ne_", "fp_", "gc_"))
        dl["confidence_level"] = np.where(downgrade, "Media" if m["conf"] == "Alta" else "Baja", m["conf"])
        dl = dl.drop(columns="v2x_regime")
        dl["indicator_id"] = code
        dl["unit"] = m["unit"]; dl["currency"] = m["currency"]; dl["price_basis"] = m["price_basis"]
        dl["observation_type"] = m["obs"]; dl["source_id"] = m["src"]; dl["source_reference"] = m["series_code"]
        LONG_PARTS.append(dl)
    if not frames:
        continue
    panel = pd.concat(frames, axis=1).reset_index().sort_values(["country_id", "year"])
    panel = panel.dropna(how="all", subset=[c for c in panel.columns if c not in ("country_id", "year")])
    add(sheet, panel, f"Panel país-año (WDI) – {sheet}", "serie_estadistica", "parcial (según disponibilidad WDI)", pk=["country_id", "year"],
        fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_WDI", notes="Cada columna es un indicador definido en 02b_INDICADORES. Celdas vacías = dato no disponible (nunca cero imputado).", freeze_col=True)

# =============================================================================
# V-Dem: paneles institucionales, gasto/PIB histórico, nombres de jefes
# =============================================================================
cb = B.load_rda(P("codebook.RData"))
cb = cb.set_index("tag")
VDEM_INST = ["v2x_regime", "v2x_regime_amb", "v2x_polyarchy", "v2x_libdem", "v2x_partipdem", "v2x_delibdem", "v2x_egaldem", "v2x_liberal", "v2xcl_rol", "v2x_jucon",
             "v2xlg_legcon", "v2x_freexp_altinf", "v2x_frassoc_thick", "v2xel_frefair", "v2x_suffr", "v2x_elecoff", "v2x_civlib", "v2x_clphy", "v2x_clpol", "v2x_clpriv",
             "v2x_corr", "v2x_pubcorr", "v2x_execorr", "v2x_rule", "v2x_neopat", "v2x_ex_military", "v2x_ex_party", "v2x_ex_hereditary", "v2x_ex_confidence", "v2x_ex_direlect",
             "v2x_accountability", "v2x_horacc", "v2x_veracc", "v2x_diagacc", "v2x_feduni", "v2x_divparctrl", "v2xps_party", "v2x_cspart", "v2xcs_ccsi", "v2x_gender",
             "v2juhcind", "v2juncind", "v2jucorrdc", "v2lgbicam", "v2lgfemleg", "v2elmulpar", "v2elfrfair", "v2elintim", "v2psparban", "v2mecenefm", "v2meharjrn",
             "v2csreprss", "v2cacamps", "v2caviol", "v2exl_legitideol", "v2exl_legitlead", "v2exl_legitperf", "v2exl_legitratio", "v2smgovdom", "v2smfordom",
             "e_fh_status", "e_fh_pr", "e_fh_cl", "e_p_polity", "e_polity2", "e_boix_regime", "e_lexical_index", "e_ti_cpi", "e_wbgi_vae", "e_wbgi_pve", "e_wbgi_gee", "e_wbgi_rqe", "e_wbgi_rle", "e_wbgi_cce",
             "e_democracy_trans", "e_democracy_breakdowns", "e_legparty", "e_coups", "e_pt_coup", "e_pt_coup_attempts", "e_civil_war"]
VDEM_ADMIN = ["v2stfisccap", "v2stcritrecadm", "v2stcritapparm", "v2svstterr", "v2svdomaut", "v2svinlaut", "v2xnp_regcorr", "v2exbribe" if "v2exbribe" in vd.columns else None, "e_wbgi_gee", "e_wbgi_rqe"]
VDEM_ADMIN = [c for c in VDEM_ADMIN if c and c in vd.columns]
VDEM_SEC = ["v2clkill", "v2cltort", "v2csreprss", "v2cacamps", "v2caviol", "v2x_clphy", "e_wbgi_pve", "e_civil_war", "v2pepwrses", "v2pepwrsoc", "v2clrgunev"]
VDEM_HIST = ["e_gdp", "e_gdppc", "e_pop", "e_miinflat", "e_cow_exports", "e_cow_imports", "e_total_oil_income_pc", "e_total_fuel_income_pc", "e_total_resources_income_pc", "e_miurbani", "e_pelifeex", "e_peaveduc", "e_radio_n"]
def vdem_meta(tag, sheet):
    base = tag if tag in cb.index else re.sub(r"_\d+$", "", tag)
    r = cb.loc[base] if base in cb.index else None
    def g(k):
        if r is None: return ""
        v = r[k] if not isinstance(r, pd.DataFrame) else r.iloc[0][k]
        return v if isinstance(v, str) else ""
    obs = "variable_externa_compilada" if tag.startswith("e_") else ("indice_latente_expertos" if tag.startswith("v2x") else "estimacion_latente_expertos")
    if tag in ("e_gdp", "e_gdppc", "e_pop"):
        obs = "estimacion_modelo_latente (Fariss et al.)"
    interp = "lineal (según codebook V-Dem)" if "interpolat" in g("notes").lower() else "ninguna aplicada por esta base"
    unit = g("scale") or ("ver codebook V-Dem / fuente original de la variable externa" if tag.startswith("e_") else "ver codebook V-Dem")
    if re.search(r"_\d+$", tag) and base != tag:
        unit = f"indicador binario (categoría {tag.rsplit('_', 1)[1]} de {base})"
    INDICATORS.append(dict(indicator_id=tag, sheet=sheet, name_en=(g("name") + (f" [categoría {tag.rsplit('_', 1)[1]}]" if base != tag else "")), series_code_original=tag, unit=unit, currency="", price_basis="",
                           observation_type=obs, base_confidence="Media", source_id="SRC_VDEM", original_source_text="V-Dem v16 codebook",
                           definition=(g("question") + " " + g("clarification")).strip()[:3000], limitations=(g("responses") + " " + g("notes")).strip()[:3000],
                           table_format="panel_ancho (columna)", interpolation=interp))
    CITES.append(dict(target_table=sheet, target_column=tag, target_records="todas las filas", source_id="SRC_VDEM", locator=f"V-Dem v16, variable {tag}; años del codebook: {g('years')}", note=""))

def vdem_panel(sheet, cols, y0, desc):
    cols = [c for c in cols if c in vd.columns]
    d = vd[vd.year >= y0][["country_id", "year"] + cols].copy()
    d["year"] = d.year.astype(int)
    d = d.dropna(how="all", subset=cols).sort_values(["country_id", "year"])
    for c in cols:
        vdem_meta(c, sheet)
    add(sheet, d, desc, "serie_estadistica", "completo (V-Dem v16)" , pk=["country_id", "year"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_VDEM",
        notes="Valores puntuales del modelo de medición V-Dem (sin intervalos). Ver definiciones en 02b_INDICADORES.", freeze_col=True)

# =============================================================================
# Otras fuentes de series
# =============================================================================
# COW NMC + amenaza territorial
nmc = B.load_rda(P("ps/cow_nmc.rda"))
nmc["country_id"] = nmc.ccode.map(cow_id)
for c in ["milex", "milper", "irst", "pec", "tpop", "upop"]:
    nmc.loc[nmc[c] < 0, c] = np.nan   # -9 = faltante en COW
tt = B.load_rda(P("ps/terrthreat.rda"))
tt["country_id"] = tt.ccode.map(cow_id)
nmc = nmc.merge(tt[["country_id", "year", "lterrthreat", "lwr", "upr"]], on=["country_id", "year"], how="left")
igo = B.load_rda(P("ps/cow_igo_sy.rda"))
igo["country_id"] = igo.ccode.map(cow_id)
nmc = nmc.merge(igo[["country_id", "year", "sum_igo_full"]], on=["country_id", "year"], how="left")
nmc = nmc.drop(columns=["ccode"]).rename(columns={"milex": "cow_milex_thousand_usd_current", "milper": "cow_milper_thousands", "irst": "cow_iron_steel_thousand_tons",
                                                   "pec": "cow_energy_thousand_coal_ton_eq", "tpop": "cow_total_pop_thousands", "upop": "cow_urban_pop_thousands",
                                                   "cinc": "cow_cinc_share", "lterrthreat": "terr_threat_latent", "lwr": "terr_threat_lwr95", "upr": "terr_threat_upr95", "sum_igo_full": "igo_full_memberships"})
nmc["year"] = nmc.year.astype(int)
nmc = nmc[["country_id", "year"] + [c for c in nmc.columns if c not in ("country_id", "year")]]
dups = nmc.duplicated(["country_id", "year"]).sum()
nmc = nmc.drop_duplicates(["country_id", "year"])
for c, u, o, s in [("cow_milex_thousand_usd_current", "miles de USD corrientes", "dato_compilado_fuentes_historicas", "SRC_COW_NMC"),
                   ("cow_milper_thousands", "miles de personas", "dato_compilado_fuentes_historicas", "SRC_COW_NMC"),
                   ("cow_iron_steel_thousand_tons", "miles de toneladas", "dato_compilado_fuentes_historicas", "SRC_COW_NMC"),
                   ("cow_energy_thousand_coal_ton_eq", "miles de t equivalentes de carbón", "dato_compilado_fuentes_historicas", "SRC_COW_NMC"),
                   ("cow_total_pop_thousands", "miles de personas", "dato_compilado_fuentes_historicas", "SRC_COW_NMC"),
                   ("cow_urban_pop_thousands", "miles de personas (ciudades >100.000)", "dato_compilado_fuentes_historicas", "SRC_COW_NMC"),
                   ("cow_cinc_share", "proporción del total del sistema (0-1)", "indice_derivado", "SRC_COW_NMC"),
                   ("terr_threat_latent", "escala latente", "estimacion_modelo_latente", "SRC_TERRTHREAT"),
                   ("terr_threat_lwr95", "escala latente", "estimacion_modelo_latente", "SRC_TERRTHREAT"),
                   ("terr_threat_upr95", "escala latente", "estimacion_modelo_latente", "SRC_TERRTHREAT"),
                   ("igo_full_memberships", "número de OIG", "dato_compilado", "SRC_COW_IGO")]:
    INDICATORS.append(dict(indicator_id=c, sheet="13b_CAPACIDADES_HIST_COW", name_en=c, series_code_original=c, unit=u, currency="USD" if "usd" in c else "",
                           price_basis="corrientes" if "usd" in c else "", observation_type=o, base_confidence="Media", source_id=s, original_source_text="",
                           definition="", limitations="Valores -9 de COW convertidos a vacío (faltante)", table_format="panel_ancho (columna)", interpolation="la fuente COW interpola algunos huecos de población (ver codebook NMC)"))
    CITES.append(dict(target_table="13b_CAPACIDADES_HIST_COW", target_column=c, target_records="todas las filas", source_id=s, locator="peacesciencer::cow_nmc / terrthreat / cow_igo_sy", note=""))

# COW comercio
tr = B.load_rda(P("ps/cow_trade_sy.rda"))
tr["country_id"] = tr.ccode.map(cow_id)
tr = tr.drop(columns="ccode").rename(columns={"imports": "cow_imports_musd_current", "exports": "cow_exports_musd_current"})
tr["year"] = tr.year.astype(int)
tr = tr[["country_id", "year", "cow_imports_musd_current", "cow_exports_musd_current"]].drop_duplicates(["country_id", "year"])
for c in ["cow_imports_musd_current", "cow_exports_musd_current"]:
    tr.loc[tr[c] < 0, c] = np.nan
    INDICATORS.append(dict(indicator_id=c, sheet="10b_COMERCIO_HIST_COW", name_en=c, series_code_original=c, unit="millones de USD corrientes", currency="USD", price_basis="corrientes",
                           observation_type="dato_compilado_fuentes_historicas", base_confidence="Media", source_id="SRC_COW_TRADE", original_source_text="", definition="Comercio total de mercancías", limitations="", table_format="panel_ancho (columna)", interpolation="ver codebook COW Trade"))
CITES.append(dict(target_table="10b_COMERCIO_HIST_COW", target_column="*", target_records="todas las filas", source_id="SRC_COW_TRADE", locator="peacesciencer::cow_trade_sy", note=""))

# OWID energía y CO2
def owid(file, cols, sheet, src, units):
    d = pd.read_csv(P(file), usecols=["iso_code", "year"] + cols)
    d = d[d.iso_code.notna() & (~d.iso_code.astype(str).str.startswith("OWID")) | (d.iso_code == "OWID_KOS")]
    d["country_id"] = d.iso_code.replace({"OWID_KOS": "XKX"})
    d = d[d.country_id.isin(IDS)]
    d = d[["country_id", "year"] + cols].dropna(how="all", subset=cols).sort_values(["country_id", "year"])
    for c in cols:
        INDICATORS.append(dict(indicator_id="owid_" + c, sheet=sheet, name_en=c, series_code_original=c, unit=units.get(c, ""), currency="", price_basis="no_monetario",
                               observation_type="dato_compilado", base_confidence="Alta" if "production" in c or "electricity" in c else "Media", source_id=src,
                               original_source_text="Ver codebook de OWID", definition="", limitations="", table_format="panel_ancho (columna)", interpolation="ninguna aplicada por esta base"))
    CITES.append(dict(target_table=sheet, target_column="owid_*", target_records="todas las filas", source_id=src, locator=f"{file} (columnas {', '.join(cols)})", note=""))
    return d.rename(columns={c: "owid_" + c for c in cols})
EN_COLS = ["primary_energy_consumption", "energy_per_capita", "oil_production", "gas_production", "coal_production", "oil_consumption", "gas_consumption", "coal_consumption",
           "electricity_generation", "electricity_demand", "net_elec_imports", "nuclear_electricity", "hydro_electricity", "solar_electricity", "wind_electricity", "fossil_share_elec",
           "renewables_share_elec", "low_carbon_share_elec", "fossil_share_energy", "carbon_intensity_elec"]
EN_UNITS = {c: "TWh" for c in EN_COLS}
EN_UNITS.update({"energy_per_capita": "kWh por persona", "fossil_share_elec": "% de la generación eléctrica", "renewables_share_elec": "% de la generación eléctrica",
                 "low_carbon_share_elec": "% de la generación eléctrica", "fossil_share_energy": "% de la energía primaria", "carbon_intensity_elec": "gCO2 por kWh"})
en = owid("owid-energy.csv", EN_COLS, "11b_ENERGIA_OWID", "SRC_OWID_ENERGY", EN_UNITS)
CO2_COLS = ["co2", "co2_per_capita", "cumulative_co2", "share_global_co2", "consumption_co2", "co2_per_gdp", "total_ghg", "methane", "nitrous_oxide", "temperature_change_from_ghg"]
CO2_UNITS = {"co2": "millones de t CO2", "co2_per_capita": "t CO2 por persona", "cumulative_co2": "millones de t CO2", "share_global_co2": "% del total mundial",
             "consumption_co2": "millones de t CO2 (basado en consumo)", "co2_per_gdp": "kg CO2 por USD PPA (2011)", "total_ghg": "millones de t CO2eq",
             "methane": "millones de t CO2eq", "nitrous_oxide": "millones de t CO2eq", "temperature_change_from_ghg": "°C"}
co2 = owid("owid-co2.csv", CO2_COLS, "31b_EMISIONES_OWID", "SRC_OWID_CO2", CO2_UNITS)

# Fraccionalización
creg = B.load_rda(P("ps/creg.rda")); creg["country_id"] = creg.ccode.map(cow_id)
hief = B.load_rda(P("ps/hief.rda")); hief["country_id"] = hief.ccode.map(cow_id)
frac = creg[["country_id", "year", "ethfrac", "ethpol", "relfrac", "relpol"]].merge(hief[["country_id", "year", "efindex"]], on=["country_id", "year"], how="outer")
frac["year"] = frac.year.astype(int)
frac = frac.dropna(subset=["country_id"]).drop_duplicates(["country_id", "year"]).sort_values(["country_id", "year"])
frac = frac.rename(columns={"ethfrac": "creg_ethnic_frac", "ethpol": "creg_ethnic_polar", "relfrac": "creg_relig_frac", "relpol": "creg_relig_polar", "efindex": "hief_ethnic_frac"})
for c, s in [("creg_ethnic_frac", "SRC_CREG"), ("creg_ethnic_polar", "SRC_CREG"), ("creg_relig_frac", "SRC_CREG"), ("creg_relig_polar", "SRC_CREG"), ("hief_ethnic_frac", "SRC_HIEF")]:
    INDICATORS.append(dict(indicator_id=c, sheet="06b_FRACCIONALIZACION", name_en=c, series_code_original=c, unit="índice 0-1", currency="", price_basis="no_monetario",
                           observation_type="indice_derivado", base_confidence="Media", source_id=s, original_source_text="", definition="Probabilidad de que dos individuos al azar pertenezcan a grupos distintos (fraccionalización) o índice de polarización",
                           limitations="Las categorías étnicas/religiosas son construcciones del dataset; no implica conflicto", table_format="panel_ancho (columna)", interpolation="ver fuente"))
CITES.append(dict(target_table="06b_FRACCIONALIZACION", target_column="*", target_records="todas las filas", source_id="SRC_CREG;SRC_HIEF", locator="peacesciencer::creg, hief", note=""))

# =============================================================================
# Ensamblado de hojas en orden
# =============================================================================
# 03
add("03_ESTADOS", master, "Catálogo maestro de Estados y entidades políticas con identificadores, vigencias y geografía básica", "entidades", "completo (actuales) / parcial (históricos)",
    pk=["country_id"], sources="SRC_MLEDOZE;SRC_VDEM;SRC_COW_STATES;SRC_GW_STATES;SRC_ICOW_COL;SRC_RUGGED;SRC_COW_MAJORS;SRC_MAOZ",
    notes="country_id = ISO 3166-1 alfa-3 para entidades actuales; código V-Dem para históricas; prefijo H_ para otras históricas. Fronteras y superficie son actuales.", required=["country_id", "name_es", "entity_type"], freeze_col=True)
ext_ids["record_id"] = ["EXT%05d" % i for i in range(1, len(ext_ids) + 1)]
add("03b_IDS_EXTERNOS", ext_ids[["record_id", "country_id", "scheme", "code", "code_label", "abbrev", "valid_from", "valid_to", "source_id", "note"]],
    "Correspondencia de identificadores (COW, Gleditsch-Ward, V-Dem, ISO) con periodos de vigencia", "entidades", "completo", pk=["record_id"], fks={"country_id": "03_ESTADOS.country_id", "source_id": "37_FUENTES.source_id"})

# 04 cambios territoriales
tc = tup(geo.TERRITORIAL_CHANGES, ["change_id", "date_start", "date_end", "territory", "from_ids", "to_ids", "change_type", "legal_status_note", "description", "certainty", "source_ids"])
tc["verification_status"] = "CONOC_EXPERTO"
# entradas/salidas del sistema interestatal COW como cambios de soberanía
cowst = B.load_rda(P("ps/cow_states.rda"))
sysrows = []
for i, r in enumerate(cowst.itertuples(), 1):
    cid = cow_id(r.ccode)
    sysrows.append(dict(change_id=f"SYS{i:04d}", date_start=f"{int(r.styear):04d}-{int(r.stmonth):02d}-{int(r.stday):02d}", date_end=(f"{int(r.endyear):04d}-{int(r.endmonth):02d}-{int(r.endday):02d}" if int(r.endyear) < 2016 else ""),
                        territory=r.statenme, from_ids="", to_ids=cid, change_type="periodo_miembro_sistema_interestatal_COW", legal_status_note="Criterios COW de pertenencia al sistema",
                        description=f"{r.statenme} ({r.stateabb}, COW {int(r.ccode)}) miembro del sistema interestatal" + ("" if int(r.endyear) >= 2016 else f" hasta {int(r.endyear)} (pérdida de independencia, ocupación o unificación)"),
                        certainty="Alta", source_ids="SRC_COW_STATES", verification_status="DATASET"))
tc = pd.concat([tc, pd.DataFrame(sysrows)], ignore_index=True)
add("04_CAMBIOS_TERRITORIALES", tc, "Cambios de fronteras y soberanía (curados) y periodos de independencia según el sistema interestatal COW", "eventos_territoriales", "parcial",
    pk=["change_id"], sources="SRC_COW_STATES;SRC_ACADEMIC_HIST", notes="from_ids/to_ids son listas separadas por ';' de country_id.", required=["source_ids"])
ind = col[["country_id", "Name", "ColRuler", "IndFrom", "IndDate", "IndViol", "IndType", "SecFrom", "SecDate", "Into", "IntoDate", "Notes"]].copy()
for c in ["ColRuler", "IndFrom", "SecFrom", "Into"]:
    ind[c + "_id"] = ind[c].map(lambda x: cow_id(x) if pd.notna(x) and x > 0 else "")
ind["IndDate"] = ind.IndDate.map(ym); ind["SecDate"] = ind.SecDate.map(ym); ind["IntoDate"] = ind.IntoDate.map(ym)
ind["Notes"] = ind.Notes.map(lambda x: "" if str(x) in ("-9", "nan") else x)
ind = ind.rename(columns={"Name": "name", "IndDate": "independence_date", "IndViol": "independence_violent_code", "IndType": "independence_type_code", "SecDate": "secession_date", "IntoDate": "absorbed_date", "Notes": "notes"})
ind = ind[["country_id", "name", "ColRuler_id", "IndFrom_id", "independence_date", "independence_violent_code", "independence_type_code", "SecFrom_id", "secession_date", "Into_id", "absorbed_date", "notes"]]
ind.insert(0, "record_id", ["IND%04d" % i for i in range(1, len(ind) + 1)])
ind["source_ids"] = "SRC_ICOW_COL"
add("04b_INDEPENDENCIAS", ind, "Historia colonial e independencia (ICOW Colonial History)", "eventos_territoriales", "completo (hasta 2002)", pk=["record_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_ICOW_COL",
    notes="Códigos IndViol/IndType según codebook ICOW (1 = violenta, etc.). Fechas AAAA-MM.")
dsp = tup(geo.DISPUTES, ["dispute_id", "name", "claimant_ids", "controller", "dispute_type", "since", "status", "strategic_value", "notes", "certainty"])
dsp["source_ids"] = "SRC_ACADEMIC_HIST"; dsp["verification_status"] = "CONOC_EXPERTO"
add("04c_DISPUTAS_TERRITORIALES", dsp, "Disputas territoriales y de soberanía vigentes o latentes (2025)", "relaciones", "parcial", pk=["dispute_id"], sources="SRC_ACADEMIC_HIST")

# 05-13 WDI ya añadidos; reordenamos al final. Añadir paneles complementarios
add("06b_FRACCIONALIZACION", frac, "Fraccionalización étnica y religiosa por país-año", "serie_estadistica", "completo (1945-2013)", pk=["country_id", "year"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_CREG;SRC_HIEF", freeze_col=True)
vdem_panel("07b_PIB_POBLACION_HIST", VDEM_HIST, 1789, "Series históricas largas modeladas (PIB, PIB pc y población de Fariss et al. vía V-Dem; inflación, comercio, rentas petroleras, urbanización, educación)")
cc = tup(history.CURRENCY_CHANGES, ["change_id", "country_id", "date", "old_currency", "new_currency", "conversion_or_regime", "description", "certainty"])
cc["source_ids"] = "SRC_IMF_AREAER;SRC_ACADEMIC_HIST"; cc["verification_status"] = "CONOC_EXPERTO"
ec = tup(history.ECON_CRISES, ["crisis_id", "country_id", "crisis_type", "start", "end", "peak_indicator", "description", "policy_response", "certainty", "source_ids"])
ec["verification_status"] = "CONOC_EXPERTO"
add("10b_COMERCIO_HIST_COW", tr.sort_values(["country_id", "year"]), "Comercio total histórico (COW Trade 1870-2014)", "serie_estadistica", "completo (1870-2014)", pk=["country_id", "year"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_COW_TRADE", freeze_col=True)
add("11b_ENERGIA_OWID", en, "Producción, consumo y matriz eléctrica (OWID energy-data)", "serie_estadistica", "completo (según OWID)", pk=["country_id", "year"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_OWID_ENERGY", freeze_col=True)
rv = tup(economy.ENERGY_RESERVES, ["reserve_id", "country_id", "resource", "value", "unit", "ref_date", "definition", "verification_status", "certainty", "source_ids"])
add("11c_RESERVAS_ENERGETICAS", rv, "Reservas probadas de petróleo y gas (10 principales, fin de 2020)", "dato_curado", "parcial", pk=["reserve_id"], sources="SRC_EI_SR")
cm = tup(economy.CRITICAL_MINERALS, ["mineral_id", "mineral", "stage", "dominant_country_ids", "share_range_text", "ref_period", "strategic_use", "vulnerability_note", "certainty", "source_ids"])
cm["verification_status"] = "CONOC_EXPERTO"
add("11d_MINERALES_CRITICOS", cm, "Concentración de minerales y productos críticos (rangos aproximados)", "dato_curado", "parcial", pk=["mineral_id"], sources="SRC_USGS_MCS2025")
nodes = tup(geo.STRATEGIC_NODES, ["node_id", "name", "node_type", "country_ids", "lat", "lon", "strategic_function", "metric", "metric_value", "metric_unit", "metric_year", "metric_source", "certainty", "notes"])
nodes["verification_status"] = nodes.metric_source.map(lambda s: "VERIF_SESION" if s == "SRC_EIA_CHOKE" else "CONOC_EXPERTO")
nodes["source_ids"] = nodes.metric_source.replace("", "SRC_ACADEMIC_HIST")
add("12b_NODOS_ESTRATEGICOS", nodes, "Estrechos, corredores, puertos, oleoductos, bases e infraestructura crítica", "dato_curado", "parcial", pk=["node_id"], sources="SRC_EIA_CHOKE;SRC_ACADEMIC_HIST")
add("13b_CAPACIDADES_HIST_COW", nmc.sort_values(["country_id", "year"]), "Capacidades materiales históricas (COW NMC 1816-2016), amenaza territorial latente y OIG", "serie_estadistica", "completo (1816-2016)",
    pk=["country_id", "year"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_COW_NMC;SRC_TERRTHREAT;SRC_COW_IGO", notes=f"Duplicados país-año eliminados por fusión de códigos COW: {dups}", freeze_col=True)
cons = tup(defense.CONSCRIPTION, ["country_id", "conscription_status", "since", "notes", "certainty"])
cons["ref_date"] = "2025"; cons["source_ids"] = "SRC_IISS_MB;SRC_ACADEMIC_HIST"; cons["verification_status"] = "CONOC_EXPERTO"
add("13c_SERVICIO_MILITAR", cons, "Régimen de servicio militar (situación 2025)", "dato_curado", "parcial", pk=["country_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_IISS_MB")
nuc = tup(defense.NUCLEAR, ["country_id", "nuclear_status", "first_test_date", "first_test_name", "warheads_total_inventory_2024_01", "warheads_total_inventory_2025_01", "npt_status", "doctrine_note", "verification_status", "source_ids", "certainty"])
add("14_DEFENSA_INVENTARIOS", nuc, "Estatus y arsenales nucleares (inventario total de ojivas, SIPRI enero 2024 y enero 2025) y programas abandonados", "dato_curado", "completo (Estados nucleares)", pk=["country_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_SIPRI_YB2025_NUC")
inv = tup(defense.STRATEGIC_INVENTORY, ["inventory_id", "country_id", "category", "item_definition", "value_low", "value_high", "ref_date", "status_note", "verification_status", "certainty", "source_ids"])
add("14b_INVENTARIOS_ESTRATEGICOS", inv, "Inventarios estratégicos seleccionados como rangos (no sustituye a The Military Balance)", "dato_curado", "parcial", pk=["inventory_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_IISS_MB",
    notes="Rangos de órdenes de magnitud de fuentes abiertas; fecha de referencia indicada; no equivalen a disponibilidad operativa.")
dc = tup(defense.DEFENSE_COMPANIES, ["company_id", "name", "country_id", "ownership", "sector", "main_products", "founded", "notes", "certainty"])
dc["source_ids"] = "SRC_SIPRI_TOP100"; dc["verification_status"] = "CONOC_EXPERTO"
add("15_DEFENSA_INDUSTRIA", dc, "Principales empresas de la industria de defensa", "dato_curado", "parcial", pk=["company_id"], sources="SRC_SIPRI_TOP100")
pr = tup(defense.PROGRAMS, ["program_id", "country_ids", "name", "program_type", "start", "status", "description", "certainty"])
pr["source_ids"] = "SRC_ACADEMIC_HIST"; pr["verification_status"] = "CONOC_EXPERTO"
add("15b_PROGRAMAS_DEFENSA", pr, "Programas de adquisición y compromisos de gasto", "dato_curado", "parcial", pk=["program_id"], sources="SRC_ACADEMIC_HIST")

# 16 conflictos
cf = tup(conflicts.CONFLICTS, ["conflict_id", "name", "category", "start", "end", "side_a", "side_b", "external_support", "territory", "declared_objectives", "structural_causes", "trigger", "outcome",
                               "territorial_change_ids", "regime_change", "deaths_low", "deaths_high", "deaths_basis", "displaced_note", "long_term_consequences", "historiographic_debate", "certainty", "source_ids"])
def ids_in(text):
    return ";".join(sorted({t for t in re.split(r"[;,/ ()+]", str(text)) if t in IDS}))
cf["participant_ids"] = (cf.side_a + ";" + cf.side_b).map(ids_in)
cf["verification_status"] = np.where(cf.conflict_id.isin(["CF051", "CF063"]), "VERIF_SESION", "CONOC_EXPERTO")
add("16_CONFLICTOS", cf, "Registro curado de guerras, conflictos y crisis 1945-2025 con estimaciones alternativas de víctimas", "eventos_conflicto", "parcial (73 conflictos principales)", pk=["conflict_id"], sources="SRC_ACADEMIC_HIST;SRC_UCDP_WEB;SRC_COW_WEB",
    notes="deaths_low/deaths_high recogen el rango de estimaciones publicadas; no se elige cifra única.", required=["source_ids"])
acd = B.load_rda(P("ps/ucdp_acd.rda"))
old = B.load_rda(P("pd/ucdpConflict.rda"))
def _g(x):
    try:
        return int(float(str(x).split(",")[0]))
    except Exception:
        return -1
old["mkey"] = old.GWNoA.map(_g).astype(str) + "|" + old.StartDate.map(B.r_date)
oldn = old.groupby("mkey").agg(location=("Location", "last"), side_a=("SideA", "last"),
                               side_b=("SideB", lambda x: "; ".join(dict.fromkeys(str(v) for v in x if isinstance(v, str)))),
                               territory_name=("TerritoryName", "last"), old_conflict_id=("ConflictId", "first"))
TYPES = {1: "extrasistemico", 2: "interestatal", 3: "intraestatal", 4: "intraestatal_internacionalizado"}
acd["type_of_conflict"] = acd.type_of_conflict.astype(str)
ag = acd.groupby("conflict_id").agg(first_year=("year", "min"), last_year=("year", "max"), active_years=("year", "nunique"), max_intensity=("intensity_level", "max"),
                                    years_war_level=("intensity_level", lambda s: int((s == 2).sum())), type_of_conflict=("type_of_conflict", "last"), incompatibility=("incompatibility", "last"),
                                    gwno_a=("gwno_a", "first"), gwno_b=("gwno_b", "first"), start_date=("start_date", "first"))
ag = ag.reset_index()
ag["country_a_id"] = ag.gwno_a.map(lambda x: gw_id(x) if pd.notna(x) else "")
ag["country_b_id"] = ag.gwno_b.map(lambda x: gw_id(x) if pd.notna(x) else "")
ag["mkey"] = ag.gwno_a.map(_g).astype(str) + "|" + ag.start_date.map(B.r_date)
ag = ag.merge(oldn, left_on="mkey", right_index=True, how="left")
ag["start_date"] = ag.start_date.map(B.r_date)
ag["conflict_id"] = ag.conflict_id.astype(int).map(lambda x: f"UCDP{x}")
for c in ["first_year", "last_year"]:
    ag[c] = ag[c].astype(int)
ag["intensity_note"] = "1 = 25-999 muertes en batalla/año; 2 = ≥1.000 (guerra)"
ag["names_source"] = np.where(ag.side_a.notna(), "UCDP ACD versión antigua (PoliticalDatasets), emparejado por gwno_a + fecha de inicio", "sin nombre en la versión descargada")
ag["source_ids"] = "SRC_UCDP_ACD;SRC_UCDP_ACD_OLD"
ag = ag[["conflict_id", "old_conflict_id", "location", "side_a", "side_b", "territory_name", "country_a_id", "country_b_id", "type_of_conflict", "incompatibility", "start_date", "first_year", "last_year", "active_years",
         "years_war_level", "max_intensity", "intensity_note", "names_source", "source_ids"]]
add("16b_UCDP_CONFLICTOS", ag.sort_values("first_year"), "Conflictos armados estatales UCDP/PRIO 1946-2024 (nivel conflicto)", "eventos_conflicto", "completo (1946-2024)", pk=["conflict_id"], sources="SRC_UCDP_ACD")
wi = B.load_rda(P("ps/cow_war_inter.rda"))
st = wi.groupby(["warnum", "ccode1"]).agg(side=("sidea1", "first"), initiator=("initiator1", "max"), outcome=("outcome1", "first"), batdeath=("batdeath1", "max"), y0=("year", "min"), y1=("year", "max")).reset_index()
OUTC = {1: "ganador", 2: "perdedor", 3: "compromiso/empate", 4: "transformado en otro tipo de guerra", 5: "en curso", 6: "statu quo ante", 7: "abandono/retirada", 8: "otro"}
st["country_id"] = st.ccode1.map(cow_id)
st["batdeath"] = st.batdeath.where(st.batdeath >= 0)
wl = []
for w, g in st.groupby("warnum"):
    a = g[g.side == 1]; b = g[g.side == 2]
    wl.append(dict(war_id=f"COWINTER{int(w)}", cow_warnum=int(w), year_start=int(g.y0.min()), year_end=int(g.y1.max()), side_a_ids=";".join(sorted(set(a.country_id))), side_b_ids=";".join(sorted(set(b.country_id))),
                   initiator_ids=";".join(sorted(set(g[g.initiator == 1].country_id))), winner_ids=";".join(sorted(set(g[g.outcome == 1].country_id))),
                   battle_deaths_sum=float(g.batdeath.sum()) if g.batdeath.notna().any() else None, battle_deaths_missing_states=int(g.batdeath.isna().sum()),
                   per_state_deaths=";".join(f"{r.country_id}:{int(r.batdeath) if pd.notna(r.batdeath) else 'NA'}" for r in g.itertuples()), source_ids="SRC_COW_WAR",
                   note="Nombre de la guerra no incluido en la versión descargada; identificar por cow_warnum y participantes"))
wl = pd.DataFrame(wl)
wi2 = B.load_rda(P("ps/cow_war_intra.rda"))
wi2g = wi2.groupby("warnum").agg(war_name=("warname", "first"), war_type=("wartype", "first"), year_start=("year", "min"), year_end=("year", "max"), primary_state=("ccodea", "first"),
                                 side_a=("sidea", "first"), side_b=("sideb", "first"), internationalized=("intnl", "max"), outcome_code=("outcome", "first"), side_a_deaths=("sideadeaths", "max"), side_b_deaths=("sidebdeaths", "max")).reset_index()
wi2g["war_id"] = wi2g.warnum.astype(int).map(lambda x: f"COWINTRA{x}")
wi2g["country_id"] = wi2g.primary_state.map(lambda x: cow_id(x) if pd.notna(x) and x > 0 else "")
for c in ["side_a_deaths", "side_b_deaths"]:
    wi2g[c] = wi2g[c].where(wi2g[c] >= 0)
wi2g["source_ids"] = "SRC_COW_WAR"
wi2g = wi2g[["war_id", "warnum", "war_name", "war_type", "country_id", "year_start", "year_end", "side_a", "side_b", "internationalized", "outcome_code", "side_a_deaths", "side_b_deaths", "source_ids"]]
wi2g["year_start"] = wi2g.year_start.astype(int); wi2g["year_end"] = wi2g.year_end.astype(int)
add("16c_COW_GUERRAS_INTER", wl, "Guerras interestatales COW 1823-2003 (nivel guerra, participantes y muertes en batalla por Estado)", "eventos_conflicto", "completo (COW v4)", pk=["war_id"], sources="SRC_COW_WAR",
    notes="Muertes -9 en la fuente convertidas a vacío; battle_deaths_missing_states indica cuántos Estados carecen de cifra.")
add("16d_COW_GUERRAS_INTRA", wi2g, "Guerras intraestatales COW 1818-2007 (nivel guerra)", "eventos_conflicto", "completo (COW v4)", pk=["war_id"], sources="SRC_COW_WAR")
pt = B.load_rda(P("pd/PowellThyne.rda"))
pt["country_id"] = pt.powell_ccode.map(cow_id)
ptd = pt[["country_id", "powell_country", "year", "month", "day", "coup"]].copy()
ptd["date"] = ptd.apply(lambda r: f"{int(r.year):04d}-{int(r.month):02d}-{int(r.day):02d}" if pd.notna(r.day) and r.day > 0 else f"{int(r.year):04d}-{int(r.month):02d}", axis=1)
ptd["outcome"] = ptd.coup.map({1: "fallido", 2: "exitoso"})
ptd = ptd.sort_values("date").reset_index(drop=True)
ptd.insert(0, "coup_id", ["COUP%04d" % i for i in range(1, len(ptd) + 1)])
ptd["source_ids"] = "SRC_PT_COUPS"
add("16e_GOLPES_ESTADO", ptd[["coup_id", "country_id", "powell_country", "date", "year", "outcome", "source_ids"]], "Golpes e intentos de golpe 1950-~2015 (Powell & Thyne)", "eventos_conflicto", "completo hasta ~2015 (ver e_pt_coup en V-Dem para años posteriores)",
    pk=["coup_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_PT_COUPS")
mid = B.load_rda(P("ps/gml_mid_disps.rda"))
part = B.load_rda(P("ps/gml_part.rda"))
part["country_id"] = part.ccode.map(cow_id)
pp = part.groupby("dispnum").apply(lambda g: pd.Series({"side_a_ids": ";".join(sorted(set(g[g.sidea == 1].country_id))), "side_b_ids": ";".join(sorted(set(g[g.sidea == 0].country_id))),
                                                       "originators": ";".join(sorted(set(g[g.orig == 1].country_id)))}))
mid = mid.merge(pp, left_on="dispnum", right_index=True, how="left")
mid["mid_id"] = mid.dispnum.astype(int).map(lambda x: f"MID{x}")
mid["source_ids"] = "SRC_GML_MID"
add("16f_DISPUTAS_MILITARIZADAS", mid[["mid_id", "dispnum", "styear", "stmon", "side_a_ids", "side_b_ids", "originators", "hostlev", "hiact", "fatality", "outcome", "settle", "mindur", "maxdur", "recip", "source_ids"]],
    "Disputas interestatales militarizadas 1816-2010 (GML MID)", "eventos_conflicto", "completo (1816-2010)", pk=["mid_id"], sources="SRC_GML_MID",
    notes="hostlev: 1 sin acción militar ... 5 guerra; códigos según codebook MID.")
ce = tup(conflicts.CONFLICT_EVENTS, ["event_id", "conflict_id", "date", "event_type", "location", "actors", "description", "significance", "certainty"])
ce["source_ids"] = "SRC_ACADEMIC_HIST"; ce["verification_status"] = "CONOC_EXPERTO"
add("17_CONFLICTOS_EVENTOS", ce, "Cronología de operaciones y acontecimientos bélicos clave", "eventos_conflicto", "parcial", pk=["event_id"], fks={"conflict_id": "16_CONFLICTOS.conflict_id"}, sources="SRC_ACADEMIC_HIST")
acdy = acd.copy()
acdy["conflict_id"] = acdy.conflict_id.astype(int).map(lambda x: f"UCDP{x}")
acdy["country_a_id"] = acdy.gwno_a.map(lambda x: gw_id(x) if pd.notna(x) else "")
acdy["country_b_id"] = acdy.gwno_b.map(lambda x: gw_id(x) if pd.notna(x) else "")
acdy["year"] = acdy.year.astype(int)
acdy["ep_end_date"] = acdy.ep_end_date.map(B.r_date)
acdy = acdy.sort_values(["conflict_id", "year"]).reset_index(drop=True)
acdy.insert(0, "record_id", ["UCY%05d" % i for i in range(1, len(acdy) + 1)])
acdy = acdy[["record_id", "conflict_id", "year", "country_a_id", "country_b_id", "type_of_conflict", "incompatibility", "intensity_level", "ep_end", "ep_end_date"]].sort_values(["conflict_id", "year"])
add("17b_UCDP_CONFLICTO_ANIO", acdy, "Conflictos UCDP por año y episodio (una fila por conflicto-año-episodio; un conflicto puede tener varias filas por año si hubo varios episodios)", "serie_conflicto", "completo (1946-2024)", pk=["record_id"], fks={"conflict_id": "16b_UCDP_CONFLICTOS.conflict_id"}, sources="SRC_UCDP_ACD")

# 18 inteligencia
ag_ = tup(intel.AGENCIES, ["agency_id", "country_id", "name", "acronym", "agency_type", "founded", "dissolved", "predecessor", "parent_body", "competences", "oversight", "official_url", "notes", "certainty"])
ag_["source_ids"] = "SRC_OFFICIAL_AGENCY;SRC_ACADEMIC_HIST"; ag_["verification_status"] = "CONOC_EXPERTO"
add("18_INTELIGENCIA", ag_, "Organismos de inteligencia, contrainteligencia y seguridad", "dato_curado", "parcial (52 organismos)", pk=["agency_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_OFFICIAL_AGENCY")
ic = tup(intel.CASES, ["case_id", "name", "date_start", "date_end", "case_type", "perpetrator", "target", "agencies", "description", "outcome", "certainty_type", "certainty", "source_ids"])
ic["verification_status"] = "CONOC_EXPERTO"
add("18b_INTELIGENCIA_CASOS", ic, "Operaciones, casos de espionaje, ciberoperaciones y fallos documentados con nivel de certeza", "dato_curado", "parcial", pk=["case_id"], sources="SRC_FRUS;SRC_CHURCH;SRC_DOJ_INDICT;SRC_NCSC_ATTR",
    notes="certainty_type distingue hechos judiciales, reconocimientos oficiales, desclasificaciones, atribuciones gubernamentales y acusaciones no verificadas.")

# 19 instituciones
ins = tup(institutions.INSTITUTIONS, ["country_id", "state_form", "government_form", "constitution_year", "last_major_reform", "legislature_structure", "lower_house", "lower_seats", "upper_house", "upper_seats",
                                      "head_of_state_term_years", "reelection_rule", "electoral_system_lower", "exec_selection", "emergency_powers_note", "central_bank", "central_bank_founded"])
ins["ref_date"] = "2025"; ins["certainty"] = "Media"; ins["source_ids"] = "SRC_CONSTITUTE;SRC_IPU_PARLINE;SRC_IDEA_ESD;SRC_BIS_CB"; ins["verification_status"] = "CONOC_EXPERTO"
add("19_INSTITUCIONES", ins, "Perfil institucional vigente (2025): forma de Estado y gobierno, constitución, legislativo, sistema electoral, banco central", "dato_curado", "parcial (66 países)", pk=["country_id"], fks={"country_id": "03_ESTADOS.country_id"},
    sources="SRC_CONSTITUTE;SRC_IPU_PARLINE", notes="Número de escaños sujeto a cambios; verificar con IPU Parline antes de uso crítico.")
ir = tup(institutions.INSTITUTIONAL_REFORMS, ["reform_id", "country_id", "date", "institution", "reform_type", "description", "certainty"])
ir["source_ids"] = "SRC_CONSTITUTE;SRC_ACADEMIC_HIST"; ir["verification_status"] = "CONOC_EXPERTO"
add("19b_REFORMAS_INSTITUCIONALES", ir, "Reformas constitucionales e institucionales clave", "eventos_institucionales", "parcial", pk=["reform_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_CONSTITUTE")
vdem_panel("19c_REGIMEN_PANEL_VDEM", VDEM_INST, 1900, "Panel país-año de régimen político, instituciones y libertades (V-Dem v16, 1900-2025)")
gwf = B.load_rda(P("pd/all_gwf_periods.rda"))
gwf["country_id"] = gwf.GWn.map(lambda x: gw_id(x) if pd.notna(x) else "")
gwf = gwf[["country_id", "gwf_casename", "gwf_full_regimetype", "gwf_startyr", "gwf_endyr", "gwf_howend", "gwf_violent", "start_event", "end_event"]].copy()
gwf.insert(0, "regime_period_id", ["GWF%04d" % i for i in range(1, len(gwf) + 1)])
gwf["source_ids"] = "SRC_GWF"
add("19d_PERIODOS_REGIMEN", gwf, "Periodos de régimen (democracia/autocracia y tipo autocrático) 1946-2010 con forma de terminación (GWF)", "eventos_institucionales", "completo (1946-2010)", pk=["regime_period_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_GWF")

# 20 gobiernos y 21 actores
arch = B.load_rda(P("ps/archigos.rda"))
lead = B.load_rda(P("ps/LEAD.rda"))
arch["country_id"] = arch.gwcode.map(lambda x: gw_id(x))
arch["startdate"] = arch.startdate.map(B.r_date); arch["enddate"] = arch.enddate.map(B.r_date)
gov = arch[["obsid", "country_id", "leadid", "leader", "startdate", "enddate", "entry", "exit", "exitcode"]].rename(columns={"obsid": "spell_id", "leadid": "person_id", "leader": "leader_name", "startdate": "start_date", "enddate": "end_date"})
gov["source_ids"] = "SRC_ARCHIGOS"; gov["dataset"] = "Archigos 4.1"
gov.loc[gov.exit == "Still in Office", "end_date"] = ""
reign = pd.read_csv(P("reign.csv"), usecols=["ccode", "country", "leader", "year", "month", "elected", "age", "male", "militarycareer", "government", "tenure_months"])
reign["country_id"] = reign.ccode.map(cow_id)
reign = reign.sort_values(["ccode", "year", "month"])
reign["ym"] = reign.year.astype(int) * 12 + reign.month.astype(int)
reign["new"] = (reign.leader != reign.groupby("ccode").leader.shift()) | (reign.ym != reign.groupby("ccode").ym.shift() + 1)
reign["sp"] = reign.new.cumsum()
rs = reign.groupby("sp").agg(country_id=("country_id", "first"), leader_name=("leader", "first"), y0=("year", "first"), m0=("month", "first"), y1=("year", "last"), m1=("month", "last"),
                             elected=("elected", "first"), age_at_start=("age", "first"), male=("male", "first"), military_career=("militarycareer", "first"), government_type_start=("government", "first"), government_type_end=("government", "last")).reset_index(drop=True)
rs["start_date"] = rs.apply(lambda r: f"{int(r.y0):04d}-{int(r.m0):02d}", axis=1)
rs["end_date"] = rs.apply(lambda r: "" if (int(r.y1) == 2021 and int(r.m1) >= 8) else f"{int(r.y1):04d}-{int(r.m1):02d}", axis=1)
rs["spell_id"] = ["REIGN%05d" % i for i in range(1, len(rs) + 1)]
# vínculo REIGN -> Archigos por solapamiento temporal en el mismo país
ag_sp = gov.copy()
ag_sp["s"] = pd.to_datetime(ag_sp.start_date, errors="coerce"); ag_sp["e"] = pd.to_datetime(ag_sp.end_date.replace("", "2015-12-31"), errors="coerce")
links = []
for r in rs.itertuples():
    s = pd.Timestamp(r.start_date + "-01"); e = pd.Timestamp(r.end_date + "-28") if r.end_date else pd.Timestamp("2021-08-31")
    cand = ag_sp[(ag_sp.country_id == r.country_id) & (ag_sp.s <= e) & (ag_sp.e >= s)]
    best, bo = "", 0
    for c in cand.itertuples():
        ov = (min(e, c.e) - max(s, c.s)).days
        last = str(c.leader_name).split()[-1].lower() if isinstance(c.leader_name, str) else ""
        if ov > bo and last and last in str(r.leader_name).lower():
            best, bo = c.person_id, ov
    links.append(best)
rs["person_id"] = [l if l else "P_REIGN_" + hashlib.md5(f"{r.country_id}|{r.leader_name}".encode()).hexdigest()[:10] for l, r in zip(links, rs.itertuples())]
rs["archigos_link"] = ["vinculado_por_solapamiento_y_apellido" if l else "sin_vinculo" for l in links]
rs["source_ids"] = "SRC_REIGN"; rs["dataset"] = "REIGN 2021-08"
gov_all = pd.concat([gov, rs[["spell_id", "country_id", "person_id", "leader_name", "start_date", "end_date", "elected", "military_career", "government_type_start", "government_type_end", "archigos_link", "source_ids", "dataset"]]], ignore_index=True)
add("20_GOBIERNOS", gov_all, "Periodos de gobierno de líderes efectivos: Archigos (1875-2015, entrada/salida) y REIGN (1950-2021, tipo de gobierno mensual agregado en periodos)", "eventos_institucionales", "completo hasta 2021; 2022-2025 en 20b",
    pk=["spell_id"], fks={"country_id": "03_ESTADOS.country_id", "person_id": "21_ACTORES.person_id"}, sources="SRC_ARCHIGOS;SRC_REIGN",
    notes="Archigos y REIGN se solapan en 1950-2015 (dos fuentes independientes, se conservan ambas). Un periodo REIGN puede dividirse si cambia de nombre.")
hh = vd[vd.year >= 1900][["country_id", "year", "v2exnamhos", "v2extithos", "v2exhoshog", "v2exnamhog", "v2extithog"]].copy()
hh["year"] = hh.year.astype(int)
hh = hh.rename(columns={"v2exnamhos": "head_of_state_name", "v2extithos": "head_of_state_title", "v2exhoshog": "hos_is_also_hog", "v2exnamhog": "head_of_gov_name", "v2extithog": "head_of_gov_title"})
hh["source_ids"] = "SRC_VDEM"
add("20b_JEFES_ESTADO_GOBIERNO_ANUAL", hh, "Nombres y títulos de jefes de Estado y de Gobierno por país-año (V-Dem v16, 1900-2025)", "serie_institucional", "completo (1900-2025)", pk=["country_id", "year"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_VDEM",
    notes="V-Dem registra el titular a 31 de diciembre (o el de mayor duración según codebook). hos_is_also_hog: 1 = misma persona.", freeze_col=True)
lead2 = lead.merge(arch[["obsid", "leadid", "leader", "yrborn", "gender", "country_id"]], on="obsid", how="right")
persons = lead2.groupby("leadid").agg(name=("leader", "first"), country_id=("country_id", "first"), birth_year=("yrborn", "first"), gender=("gender", "first"), education_level=("leveledu", "first"),
                                      military_service=("milservice", "first"), combat_experience=("combat", "first"), rebel_experience=("rebel", "first"), n_spells=("obsid", "nunique")).reset_index().rename(columns={"leadid": "person_id"})
persons["birth_year"] = persons.birth_year.where(persons.birth_year > 0)
persons["source_ids"] = "SRC_ARCHIGOS;SRC_LEAD"
full = rs.groupby("person_id").agg(full_name_reign=("leader_name", "first"), country_reign=("country_id", "first"), male_reign=("male", "first"), military_career_reign=("military_career", "first"),
                                   first_spell=("start_date", "min")).reset_index()
persons = persons.merge(full, on="person_id", how="outer")
persons["name"] = persons.name.fillna(persons.full_name_reign)
persons["country_id"] = persons.country_id.fillna(persons.country_reign)
persons["gender"] = persons.gender.fillna(persons.male_reign.map({1: "M", 0: "F", 1.0: "M", 0.0: "F"}))
persons["source_ids"] = persons.source_ids.fillna("SRC_REIGN")
persons["role_type"] = "lider_efectivo_del_ejecutivo"
persons["attribute_note"] = "Atributos biográficos LEAD solo hasta 2004; no se incluyen rasgos psicológicos"
persons = persons[["person_id", "name", "full_name_reign", "country_id", "role_type", "birth_year", "gender", "education_level", "military_service", "combat_experience", "rebel_experience", "military_career_reign", "n_spells", "attribute_note", "source_ids"]]
add("21_ACTORES", persons, "Personas: líderes efectivos (Archigos 1875-2015 y REIGN 1950-2021) con atributos biográficos LEAD", "entidades", "parcial (solo líderes ejecutivos; ministros y mandos pendientes)",
    pk=["person_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_ARCHIGOS;SRC_LEAD;SRC_REIGN",
    notes="person_id de Archigos (UUID) cuando existe; P_REIGN_* para líderes sólo presentes en REIGN. Códigos LEAD: ver codebook (leveledu 0-?).")
arl = tup(elections_actors.ACTOR_RELATIONS, ["relation_id", "actor_a", "actor_b", "relation_type", "start", "end", "description", "certainty"])
arl["source_ids"] = "SRC_ACADEMIC_HIST"; arl["verification_status"] = "CONOC_EXPERTO"
add("21b_RELACIONES_ACTORES", arl, "Relaciones históricas entre actores (sucesión, parentesco, alianza, rivalidad, ruptura)", "relaciones", "parcial", pk=["relation_id"], sources="SRC_ACADEMIC_HIST",
    notes="Actores identificados por nombre; la vinculación a person_id está pendiente (39_PENDIENTES).")

# 22 partidos y 23 elecciones
vp = B.load_rda(P("vparty.RData"))
vp["country_id"] = vp.country_text_id
vp["party_id"] = vp.v2paid.map(lambda x: f"VP{int(x)}" if pd.notna(x) else "")
pe = vp[["party_id", "country_id", "year", "v2paenname", "v2pashname", "v2pavote", "v2paseatshare", "v2panumbseat", "v2patotalseat", "v2pariglef", "v2xpa_popul", "v2xpa_antiplural", "v2pagovsup", "v2paviol", "v2paimmig"]].copy()
pe["year"] = pe.year.astype(int)
pe = pe.rename(columns={"v2paenname": "party_name_en", "v2pashname": "party_short", "v2pavote": "vote_share_pct", "v2paseatshare": "seat_share_pct", "v2panumbseat": "seats", "v2patotalseat": "total_seats",
                        "v2pariglef": "left_right_position", "v2xpa_popul": "populism_index", "v2xpa_antiplural": "anti_pluralism_index", "v2pagovsup": "government_support", "v2paviol": "rejects_violence", "v2paimmig": "immigration_position"})
pe.insert(0, "record_id", ["PE%06d" % i for i in range(1, len(pe) + 1)])
pe["source_ids"] = "SRC_VPARTY"
parties = pe.sort_values("year").groupby("party_id").agg(party_name_en=("party_name_en", "last"), party_short=("party_short", "last"), country_id=("country_id", "last"), first_election_year=("year", "min"),
                                                         last_election_year=("year", "max"), n_elections=("year", "nunique"), max_vote_share_pct=("vote_share_pct", "max"), last_left_right=("left_right_position", "last"),
                                                         last_populism_index=("populism_index", "last")).reset_index()
parties["source_ids"] = "SRC_VPARTY"
add("22_PARTIDOS", parties, "Catálogo de partidos políticos (V-Party, partidos con >5% en alguna elección, 1900-2019)", "entidades", "parcial (sin datos post-2019)", pk=["party_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_VPARTY",
    notes="left_right_position: escala latente V-Party (valores mayores = más a la derecha); populism_index 0-1.")
add("22b_PARTIDOS_ELECCIONES", pe, "Resultados e ideología de partidos por elección (V-Party)", "serie_electoral", "parcial (1900-2019)", pk=["record_id"], fks={"party_id": "22_PARTIDOS.party_id", "country_id": "03_ESTADOS.country_id"}, sources="SRC_VPARTY")
ne = B.load_rda(P("pd/nelda.rda"))
ne["country_id"] = ne.nelda_ccode.map(lambda x: cow_id(x) if pd.notna(x) else "")
ncols = ["electionid", "country_id", "nelda_country", "year", "mmdd", "types"] + [f"nelda{i}" for i in range(1, 59) if f"nelda{i}" in ne.columns]
nel = ne[ncols].copy()
nel["year"] = nel.year.astype(int)
nel["mmdd"] = nel.mmdd.map(lambda x: f"{int(float(x)):04d}" if pd.notna(x) and str(x).replace('.', '').isdigit() else str(x))
nel["date"] = nel.apply(lambda r: f"{r.year:04d}-{r.mmdd[:2]}-{r.mmdd[2:]}" if len(str(r.mmdd)) == 4 and str(r.mmdd).isdigit() else str(r.year), axis=1)
nel["source_ids"] = "SRC_NELDA"
nel = nel.drop(columns=["mmdd"])
add("23_ELECCIONES", nel, "Elecciones nacionales 1945-2012 (NELDA) con indicadores de competencia y calidad (respuestas sí/no/no aplica)", "eventos_electorales", "completo (1945-2012)", pk=["electionid"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_NELDA",
    notes="El texto exacto de las preguntas nelda1...nelda58 debe consultarse en el codebook NELDA (no se reproduce para evitar errores de transcripción).")
re_ = tup(elections_actors.RECENT_ELECTIONS, ["result_id", "country_id", "date", "election_type", "round", "candidate_or_party", "party_or_coalition", "votes", "pct", "seats", "total_seats", "turnout_pct", "result_type", "winner", "notes", "certainty"])
re_["source_ids"] = "SRC_IPU_PARLINE;SRC_IDEA_ESD"
re_["verification_status"] = np.where(re_.result_id.isin(["RE010", "RE011", "RE032", "RE033", "RE034", "RE036"]), "VERIF_SESION", "CONOC_EXPERTO")
add("23b_RESULTADOS_RECIENTES", re_, "Resultados electorales oficiales recientes seleccionados (2020-2025), separados de estimaciones de la oposición", "eventos_electorales", "parcial", pk=["result_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_IPU_PARLINE")
ve = vd[(vd.year >= 1900)][["country_id", "year", "v2eltype_0", "v2eltype_1", "v2eltype_6", "v2eltype_7", "v2eltrnout", "v2elturnhog", "v2elturnhos", "v2elmulpar", "v2elfrfair", "v2elintim", "v2x_elecreg" if "v2x_elecreg" in vd.columns else "v2x_polyarchy"]].copy()
ve = ve[(ve[["v2eltype_0", "v2eltype_1", "v2eltype_6", "v2eltype_7"]].fillna(0).sum(axis=1) > 0)]
ve["year"] = ve.year.astype(int)
for c in ["v2x_elecreg", "v2eltype_0", "v2eltype_1", "v2eltype_6", "v2eltype_7", "v2eltrnout", "v2elturnhog", "v2elturnhos", "v2elmulpar", "v2elfrfair", "v2elintim"]:
    vdem_meta(c, "23c_ELECCIONES_VDEM")
add("23c_ELECCIONES_VDEM", ve, "Años electorales (V-Dem): tipo de elección, participación, alternancia y calidad", "serie_electoral", "completo (1900-2025)", pk=["country_id", "year"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_VDEM", freeze_col=True)

# 24 diplomacia y 25 relaciones
tr_ = tup(diplomacy.TREATIES, ["treaty_id", "name", "treaty_type", "signed", "in_force", "terminated", "parties", "depositary_org", "key_provisions", "status", "certainty", "source_ids"])
tr_["verification_status"] = "CONOC_EXPERTO"
add("24_DIPLOMACIA", tr_, "Tratados y acuerdos internacionales clave (alianzas, control de armas, comercio, paz)", "dato_curado", "parcial (60 tratados)", pk=["treaty_id"], sources="SRC_UNTC;SRC_ARMS_CONTROL")
orgs = tup(diplomacy.ORGS, ["org_id", "name", "org_type", "founded", "headquarters", "purpose"])
orgs["source_ids"] = "SRC_UN_MEMBERS;SRC_NATO_MEMBERS;SRC_EU_MEMBERS;SRC_OPEC"
add("24b_ORGANIZACIONES", orgs, "Organizaciones internacionales y foros", "entidades", "parcial", pk=["org_id"], sources="SRC_UN_MEMBERS")
ms = tup(diplomacy.MEMBERSHIPS, ["org_id", "country_id", "joined", "left", "notes"])
ms.insert(0, "membership_id", ["MEM%04d" % i for i in range(1, len(ms) + 1)])
ms["source_ids"] = ms.org_id.map({"ORG_NATO": "SRC_NATO_MEMBERS", "ORG_EU": "SRC_EU_MEMBERS", "ORG_EUROZONE": "SRC_ECB_EURO", "ORG_OPEC": "SRC_OPEC"}).fillna("SRC_ACADEMIC_HIST")
ms["verification_status"] = np.where((ms.org_id == "ORG_NATO") & ms.country_id.isin(["FIN", "SWE"]), "VERIF_SESION", "CONOC_EXPERTO"); ms["certainty"] = ms.notes.map(lambda n: "Media" if "verificar" in str(n) else "Alta")
add("24c_MEMBRESIAS", ms, "Pertenencia de Estados a organizaciones con fechas de entrada y salida", "relaciones", "parcial", pk=["membership_id"], fks={"org_id": "24b_ORGANIZACIONES.org_id", "country_id": "03_ESTADOS.country_id"}, sources="SRC_NATO_MEMBERS;SRC_EU_MEMBERS")
sn = tup(diplomacy.SANCTIONS, ["sanction_id", "name", "sender", "target_ids", "start", "end", "sanction_type", "legal_basis", "scope", "trigger", "effects_note", "certainty", "source_ids"])
sn["verification_status"] = "CONOC_EXPERTO"
add("24d_SANCIONES", sn, "Regímenes de sanciones y embargos", "dato_curado", "parcial", pk=["sanction_id"], sources="SRC_OFAC;SRC_EU_SANCTIONS;SRC_UNSC_SANCTIONS")
rel = []
cont = B.load_rda(P("ps/cow_contdir.rda"))
CT = {1: "contiguidad_terrestre", 2: "contiguidad_maritima_<=12mi", 3: "contiguidad_maritima_<=24mi", 4: "contiguidad_maritima_<=150mi", 5: "contiguidad_maritima_<=400mi"}
for r in cont.itertuples():
    if r.ccode1 < r.ccode2:
        rel.append(dict(actor_a_id=cow_id(r.ccode1), actor_b_id=cow_id(r.ccode2), relationship_type=CT.get(int(r.conttype), str(r.conttype)), start_date=B.r_date(r.stdate), end_date=("" if B.r_date(r.enddate) >= "2016-12-01" else B.r_date(r.enddate)),
                        intensity_or_status=int(r.conttype), evidence="COW Direct Contiguity v3.2", source_ids="SRC_COW_CONTDIR"))
atop = B.load_rda(P("ps/atop_alliance.rda"))
atop = atop[atop.ccode1 < atop.ccode2]
for typ in ["atop_defense", "atop_offense", "atop_neutral", "atop_nonagg", "atop_consul"]:
    a = atop[atop[typ] == 1][["ccode1", "ccode2", "year"]].sort_values(["ccode1", "ccode2", "year"])
    a["gap"] = (a.year != a.groupby(["ccode1", "ccode2"]).year.shift() + 1).cumsum()
    sp = a.groupby("gap").agg(c1=("ccode1", "first"), c2=("ccode2", "first"), y0=("year", "min"), y1=("year", "max"))
    for r in sp.itertuples():
        rel.append(dict(actor_a_id=cow_id(r.c1), actor_b_id=cow_id(r.c2), relationship_type="alianza_" + typ.replace("atop_", ""), start_date=str(int(r.y0)), end_date=str(int(r.y1)) if r.y1 < 2018 else "",
                        intensity_or_status="obligacion_activa", evidence="ATOP v5 díada-año agregada en periodos consecutivos", source_ids="SRC_ATOP"))
for r in B.load_rda(P("ps/td_rivalries.rda")).itertuples():
    rel.append(dict(actor_a_id=cow_id(r.ccode1), actor_b_id=cow_id(r.ccode2), relationship_type="rivalidad_estrategica", start_date=str(int(r.styear)), end_date=str(int(r.endyear)) if r.endyear < 2010 else "",
                    intensity_or_status=";".join(str(x) for x in [r.type1, r.type2, r.type3] if isinstance(x, str) and x), evidence=f"Thompson & Dreyer: {r.rivalryname}", source_ids="SRC_TD_RIV"))
for r in B.load_rda(P("ps/tss_rivalries.rda")).itertuples():
    kinds = [k for k in ["positional", "spatial", "ideological", "interventionary"] if getattr(r, k) == 1]
    rel.append(dict(actor_a_id=cow_id(r.ccode1), actor_b_id=cow_id(r.ccode2), relationship_type="rivalidad_interestatal", start_date=str(int(r.start)), end_date=str(int(r.end)) if r.end < 2020 else "",
                    intensity_or_status=";".join(kinds) + ("; principal" if r.principal == 1 else ""), evidence=f"Thompson, Sakuwa & Suhas: {r.rivalry}", source_ids="SRC_TSS_RIV"))
for r in B.load_rda(P("ps/grh_arms_races.rda")).itertuples():
    rel.append(dict(actor_a_id=cow_id(r.ccode1), actor_b_id=cow_id(r.ccode2), relationship_type="carrera_armamentista", start_date=str(int(r.styear)), end_date=str(int(r.endyear)),
                    intensity_or_status="", evidence="Gibler, Rider & Hutchison", source_ids="SRC_GRH_ARMS"))
rel = pd.DataFrame(rel)
rel.insert(0, "relationship_id", ["REL%06d" % i for i in range(1, len(rel) + 1)])
add("25_RELACIONES_ESTADOS", rel, "Relaciones bilaterales con vigencia temporal: contigüidad, alianzas (ATOP), rivalidades y carreras armamentistas", "relaciones", "completo para las fuentes incluidas; relaciones diplomáticas formales pendientes",
    pk=["relationship_id"], fks={"actor_a_id": "03_ESTADOS.country_id", "actor_b_id": "03_ESTADOS.country_id"}, sources="SRC_COW_CONTDIR;SRC_ATOP;SRC_TD_RIV;SRC_TSS_RIV;SRC_GRH_ARMS",
    notes="Se registran relaciones observadas; no se calcula ninguna 'puntuación de amistad'. Ver 35_PARAMETROS_JUEGO para índices modelados.")

# 26 historia
ev = tup(history.EVENTS, ["event_id", "start_date", "end_date", "country_ids", "geographic_scope", "event_type", "event_name", "description", "antecedents", "immediate_consequences", "long_term_consequences", "certainty"])
ev["country_ids"] = ev.country_ids.str.replace("GLOBAL", "WLD")
ev["source_ids"] = "SRC_ACADEMIC_HIST;SRC_BRITANNICA"; ev["verification_status"] = "CONOC_EXPERTO"
add("26_HISTORIA", ev, "Cronología de acontecimientos históricos (antecedentes pre-1945 y 1945-2025)", "eventos_historicos", "parcial", pk=["event_id"], sources="SRC_ACADEMIC_HIST", required=["source_ids"])
ec["country_id"] = ec.country_id.replace("GLOBAL", "WLD")
add("26b_CRISIS_ECONOMICAS", ec, "Crisis económicas: hiperinflaciones, defaults, crisis bancarias y cambiarias, shocks", "eventos_economicos", "parcial", pk=["crisis_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_LAEVEN_VALENCIA;SRC_HANKE_KRUS")
add("26c_CAMBIOS_MONETARIOS", cc, "Cambios de moneda, redenominaciones y regímenes cambiarios", "eventos_economicos", "parcial", pk=["change_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_IMF_AREAER")

# 29 administración pública (V-Dem capacidad) y 30 empresas
vdem_panel("29_ADMIN_PUBLICA", VDEM_ADMIN, 1900, "Capacidad estatal y calidad administrativa (V-Dem y WGI vía V-Dem)")
co = tup(economy.COMPANIES, ["company_id", "name", "country_id", "sector", "ownership_current", "founded", "ownership_events", "strategic_role", "certainty"])
co["ref_date"] = "2025"; co["source_ids"] = "SRC_FT500_FORTUNE;SRC_ACADEMIC_HIST"; co["verification_status"] = "CONOC_EXPERTO"
add("30_EMPRESAS", co, "Empresas estratégicas (energía, minería, tecnología, banca, transporte) con historia de propiedad", "dato_curado", "parcial", pk=["company_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_FT500_FORTUNE")
vdem_panel("28b_REPRESION_VIOLENCIA", VDEM_SEC, 1900, "Violencia política, represión y control territorial (V-Dem)")
ds = tup(history.DISASTERS, ["disaster_id", "country_ids", "date", "disaster_type", "name", "deaths_low", "deaths_high", "economic_loss_usd_bn", "loss_basis", "notes", "certainty"])
ds["country_ids"] = ds.country_ids.str.replace("EUU", "EUU")
ds["source_ids"] = "SRC_EMDAT"; ds["verification_status"] = "CONOC_EXPERTO"
add("31c_CATASTROFES", ds, "Catástrofes naturales y humanitarias mayores con rangos de víctimas", "eventos_historicos", "parcial", pk=["disaster_id"], sources="SRC_EMDAT")
add("31b_EMISIONES_OWID", co2, "Emisiones de CO2 y GEI (OWID co2-data)", "serie_estadistica", "completo (según OWID)", pk=["country_id", "year"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_OWID_CO2", freeze_col=True)

# 33 causales, 34 escenarios
ca = tup(causal.CAUSAL, ["causal_id", "source_variable", "target_variable", "relation", "mechanism", "necessary_conditions", "time_lag", "supporting_cases", "contradicting_cases", "evidence_class", "certainty", "engine_applicability", "source_ids"])
ca["verification_status"] = "CONOC_EXPERTO"
add("33_EVENTOS_CAUSALES", ca, "Relaciones causales documentadas entre variables/acontecimientos, con condiciones y contraejemplos", "modelo_causal", "parcial (30 relaciones)", pk=["causal_id"], sources="SRC_ACADEMIC_HIST")
sc = tup(scenarios.SCENARIOS, ["scenario_id", "name", "start_date", "reference_region", "focus_country_ids", "political_situation", "economic_conditions", "military_capabilities", "international_relations", "active_conflict_ids",
                                "social_situation", "institutions", "recent_events", "threats", "opportunities", "missing_data", "notes", "source_ids"])
sc["focus_country_ids"] = sc.focus_country_ids.str.replace("GLOBAL", "WLD")
add("34_ESCENARIOS", sc, "Escenarios históricos de inicio de partida", "escenarios", "parcial (20 escenarios)", pk=["scenario_id"], sources="SRC_ACADEMIC_HIST")

# =============================================================================
# 32 Indicadores comparados, 34b instantáneas de escenarios, 35 parámetros
# =============================================================================
def panel(name):
    for t in TABLES:
        if t["name"] == name:
            return t["df"]
    raise KeyError(name)
SNAP = [("población (WDI)", "05_DEMOGRAFIA", "sp_pop_totl"), ("PIB USD corrientes (WDI)", "07_MACROECONOMIA", "ny_gdp_mktp_cd"),
        ("PIB pc PPA USD 2021 constantes (WDI)", "07_MACROECONOMIA", "ny_gdp_pcap_pp_kd"), ("crecimiento PIB % (WDI)", "07_MACROECONOMIA", "ny_gdp_mktp_kd_zg"),
        ("inflación IPC % (WDI)", "07_MACROECONOMIA", "fp_cpi_totl_zg"), ("deuda gobierno central % PIB (WDI)", "08_FINANZAS_PUBLICAS", "gc_dod_totl_gd_zs"),
        ("gasto militar % PIB (SIPRI)", "13_DEFENSA_PRESUPUESTOS", "ms_mil_xpnd_gd_zs"), ("gasto militar USD corrientes (SIPRI)", "13_DEFENSA_PRESUPUESTOS", "ms_mil_xpnd_cd"),
        ("personal fuerzas armadas (WDI)", "13_DEFENSA_PRESUPUESTOS", "ms_mil_totl_p1"), ("importaciones netas de energía % uso (WDI)", "11_RECURSOS_ENERGIA", "eg_imp_cons_zs"),
        ("rentas recursos naturales % PIB (WDI)", "11_RECURSOS_ENERGIA", "ny_gdp_totl_rt_zs"), ("exportaciones % PIB (WDI)", "10_COMERCIO", "ne_exp_gnfs_zs"),
        ("desempleo % (WDI, OIT modelado)", "06_INDICADORES_SOCIALES", "sl_uem_totl_zs"), ("homicidios por 100.000 (WDI)", "28_SEGURIDAD_INTERIOR", "vc_ihr_psrc_p5"),
        ("democracia electoral 0-1 (V-Dem)", "19c_REGIMEN_PANEL_VDEM", "v2x_polyarchy"), ("régimen RoW 0-3 (V-Dem)", "19c_REGIMEN_PANEL_VDEM", "v2x_regime"),
        ("corrupción política 0-1 (V-Dem)", "19c_REGIMEN_PANEL_VDEM", "v2x_corr"), ("índice CINC (COW)", "13b_CAPACIDADES_HIST_COW", "cow_cinc_share"),
        ("población miles (COW)", "13b_CAPACIDADES_HIST_COW", "cow_total_pop_thousands"), ("gasto militar miles USD (COW)", "13b_CAPACIDADES_HIST_COW", "cow_milex_thousand_usd_current"),
        ("PIB pc modelado (V-Dem/Fariss)", "07b_PIB_POBLACION_HIST", "e_gdppc")]
series = {}
for label, sh, col in SNAP:
    d = panel(sh)[["country_id", "year", col]].dropna()
    series[col] = (label, sh, d)
def latest(col, cid, year, max_age):
    label, sh, d = series[col]
    s = d[(d.country_id == cid) & (d.year <= year) & (d.year >= year - max_age)]
    if not len(s):
        return None, None
    r = s.loc[s.year.idxmax()]
    return r[col], int(r.year)
BENCH = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024]
cmp_rows = []
by_country = {col: {cid: g for cid, g in d.groupby("country_id")} for col, (label, sh, d) in series.items()}
def latest_fast(col, cid, year, max_age):
    g = by_country[col].get(cid)
    if g is None:
        return None, None
    s = g[(g.year <= year) & (g.year >= year - max_age)]
    if not len(s):
        return None, None
    r = s.loc[s.year.idxmax()]
    return r[col], int(r.year)
for cid in master.country_id:
    for y in BENCH:
        for col, (label, sh, d) in series.items():
            v, yy = latest_fast(col, cid, y, 0)
            if v is not None:
                cmp_rows.append(dict(country_id=cid, benchmark_year=y, indicator_id=col, indicator_label=label, value=v, data_year=yy, source_sheet=sh))
cmp = pd.DataFrame(cmp_rows)
cmp.insert(0, "record_id", ["CMP%07d" % i for i in range(1, len(cmp) + 1)])
add("32_INDICADORES_COMPARADOS", cmp, "Indicadores clave comparables en años de referencia (formato largo; solo valores observados en el año exacto)", "serie_derivada", "completo para los indicadores seleccionados",
    pk=["record_id"], fks={"country_id": "03_ESTADOS.country_id"}, sources="SRC_WDI;SRC_VDEM;SRC_COW_NMC", notes="No se arrastran valores de otros años: data_year = benchmark_year siempre.")
snap_rows = []
for s in scenarios.SCENARIOS:
    sid, name, start = s[0], s[1], s[2]
    y = int(start[:4])
    for cid in s[4].replace("GLOBAL", "WLD").split(";"):
        for col, (label, sh, d) in series.items():
            v, yy = latest_fast(col, cid, y, 3)
            snap_rows.append(dict(scenario_id=sid, country_id=cid, indicator_id=col, indicator_label=label, value=v, data_year=yy,
                                  age_years=(y - yy) if yy else None, data_status=("ok" if yy == y else ("dato_previo_hasta_3_años" if yy else "sin_dato")), source_sheet=sh))
snap = pd.DataFrame(snap_rows)
snap.insert(0, "record_id", ["SNP%06d" % i for i in range(1, len(snap) + 1)])
add("34b_ESCENARIOS_PAISES", snap, "Instantáneas cuantitativas por escenario y país (último dato ≤ año del escenario, máximo 3 años de antigüedad; nunca datos posteriores)", "escenarios", "completo según disponibilidad",
    pk=["record_id"], fks={"scenario_id": "34_ESCENARIOS.scenario_id", "country_id": "03_ESTADOS.country_id"}, sources="SRC_WDI;SRC_VDEM;SRC_COW_NMC",
    notes="data_status indica si el dato es del mismo año, previo o inexistente. Nunca se usan datos posteriores a la fecha de inicio.")

# Parámetros del juego (derivados con método explícito)
PARAMS = [
 ("PAR01", "capacidad_economica_relativa", "Peso económico relativo del país en el mundo", "proporción 0-1 del PIB mundial (USD corrientes)", "ny_gdp_mktp_cd", "PIB del país / suma del PIB de todos los países con dato ese año", "Ignora PPA; suma solo países con dato", "Alta"),
 ("PAR02", "capacidad_militar_material_COW", "Capacidad material compuesta histórica", "índice CINC (proporción del sistema)", "cow_cinc_share", "Valor CINC observado (COW), no transformado", "CINC ≠ poder efectivo (no considera tecnología, entrenamiento ni logística)", "Media"),
 ("PAR03", "esfuerzo_defensa", "Esfuerzo de defensa", "categórico: bajo (<1,5% PIB) / medio (1,5-3%) / alto (3-6%) / muy alto (>6%)", "ms_mil_xpnd_gd_zs", "Umbrales fijos aplicados al gasto militar % PIB", "Umbrales convencionales elegidos para el juego", "Media"),
 ("PAR04", "estabilidad_regimen_institucional", "Grado de democracia electoral (insumo para estabilidad y legitimidad)", "categórico RoW: autocracia cerrada / autocracia electoral / democracia electoral / democracia liberal", "v2x_regime", "Clasificación V-Dem RoW sin modificación", "No mide estabilidad per se; usar con historial de golpes", "Alta"),
 ("PAR05", "riesgo_golpe_base", "Riesgo base de golpe de Estado", "categórico: bajo / medio / alto", "e_pt_coup;e_pt_coup_attempts;v2x_regime", "Alto si hubo intento de golpe en los 10 años previos; medio si régimen autocrático sin golpes recientes; bajo si democracia sin golpes en 10 años", "Regla heurística basada en la 'trampa del golpe' (CL011)", "Media"),
 ("PAR06", "vulnerabilidad_energetica", "Dependencia de importaciones energéticas", "categórico: exportador neto (<0%) / baja (0-30%) / media (30-60%) / alta (>60%)", "eg_imp_cons_zs", "Umbrales sobre importaciones netas de energía % del uso", "Último dato disponible ≤ año", "Alta"),
 ("PAR07", "dependencia_rentas", "Dependencia de rentas de recursos naturales", "categórico: baja (<5% PIB) / media (5-15%) / alta (>15%)", "ny_gdp_totl_rt_zs", "Umbrales sobre rentas totales % PIB", "Rentas estimadas por el Banco Mundial con precios internacionales", "Media"),
 ("PAR08", "espacio_fiscal", "Margen fiscal aproximado", "categórico: amplio (<40% PIB) / moderado (40-80%) / estrecho (80-120%) / crítico (>120%)", "gc_dod_totl_gd_zs", "Umbrales sobre deuda del gobierno central % PIB", "Cobertura incompleta; deuda central ≠ deuda general", "Media"),
 ("PAR09", "control_corrupcion", "Nivel de corrupción política", "continuo 0-1 (V-Dem, mayor = más corrupción)", "v2x_corr", "Valor V-Dem observado", "Estimación de expertos", "Media"),
 ("PAR10", "presion_inflacionaria", "Presión inflacionaria", "categórico: baja (<5%) / moderada (5-15%) / alta (15-50%) / muy alta (50-1000%) / hiperinflación (>1000%)", "fp_cpi_totl_zg", "Umbrales sobre inflación IPC anual", "", "Alta"),
]
pdef = pd.DataFrame(PARAMS, columns=["parameter_id", "name", "description", "scale_unit", "historical_variables", "method", "assumptions_limitations", "confidence"])
pdef["value_class"] = "C_parametro_simulacion"
pdef["source_ids"] = "SRC_WDI;SRC_VDEM;SRC_COW_NMC"
add("35_PARAMETROS_JUEGO", pdef, "Definición de parámetros de simulación derivados (clase C: NO son estadísticas oficiales)", "parametros_modelados", "parcial (10 parámetros)", pk=["parameter_id"], sources="SRC_WDI;SRC_VDEM;SRC_COW_NMC")
gdp = series["ny_gdp_mktp_cd"][2]
world = gdp.groupby("year").ny_gdp_mktp_cd.sum()
cinc = series["cow_cinc_share"][2]
coup_v = vd[["country_id", "year", "e_pt_coup", "e_pt_coup_attempts"]]
def cat(v, cuts, labels):
    if v is None or pd.isna(v): return None
    for c, l in zip(cuts, labels):
        if v < c: return l
    return labels[-1]
pv = []
for s in scenarios.SCENARIOS:
    sid, y = s[0], int(s[2][:4])
    for cid in s[4].replace("GLOBAL", "WLD").split(";"):
        def add_p(pid, val, var_year, basis):
            pv.append(dict(scenario_id=sid, country_id=cid, parameter_id=pid, value=val, basis_data_year=var_year, basis_values=basis, valid_for_date=s[2], value_class="C_parametro_simulacion",
                           status=("calculado" if val is not None else "pendiente_sin_datos")))
        v, yy = latest_fast("ny_gdp_mktp_cd", cid, y, 3)
        add_p("PAR01", round(v / world.get(yy), 5) if v is not None and yy in world.index else None, yy, f"PIB={v}")
        v, yy = latest_fast("cow_cinc_share", cid, y, 3); add_p("PAR02", v, yy, f"CINC={v}")
        v, yy = latest_fast("ms_mil_xpnd_gd_zs", cid, y, 3); add_p("PAR03", cat(v, [1.5, 3, 6], ["bajo", "medio", "alto", "muy_alto"]), yy, f"milex%PIB={v}")
        v, yy = latest_fast("v2x_regime", cid, y, 1); add_p("PAR04", {0: "autocracia_cerrada", 1: "autocracia_electoral", 2: "democracia_electoral", 3: "democracia_liberal"}.get(int(v)) if v is not None else None, yy, f"RoW={v}")
        c = coup_v[(coup_v.country_id == cid) & (coup_v.year < y) & (coup_v.year >= y - 10)]
        reg, ry = latest_fast("v2x_regime", cid, y, 1)
        if len(c) and reg is not None:
            att = (c.e_pt_coup_attempts.fillna(0).sum() + c.e_pt_coup.fillna(0).sum()) > 0
            val = "alto" if att else ("medio" if reg <= 1 else "bajo")
        else:
            val = None
        add_p("PAR05", val, ry, f"golpes/intentos 10 años previos={'sí' if len(c) and ((c.e_pt_coup_attempts.fillna(0).sum() + c.e_pt_coup.fillna(0).sum()) > 0) else 'no'}; RoW={reg}")
        v, yy = latest_fast("eg_imp_cons_zs", cid, y, 3); add_p("PAR06", cat(v, [0, 30, 60], ["exportador_neto", "baja", "media", "alta"]), yy, f"imp_netas%={v}")
        v, yy = latest_fast("ny_gdp_totl_rt_zs", cid, y, 3); add_p("PAR07", cat(v, [5, 15], ["baja", "media", "alta"]), yy, f"rentas%PIB={v}")
        v, yy = latest_fast("gc_dod_totl_gd_zs", cid, y, 3); add_p("PAR08", cat(v, [40, 80, 120], ["amplio", "moderado", "estrecho", "critico"]), yy, f"deuda%PIB={v}")
        v, yy = latest_fast("v2x_corr", cid, y, 1); add_p("PAR09", round(float(v), 3) if v is not None else None, yy, f"v2x_corr={v}")
        v, yy = latest_fast("fp_cpi_totl_zg", cid, y, 3); add_p("PAR10", cat(v, [5, 15, 50, 1000], ["baja", "moderada", "alta", "muy_alta", "hiperinflacion"]), yy, f"inflacion={v}")
pvd = pd.DataFrame(pv)
pvd.insert(0, "record_id", ["PV%06d" % i for i in range(1, len(pvd) + 1)])
add("35b_PARAMETROS_VALORES", pvd, "Valores de parámetros por escenario y país, con año del dato base (clase C)", "parametros_modelados", "completo según disponibilidad", pk=["record_id"],
    fks={"parameter_id": "35_PARAMETROS_JUEGO.parameter_id", "scenario_id": "34_ESCENARIOS.scenario_id", "country_id": "03_ESTADOS.country_id"}, sources="SRC_WDI;SRC_VDEM;SRC_COW_NMC")

# =============================================================================
# Tablas de metadatos: fuentes, citas, indicadores, calidad, pendientes, importación, diccionario, índice, léame
# =============================================================================
for t in TABLES:
    if t["sources"] and not t["name"].startswith(tuple(WDI_THEMES.keys())):
        CITES.append(dict(target_table=t["name"], target_column="(tabla completa)", target_records="todas las filas", source_id=t["sources"], locator="ver columna source_ids de cada fila cuando exista", note=t["notes"][:300]))
# citas a nivel de registro para tablas curadas con source_ids por fila
for t in TABLES:
    df = t["df"]
    if "source_ids" in df.columns and t["pk"] and len(df) < 5000 and len(t["pk"]) == 1:
        for r in df[[t["pk"][0], "source_ids"] + (["verification_status"] if "verification_status" in df.columns else [])].itertuples(index=False):
            CITES.append(dict(target_table=t["name"], target_column="(registro)", target_records=str(r[0]), source_id=r[1], locator="registro curado" if len(r) > 2 and r[2] == "CONOC_EXPERTO" else "registro de dataset",
                              note=(f"verification_status={r[2]}" if len(r) > 2 else "")))
cit = pd.DataFrame(CITES)
cit.insert(0, "citation_id", ["CIT%06d" % i for i in range(1, len(cit) + 1)])
indf = pd.DataFrame(INDICATORS).drop_duplicates(["indicator_id", "sheet"])
indf["last_verified"] = TODAY

# Calidad de datos: cobertura por indicador
qual = []
for t in TABLES:
    df = t["df"]
    if t["category"] == "serie_estadistica" and "year" in df.columns:
        for c in df.columns:
            if c in ("country_id", "year"):
                continue
            s = df[["country_id", "year", c]].dropna()
            zero_share = float((s[c] == 0).mean()) if len(s) and pd.api.types.is_numeric_dtype(s[c]) else None
            qual.append(dict(sheet=t["name"], indicator_id=c, n_observations=len(s), n_countries=s.country_id.nunique(), first_year=int(s.year.min()) if len(s) else None,
                             last_year=int(s.year.max()) if len(s) else None, pct_filled_in_panel=round(100 * len(s) / max(len(df), 1), 1), share_exact_zero=round(zero_share, 4) if zero_share is not None else None,
                             issue=("revisar ceros: posible codificación de faltantes" if zero_share and zero_share > 0.3 and not c.startswith(("v2el", "e_pt", "e_coups", "e_civil", "v2x_ex", "e_democracy", "vc_btl", "vc_idp", "owid_", "e_fh", "e_boix")) else "")))
qual = pd.DataFrame(qual)
issues = pd.DataFrame([
 dict(issue_id="Q001", scope="Global", issue="Portales oficiales (Banco Mundial, FMI, SIPRI, UCDP, COW, V-Dem) bloqueados por la política de red del entorno de construcción", impact="Se usaron réplicas públicas en GitHub con hash SHA-256 registrado", action="Re-descargar desde la fuente oficial al actualizar"),
 dict(issue_id="Q002", scope="Tablas curadas", issue="Los registros con verification_status=CONOC_EXPERTO se compilaron a partir de historiografía de referencia sin contraste línea a línea durante la construcción", impact="Posibles errores puntuales en fechas o cifras", action="Verificar contra las fuentes citadas antes de usos críticos; ver 36c_VERIFICACION_MUESTRAL"),
 dict(issue_id="Q003", scope="WDI", issue="Las series se revisan retroactivamente; valores de 2023-2024 son preliminares en muchos países", impact="Cambios en futuras ediciones", action="Registrar versión del WDI usada (datapackage 1.1.0, 2026-05)"),
 dict(issue_id="Q004", scope="V-Dem e_miinflat", issue="Interpolación lineal de huecos aplicada por la fuente original", impact="Serie no observada en todos los años", action="Señalado en 02b_INDICADORES.interpolation"),
 dict(issue_id="Q005", scope="UCDP", issue="La versión 1946-2024 descargada no incluye nombres de actores", impact="Conflictos post-2014 sin nombre ni localización textual", action="Nombres añadidos desde la versión antigua cuando coincide conflict_id"),
 dict(issue_id="Q006", scope="COW guerras interestatales", issue="La versión descargada no incluye el nombre de cada guerra", impact="Identificación por número y participantes", action="Cruzar con 16_CONFLICTOS curado o con el fichero oficial COW"),
 dict(issue_id="Q007", scope="Inventarios militares", issue="Sin acceso a The Military Balance (IISS) ni a bases de inventarios", impact="14b solo contiene rangos estratégicos seleccionados", action="Completar con IISS/SIPRI; ver 39_PENDIENTES"),
 dict(issue_id="Q008", scope="Entidades continuadoras", issue="URSS, Yugoslavia y Checoslovaquia se codifican como continuidad de RUS, SRB y CZE (convención COW/V-Dem)", impact="Series pre-1991/1992 bajo el código del sucesor", action="Ver 03_ESTADOS.entity_note y 04_CAMBIOS_TERRITORIALES"),
 dict(issue_id="Q009", scope="Confianza", issue="La confianza de observaciones económicas WDI se rebaja un nivel en años de autocracia cerrada (V-Dem RoW=0)", impact="Regla documentada, no juicio caso a caso", action="Ver 00_LEEME §Confianza"),
 dict(issue_id="Q010", scope="Fechas", issue="Fechas parciales (AAAA o AAAA-MM) cuando la fuente no da el día", impact="Se almacenan como texto ISO; las columnas con fechas completas se guardan como fecha de Excel", action=""),
 dict(issue_id="Q011", scope="Archigos/REIGN", issue="Dos fuentes independientes de líderes se solapan 1950-2015", impact="Posibles duplicados de periodos con nombres distintos", action="Columna dataset y archigos_link para distinguir"),
 dict(issue_id="Q013", scope="WDI", issue="~2.900 series país-indicador presentan tramos perfectamente lineales de ≥6 años (sobre todo superficie, uso del suelo, acceso a servicios y estimaciones modeladas)", impact="Probable interpolación o extrapolación realizada por la fuente original, no por esta base", action="Tratar como estimación; ver validation_report.md"),
 dict(issue_id="Q012", scope="Cobertura temporal", issue="Datos estadísticos hasta 2024 (V-Dem hasta 2025); acontecimientos curados hasta mediados de 2025", impact="Acontecimientos de fines de 2025 y 2026 no cubiertos sistemáticamente", action="Actualizar"),
])
# Verificación muestral (contrastes realizados en la sesión)
ver = pd.DataFrame([
 dict(check_id="V001", table="14_DEFENSA_INVENTARIOS", record="USA, RUS, CHN, FRA, GBR, IND, PAK, ISR, PRK", field="warheads_total_inventory_2024_01 / 2025_01", value_in_db="ver tabla", value_in_source="Coinciden con la tabla SIPRI reproducida por la Prefectura de Hiroshima (enero 2024 y enero 2025); total mundial 12.241 (2025)", method="busqueda_web", result="coincide", source_id="SRC_SIPRI_YB2025_NUC"),
 dict(check_id="V002", table="12b_NODOS_ESTRATEGICOS", record="NODE002 (Malaca)", field="metric_value", value_in_db="23,7 Mb/d (2023)", value_in_source="23,7 millones b/d en 2023 (resumen de datos EIA)", method="busqueda_web", result="coincide (fuente secundaria)", source_id="SRC_EIA_CHOKE"),
 dict(check_id="V003", table="12b_NODOS_ESTRATEGICOS", record="NODE001, NODE003 (Ormuz, Suez)", field="metric_value", value_in_db="18,5 y 5,5 Mb/d (2016)", value_in_source="Tabla EIA 2017 citada en resultados: Ormuz 18,5; Suez+SUMED 5,5 (2016)", method="busqueda_web", result="coincide; dato de 2016 (no actual)", source_id="SRC_EIA_CHOKE"),
 dict(check_id="V004", table="11c_RESERVAS_ENERGETICAS", record="RV001-RV020", field="value", value_in_db="ver tabla", value_in_source="No se pudieron obtener las cifras por país en la búsqueda", method="busqueda_web", result="NO verificado", source_id="SRC_EI_SR"),
 dict(check_id="V006", table="23b_RESULTADOS_RECIENTES", record="RE010, RE011 (Argentina 2023, 2ª vuelta)", field="votes / pct", value_in_db="14.476.462 (55,65%) / 11.516.142 (44,35%)", value_in_source="Votos idénticos (La Gaceta, 99,3% escrutado: 55,7% / 44,3%); los porcentajes con dos decimales no aparecieron en los resultados", method="busqueda_web", result="votos coinciden; % redondeados coinciden, decimales no confirmados", source_id="SRC_IPU_PARLINE"),
 dict(check_id="V007", table="24c_MEMBRESIAS", record="FIN y SWE en ORG_NATO", field="joined", value_in_db="2023-04-04 / 2024-03-07", value_in_source="Finlandia 4 de abril de 2023; Suecia 7 de marzo de 2024 (depósito del instrumento de adhesión)", method="busqueda_web", result="coincide", source_id="SRC_NATO_MEMBERS"),
 dict(check_id="V008", table="23b_RESULTADOS_RECIENTES", record="RE032-RE036 (Alemania 2025)", field="pct / seats", value_in_db="CDU/CSU 28,5% 208; AfD 20,8% 152; SPD 16,4% 120; Linke 64", value_in_source="CDU/CSU 28,5% y 208 escaños; AfD 20,8% y 152; SPD 16,4% y 120; Linke 64 (alguna fuente da 69, inconsistente)", method="busqueda_web", result="coincide", source_id="SRC_IPU_PARLINE"),
 dict(check_id="V009", table="16_CONFLICTOS", record="CF051 (Perú)", field="deaths_low/high", value_in_db="69.000-69.280", value_in_source="CVR: cifra más probable 69.280 (estimación de múltiples sistemas, IC 95%)", method="busqueda_web", result="coincide", source_id="SRC_ACADEMIC_HIST"),
 dict(check_id="V010", table="16_CONFLICTOS", record="CF063 (Chile)", field="deaths_low/high", value_in_db="3.197", value_in_source="Rettig + Corporación de Reparación: 3.197 muertos y desaparecidos; Valech I y II: ~30.000-40.000 víctimas reconocidas de prisión política y tortura (fuentes secundarias no coinciden en la cifra exacta)", method="busqueda_web", result="coincide (cifra corregida a 3.197 tras el contraste)", source_id="SRC_ACADEMIC_HIST"),
 dict(check_id="V005", table="11d_MINERALES_CRITICOS", record="CM001-CM011", field="share_range_text", value_in_db="ver tabla", value_in_source="Se confirmó la existencia de MCS 2025; cifras por país no accesibles", method="busqueda_web", result="NO verificado", source_id="SRC_USGS_MCS2025"),
])
pend = pd.DataFrame([
 dict(pending_id="PD001", area="Defensa – inventarios", scope="Todos los países", description="Inventarios completos (aeronaves, buques, blindados, artillería, defensa aérea) por año con estado y disponibilidad", reason="Fuentes (IISS Military Balance, Oryx, SIPRI Arms Transfers por sistema) no accesibles o de pago", priority="Alta"),
 dict(pending_id="PD002", area="Comercio bilateral", scope="Todos", description="Socios comerciales principales y composición por producto (UN Comtrade, BACI)", reason="UN Comtrade bloqueado", priority="Alta"),
 dict(pending_id="PD003", area="Finanzas públicas FMI", scope="Todos", description="Balance y deuda del gobierno general (WEO/GFS); rendimientos soberanos; tipos oficiales de bancos centrales", reason="Portales del FMI y BIS bloqueados; WDI solo cubre gobierno central", priority="Alta"),
 dict(pending_id="PD004", area="Elecciones", scope="Post-2012 (NELDA) y post-2019 (V-Party)", description="Resultados completos por candidato/partido y distribución territorial del voto", reason="Fuentes oficiales nacionales y bases (ParlGov, CLEA) no accesibles", priority="Alta"),
 dict(pending_id="PD005", area="Encuestas y aprobación presidencial", scope="Todos", description="Series de aprobación (p.ej. Executive Approval Project)", reason="No accesible", priority="Media"),
 dict(pending_id="PD006", area="Actores", scope="Todos", description="Ministros, altos mandos, diplomáticos (WhoGov) y vínculo de 21b a person_id", reason="No descargado", priority="Media"),
 dict(pending_id="PD007", area="Administración pública", scope="Todos", description="Ministerios, agencias, presupuestos y dotación de personal por organismo", reason="Requiere fuentes nacionales", priority="Media"),
 dict(pending_id="PD008", area="Terrorismo", scope="Todos", description="Incidentes (Global Terrorism Database)", reason="No accesible", priority="Media"),
 dict(pending_id="PD009", area="Relaciones diplomáticas", scope="Todos", description="Representación diplomática (COW Diplomatic Exchange), votaciones en la AGNU (Voeten)", reason="No descargado", priority="Media"),
 dict(pending_id="PD010", area="Subnacional", scope="Todos", description="División administrativa, distribución territorial de población y recursos, ciudades principales", reason="Requiere GADM/ONU-Hábitat", priority="Baja"),
 dict(pending_id="PD011", area="Verificación", scope="Tablas curadas", description="Contraste línea a línea de registros CONOC_EXPERTO con fuentes primarias", reason="Acceso web limitado durante la construcción", priority="Alta"),
 dict(pending_id="PD012", area="Conflictos", scope="UCDP", description="Muertes en batalla por conflicto-año (UCDP BRD) y eventos georreferenciados (GED)", reason="No accesible", priority="Media"),
 dict(pending_id="PD013", area="Empresas", scope="Global", description="Rankings cuantitativos por año (ingresos, activos) y cuotas de mercado", reason="Fuentes comerciales", priority="Baja"),
 dict(pending_id="PD014", area="Escenarios", scope="Pre-1960", description="Indicadores económicos detallados para escenarios 1946-1959 (WDI empieza en 1960)", reason="Usar Maddison Project y fuentes nacionales", priority="Media"),
])
imp = pd.DataFrame([
 dict(step=1, topic="Formato", instruction="Cada hoja es una tabla de Excel (T_<hoja>) con cabecera en la fila 1. Los CSV UTF-8 en output/csv/ tienen el mismo contenido y nombre que las hojas."),
 dict(step=2, topic="Claves", instruction="Usar 03_ESTADOS.country_id como clave de país en todas las tablas. Las claves primarias y foráneas de cada tabla están en output/schema/schema.json y en 01_INDICE."),
 dict(step=3, topic="Paneles", instruction="Las hojas con (country_id, year) son paneles anchos: cada columna es un indicador definido en 02b_INDICADORES (unidad, moneda, base de precios, tipo de observación, fuente)."),
 dict(step=4, topic="Formato largo", instruction="output/csv/observaciones_largo.csv.gz contiene todas las observaciones WDI con los campos record_id, country_id, indicator_id, year, period_start, period_end, value, unit, currency, price_basis, geographic_scope, observation_type, source_id, source_reference, confidence_level, methodology_notes, last_verified."),
 dict(step=5, topic="SQL", instruction="Ejemplo: CREATE TABLE estados (...); COPY estados FROM '03_ESTADOS.csv' CSV HEADER; en SQLite: .mode csv / .import 03_ESTADOS.csv estados. Ver scripts/30_export_sqlite.py para una carga automática."),
 dict(step=6, topic="JSON", instruction="pandas: pd.read_csv(f).to_json(orient='records', force_ascii=False). Listas dentro de celdas usan ';' como separador (p.ej. participant_ids)."),
 dict(step=7, topic="Clases de valor", instruction="Clase A = observado (observation_type dato_*), clase B = estimación (estimacion_*, indice_*), clase C = parámetro de simulación (35_*). No mezclar C con A/B en análisis históricos."),
 dict(step=8, topic="Vacíos", instruction="Celda vacía = sin dato. Nunca se imputó cero. Los ceros presentes provienen de la fuente."),
])
# Diccionario: columnas de todas las tablas
COLDOC = {"country_id": "Identificador de país/entidad (FK a 03_ESTADOS)", "year": "Año calendario", "source_ids": "Fuentes (FK a 37_FUENTES; varias separadas por ';')",
          "certainty": "Nivel de certeza: Alta | Media | Baja", "confidence": "Nivel de confianza: Alta | Media | Baja", "confidence_level": "Nivel de confianza: Alta | Media | Baja",
          "verification_status": "VERIF_SESION | CONOC_EXPERTO | DATASET (ver 00_LEEME)", "record_id": "Identificador único de registro", "observation_type": "Tipo de observación (ver 00_LEEME)",
          "start_date": "Fecha de inicio ISO (AAAA[-MM[-DD]])", "end_date": "Fecha de término ISO; vacío = vigente/en curso", "value": "Valor numérico o categórico", "data_year": "Año del dato efectivamente usado"}
ind_lookup = indf.drop_duplicates("indicator_id").set_index("indicator_id")
for t in TABLES:
    for c in t["df"].columns:
        if c in ind_lookup.index:
            r = ind_lookup.loc[c]
            desc = f"{r['name_en']} — unidad: {r['unit']}; tipo: {r['observation_type']}"
        else:
            desc = COLDOC.get(c, "")
        dtype = str(t["df"][c].dtype)
        DICT.append(dict(sheet=t["name"], column=c, description=desc, dtype=("numérico" if "float" in dtype or "int" in dtype else "texto/fecha"),
                         is_primary_key="si" if c in t["pk"] else "", foreign_key=t["fks"].get(c, ""), n_non_empty=int((t["df"][c].astype(str) != "").sum() - t["df"][c].isna().sum())))
dic = pd.DataFrame(DICT)
dic_codes = pd.DataFrame([
 ("Alta", "confidence/certainty", "Dato de fuente primaria o estadística oficial sólida con definición clara, o hecho histórico no controvertido"),
 ("Media", "confidence/certainty", "Estimación razonablemente respaldada, reconstrucción con limitaciones, o dato compilado sin contraste en sesión"),
 ("Baja", "confidence/certainty", "Información incompleta, indirecta, controvertida o con fuentes muy divergentes"),
 ("VERIF_SESION", "verification_status", "Contrastado en la sesión de construcción mediante búsqueda web"),
 ("CONOC_EXPERTO", "verification_status", "Compilado de historiografía de referencia; no contrastado línea a línea en la sesión"),
 ("DATASET", "verification_status", "Extraído de un conjunto de datos descargado"),
 ("dato_oficial_compilado", "observation_type", "Estadística oficial compilada por organismo internacional (clase A)"),
 ("estimacion_modelada / estimacion_demografica_ONU_WPP", "observation_type", "Estimación o proyección de modelo (clase B)"),
 ("indice_latente_expertos / estimacion_latente_expertos", "observation_type", "Índice V-Dem de modelo de medición con expertos (clase B)"),
 ("indice_volumen_TIV", "observation_type", "Índice de volumen SIPRI (no monetario)"),
 ("C_parametro_simulacion", "value_class", "Parámetro creado para el motor del juego (clase C)"),
 ("RoW 0-3", "v2x_regime", "0 autocracia cerrada; 1 autocracia electoral; 2 democracia electoral; 3 democracia liberal"),
 ("1/2", "intensity_level (UCDP)", "1 = 25-999 muertes en batalla en el año; 2 = ≥1.000"),
 ("1-5", "contigüidad COW", "1 terrestre; 2 ≤12 millas de mar; 3 ≤24; 4 ≤150; 5 ≤400"),
], columns=["code", "applies_to", "meaning"])

# LEEME
leeme = pd.DataFrame([
 ("Propósito", "Base de conocimiento histórica, económica, militar, institucional y geopolítica para un simulador presidencial. Distingue datos observados (A), estimaciones (B) y parámetros de simulación (C)."),
 ("Fecha de construcción", TODAY + ". Datos estadísticos hasta 2024 (V-Dem hasta 2025). Acontecimientos curados hasta mediados de 2025."),
 ("Alcance geográfico", f"{len(master)} entidades: Estados soberanos actuales, territorios, Estados históricos (1789-) y agregados. Identificador country_id estable (ISO3 / V-Dem / H_*)."),
 ("Alcance temporal", "Series: 1789-2025 (V-Dem), 1816-2016 (COW), 1946-2024 (UCDP), 1960-2024 (WDI), 1900-2024 (OWID). Prioridad 1945-actualidad."),
 ("Metodología", "1) Descarga reproducible de conjuntos de datos (scripts/02_download_sources.py, 01_download_wdi.py) con hash SHA-256. 2) Normalización de identificadores mediante crosswalk COW/GW/V-Dem/ISO (03b). 3) Paneles país-año por tema. 4) Tablas curadas para conflictos, tratados, inteligencia, instituciones, historia, causalidad y escenarios. 5) Parámetros derivados con método explícito. 6) Validación automática (scripts/20_validate.py)."),
 ("Restricción de acceso", "El entorno de construcción no podía acceder a los portales oficiales (worldbank.org, imf.org, sipri.org, ucdp.uu.se, v-dem.net...). Se usaron réplicas públicas en GitHub de los mismos conjuntos de datos, registrando URL y hash en 37_FUENTES. La búsqueda web solo devolvía resúmenes, por lo que la verificación de cifras curadas fue muestral (36c)."),
 ("Confianza", "WDI: confianza base por indicador (Alta para cuentas nacionales y demografía oficial; Media para estimaciones, encuestas dispersas, gasto militar y seguridad). En el formato largo, observaciones económicas de años con autocracia cerrada (V-Dem RoW=0) se rebajan un nivel. V-Dem: Media (estimaciones de expertos). Curados: asignada registro a registro."),
 ("Faltantes", "Celda vacía = no disponible. No se imputan ceros ni se interpola. Los valores -9/-8 de COW se convierten en vacío. Las interpolaciones de origen se señalan en 02b_INDICADORES.interpolation."),
 ("Contradicciones", "Cuando las fuentes difieren (víctimas, resultados impugnados) se conservan rangos (deaths_low/high) o filas separadas por result_type."),
 ("Escenarios", "34b toma el último dato ≤ fecha del escenario (máx. 3 años de antigüedad) e informa data_year: nunca se usan datos posteriores."),
 ("Parámetros", "35/35b: clase C. Reglas de umbrales documentadas; escalas categóricas cuando la precisión numérica no está justificada."),
 ("Archivos complementarios", "output/csv/*.csv (UTF-8, una por hoja), output/csv/observaciones_largo.csv.gz, output/schema/schema.json, output/validation_report.md."),
 ("Limitaciones principales", "Ver 36_CALIDAD_DATOS (problemas Q001-Q012) y 39_PENDIENTES. Las tablas curadas (CONOC_EXPERTO) requieren verificación antes de usos críticos."),
], columns=["section", "content"])

# Índice
ORDER_PREFIX = lambda n: (re.match(r"(\d+)", n).group(1), n)
TABLES.sort(key=lambda t: (int(re.match(r"(\d+)", t["name"]).group(1)), t["name"]))
idx = []
meta_tables = [("00_LEEME", leeme, "Propósito, alcance, metodología, instrucciones y limitaciones", "metadatos", "completo"),
               ("01_INDICE", None, "Índice de hojas", "metadatos", "completo"),
               ("02_DICCIONARIO", dic, "Diccionario de columnas de todas las hojas", "metadatos", "completo"),
               ("02b_INDICADORES", indf, "Catálogo de indicadores: definición, unidad, moneda, base de precios, tipo de observación y fuente", "metadatos", "completo"),
               ("02c_CODIGOS", dic_codes, "Códigos y categorías controladas", "metadatos", "completo"),
               ("36_CALIDAD_DATOS", qual, "Cobertura por indicador, ceros y problemas", "metadatos", "completo"),
               ("36b_PROBLEMAS", issues, "Problemas de calidad detectados", "metadatos", "completo"),
               ("36c_VERIFICACION_MUESTRAL", ver, "Contrastes realizados contra fuentes durante la construcción", "metadatos", "completo"),
               ("37_FUENTES", SRCDF, "Registro maestro de fuentes", "metadatos", "completo"),
               ("38_CITAS_DATOS", cit, "Correspondencia dato/columna/registro → fuente", "metadatos", "completo"),
               ("39_PENDIENTES", pend, "Investigación pendiente", "metadatos", "completo"),
               ("40_IMPORTACION", imp, "Guía de importación a bases de datos/JSON", "metadatos", "completo")]
all_entries = [(m[0], m[1], m[2], m[3], m[4], [], {}) for m in meta_tables] + [(t["name"], t["df"], t["desc"], t["category"], t["status"], t["pk"], t["fks"]) for t in TABLES]
for name, df, desc, cat_, status, pk, fks in all_entries:
    n = 0 if df is None else len(df)
    yrs = ""
    if df is not None and "year" in df.columns and n:
        yrs = f"{int(pd.to_numeric(df.year, errors='coerce').min())}-{int(pd.to_numeric(df.year, errors='coerce').max())}"
    nc = df.country_id.nunique() if df is not None and "country_id" in df.columns else ""
    idx.append(dict(sheet=name, description=desc, category=cat_, coverage_status=status, n_rows=n, n_columns=0 if df is None else df.shape[1], years=yrs, n_countries=nc,
                    primary_key=";".join(pk), foreign_keys=";".join(f"{k}->{v}" for k, v in fks.items()), csv_file=f"csv/{name}.csv"))
idxdf = pd.DataFrame(idx)
final = []
for name, df, desc, cat_, status, pk, fks in all_entries:
    if name == "01_INDICE":
        df = idxdf
    final.append(dict(name=name, df=df, pk=pk, fks=fks, required_cols=next((t["required_cols"] for t in TABLES if t["name"] == name), []),
                      freeze_col=next((t["freeze_col"] for t in TABLES if t["name"] == name), False), obs_types=None))
final.sort(key=lambda t: (int(re.match(r"(\d+)", t["name"]).group(1)), t["name"]))

# =============================================================================
# Escritura
# =============================================================================
for t in final:
    t["df"].to_csv(os.path.join(CSV, t["name"] + ".csv"), index=False, encoding="utf-8")
long = pd.concat(LONG_PARTS, ignore_index=True)
long["year"] = long.year.astype(int)
long["record_id"] = ["OBS%08d" % i for i in range(1, len(long) + 1)]
long["period_start"] = long.year.astype(str) + "-01-01"; long["period_end"] = long.year.astype(str) + "-12-31"
long["geographic_scope"] = "nacional"; long["methodology_notes"] = "Ver 02b_INDICADORES (definición y limitaciones de la serie)"; long["last_verified"] = TODAY
long = long[["record_id", "country_id", "indicator_id", "year", "period_start", "period_end", "value", "unit", "currency", "price_basis", "geographic_scope", "observation_type", "source_id", "source_reference", "confidence_level", "methodology_notes", "last_verified"]]
with gzip.open(os.path.join(CSV, "observaciones_largo.csv.gz"), "wt", encoding="utf-8") as f:
    long.to_csv(f, index=False)
os.makedirs(os.path.join(OUT, "schema"), exist_ok=True)
schema = {"database": "Base_Datos_Historica_Geopolitica_Simulador", "build_date": TODAY, "tables": []}
for t in final:
    schema["tables"].append({"name": t["name"], "primary_key": t["pk"], "foreign_keys": t["fks"],
                             "columns": [{"name": c, "dtype": str(t["df"][c].dtype)} for c in t["df"].columns]})
schema["tables"].append({"name": "observaciones_largo", "file": "csv/observaciones_largo.csv.gz", "primary_key": ["record_id"], "foreign_keys": {"country_id": "03_ESTADOS.country_id", "indicator_id": "02b_INDICADORES.indicator_id", "source_id": "37_FUENTES.source_id"},
                         "columns": [{"name": c, "dtype": str(long[c].dtype)} for c in long.columns], "n_rows": len(long)})
json.dump(schema, open(os.path.join(OUT, "schema", "schema.json"), "w"), ensure_ascii=False, indent=1)
B.write_book(XLSX, final)
print("OK", XLSX, len(final), "hojas;", sum(len(t["df"]) for t in final), "filas;", len(long), "observaciones largas")
