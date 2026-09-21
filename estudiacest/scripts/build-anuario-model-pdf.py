"""PDF A4 del mismo contenido, paleta e imágenes del modelo web.
Uso: py -3 scripts/build-anuario-model-pdf.py (reportlab, Pillow, PyMuPDF).
"""
from pathlib import Path
from io import BytesIO
from html import escape
import json, subprocess
from PIL import Image
import fitz
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'4dtp'; QA=ROOT/'test-results/anuario';QA.mkdir(parents=True,exist_ok=True)
pages=json.loads(subprocess.check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./4dtp/modelo-content.js')))"],cwd=ROOT).decode('utf-8'))
for name,file in [('Arial','arial.ttf'),('Arial-Bold','arialbd.ttf')]:pdfmetrics.registerFont(TTFont(name,'C:/Windows/Fonts/'+file))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='Arial-Bold',italic='Arial',boldItalic='Arial-Bold')
W,H,M=595.276,841.89,44; CW=W-M*2
file=OUT/'modelo-completo.pdf'; c=canvas.Canvas(str(file),pagesize=(W,H),invariant=1,pageCompression=1)
c.setTitle('Huellas en papel · Anuario visual 4°D TP 2026');c.setAuthor('Estudia CEST · Modelo ficticio')
images={}; diagnostics=[]
def image(src,x,y,w,maxh):
    if src not in images:
        with Image.open(OUT/src) as im:
            iw,ih=im.size;buf=BytesIO();im.convert('RGB').save(buf,format='JPEG',quality=94,subsampling=0);buf.seek(0)
        images[src]=(ImageReader(buf),iw,ih)
    reader,iw,ih=images[src];scale=min(w/iw,maxh/ih);dw,dh=iw*scale,ih*scale
    c.drawImage(reader,x+(w-dw)/2,H-y-dh,dw,dh)
    return dh
def para(text,x,y,w,size=11,color='#22304A',bold=False,maxh=None):
    style=ParagraphStyle('p',fontName='Arial-Bold' if bold else 'Arial',fontSize=size,leading=size*1.38,textColor=HexColor(color),spaceAfter=0)
    p=Paragraph(text,style);_,h=p.wrap(w,10000)
    if maxh is not None: assert h<=maxh+.1,(text[:80],h,maxh)
    p.drawOn(c,x,H-y-h);return h
