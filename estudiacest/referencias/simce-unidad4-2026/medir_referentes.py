"""Medición reproducible de fuentes locales; no calcula nivel SIMCE."""
import fitz, json, re, hashlib, pathlib, statistics
from bs4 import BeautifulSoup
BASE = pathlib.Path(__file__).parent
DOCENCIA = pathlib.Path(r'C:\Users\franc\OneDrive\Desktop\2026\2026\Lengua y Literatura 2026\NM2 - SIMCE')
PDF = DOCENCIA / 'articles-208047_recurso_pdf.pdf'
FORMA = DOCENCIA / 'ENSAYOS OFICIALES/SIMCE 2025 (Forma P)/SIMCE_2025_NM2_Forma_P.html'
def words(t): return re.findall(r"[^\W_]+(?:[’'-][^\W_]+)*",t,re.UNICODE)
def metrics(t):
    s=[x for x in re.split(r'[.!?…]+(?:[»”\"])?\s+',t) if words(x)]
    ns=[len(words(x)) for x in s]
    return dict(words_lexical=len(words(t)),words_whitespace=len(t.split()),sentences_approx=len(s),mean_sentence_words=round(statistics.mean(ns),1) if ns else 0,max_sentence_words=max(ns,default=0),long_sentences_over_30=sum(n>30 for n in ns),subordination_markers=len(re.findall(r'\b(?:que|aunque|cuando|porque|si|mientras|donde|cuyo|cuya)\b',t,re.I)))
def body(doc,n,title):
    t=doc[n-1].get_text(sort=True)
    # Se excluyen solo folio, título y referencias; se conservan contexto,
    # personajes, acotaciones, bajada, fecha, pie de imagen y comentarios.
    t=re.sub(r'^\s*\d+\s*\n','',t)
    t=t.split('Fuente:')[0]
    t=re.sub(r'(?<=\w)-\s*\n(?=\w)','',t)
    t=re.sub(r'\s+',' ',t).strip()
    t=re.sub(r'^Texto [12]\s+','',t)
    t=t.replace(title,'',1)
    if title.startswith('Morir de Amor:'): t=t.replace('“Morir de Amor” se roba el corazón del público.','',1)
    return t.strip()
doc=fitz.open(PDF)
units=[('El bosque de la autopista',[24,25,26],'Narrativa con ironía y perspectiva equivocada'),('El joven que no tenía nombre',[30,31],'Narrativa fantástica y simbolismo de identidad'),('Macbeth',[34,35],'Drama con contexto, carta, parlamentos y acotaciones'),('La canción kitsch y cebolla llega a los escenarios con “Morir de Amor”',[38,39],'Artículo con entrevista, dos columnas, imagen y pie'),('Morir de Amor: noticia y comentarios',[40,41],'Noticia y cuatro comentarios con datos de interacción'),('Fatalidad',[46],'Poema: seis estrofas de cuatro versos')]
records=[]
for title,pages,form in units:
    content=' '.join(body(doc,n,title) for n in pages)
    spans=[s for n in pages for b in doc[n-1].get_text('dict')['blocks'] if b['type']==0 for l in b['lines'] for s in l['spans']]
    rect=doc[pages[0]-1].rect
    record={'title':title,'pdf_pages':pages,'printed_pages':[n-4 for n in pages],'format':form,**metrics(content),'font_sizes_pt':sorted(set(round(s['size'],1) for s in spans)),'page_size_pt':[round(rect.width,2),round(rect.height,2)],'embedded_rasters':sum(len(doc[n-1].get_images()) for n in pages),'count_note':'Incluye paratextos de lectura excepto título, folio y fuente. No cuenta letras de la imagen. Segmentación de oraciones aproximada, no comparable con verso sin interpretación.'}
    if title=='Macbeth':
        ctx=re.search(r'Contexto:(.*?)Escena V',content)
        record['context_words']=len(words(ctx.group(1))) if ctx else None
        record['lexical_obstacles']=['nuncios','clemencia','hado','henchidme','hórrida','columbrar','áspid']
        record['demand_note']='Texto complejo no implica pregunta compleja: ambición está reiterada (Elemental); plan de muerte frente a profecía exige integrar implícitos (Adecuado).'
    records.append(record)
soup=BeautifulSoup(FORMA.read_text(encoding='utf8'),'html.parser')
forms=[]
for i,c in enumerate(soup.select('.texto-container'),1):
    t=c.get_text(' ',strip=True)
    forms.append({'container':i,'start':t[:110],**metrics(t),'svg_nodes':len(c.select('svg')),'img_nodes':len(c.select('img'))})
opens=[x.find_parent(class_='pregunta').get_text(' ',strip=True) for x in soup.select('.pregunta-abierta')]
inventory=[{'pdf_page':i+1,'printed_page':i-3 if i>=4 else None,'words_extracted':len(words(p.get_text())),'images_embedded':len(p.get_images()),'text_sha256':hashlib.sha256(p.get_text().encode()).hexdigest(),'review':'leído; páginas con ejemplos visuales contrastadas con render; portadas/blancos identificados'} for i,p in enumerate(doc)]
result={'pdf_source':'Estándares de Aprendizaje Lectura 2.º medio, MINEDUC, 2022, decretos 178/2015 y 256/2019','pdf_sha256':hashlib.sha256(PDF.read_bytes()).hexdigest(),'pages':len(doc),'page_inventory':inventory,'official_examples':records,'form_p_local':{'source_note':'Reproducción HTML local; no facsímil oficial ni norma de formato 2026. Ocho contenedores forman siete unidades porque cuento y reseña integran una unidad. SVG de la reproducción no demuestra el formato del cuadernillo original.','sha256':hashlib.sha256(FORMA.read_bytes()).hexdigest(),'units':7,'containers':forms,'question_positions':len(soup.select('.pregunta')),'constructed_prompts':opens,'svg_nodes':len(soup.select('svg')),'img_nodes':len(soup.select('img'))},'method':'Palabras léxicas Unicode; se informan también tokens separados por espacio para cotejar mediciones anteriores. No se equipara extensión, sintaxis ni ningún índice a dificultad empírica.'}
(BASE/'INGENIERIA_INVERSA.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'official':[{k:r[k] for k in ['title','words_lexical','words_whitespace','mean_sentence_words','max_sentence_words','embedded_rasters']} for r in records],'macbeth_context_words':records[2]['context_words'],'local_form_containers':[r['words_lexical'] for r in forms],'open_positions':opens},ensure_ascii=False,indent=2))
