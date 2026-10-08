"""Extrae de vdem.RData (V-Dem v16) el subconjunto de columnas usado por la base y lo guarda en vdem_subset.pkl.
Uso: python3 03_vdem_subset.py <dir_raw>"""
import os, re, sys
import pyreadr
RAW = sys.argv[1]
v = pyreadr.read_r(os.path.join(RAW, "vdem.RData"))["vdem"]
PAT = re.compile(r'^(v2x_[a-z_]+|v2x[a-z]+_[a-z_]+|v2ex(namhos|namhog|hoshog|tithos|tithog)|v2eltype_\d+|v2elturnhog|v2elturnhos|v2eltrnout|v2elvottrn|v2elcomvot|v2lgbicam|v2lgqstexp|v2lgfemleg|v2jucorrdc|v2juhcind|v2juncind|v2mecenefm|v2meharjrn|v2csreprss|v2cacamps|v2caviol|v2clkill|v2cltort|v2svinlaut|v2svdomaut|v2svstterr|v2stfisccap|v2stcritrecadm|v2smgovdom|v2smfordom|v2regsupgroups_\d+|v2regoppgroups_\d+|v2mecorrpt|v2exl_legit\w+|v2psparban|v2pscomprg|v2ddyrall|v2elmulpar|v2elfrfair|v2elintim|v2ellocumul|v2eldonate|v2xnp_regcorr|v2stcritapparm|v2mecenefi|v2pepwrses|v2pepwrsoc|v2clrgunev|v2x_rule|v2xcs_ccsi|e_\w+)$')
BASE = ("country_name", "country_text_id", "country_id", "COWcode", "year", "historical_date", "codingstart", "codingend", "gapstart1", "gapend1")
cols = [c for c in v.columns if (c in BASE or PAT.match(c)) and not re.search(r"_(codelow|codehigh|sd|osp|ord|mean|nr|3C|4C|5C)$", c)]
v[cols].to_pickle(os.path.join(RAW, "vdem_subset.pkl"))
print(len(cols), "columnas")
