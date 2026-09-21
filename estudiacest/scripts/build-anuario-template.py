"""Plantilla vectorial del modelo vigente; no requiere Adobe para construirla.
Uso: py -3 scripts/build-anuario-template.py
Dependencias: reportlab, Pillow, PyMuPDF. Fuentes Arial instaladas en Windows.
El JSX incluido construye documentos nativos cuando se ejecuta en Illustrator.
"""
from pathlib import Path
import base64, html, json, shutil, subprocess, zipfile
from io import BytesIO
from PIL import Image
import fitz
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '4dtp'
STAGE = ROOT / 'test-results/anuario/plantilla-paquete'
STAGE.mkdir(parents=True, exist_ok=True)
for name in ['paginas-svg', 'imagenes']:
    (STAGE / name).mkdir(exist_ok=True)
model = json.loads(subprocess.check_output(['node', '-e', "process.stdout.write(JSON.stringify(require('./4dtp/modelo-content.js')))"], cwd=ROOT).decode('utf-8'))
guide = json.loads(subprocess.check_output(['node', '-e', "process.stdout.write(JSON.stringify(require('./4dtp/book-guide.js')))"], cwd=ROOT).decode('utf-8'))
guides = {p['id']:p for p in guide}
for name, file in [('Arial','arial.ttf'),('Arial-Bold','arialbd.ttf')]:
    pdfmetrics.registerFont(TTFont(name, 'C:/Windows/Fonts/' + file))
W, H, M = 595.276, 841.89, 44
CW = W - 2*M
titles = {p['id']:guides.get(p['id'],p)['title'] for p in model}
titles.update(portada='[Título de mi anuario]', editada='Entrevista editada', aniversario='Aniversario y memorias escolares', especialidad='Mi proyecto de especialidad', ficha='Ficha y proceso del proyecto', amigos='Fotos con amigos', galeria='Galería de recuerdos', despedida='Despedida', entrevistas='Entrevista 1 · Compañero/a')
for i in range(2,6): titles['entrevista-'+str(i)] = f'Entrevista {i} · ' + ('Compañero/a' if i<4 else 'Adulto/a de la comunidad')

def wrap(text, width, size, bold=False):
    lines=[]
    for paragraph in text.split('\n'):
        line=''
        for word in paragraph.split():
            candidate=(line+' '+word).strip()
            if line and pdfmetrics.stringWidth(candidate,'Arial-Bold' if bold else 'Arial',size)>width:
                lines.append(line); line=word
            else: line=candidate
        lines.append(line)
    return lines

