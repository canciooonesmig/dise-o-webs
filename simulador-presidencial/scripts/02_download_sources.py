"""Descarga reproducible de las fuentes masivas usadas por la base de datos.
Uso: python3 02_download_sources.py <dir_raw>
Todas las URLs son réplicas públicas en GitHub (raw.githubusercontent.com) porque los portales
originales (worldbank.org, sipri.org, ucdp.uu.se, correlatesofwar.org, v-dem.net...) no son
accesibles desde el entorno de construcción. Se registra hash SHA-256 y fecha de descarga."""
import hashlib, json, os, sys, urllib.request, datetime
RAW = sys.argv[1]
PS = "https://raw.githubusercontent.com/svmiller/peacesciencer/master/data/"
PD = "https://raw.githubusercontent.com/xmarquez/PoliticalDatasets/master/data/"
FILES = {
    "vdem.RData": "https://raw.githubusercontent.com/vdeminstitute/vdemdata/master/data/vdem.RData",
    "vparty.RData": "https://raw.githubusercontent.com/vdeminstitute/vdemdata/master/data/vparty.RData",
    "codebook.RData": "https://raw.githubusercontent.com/vdeminstitute/vdemdata/master/data/codebook.RData",
    "reign.csv": "https://raw.githubusercontent.com/OEFdatascience/REIGN.github.io/gh-pages/data_sets/REIGN_2021_8.csv",
    "owid-co2.csv": "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv",
    "owid-energy.csv": "https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv",
    "countries.json": "https://raw.githubusercontent.com/mledoze/countries/master/countries.json",
    "country-codes.csv": "https://raw.githubusercontent.com/datasets/country-codes/main/data/country-codes.csv",
    "wdi_dp.json": "https://raw.githubusercontent.com/open-numbers/ddf--open_numbers--world_development_indicators/master/datapackage.json",
    "wdi_concepts.csv": "https://raw.githubusercontent.com/open-numbers/ddf--open_numbers--world_development_indicators/master/ddf--concepts--continuous.csv",
    "wdi_geo.csv": "https://raw.githubusercontent.com/open-numbers/ddf--open_numbers--world_development_indicators/master/ddf--entities--geo--country.csv",
}
for f in ["LEAD", "archigos", "atop_alliance", "cow_capitals", "cow_contdir", "cow_igo_sy", "cow_majors",
          "cow_mid_disps", "cow_nmc", "cow_states", "cow_trade_sy", "cow_war_inter", "cow_war_intra", "creg",
          "gw_states", "hief", "leader_codes", "maoz_powers", "rugged", "td_rivalries", "terrthreat",
          "tss_rivalries", "ucdp_acd", "ucdp_onsets", "grh_arms_races", "gml_mid_disps", "gml_part"]:
    FILES[f"ps/{f}.rda"] = PS + f + ".rda"
for f in ["PowellThyne", "nelda", "colonial", "ucdpConflict", "maddison", "SvolikRegimeAll", "all_gwf_periods"]:
    FILES[f"pd/{f}.rda"] = PD + f + ".rda"
manifest = {}
for rel, url in FILES.items():
    out = os.path.join(RAW, rel)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    if not os.path.exists(out):
        urllib.request.urlretrieve(url, out)
    data = open(out, "rb").read()
    manifest[rel] = {"url": url, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(),
                     "downloaded": datetime.date.today().isoformat()}
json.dump(manifest, open(os.path.join(RAW, "manifest.json"), "w"), indent=1)
print(len(manifest), "ficheros")
