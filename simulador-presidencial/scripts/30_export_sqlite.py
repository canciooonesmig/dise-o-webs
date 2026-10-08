"""Carga opcional de todos los CSV en una base SQLite (para el motor del juego).
Uso: python3 scripts/30_export_sqlite.py [ruta_salida.sqlite]
Crea una tabla por hoja (nombre = hoja) más 'observaciones_largo', con índices en las claves primarias declaradas."""
import gzip, json, os, sqlite3, sys
import pandas as pd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "output")
db = sys.argv[1] if len(sys.argv) > 1 else os.path.join(OUT, "simulador.sqlite")
schema = json.load(open(os.path.join(OUT, "schema", "schema.json")))
con = sqlite3.connect(db)
for t in schema["tables"]:
    name = t["name"]
    path = os.path.join(OUT, t.get("file", f"csv/{name}.csv"))
    df = pd.read_csv(path, low_memory=False)
    df.to_sql(name, con, if_exists="replace", index=False)
    if t["primary_key"]:
        cols = ", ".join(f'"{c}"' for c in t["primary_key"])
        con.execute(f'CREATE INDEX IF NOT EXISTS "ix_{name}" ON "{name}" ({cols})')
    print(name, len(df))
con.commit()
con.close()
print("SQLite:", db)
