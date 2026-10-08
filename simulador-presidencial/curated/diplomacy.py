# Tratados, organizaciones, membresías y sanciones (curado). verification_status = CONOC_EXPERTO.

# treaty_id, name, type, signed, in_force, terminated, parties (ids o descripción), depositary_org, key_provisions, status, certainty, source_ids
TREATIES = [
 ("TR001", "Carta de las Naciones Unidas", "organizacion_internacional", "1945-06-26", "1945-10-24", "", "Multilateral (193 miembros)", "ONU", "Seguridad colectiva; CSNU con 5 miembros permanentes con veto", "vigente", "Alta", "SRC_UN_MEMBERS;SRC_UNTC"),
 ("TR002", "Acuerdos de Bretton Woods (FMI y BIRF)", "economico_financiero", "1944-07-22", "1945-12-27", "", "Multilateral", "FMI;Banco Mundial", "Tipos de cambio fijos ajustables (hasta 1971-1973); financiación", "vigente (sistema cambiario terminado en 1971-1973)", "Alta", "SRC_UNTC"),
 ("TR003", "Acuerdo General sobre Aranceles y Comercio (GATT)", "comercio", "1947-10-30", "1948-01-01", "1995-01-01", "Multilateral", "", "Reducción arancelaria; sustituido institucionalmente por la OMC", "sustituido", "Alta", "SRC_UNTC"),
 ("TR004", "Tratado Interamericano de Asistencia Recíproca (TIAR/Pacto de Río)", "alianza_defensiva", "1947-09-02", "1948-12-03", "", "Estados americanos (varias denuncias: MEX 2004; BOL, ECU, NIC, VEN 2012-2013)", "OEA", "Ataque contra uno es ataque contra todos", "vigente (con retiros)", "Alta", "SRC_UNTC"),
 ("TR005", "Tratado del Atlántico Norte", "alianza_defensiva", "1949-04-04", "1949-08-24", "", "OTAN (32 miembros en 2024)", "OTAN", "Artículo 5: defensa colectiva", "vigente", "Alta", "SRC_NATO_MEMBERS"),
 ("TR006", "Convenios de Ginebra", "derecho_humanitario", "1949-08-12", "1950-10-21", "", "Universal (196 Estados)", "Suiza", "Protección de heridos, prisioneros y civiles", "vigente", "Alta", "SRC_UNTC"),
 ("TR007", "Tratado de Seguridad ANZUS", "alianza_defensiva", "1951-09-01", "1952-04-29", "", "AUS;NZL;USA (EE.UU. suspendió obligaciones con NZL en 1986)", "", "Defensa del Pacífico", "vigente (parcial)", "Alta", "SRC_UNTC"),
 ("TR008", "Tratado de Paz de San Francisco", "paz", "1951-09-08", "1952-04-28", "", "JPN y 48 Estados (no URSS, no China)", "", "Fin de la ocupación de Japón", "vigente", "Alta", "SRC_UNTC"),
 ("TR009", "Tratado de Seguridad EE.UU.-Japón (revisado)", "alianza_defensiva", "1960-01-19", "1960-06-23", "", "USA;JPN", "", "Bases estadounidenses; defensa de territorios bajo administración japonesa", "vigente", "Alta", "SRC_UNTC"),
 ("TR010", "Tratado de Defensa Mutua EE.UU.-Corea del Sur", "alianza_defensiva", "1953-10-01", "1954-11-17", "", "USA;KOR", "", "", "vigente", "Alta", "SRC_UNTC"),
 ("TR011", "Pacto de Varsovia", "alianza_defensiva", "1955-05-14", "1955-06-04", "1991-07-01", "URSS;POL;DDR;CZE;HUN;ROU;BGR;ALB (ALB se retiró en 1968)", "", "Alianza del bloque soviético", "disuelto", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR012", "Tratado de Roma (CEE)", "integracion_regional", "1957-03-25", "1958-01-01", "", "BEL;FRA;DEU;ITA;LUX;NLD", "", "Mercado común", "sustituido por TUE/TFUE", "Alta", "SRC_EU_MEMBERS"),
 ("TR013", "Tratado Antártico", "regimen_territorial", "1959-12-01", "1961-06-23", "", "Multilateral (12 originales; >50 partes)", "EE.UU.", "Desmilitarización y congelación de reclamaciones", "vigente", "Alta", "SRC_UNTC"),
 ("TR014", "Tratado de Prohibición Parcial de Ensayos Nucleares", "control_armamentos", "1963-08-05", "1963-10-10", "", "USA;GBR;URSS y >120 Estados", "", "Prohíbe ensayos en atmósfera, espacio y bajo el agua", "vigente", "Alta", "SRC_ARMS_CONTROL"),
 ("TR015", "Tratado de Tlatelolco", "zona_libre_armas_nucleares", "1967-02-14", "1969-04-25", "", "33 Estados de América Latina y el Caribe", "OPANAL", "Zona libre de armas nucleares", "vigente", "Alta", "SRC_ARMS_CONTROL"),
 ("TR016", "Tratado del Espacio Ultraterrestre", "regimen_espacial", "1967-01-27", "1967-10-10", "", "Multilateral (>110 partes)", "", "Prohíbe armas nucleares en órbita y apropiación de cuerpos celestes", "vigente", "Alta", "SRC_UNTC"),
 ("TR017", "Tratado de No Proliferación Nuclear (TNP)", "control_armamentos", "1968-07-01", "1970-03-05", "", "191 Estados (PRK anunció retirada en 2003); no partes: IND, PAK, ISR, SSD", "ONU", "5 Estados nuclearmente armados reconocidos; salvaguardias OIEA", "vigente (prorrogado indefinidamente en 1995)", "Alta", "SRC_ARMS_CONTROL"),
 ("TR018", "Tratado ABM", "control_armamentos", "1972-05-26", "1972-10-03", "2002-06-13", "USA;URSS", "", "Limitación de defensas antimisiles", "terminado (retirada de EE.UU.)", "Alta", "SRC_ARMS_CONTROL"),
 ("TR019", "SALT I (Acuerdo Interino)", "control_armamentos", "1972-05-26", "1972-10-03", "1977-10-03", "USA;URSS", "", "Congelación de lanzadores estratégicos", "expirado", "Alta", "SRC_ARMS_CONTROL"),
 ("TR020", "Acta Final de Helsinki (CSCE)", "acuerdo_politico", "1975-08-01", "", "", "35 Estados (Europa, USA, CAN)", "OSCE", "Inviolabilidad de fronteras; derechos humanos", "vigente (no vinculante jurídicamente)", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR021", "Acuerdos de Camp David / Tratado de Paz Egipto-Israel", "paz", "1979-03-26", "1979-04-25", "", "EGY;ISR", "", "Devolución del Sinaí; reconocimiento mutuo", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR022", "Tratado INF", "control_armamentos", "1987-12-08", "1988-06-01", "2019-08-02", "USA;URSS/RUS", "", "Eliminación de misiles terrestres de 500-5.500 km", "terminado (retirada de EE.UU. alegando violación rusa)", "Alta", "SRC_ARMS_CONTROL"),
 ("TR023", "Tratado sobre Fuerzas Armadas Convencionales en Europa (FACE)", "control_armamentos", "1990-11-19", "1992-11-09", "2023-11-07", "OTAN y Pacto de Varsovia", "", "Techos de equipos convencionales", "Rusia se retiró (2023); OTAN suspendió", "Alta", "SRC_ARMS_CONTROL"),
 ("TR024", "Tratado 2+4 (Acuerdo Final sobre Alemania)", "paz_territorial", "1990-09-12", "1991-03-15", "", "DEU;DDR;USA;URSS;GBR;FRA", "", "Plena soberanía de la Alemania unificada; fronteras definitivas", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR025", "START I", "control_armamentos", "1991-07-31", "1994-12-05", "2009-12-05", "USA;URSS (sucesores RUS, UKR, BLR, KAZ)", "", "Reducción de armas estratégicas", "expirado", "Alta", "SRC_ARMS_CONTROL"),
 ("TR026", "Tratado de Maastricht (TUE)", "integracion_regional", "1992-02-07", "1993-11-01", "", "Estados de la CE", "", "Unión Europea; UEM", "vigente (modificado)", "Alta", "SRC_EU_MEMBERS"),
 ("TR027", "Memorando de Budapest", "garantias_seguridad", "1994-12-05", "1994-12-05", "", "UKR;RUS;USA;GBR", "", "Garantías (no defensa) a cambio de la desnuclearización ucraniana", "violado según Ucrania y signatarios occidentales", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR028", "Tratado de Libre Comercio de América del Norte (TLCAN/NAFTA)", "comercio", "1992-12-17", "1994-01-01", "2020-07-01", "USA;CAN;MEX", "", "", "sustituido por T-MEC/USMCA", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR029", "Tratado de Asunción (Mercosur)", "integracion_regional", "1991-03-26", "1991-11-29", "", "ARG;BRA;PRY;URY (VEN suspendida 2016; BOL adhesión 2024)", "", "Unión aduanera imperfecta", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR030", "Acuerdo de Marrakech (OMC)", "comercio", "1994-04-15", "1995-01-01", "", "164-166 miembros", "OMC", "Solución de diferencias (Órgano de Apelación paralizado desde 2019)", "vigente", "Alta", "SRC_UNTC"),
 ("TR031", "Acuerdos de Oslo", "paz", "1993-09-13", "", "", "ISR;OLP", "", "Autoridad Nacional Palestina; autogobierno interino", "estancado", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR032", "Acuerdo de Dayton", "paz", "1995-12-14", "1995-12-14", "", "BIH;HRV;SRB", "", "Bosnia y Herzegovina con dos entidades; Alto Representante", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR033", "Tratado de Prohibición Completa de Ensayos Nucleares (TPCE/CTBT)", "control_armamentos", "1996-09-24", "", "", "187 firmantes; no en vigor (falta ratificación de USA, CHN, IND, PAK, PRK, ISR, EGY, IRN; RUS retiró su ratificación en 2023)", "ONU", "", "no en vigor", "Alta", "SRC_ARMS_CONTROL"),
 ("TR034", "Convención sobre Armas Químicas", "control_armamentos", "1993-01-13", "1997-04-29", "", "193 Estados", "OPAQ", "Prohibición y destrucción de armas químicas", "vigente", "Alta", "SRC_ARMS_CONTROL"),
 ("TR035", "Protocolo de Kioto", "medioambiente", "1997-12-11", "2005-02-16", "", "192 partes (USA no ratificó; CAN se retiró en 2012)", "ONU", "Reducción de emisiones de países del Anexo I", "sustituido de facto por Acuerdo de París", "Alta", "SRC_UNTC"),
 ("TR036", "Estatuto de Roma (Corte Penal Internacional)", "justicia_internacional", "1998-07-17", "2002-07-01", "", "~125 Estados (no USA, RUS, CHN, IND, ISR)", "ONU", "", "vigente", "Alta", "SRC_UNTC"),
 ("TR037", "Acuerdo de Viernes Santo", "paz", "1998-04-10", "1999-12-02", "", "GBR;IRL;partidos norirlandeses", "", "Gobierno compartido en Irlanda del Norte", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR038", "Tratado de Buena Vecindad y Cooperación Amistosa China-Rusia", "cooperacion_estrategica", "2001-07-16", "2002-02-28", "", "CHN;RUS", "", "Sin cláusula de defensa mutua", "vigente (prorrogado 2021)", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR039", "Tratado de Lisboa", "integracion_regional", "2007-12-13", "2009-12-01", "", "Estados miembros de la UE", "", "Art. 42.7 TUE (cláusula de asistencia mutua); art. 50 (retirada)", "vigente", "Alta", "SRC_EU_MEMBERS"),
 ("TR040", "New START", "control_armamentos", "2010-04-08", "2011-02-05", "2026-02-05", "USA;RUS", "", "1.550 ojivas estratégicas desplegadas; Rusia suspendió su participación en febrero de 2023; expiró en febrero de 2026", "expirado (verificar continuidad de límites voluntarios)", "Media", "SRC_ARMS_CONTROL"),
 ("TR041", "Plan de Acción Integral Conjunto (JCPOA)", "no_proliferacion", "2015-07-14", "2016-01-16", "", "IRN;P5+1;UE", "", "Límites al programa nuclear iraní a cambio de levantar sanciones; EE.UU. se retiró en 2018; mecanismo de 'snapback' activado por E3 en 2025", "colapsado", "Media", "SRC_ARMS_CONTROL"),
 ("TR042", "Acuerdo de París", "medioambiente", "2015-12-12", "2016-11-04", "", "195 partes (EE.UU. salió 2020, reingresó 2021 y anunció nueva salida en enero 2025)", "ONU", "Contribuciones determinadas a nivel nacional", "vigente", "Alta", "SRC_UNTC"),
 ("TR043", "Acuerdos de Minsk (I y II)", "alto_el_fuego", "2014-09-05", "2015-02-12", "2022-02-22", "UKR;RUS;OSCE;RPD;RPL", "OSCE", "Alto el fuego y estatuto especial del Donbás", "fracasado", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR044", "Tratado Integral y Progresista de Asociación Transpacífico (CPTPP)", "comercio", "2018-03-08", "2018-12-30", "", "AUS;BRN;CAN;CHL;JPN;MYS;MEX;NZL;PER;SGP;VNM;GBR (2024)", "Nueva Zelanda", "", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR045", "T-MEC / USMCA / CUSMA", "comercio", "2018-11-30", "2020-07-01", "", "USA;MEX;CAN", "", "Revisión conjunta prevista en 2026", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR046", "Acuerdos de Abraham", "normalizacion_diplomatica", "2020-09-15", "", "", "ISR;ARE;BHR (luego MAR, SDN)", "", "Normalización diplomática", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR047", "Asociación Económica Integral Regional (RCEP)", "comercio", "2020-11-15", "2022-01-01", "", "ASEAN (10) + CHN;JPN;KOR;AUS;NZL", "ASEAN", "", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR048", "AUKUS", "cooperacion_defensa_tecnologica", "2021-09-15", "", "", "AUS;GBR;USA", "", "Submarinos de propulsión nuclear para Australia; tecnologías avanzadas", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR049", "Tratado de Asociación Estratégica Integral Rusia-Corea del Norte", "alianza_defensiva", "2024-06-19", "2024-12-04", "", "RUS;PRK", "", "Asistencia militar mutua en caso de agresión (art. 4)", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR050", "Tratado de Amistad, Cooperación y Asistencia Mutua China-Corea del Norte", "alianza_defensiva", "1961-07-11", "1961-09-10", "", "CHN;PRK", "", "Asistencia militar en caso de ataque", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR051", "Taiwan Relations Act (ley interna de EE.UU.)", "ley_nacional_con_efecto_exterior", "1979-04-10", "1979-01-01", "", "USA (unilateral)", "", "Venta de armas defensivas; ambigüedad estratégica", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR052", "Tratado de Pelindaba", "zona_libre_armas_nucleares", "1996-04-11", "2009-07-15", "", "Estados africanos", "UA", "", "vigente", "Alta", "SRC_ARMS_CONTROL"),
 ("TR053", "Tratado sobre la Prohibición de las Armas Nucleares (TPAN)", "control_armamentos", "2017-07-07", "2021-01-22", "", "~70 Estados parte; ninguna potencia nuclear", "ONU", "", "vigente", "Alta", "SRC_ARMS_CONTROL"),
 ("TR054", "Convención de Montreux sobre el régimen de los Estrechos", "regimen_maritimo", "1936-07-20", "1936-11-09", "", "TUR y Estados ribereños/otros", "", "Control turco de los Estrechos; límites a buques de guerra no ribereños", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR055", "Convención de las Naciones Unidas sobre el Derecho del Mar (CONVEMAR)", "regimen_maritimo", "1982-12-10", "1994-11-16", "", "~170 partes (USA no ratificó)", "ONU", "ZEE de 200 millas; plataforma continental", "vigente", "Alta", "SRC_UNTC"),
 ("TR056", "Tratados Torrijos-Carter", "transferencia_territorial", "1977-09-07", "1979-10-01", "", "USA;PAN", "", "Transferencia del canal (31-12-1999); neutralidad permanente", "vigente (tratado de neutralidad)", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR057", "Pacto Molotov-Ribbentrop (antecedente)", "no_agresion", "1939-08-23", "1939-08-23", "1941-06-22", "DEU;URSS", "", "Protocolo secreto de reparto de Europa del Este", "roto por la invasión alemana", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR058", "Tratado de Versalles (antecedente)", "paz", "1919-06-28", "1920-01-10", "", "Aliados;DEU", "Sociedad de Naciones", "Reparaciones, pérdidas territoriales alemanas", "históricamente superado", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR059", "Organización del Tratado de Seguridad Colectiva (CSTO) – Tratado de Taskent", "alianza_defensiva", "1992-05-15", "1994-04-20", "", "RUS;BLR;KAZ;KGZ;TJK;ARM (Armenia congeló participación 2024)", "", "", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
 ("TR060", "Tratado de Amistad y Cooperación en el Sudeste Asiático (TAC)", "no_agresion_regional", "1976-02-24", "1976-06-21", "", "ASEAN y adherentes", "ASEAN", "", "vigente", "Alta", "SRC_ACADEMIC_HIST"),
]

# membership_id generado en build: org_id, country_id, joined, left, membership_type, notes
ORGS = [
 # org_id, name, type, founded, hq, purpose
 ("ORG_UN", "Organización de las Naciones Unidas", "universal", "1945-10-24", "Nueva York", "Seguridad, cooperación"),
 ("ORG_UNSC_P5", "Consejo de Seguridad ONU – miembros permanentes", "organo", "1945-10-24", "Nueva York", "Veto"),
 ("ORG_NATO", "Organización del Tratado del Atlántico Norte", "alianza_militar", "1949-04-04", "Bruselas", "Defensa colectiva"),
 ("ORG_WARSAW", "Pacto de Varsovia", "alianza_militar", "1955-05-14", "Moscú", "Defensa del bloque soviético"),
 ("ORG_EU", "Unión Europea (y predecesoras CEE/CE)", "integracion_regional", "1958-01-01", "Bruselas", "Integración económica y política"),
 ("ORG_EUROZONE", "Zona euro", "union_monetaria", "1999-01-01", "Fráncfort", "Moneda común"),
 ("ORG_OPEC", "Organización de Países Exportadores de Petróleo", "cartel_materias_primas", "1960-09-14", "Viena", "Coordinación petrolera"),
 ("ORG_G7", "Grupo de los Siete", "foro", "1975-11-15", "", "Coordinación económica de democracias industriales"),
 ("ORG_BRICS", "BRICS", "foro", "2009-06-16", "", "Coordinación de economías emergentes"),
 ("ORG_SCO", "Organización de Cooperación de Shanghái", "organizacion_regional_seguridad", "2001-06-15", "Pekín", "Seguridad y cooperación euroasiática"),
 ("ORG_CSTO", "Organización del Tratado de Seguridad Colectiva", "alianza_militar", "2002-10-07", "Moscú", "Defensa colectiva postsoviética"),
 ("ORG_ASEAN", "Asociación de Naciones del Sudeste Asiático", "integracion_regional", "1967-08-08", "Yakarta", ""),
 ("ORG_AU", "Unión Africana (OUA 1963-2002)", "integracion_regional", "1963-05-25", "Adís Abeba", ""),
 ("ORG_MERCOSUR", "Mercado Común del Sur", "integracion_regional", "1991-03-26", "Montevideo", ""),
 ("ORG_GCC", "Consejo de Cooperación del Golfo", "integracion_regional", "1981-05-25", "Riad", ""),
 ("ORG_OECD", "Organización para la Cooperación y el Desarrollo Económicos", "organizacion_economica", "1961-09-30", "París", ""),
 ("ORG_QUAD", "Diálogo de Seguridad Cuadrilateral", "foro_seguridad", "2007", "", ""),
 ("ORG_FIVE_EYES", "Alianza de inteligencia Five Eyes (UKUSA)", "alianza_inteligencia", "1946-03-05", "", "Intercambio de SIGINT"),
 ("ORG_CIS", "Comunidad de Estados Independientes", "organizacion_regional", "1991-12-08", "Minsk", ""),
 ("ORG_AES", "Alianza/Confederación de Estados del Sahel", "alianza_defensiva_regional", "2023-09-16", "", ""),
]

# org_id, country_id, joined, left, notes
MEMBERSHIPS = [
 # OTAN
 *[("ORG_NATO", c, "1949-08-24", "", "Miembro fundador") for c in ["BEL","CAN","DNK","FRA","ISL","ITA","LUX","NLD","NOR","PRT","GBR","USA"]],
 ("ORG_NATO","GRC","1952-02-18","","Retirada de la estructura militar 1974-1980"), ("ORG_NATO","TUR","1952-02-18","",""),
 ("ORG_NATO","DEU","1955-05-06","","RFA; Alemania unificada desde 1990"), ("ORG_NATO","ESP","1982-05-30","","Referéndum de permanencia 1986"),
 *[("ORG_NATO", c, "1999-03-12", "", "") for c in ["CZE","HUN","POL"]],
 *[("ORG_NATO", c, "2004-03-29", "", "") for c in ["BGR","EST","LVA","LTU","ROU","SVK","SVN"]],
 ("ORG_NATO","ALB","2009-04-01","",""), ("ORG_NATO","HRV","2009-04-01","",""), ("ORG_NATO","MNE","2017-06-05","",""),
 ("ORG_NATO","MKD","2020-03-27","",""), ("ORG_NATO","FIN","2023-04-04","",""), ("ORG_NATO","SWE","2024-03-07","",""),
 # Pacto de Varsovia
 *[("ORG_WARSAW", c, "1955-06-04", "1991-07-01", "") for c in ["RUS","POL","CZE","HUN","ROU","BGR"]],
 ("ORG_WARSAW","DDR","1956-01-28","1990-09-24",""), ("ORG_WARSAW","ALB","1955-06-04","1968-09-13","Retirada formal 1968"),
 # UE
 *[("ORG_EU", c, "1958-01-01", "", "Fundador CEE") for c in ["BEL","FRA","DEU","ITA","LUX","NLD"]],
 ("ORG_EU","DNK","1973-01-01","",""), ("ORG_EU","IRL","1973-01-01","",""), ("ORG_EU","GBR","1973-01-01","2020-01-31","Brexit"),
 ("ORG_EU","GRC","1981-01-01","",""), ("ORG_EU","ESP","1986-01-01","",""), ("ORG_EU","PRT","1986-01-01","",""),
 ("ORG_EU","AUT","1995-01-01","",""), ("ORG_EU","FIN","1995-01-01","",""), ("ORG_EU","SWE","1995-01-01","",""),
 *[("ORG_EU", c, "2004-05-01", "", "") for c in ["CYP","CZE","EST","HUN","LVA","LTU","MLT","POL","SVK","SVN"]],
 ("ORG_EU","BGR","2007-01-01","",""), ("ORG_EU","ROU","2007-01-01","",""), ("ORG_EU","HRV","2013-07-01","",""),
 # Zona euro
 *[("ORG_EUROZONE", c, "1999-01-01", "", "Billetes y monedas desde 2002-01-01") for c in ["AUT","BEL","FIN","FRA","DEU","IRL","ITA","LUX","NLD","PRT","ESP"]],
 ("ORG_EUROZONE","GRC","2001-01-01","",""), ("ORG_EUROZONE","SVN","2007-01-01","",""), ("ORG_EUROZONE","CYP","2008-01-01","",""), ("ORG_EUROZONE","MLT","2008-01-01","",""),
 ("ORG_EUROZONE","SVK","2009-01-01","",""), ("ORG_EUROZONE","EST","2011-01-01","",""), ("ORG_EUROZONE","LVA","2014-01-01","",""), ("ORG_EUROZONE","LTU","2015-01-01","",""), ("ORG_EUROZONE","HRV","2023-01-01","",""),
 ("ORG_EUROZONE","BGR","2026-01-01","","Adopción prevista/aprobada para 2026; verificar"),
 # OPEP
 *[("ORG_OPEC", c, "1960-09-14", "", "Fundador") for c in ["IRN","IRQ","KWT","SAU","VEN"]],
 ("ORG_OPEC","QAT","1961","2019-01-01",""), ("ORG_OPEC","IDN","1962","2016-11-30","Suspendida/retirada varias veces"), ("ORG_OPEC","LBY","1962","",""),
 ("ORG_OPEC","ARE","1967","",""), ("ORG_OPEC","DZA","1969","",""), ("ORG_OPEC","NGA","1971","",""), ("ORG_OPEC","ECU","1973","2020-01-01","Suspendida 1992-2007"),
 ("ORG_OPEC","GAB","1975","","Retirada 1995-2016"), ("ORG_OPEC","AGO","2007","2024-01-01",""), ("ORG_OPEC","GNQ","2017","",""), ("ORG_OPEC","COG","2018","",""),
 # G7
 *[("ORG_G7", c, "1975-11-15", "", "") for c in ["FRA","DEU","ITA","JPN","GBR","USA"]], ("ORG_G7","CAN","1976","",""),
 ("ORG_G7","RUS","1997","2014-03-24","G8; suspendida tras Crimea"),
 # BRICS
 *[("ORG_BRICS", c, "2009-06-16", "", "") for c in ["BRA","RUS","IND","CHN"]], ("ORG_BRICS","ZAF","2010-12-24","",""),
 *[("ORG_BRICS", c, "2024-01-01", "", "Ampliación") for c in ["EGY","ETH","IRN","ARE"]], ("ORG_BRICS","IDN","2025-01-06","",""),
 # OCS
 *[("ORG_SCO", c, "2001-06-15", "", "Fundador") for c in ["CHN","RUS","KAZ","KGZ","TJK","UZB"]],
 ("ORG_SCO","IND","2017-06-09","",""), ("ORG_SCO","PAK","2017-06-09","",""), ("ORG_SCO","IRN","2023-07-04","",""), ("ORG_SCO","BLR","2024-07-04","",""),
 # CSTO
 *[("ORG_CSTO", c, "2002-10-07", "", "") for c in ["RUS","BLR","KAZ","KGZ","TJK"]], ("ORG_CSTO","ARM","2002-10-07","","Participación congelada desde 2024"),
 # ASEAN
 *[("ORG_ASEAN", c, "1967-08-08", "", "Fundador") for c in ["IDN","MYS","PHL","SGP","THA"]],
 ("ORG_ASEAN","BRN","1984-01-07","",""), ("ORG_ASEAN","VNM","1995-07-28","",""), ("ORG_ASEAN","LAO","1997-07-23","",""), ("ORG_ASEAN","MMR","1997-07-23","",""), ("ORG_ASEAN","KHM","1999-04-30","",""), ("ORG_ASEAN","TLS","2025-10-26","","Adhesión prevista en la cumbre de octubre de 2025; verificar"),
 # Mercosur
 *[("ORG_MERCOSUR", c, "1991-03-26", "", "Fundador") for c in ["ARG","BRA","PRY","URY"]], ("ORG_MERCOSUR","VEN","2012-07-31","","Suspendida desde 2016-12"), ("ORG_MERCOSUR","BOL","2024-07-08","",""),
 # CCG
 *[("ORG_GCC", c, "1981-05-25", "", "") for c in ["BHR","KWT","OMN","QAT","SAU","ARE"]],
 # Five Eyes
 ("ORG_FIVE_EYES","USA","1946-03-05","",""), ("ORG_FIVE_EYES","GBR","1946-03-05","",""), ("ORG_FIVE_EYES","CAN","1948","",""), ("ORG_FIVE_EYES","AUS","1956","",""), ("ORG_FIVE_EYES","NZL","1956","",""),
 # Quad
 *[("ORG_QUAD", c, "2007", "", "Relanzado en 2017") for c in ["USA","JPN","IND","AUS"]],
 # AES
 *[("ORG_AES", c, "2023-09-16", "", "Salida de la CEDEAO efectiva en enero de 2025") for c in ["MLI","BFA","NER"]],
 # P5
 *[("ORG_UNSC_P5", c, "1945-10-24", "", "") for c in ["USA","GBR","FRA","RUS"]], ("ORG_UNSC_P5","CHN","1971-10-25","","Asiento de la RPC desde Res. 2758; antes ocupado por la República de China (TWN)"), ("ORG_UNSC_P5","TWN","1945-10-24","1971-10-25","República de China"),
 # OCDE (fundadores y principales)
 *[("ORG_OECD", c, "1961", "", "Fundador") for c in ["AUT","BEL","CAN","DNK","FRA","DEU","GRC","ISL","IRL","ITA","LUX","NLD","NOR","PRT","ESP","SWE","CHE","TUR","GBR","USA"]],
 ("ORG_OECD","JPN","1964","",""), ("ORG_OECD","FIN","1969","",""), ("ORG_OECD","AUS","1971","",""), ("ORG_OECD","NZL","1973","",""), ("ORG_OECD","MEX","1994","",""), ("ORG_OECD","CZE","1995","",""),
 ("ORG_OECD","HUN","1996","",""), ("ORG_OECD","POL","1996","",""), ("ORG_OECD","KOR","1996","",""), ("ORG_OECD","SVK","2000","",""), ("ORG_OECD","CHL","2010","",""), ("ORG_OECD","SVN","2010","",""),
 ("ORG_OECD","ISR","2010","",""), ("ORG_OECD","EST","2010","",""), ("ORG_OECD","LVA","2016","",""), ("ORG_OECD","LTU","2018","",""), ("ORG_OECD","COL","2020","",""), ("ORG_OECD","CRI","2021","",""),
]

# sanction_id, name, sender, target_ids, start, end, type, legal_basis, scope, trigger, effects_note, certainty, source_ids
SANCTIONS = [
 ("SN001", "Embargo estadounidense a Cuba", "USA", "CUB", "1960-10-19", "", "embargo_comercial_financiero", "Trading with the Enemy Act; Ley Helms-Burton (1996)", "Integral", "Nacionalizaciones tras la Revolución", "AGNU vota anualmente su condena desde 1992", "Alta", "SRC_OFAC"),
 ("SN002", "Sanciones ONU a Rodesia del Sur", "ONU", "ZWE", "1966-12-16", "1979-12-21", "sanciones_obligatorias_onu", "Res. 232 CSNU", "Integral", "Declaración unilateral de independencia", "Primeras sanciones obligatorias de la ONU", "Alta", "SRC_UNSC_SANCTIONS"),
 ("SN003", "Embargo de armas ONU a Sudáfrica (apartheid)", "ONU", "ZAF", "1977-11-04", "1994-05-25", "embargo_armas", "Res. 418 CSNU", "Armas", "Apartheid", "Sanciones adicionales de EE.UU. (CAAA 1986) y CE", "Alta", "SRC_UNSC_SANCTIONS"),
 ("SN004", "Embargo petrolero de la OPAEP", "SAU;KWT;IRQ;LBY;DZA;ARE;QAT", "USA;NLD;PRT;ZAF", "1973-10-17", "1974-03-18", "embargo_energetico", "Decisión OPAEP", "Petróleo", "Apoyo a Israel en la guerra de Yom Kipur", "Precio del crudo x4", "Alta", "SRC_ACADEMIC_HIST"),
 ("SN005", "Sanciones de EE.UU. a Irán", "USA", "IRN", "1979-11-14", "", "integral_secundaria", "IEEPA; ISA 1996; CISADA 2010", "Integral; sanciones secundarias", "Crisis de los rehenes; programa nuclear; terrorismo", "Alivio parcial 2016-2018 (JCPOA); 'máxima presión' desde 2018", "Alta", "SRC_OFAC"),
 ("SN006", "Sanciones ONU a Irak", "ONU", "IRQ", "1990-08-06", "2003-05-22", "sanciones_obligatorias_onu", "Res. 661 CSNU; Petróleo por Alimentos (Res. 986, 1995)", "Integral", "Invasión de Kuwait", "Grave impacto humanitario (cifras de mortalidad infantil discutidas)", "Alta", "SRC_UNSC_SANCTIONS"),
 ("SN007", "Sanciones ONU a Yugoslavia (RFY)", "ONU", "SRB", "1992-05-30", "1996-10-01", "sanciones_obligatorias_onu", "Res. 757 CSNU", "Integral", "Guerra en Bosnia", "Hiperinflación yugoslava 1992-1994", "Alta", "SRC_UNSC_SANCTIONS"),
 ("SN008", "Sanciones ONU a Libia", "ONU", "LBY", "1992-03-31", "2003-09-12", "sanciones_obligatorias_onu", "Res. 748 y 883 CSNU", "Aviación, armas, finanzas", "Lockerbie", "Levantadas tras aceptación de responsabilidad", "Alta", "SRC_UNSC_SANCTIONS"),
 ("SN009", "Sanciones ONU a Corea del Norte", "ONU", "PRK", "2006-10-14", "", "sanciones_obligatorias_onu", "Res. 1718 y siguientes CSNU", "Armas, finanzas, exportaciones (carbón, textiles, trabajadores)", "Ensayos nucleares y de misiles", "Panel de Expertos disuelto en 2024 por veto ruso", "Alta", "SRC_UNSC_SANCTIONS"),
 ("SN010", "Sanciones ONU a Irán (programa nuclear)", "ONU", "IRN", "2006-12-23", "2016-01-16", "sanciones_obligatorias_onu", "Res. 1737, 1747, 1803, 1929 CSNU", "Nuclear, armas, finanzas", "Programa nuclear", "Reactivación ('snapback') solicitada por E3 en agosto-septiembre de 2025", "Media", "SRC_UNSC_SANCTIONS"),
 ("SN011", "Sanciones UE/EE.UU. a Rusia por Crimea y Donbás", "USA;EU;GBR;CAN;JPN;AUS", "RUS", "2014-03-17", "", "sectoriales_individuales", "Decisiones PESC; órdenes ejecutivas EE.UU.", "Finanzas, energía, defensa, individuos", "Anexión de Crimea", "", "Alta", "SRC_EU_SANCTIONS;SRC_OFAC"),
 ("SN012", "Sanciones por la invasión de Ucrania (2022)", "USA;EU;GBR;CAN;JPN;AUS;CHE;KOR", "RUS;BLR", "2022-02-22", "", "integral_amplia", "Paquetes de sanciones UE (>17 hasta 2025); EO de EE.UU.", "Congelación de ~300.000 M USD de reservas del banco central; exclusión de SWIFT; embargo de crudo por mar y tope de precio; controles de exportación", "Invasión de Ucrania", "Reorientación comercial rusa hacia China, India, Turquía", "Alta", "SRC_EU_SANCTIONS;SRC_OFAC"),
 ("SN013", "Sanciones de EE.UU. a Venezuela", "USA", "VEN", "2015-03-09", "", "sectoriales_petroleras", "EO 13692; EO 13850, 13884 (2017-2019)", "PDVSA, deuda, gobierno", "Crisis democrática", "Licencias intermitentes (Chevron)", "Alta", "SRC_OFAC"),
 ("SN014", "Controles de exportación de semiconductores a China", "USA (con NLD, JPN)", "CHN", "2022-10-07", "", "control_exportaciones_tecnologicas", "Export Administration Regulations (BIS)", "Chips avanzados, equipos de fabricación, supercomputación", "Competencia tecnológica-militar", "Ampliados en 2023 y 2024; Huawei en Entity List desde 2019", "Alta", "SRC_OFAC"),
 ("SN015", "Sanciones a Siria", "USA;EU;LAS", "SYR", "2011-05", "", "integral", "Caesar Act (2019); Decisiones UE", "Integral", "Represión de 2011", "Levantamiento parcial tras la caída de Assad (2025)", "Media", "SRC_OFAC;SRC_EU_SANCTIONS"),
 ("SN016", "Bloqueo a Catar", "SAU;ARE;BHR;EGY", "QAT", "2017-06-05", "2021-01-05", "bloqueo_diplomatico_comercial", "Decisión de los Estados", "Diplomático, aéreo, terrestre", "Acusaciones de apoyo al terrorismo y cercanía a Irán", "Declaración de Al-Ula", "Alta", "SRC_ACADEMIC_HIST"),
 ("SN017", "Sanciones de la CEDEAO a Malí y Níger", "CEDEAO", "MLI;NER", "2022-01-09", "2024-02-24", "sanciones_regionales", "Protocolo de la CEDEAO", "Comercio, finanzas, fronteras", "Golpes de Estado", "Contribuyó a la salida de la CEDEAO", "Media", "SRC_ACADEMIC_HIST"),
 ("SN018", "Embargo de armas de la UE y EE.UU. a China", "EU;USA", "CHN", "1989-06", "", "embargo_armas", "Declaración del Consejo Europeo de Madrid (1989)", "Armas", "Tiananmén", "", "Alta", "SRC_EU_SANCTIONS"),
 ("SN019", "Restricciones comerciales chinas a Australia", "CHN", "AUS", "2020-05", "2024-12", "coercion_comercial", "Medidas administrativas", "Cebada, vino, carbón, carne, langosta", "Petición australiana de investigación sobre la COVID-19", "Levantadas gradualmente 2023-2024", "Media", "SRC_ACADEMIC_HIST"),
 ("SN020", "Aranceles de EE.UU. ('Día de la Liberación') y guerra comercial", "USA", "Múltiples (CHN principal)", "2025-04-02", "", "aranceles", "IEEPA; Sección 232; Sección 301", "Aranceles generales y recíprocos", "Déficit comercial y política industrial", "Escalada y treguas sucesivas con China en 2025; litigios sobre la base legal IEEPA", "Media", "SRC_ACADEMIC_HIST"),
]