def safe(text):return escape(text).replace('\n','<br/>')
for number,p in enumerate(pages,1):
    v=p['visual'];c.setFillColor(HexColor(v['paper']));c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(HexColor(v['soft']));c.circle(W-66,H-65,49,fill=1,stroke=0)
    para(str(number).zfill(2),W-99,38,72,42,v['accent'],True)
    for k in range(16):
        c.setFillColor(HexColor(v['accent'] if k%2==0 else v['soft']));c.rect(k*W/16,0,W/16,9,fill=1,stroke=0)
    y=38+para(safe(p.get('kicker','Huellas en papel · Edición didáctica')),M,38,CW-90,8,v['accent'],True)+16
    y+=para(safe(p['title']),M,y,CW-55,48 if p.get('cover') else 27,v['ink'],True)+15
    if p.get('optional'):y+=para('CAPÍTULO A ELECCIÓN',M,y,CW,8,v['accent'],True)+14
    bottom=768
    if p['id']=='indice':
        col=(CW-25)/2
        for i,entry in enumerate(pages):
            x=M+(i//16)*(col+25);cy=y+(i%16)*35
            c.setStrokeColor(HexColor(v['accent']));c.setLineWidth(.4);c.line(x,H-cy,x+col,H-cy)
            para(str(i+1).zfill(2),x,cy+6,23,11,v['accent'],True)
            para(safe(entry['title']),x+29,cy+6,col-29,8.4,v['ink'],maxh=28)
        last=y+560
    elif p.get('cover'):
        ih=image(p['image'],M,y,CW,450);y+=ih+10
        y+=para(safe(p.get('caption','Ilustración con IA.')),M,y,CW,7,v['ink'])+13
        y+=para(safe(p['text']),M,y,CW,10,v['ink'])
        last=y
    else:
        layout=v['layout'];chunks=p['text'].split('\n\n')
        image_h=250 if p.get('image') else 0
        if p.get('back'):image_h=420
        if layout=='gallery':image_h=190
        base=20 if layout=='poster' else (12 if layout in ['interview','cards','gallery'] else 13)
        def blocks(size):
            result=[]
            if v.get('quote'): result.append((safe(v['quote']),size+5,True,v['accent'],18))
            for chunk in chunks:
                if layout=='interview' and '\n' in chunk:
                    first,*rest=chunk.split('\n');content='<b>'+safe(first)+'</b><br/>'+safe('\n'.join(rest))
                elif layout in ['cards','timeline'] and '\n' in chunk:
                    first,*rest=chunk.split('\n');content='<b>'+safe(first)+'</b><br/>'+safe('\n'.join(rest))
                else:content=safe(chunk)
                result.append((content,size,False,v['ink'],11 if size<15 else 24))
            return result
        def measured(items):
            if layout=='cards':
                heights=[]
                for txt,sz,bold,color,gap in items:
                    par=Paragraph(txt,ParagraphStyle('measure',fontName='Arial-Bold' if bold else 'Arial',fontSize=sz,leading=sz*1.38))
                    heights.append(par.wrap((CW-16)/2-28,10000)[1]+24)
                return sum(max(heights[i:i+2])+14 for i in range(0,len(heights),2))
            total=0
            for txt,sz,bold,color,gap in items:
                par=Paragraph(txt,ParagraphStyle('measure',fontName='Arial-Bold' if bold else 'Arial',fontSize=sz,leading=sz*1.38));total+=par.wrap(CW-28 if layout in ['cards','timeline','letter'] else CW,10000)[1]+gap+(22 if layout in ['cards','timeline','letter'] else 0)
            return total
        def artwork_height(src,limit):
            with Image.open(OUT/src) as im:return min(limit,CW*im.height/im.width)
        for attempt in range(40):
            items=blocks(base)
            pics=sum(artwork_height(src,image_h)+30 for src in [p.get('image'),p.get('secondImage')] if src)
            needed=measured(items)+pics
            if needed<=bottom-y:break
            if base>9:base-=.25
            elif image_h>110:image_h-=10
            else:raise RuntimeError(f'No cabe el modelo {p["id"]}: {needed}')
        if layout=='poster':y+=max(20,(bottom-y-needed)/2)
        if p.get('image'):
            y+=image(p['image'],M,y,CW,image_h)+7
            y+=para(safe(p.get('caption','Ilustración generada con IA · Escena ficticia')),M,y,CW,7,v['ink'])+13
        if layout=='cards':
            col=(CW-16)/2
            for i in range(0,len(items),2):
                row=items[i:i+2];heights=[]
                for txt,sz,bold,color,gap in row:
                    par=Paragraph(txt,ParagraphStyle('card',fontName='Arial-Bold' if bold else 'Arial',fontSize=sz,leading=sz*1.38));heights.append(par.wrap(col-28,10000)[1]+24)
                rh=max(heights)
                for j,(txt,sz,bold,color,gap) in enumerate(row):
                    x=M+j*(col+16);c.setFillColor(HexColor(v['soft']));c.rect(x,H-y-rh,col,rh,fill=1,stroke=0)
                    para(txt,x+14,y+12,col-28,sz,color,bold)
                y+=rh+14
        for txt,sz,bold,color,gap in ([] if layout=='cards' else items):
            if layout in ['timeline','letter']:
                par=Paragraph(txt,ParagraphStyle('box',fontName='Arial-Bold' if bold else 'Arial',fontSize=sz,leading=sz*1.38));ph=par.wrap(CW-28,10000)[1]
                c.setFillColor(HexColor(v['soft']));c.rect(M,H-y-ph-20,CW,ph+20,fill=1,stroke=0)
                c.setFillColor(HexColor(v['accent']));c.rect(M,H-y-ph-20,3,ph+20,fill=1,stroke=0)
                y+=10+para(txt,M+14,y+10,CW-28,sz,color,bold)+10+gap
            else:y+=para(txt,M,y,CW,sz,color,bold)+gap
        if p.get('secondImage'):
            y+=image(p['secondImage'],M,y,CW,image_h)+7
            y+=para('Ilustración con IA · Escena ficticia',M,y,CW,7,v['ink'])+8
        last=y
        diagnostics.append({'id':p['id'],'fontSize':base,'contentBottom':round(last,1)})
    assert last<=780,(p['id'],last)
    c.setStrokeColor(HexColor(v['accent']));c.setLineWidth(.7);c.line(M,56,W-M,56)
    para('HUELLAS EN PAPEL · 4°D TP · CEST · 2026',M,796,CW-45,7,v['ink'],True)
    para('Modelo ficticio · Ilustraciones de OpenAI y Gemini',M,808,CW-45,7,v['ink'])
    para(str(number).zfill(2),W-M-30,791,30,19,v['ink'],True)
    c.showPage()
c.save()
doc=fitz.open(file);assert len(doc)==32
for p in doc:
    assert len(p.get_text())>120
    for b in p.get_text('dict')['blocks']:
        if b['type']==0:assert fitz.Rect(0,0,W,H).contains(fitz.Rect(b['bbox'])),b['bbox']
for start in [0,16]:
    sheet=Image.new('RGB',(1000,1460),'#172741')
    for j in range(16):
        pix=doc[start+j].get_pixmap(matrix=fitz.Matrix(.4,.4),alpha=False)
        im=Image.open(BytesIO(pix.tobytes('png')));sheet.paste(im,((j%4)*250+6,(j//4)*365+8))
    sheet.save(QA/f'modelo-gemini-contact-{start}.png')
for n in [11,13,18,20,24,31]:doc[n].get_pixmap(matrix=fitz.Matrix(1.3,1.3),alpha=False).save(QA/f'modelo-gemini-p{n+1}.png')
(QA/'modelo-gemini-pdf-audit.json').write_text(json.dumps(diagnostics,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':len(doc),'images':len(images),'bytes':file.stat().st_size,'minimumFont':min(d['fontSize'] for d in diagnostics)}))