pages=[]
for index, source in enumerate(model):
    id=source['id']; v=source['visual']; nodes=[]
    page={'id':id,'title':titles[id],'optional':bool(source.get('optional')),'palette':v,'nodes':nodes}
    def rect(x,y,w,h,color,layer='Fondos',stroke=None):
        nodes.append(dict(kind='rect',x=x,y=y,w=w,h=h,color=color,stroke=stroke,layer=layer))
    def text(value,x,y,w,h,size=11,bold=False,color=None,layer='Textos',name=None):
        lines=wrap(value,w,size,bold)
        leading=size*1.36
        assert len(lines)*leading <= h+0.1, (id,value,'Texto excede el marco',len(lines)*leading,h)
        nodes.append(dict(kind='text',text=value,lines=lines,x=x,y=y,w=w,h=h,size=size,leading=leading,bold=bold,color=color or v['ink'],layer=layer,name=name or value[:60]))
    def image(src,x,y,w,h):
        asset=OUT/src
        target=STAGE/'imagenes'/asset.name
        if not target.exists() or target.read_bytes()!=asset.read_bytes(): shutil.copyfile(asset,target)
        with Image.open(asset) as im: iw,ih=im.size
        scale=min(w/iw,h/ih); dw,dh=iw*scale,ih*scale
        nodes.append(dict(kind='image',src='imagenes/'+asset.name,x=x+(w-dw)/2,y=y+(h-dh)/2,w=dw,h=dh,layer='Imagenes'))
    def field(label,prompt,y,h=90,x=M,w=CW):
        rect(x,y,w,h,v['soft'],'Marcos')
        text(label,x+14,y+12,w-28,34,11,True,v['accent'])
        text(prompt,x+14,y+48,w-28,max(26,h-55),11,False,name=label+' · completar')
    def photo(label,y,h=180,x=M,w=CW,src=None):
        rect(x,y,w,h,v['soft'],'Marcos',v['accent'])
        if src: image(src,x+8,y+8,w-16,h-36)
        text(label,x+12,y+h-26,w-24,20,9,True,v['accent'],'Ayudas')
    rect(0,0,W,H,v['paper'])
    # Motivos vectoriales totalmente editables, contenidos en la página.
    nodes.append(dict(kind='ellipse',x=W-127,y=20,w=98,h=98,color=v['soft'],layer='Fondos'))
    text(f'{index+1:02}',W-100,42,65,65,42,True,v['accent'],'Numeracion')
    for k in range(16): rect(k*W/16,H-9,W/16,9,v['accent'] if k%2==0 else v['soft'])
    text('ANUARIO 2026 · 4°D TP · CEST',M,34,CW-90,20,9,True,v['accent'],'Titulos')
    title_size=35 if id=='portada' else 26
    text(titles[id],M,66,CW-75,122,title_size,True,layer='Titulos',name='Título de la sección')
    if page['optional']: text('CAPÍTULO A ELECCIÓN · puedes conservarlo o quitarlo',M,168,CW,20,8,True,v['accent'],'Ayudas')
    rect(M,783,CW,0.7,v['accent'],'Numeracion')
    text('[Tu nombre] · 4°D TP · CEST · 2026',M,796,CW-55,18,8,False,layer='Numeracion')
    text(f'{index+1:02}',W-M-30,791,30,30,18,True,layer='Numeracion')
    if id=='portada':
        image(source['image'],M,190,CW,398)
        text('[Una frase que represente tu historia]',M,617,CW,62,19,True)
        text('[Nombre y apellido]\n4°D TP · CEST · 2026',M,699,CW,62,14)
    elif id in ['dedicatoria','agradecimientos']:
        text('“',M,211,120,100,72,True,v['accent'],'Fondos')
        prompt='[Escribe a quién dedicas este libro y qué apoyo agradeces.]' if id=='dedicatoria' else '[Nombra a quienes te acompañaron y explica qué agradeces de cada persona.]'
        text(prompt,M+14,337,CW-28,280,24)
        text('[Tu firma]',M,693,CW,40,15)
    elif id=='indice':
        text('Conserva las secciones que uses y actualiza su número al terminar.',M,180,CW,45,10,layer='Ayudas')
        colw=(CW-24)/2
        for n,p in enumerate(model):
            x=M+(n//16)*(colw+24); y=235+(n%16)*32
            rect(x,y,colw,.5,v['accent'],'Marcos')
            text(f'{n+1:02}',x,y+6,22,20,10,True,v['accent'])
            t=titles[p['id']].replace('[Título de mi anuario]','Portada')
            text(t,x+29,y+5,colw-29,27,8.3)
    elif source['visual']['layout']=='interview':
        text('[Nombre de la persona] · [Curso o función]\n[Fecha] · [Nombre del audio o enlace al registro]',M,184,CW,50,10)
        for n in range(5):
            y=250+n*99
            text(f'{n+1:02}',M,y,32,35,20,True,v['accent'])
            text('[Escribe aquí tu pregunta]',M+42,y,CW-42,35,11,True)
            text('[Transcribe la respuesta real de la persona entrevistada.]',M+42,y+34,CW-42,56,11)
            rect(M+42,y+93,CW-42,.6,v['accent'],'Marcos')
    elif id=='editada':
        photo('REEMPLAZA POR UN RETRATO O UNA IMAGEN RELACIONADA',192,142,src=source['image'])
        field('Presentación de la persona','[Nombre, vínculo con el colegio y tema de la entrevista.]',350,96)
        for n in range(3):
            text(f'{n+1}. [Pregunta seleccionada]',M,463+n*78,CW,29,11,True,v['accent'])
            text('[Respuesta revisada sin cambiar su sentido.]',M,493+n*78,CW,43,11)
        text('[Cita breve y exacta que quieras destacar]',M,712,CW,47,15,True,v['accent'])
    elif id=='trayectoria':
        for n,(label,prompt) in enumerate([('Enseñanza básica','[Colegio, personas y un recuerdo.]'),('Primero y segundo medio','[Un cambio y algo que aprendiste.]'),('Tercero y cuarto medio','[Experiencias que te marcaron.]'),('Lo que viene','[Una meta y el primer paso para alcanzarla.]')]):
            field(label,prompt,203+n*137,116)
    elif id=='jefes':
        photo('ACOMPAÑAMIENTO DOCENTE · ilustración de apoyo',191,166,src=source['image'])
        for n,label in enumerate(['Profesor/a jefe de primero','Profesor/a jefe de segundo']):
            field(label,'[Nombre y año]\n[Un recuerdo concreto y lo que aprendiste de esa persona.]',375+n*174,154)
        text('Si cambiaste de colegio o una situación no corresponde, explícalo con tus palabras.',M,714,CW,42,10,layer='Ayudas')
    elif id=='ficha':
        image(source['image'],M,186,CW,139)
        labels=[('Producto','[Nombre y finalidad.]'),('Equipo','[Nombres y tareas.]'),('Materiales','[Herramientas y materiales.]'),('Proceso','[Pasos principales.]'),('Aprendizaje','[Una dificultad y su solución.]'),('Revisión','[Cómo comprobaste la calidad.]')]
        for n,(label,prompt) in enumerate(labels): field(label,prompt,345+(n//2)*140,122,M+(n%2)*(CW+18)/2,(CW-18)/2)
    elif id=='creaciones':
        text('[Título de tu cómic, dibujo, poema o diseño]',M,191,CW,50,15,True)
        image(source['image'],M,238,CW,165)
        for n in range(4):
            x=M+(n%2)*(CW+18)/2; y=420+(n//2)*110
            photo(f'ESPACIO {n+1} · TU CREACIÓN',y,94,x,(CW-18)/2)
        field('Sobre mi creación','[Explica qué expresa y cómo la hiciste. Puedes unir los espacios.]',643,112)
    elif id in ['amigos','galeria']:
        for n in range(2):
            y=191+n*282
            photo('REEMPLAZA POR TU FOTOGRAFÍA O CREACIÓN',y,207,src=source.get('image' if n==0 else 'secondImage'))
            text('[Quiénes o qué aparecen · lugar · año · autor/a]',M,y+217,CW,34,10)
            text('[Una frase sobre el recuerdo]',M,y+250,CW,27,11,True)
    elif id=='creditos':
        for n,(label,prompt) in enumerate([('Autoría','[Tu nombre y quienes colaboraron.]'),('Textos y entrevistas','[Autores, personas entrevistadas y fecha.]'),('Fotografías e ilustraciones','[Archivo o página, autor/a y autorización. Identifica las imágenes de IA que conserves.]'),('Diseño y producción','[Programas, impresión, encuadernación y fecha.]')]):
            field(label,prompt,195+n*141,122)
    elif id=='contraportada':
        image(source['image'],M,190,CW,330)
        text('[Una frase final que represente tu recorrido]',M,564,CW,120,25,True)
        text('[Nombre y apellido]\n4°D TP · CEST · 2026',M,705,CW,58,13)
    else:
        y=192
        if source.get('image'):
            photo('IMAGEN DE APOYO · puedes conservarla o reemplazarla',y,232,src=source['image']); y+=254
        prompts={
            'presentacion':[('Por qué hago este anuario','[Presenta quién eres y qué quieres conservar de esta etapa.]'),('Qué encontrarán en estas páginas','[Explica cómo organizaste tus recuerdos y para quién escribes.]')],
            'identidad':[('Así me presento','[Mis intereses, valores y algo que me caracteriza.]'),('La idea de mi libro','[Qué historia quiero contar y por qué elegí estos colores o símbolos.]')],
            'aniversario':[('La escena que recuerdo','[Cuándo ocurrió, dónde estabas y quiénes participaron.]'),('Lo que ocurrió y lo que me dejó','[Cuenta el momento y explica por qué sigue siendo importante.]')],
            'jefeactual':[('Quien nos acompañó este año','[Nombre y un recuerdo concreto.]'),('Lo que me llevo','[Un aprendizaje y las palabras que quisieras dedicarle.]')],
            'curso':[('Así era nuestro curso','[Personas, costumbres y rasgos que nos representaban.]'),('Un momento compartido','[Qué ocurrió y por qué merece quedar en el anuario.]')],
            'anecdota':[('Así empezó todo','[Sitúa la escena y presenta a quienes participaron.]'),('Lo inesperado','[Cuenta qué pasó y cómo reaccionaron.]'),('Por qué lo recuerdo','[Explica qué significa hoy para ti.]')],
            'participacion':[('Mi actividad','[Taller, deporte, arte, pastoral o servicio en que participé.]'),('Mi aporte y aprendizaje','[Qué hice, con quiénes y qué me dejó la experiencia.]')],
            'salidas':[('Una experiencia fuera del aula','[Lugar, fecha y propósito de la salida o encuentro.]'),('Lo que descubrí','[Una escena, una pregunta y un aprendizaje.]')],
            'especialidad':[('El desafío','[Qué hiciste y para qué.]'),('Proceso y aprendizaje','[Cómo lo realizaste, qué dificultad resolviste y qué aprendiste.]')],
            'comun':[('Una clase o trabajo','[Asignatura, actividad y experiencia concreta.]'),('Un aprendizaje que conservo','[Qué comprendí y cómo puedo usarlo.]')],
            'favorita':[('Mi asignatura favorita','[Nombre y una experiencia que explique tu elección.]'),('Por qué me importa','[Qué descubriste o aprendiste sobre ti.]')],
            'intereses':[('Lo que disfruto','[Música, deporte, arte, lectura u otro interés personal.]'),('Lo que dice de mí','[Cómo apareció este interés y qué lugar ocupa en tu vida.]')],
            'futuro':[('Querido yo del futuro:','[Lo que siento hoy y lo que quisiera que recordaras.]'),('Una meta y un compromiso','[Qué quiero lograr y qué puedo empezar a hacer.]')],
            'despedida':[('Lo que me llevo','[Una experiencia y las personas que recordaré.]'),('Mis palabras finales','[Agradece, despídete y deja un deseo para lo que viene.]')]
        }
        pairs=prompts[id]; available=759-y; gap=16; height=(available-gap*(len(pairs)-1))/len(pairs)
        for n,(label,prompt) in enumerate(pairs): field(label,prompt,y+n*(height+gap),height)
    pages.append(page)

# Preflight: geometría y texto real, sin respuestas de los personajes ficticios.
for p in pages:
    for n in p['nodes']:
        assert n['x']>=-0.01 and n['y']>=0 and n['x']+n['w']<=W+.01 and n['y']+n['h']<=H+.01, (p['id'],n)
all_text='\n'.join(n.get('text','') for p in pages for n in p['nodes'])
assert all(name not in all_text for name in ['Emilia','Diego','Sofía','Alex','Huellas en papel'])

def svg_nodes(p, prefix='', dx=0, dy=0):
    chunks=[]
    for layer in ['Fondos','Marcos','Imagenes','Numeracion','Titulos','Textos','Ayudas']:
        chunks.append(f'<g id="{prefix}{layer}" inkscape:groupmode="layer" inkscape:label="{layer}" transform="translate({dx} {dy})">')
        for i,n in enumerate(p['nodes']):
            if n['layer']!=layer: continue
            x,y,w,h=[n[k] for k in ['x','y','w','h']]; kind=n['kind']; color=n.get('color','#000')
            if kind=='rect': chunks.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{color}"'+(f' stroke="{n["stroke"]}" stroke-width="1"' if n.get('stroke') else '')+'/>')
            elif kind=='ellipse': chunks.append(f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2}" ry="{h/2}" fill="{color}"/>')
            elif kind=='image': chunks.append(f'<image x="{x}" y="{y}" width="{w}" height="{h}" xlink:href="{html.escape(prefix and n["src"] or "../"+n["src"])}"/>')
            else:
                chunks.append(f'<text id="{prefix}t{i}" xml:space="preserve" x="{x}" y="{y+n["size"]}" fill="{color}" font-family="Arial" font-size="{n["size"]}" font-weight="{700 if n["bold"] else 400}">')
                for j,line in enumerate(n['lines']): chunks.append(f'<tspan x="{x}" y="{y+n["size"]+j*n["leading"]}">{html.escape(line)}</tspan>')
                chunks.append('</text>')
        chunks.append('</g>')
    return ''.join(chunks)
svg_header=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="210mm" height="297mm" viewBox="0 0 {W} {H}">'
for i,p in enumerate(pages):
    (STAGE/'paginas-svg'/f'{i+1:02}-{p["id"]}.svg').write_text(svg_header+svg_nodes(p)+'</svg>',encoding='utf-8')
namedview='<sodipodi:namedview xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" id="namedview">'
for i,p in enumerate(pages):
    namedview+=f'<inkscape:page x="{(i%4)*(W+40)}" y="{(i//4)*(H+40)}" width="{W}" height="{H}" id="page{i+1}" inkscape:label="{i+1:02} {html.escape(p["title"])}"/>'
namedview+='</sodipodi:namedview>'
(STAGE/'Plantilla_Anuario_4D.svg').write_text(svg_header+namedview+''.join(svg_nodes(p,f'p{i+1}_',(i%4)*(W+40),(i//4)*(H+40)) for i,p in enumerate(pages))+'</svg>',encoding='utf-8')

pdf_file=OUT/'plantilla-anuario-4d.pdf'
c=canvas.Canvas(str(pdf_file),pagesize=(W,H),pageCompression=1,invariant=1)
c.setTitle('Plantilla editable · Anuario 4D TP 2026');c.setAuthor('Estudia CEST')
pdf_images={}
def pdf_image(src):
    if src not in pdf_images:
        buffer=BytesIO()
        with Image.open(STAGE/src) as im: im.convert('RGB').save(buffer,format='JPEG',quality=94,subsampling=0)
        buffer.seek(0);pdf_images[src]=ImageReader(buffer)
    return pdf_images[src]
for p in pages:
    for layer in ['Fondos','Marcos','Imagenes','Numeracion','Titulos','Textos','Ayudas']:
        for n in p['nodes']:
            if n['layer']!=layer: continue
            x,y,w,h=[n[k] for k in ['x','y','w','h']]
            if n['kind']=='image': c.drawImage(pdf_image(n['src']),x,H-y-h,w,h)
            elif n['kind']=='text':
                c.setFillColor(HexColor(n['color']));c.setFont('Arial-Bold' if n['bold'] else 'Arial',n['size'])
                for j,line in enumerate(n['lines']): c.drawString(x,H-y-n['size']-j*n['leading'],line)
            else:
                c.setFillColor(HexColor(n['color']));c.setStrokeColor(HexColor(n.get('stroke') or n['color']));c.setLineWidth(1)
                if n['kind']=='rect': c.rect(x,H-y-h,w,h,fill=1,stroke=bool(n.get('stroke')))
                else: c.ellipse(x,H-y-h,x+w,H-y,fill=1,stroke=0)
    c.showPage()
c.save();shutil.copyfile(pdf_file,STAGE/'Plantilla_Anuario_4D.pdf')

jsx_source=(ROOT/'scripts/anuario-template-illustrator.jsx').read_text(encoding='utf-8')
jsx_source=jsx_source.replace('/*__TEMPLATE_DATA__*/',json.dumps({'width':W,'height':H,'pages':pages},ensure_ascii=True,separators=(',',':')))
(STAGE/'Crear_plantilla_en_Illustrator.jsx').write_text(jsx_source,encoding='utf-8')
readme=(ROOT/'scripts/anuario-template-leeme.html').read_text(encoding='utf-8')
(STAGE/'EMPIEZA_AQUI.html').write_text(readme,encoding='utf-8')
assets={n['src'] for p in pages for n in p['nodes'] if n['kind']=='image'}
manifest={'version':'2026-09-21','pages':32,'size':'A4 vertical','source':'https://www.estudiacest.com/4dtp/modelo.html','optionalPages':[i+1 for i,p in enumerate(pages) if p['optional']],'assets':sorted(assets),'fonts':['Arial','Arial Bold'],'nativeIllustratorExecutionVerified':False,'note':'PDF y SVG verificados. El JSX requiere Illustrator; no está instalado en el equipo de construcción.'}
(STAGE/'CONTENIDO.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'test-results/anuario/plantilla-layout.json').write_text(json.dumps({'width':W,'height':H,'pages':pages},ensure_ascii=False),encoding='utf-8')
paths=['EMPIEZA_AQUI.html','CONTENIDO.json','Crear_plantilla_en_Illustrator.jsx','Plantilla_Anuario_4D.pdf','Plantilla_Anuario_4D.svg']+sorted(assets)+[f'paginas-svg/{i+1:02}-{p["id"]}.svg' for i,p in enumerate(pages)]
with zipfile.ZipFile(OUT/'plantilla-anuario-4d.zip','w',zipfile.ZIP_DEFLATED) as z:
    for relative in paths:
        info=zipfile.ZipInfo('Plantilla_Anuario_4D/'+relative,date_time=(2026,9,21,12,0,0));info.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(info,(STAGE/relative).read_bytes())
doc=fitz.open(pdf_file)
assert len(doc)==32
for p in doc:
    assert len(p.get_text())>80 and len(p.get_drawings())>10
    for block in p.get_text('dict')['blocks']:
        if block['type']==0:
            assert fitz.Rect(0,0,W,H).contains(fitz.Rect(block['bbox'])), block['bbox']
for start in [0,16]:
    sheet=Image.new('RGB',(1000,1460),'#172741')
    for j in range(16):
        pix=doc[start+j].get_pixmap(matrix=fitz.Matrix(.4,.4),alpha=False)
        im=Image.open(BytesIO(pix.tobytes('png')));sheet.paste(im,((j%4)*250+6,(j//4)*365+8))
    sheet.save(ROOT/f'test-results/anuario/plantilla-contact-{start}.png')
for n in [0,6,20,25,30]: doc[n].get_pixmap(matrix=fitz.Matrix(1.3,1.3),alpha=False).save(ROOT/f'test-results/anuario/plantilla-p{n+1}.png')
preview=Image.new('RGB',(1120,810),'#172741')
for j,n in enumerate([0,5,6,12,20,24,25,31]):
    pix=doc[n].get_pixmap(matrix=fitz.Matrix(.445,.445),alpha=False)
    preview.paste(Image.open(BytesIO(pix.tobytes('png'))),((j%4)*280+7,(j//4)*405+12))
preview.save(OUT/'assets/plantilla-vista-previa.webp',quality=88)
print(json.dumps({'pages':len(doc),'svgPages':32,'images':len(assets),'pdfBytes':pdf_file.stat().st_size,'zipBytes':(OUT/'plantilla-anuario-4d.zip').stat().st_size,'optionalPages':manifest['optionalPages']}))
