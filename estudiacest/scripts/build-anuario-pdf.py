"""Edición A4 a color del contenido web, con control de desbordes por página."""
from pathlib import Path
import json, subprocess
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from reportlab import rl_config

rl_config.useA85=False
ROOT=Path(__file__).resolve().parents[1]
pages=json.loads(subprocess.check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./4dtp/modelo-content.js')))"],cwd=ROOT).decode('utf-8'))
fonts=Path('C:/Windows/Fonts')
for name,file in [('BookSerif','georgia.ttf'),('BookSans','arial.ttf'),('BookBold','arialbd.ttf')]:pdfmetrics.registerFont(TTFont(name,str(fonts/file)))
W,H=A4; M=44; CW=W-2*M
pdf=canvas.Canvas(str(ROOT/'4dtp/modelo-completo.pdf'),pagesize=A4)
pdf.setTitle('Huellas en papel · Anuario visual a todo color · 4°D TP 2026')
pdf.setAuthor('Estudia CEST · Modelo didáctico ficticio')
images={}

def plan(page,n,image_height):
    v=page['visual']; ink=v['ink']; accent=v['accent']; soft=v['soft']; ops=[]
    def text(value,y,x=M,w=CW,size=11.2,font='BookSerif',color=ink,leading=None):
        p=Paragraph(escape(value).replace('\n','<br/>'),ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.45,textColor=HexColor(color)))
        _,h=p.wrap(w,H);ops.append(('text',p,x,y-h));return y-h
    def panel(x,y,w,h,color=soft):ops.append(('panel',x,y-h,w,h,color))
    def pic(name,y,height):
        if name not in images:images[name]=ImageReader(str(ROOT/'4dtp'/name))
        im=images[name];iw,ih=im.getSize();scale=min((CW-14)/iw,height/ih);dw,dh=iw*scale,ih*scale
        panel(M,y,CW,dh+14);ops.append(('image',im,M+(CW-dw)/2,y-7-dh,dw,dh));return y-dh-21
    if page.get('cover'):
        name=page['image']
        if name not in images:images[name]=ImageReader(str(ROOT/'4dtp'/name))
        im=images[name];iw,ih=im.getSize();scale=max(W/iw,H/ih);dw,dh=iw*scale,ih*scale
        ops.append(('image',im,(W-dw)/2,(H-dh)/2,dw,dh))
        panel(0,H,W,185,v['paper']);panel(0,123,W,123,v['paper'])
        text('ANUARIO 2026 · 4°D TP · CEST',H-30,size=8,font='BookBold',color=accent)
        text('Huellas en\npapel',H-55,size=54,font='BookBold',leading=53)
        text(page['text'],106,size=9,font='BookSans',leading=12)
        return ops,67
    y=H-42
    kicker=page.get('kicker','Huellas en papel · Edición didáctica')
    y=text(kicker.upper(),y,size=7.6,font='BookBold',color=accent,w=CW-40)-12
    y=text(page['title'],y,size=52 if page.get('cover') else 29,font='BookBold',leading=53 if page.get('cover') else 31,w=CW-24)-16
    if page.get('optional'):y=text('CAPÍTULO A ELECCIÓN',y,size=8,font='BookBold',color=accent)-14
    if page.get('image'):
        y=pic(page['image'],y,image_height)
        y=text(page.get('caption','Ilustración generada con IA · Modelo ficticio'),y,size=7,font='BookSans',leading=10)-15
    if v.get('quote'):
        y=text(v['quote'],y,size=18,font='BookBold',color=accent,leading=21)-18
    chunks=page['text'].split('\n\n');layout=v['layout']
    if layout=='index':
        col_w=(CW-26)/2;ends=[]
        for col in range(2):
            cy=y
            for i,p in enumerate(pages[col*16:(col+1)*16],col*16+1):
                panel(M+col*(col_w+26),cy,col_w,2,accent)
                cy-=10
                cy=text(f'{i:02}  {p["title"]}',cy,x=M+col*(col_w+26),w=col_w,size=10.2,font='BookBold',leading=13)-12
            ends.append(cy)
        y=min(ends)
    elif layout=='interview':
        intro_y=y-12
        end=text(chunks[0],intro_y,x=M+12,w=CW-24,size=8.5,font='BookSans',leading=11)
        ops.insert(len(ops)-1,('panel',M,end-10,CW,y-end+10,soft));y=end-24
        for i,chunk in enumerate(chunks[1:],1):
            q,answer=chunk.split('\n',1)
            panel(M,y,CW,1,accent);y-=12
            text(f'{i:02}',y,x=M,w=32,size=18,font='BookBold',color=accent)
            y=text(q,y,x=M+40,w=CW-40,size=10.2,font='BookBold',color=accent,leading=13)-5
            y=text(answer,y,x=M+40,w=CW-40,size=10.6,leading=14.4)-16
    elif layout in ('timeline','cards'):
        for i,chunk in enumerate(chunks,1):
            before=len(ops);top=y;cy=y-14
            text(f'{i:02}',cy,x=M+12,w=28,size=19,font='BookBold',color=accent)
            if '\n' in chunk:
                title,rest=chunk.split('\n',1)
                cy=text(title,cy,x=M+52,w=CW-66,size=10.4,font='BookBold',color=accent,leading=13)-6
                cy=text(rest,cy,x=M+52,w=CW-66,size=10.7,leading=14.5)
            else:cy=text(chunk,cy,x=M+52,w=CW-66,size=10.7,leading=14.5)
            bottom=cy-14;ops.insert(before,('panel',M,bottom,CW,top-bottom,soft));y=bottom-12
    elif layout=='poster':
        y-=65
        y=text('“',y,size=105,font='BookSerif',color=accent,leading=75)-8
        for chunk in chunks:y=text(chunk,y,size=22,leading=31)-18
    else:
        if layout=='letter':
            before=len(ops);top=y;y-=16
            for chunk in chunks:y=text(chunk,y,x=M+16,w=CW-32,size=11,leading=15.5)-12
            ops.insert(before,('panel',M,y,CW,top-y,soft));y-=12
        else:
            size=10 if layout=='gallery' else 14.5 if not page.get('image') else 11.2
            for chunk in chunks:y=text(chunk,y,size=size,font='BookSans' if page.get('cover') else 'BookSerif',leading=size*1.45)-12
    if page.get('secondImage'):y=pic(page['secondImage'],y,170)
    return ops,y

for n,page in enumerate(pages,1):
    v=page['visual'];pdf.setFillColor(HexColor(v['paper']));pdf.rect(0,0,W,H,fill=1,stroke=0)
    pdf.setStrokeColor(HexColor(v['soft']));pdf.setLineWidth(23);pdf.circle(W-7,H-9,66,stroke=1,fill=0)
    pdf.setFillColor(HexColor(v['soft']));pdf.setFont('BookBold',64);pdf.drawRightString(W-22,H-72,f'{n:02}')
    for i in range(16):
        pdf.setFillColor(HexColor(v['accent'] if i%2 else v['soft']));pdf.rect(i*40,0,40,9,fill=1,stroke=0)
    initial=385 if page.get('cover') else 300 if page.get('back') else 175 if page.get('secondImage') else 230
    ops,bottom=plan(page,n,initial)
    while bottom<67 and page.get('image') and initial>105:
        initial-=15;ops,bottom=plan(page,n,initial)
    if bottom<67:raise ValueError(f'Página {n} ({page["id"]}) desbordada: {bottom:.1f}')
    for op in ops:
        if op[0]=='text':op[1].drawOn(pdf,op[2],op[3])
        elif op[0]=='panel':
            _,x,y,w,h,color=op;pdf.setFillColor(HexColor(color));pdf.rect(x,y,w,h,fill=1,stroke=0)
        else:
            _,im,x,y,w,h=op;pdf.drawImage(im,x,y,width=w,height=h,mask='auto')
    pdf.setStrokeColor(HexColor(v['accent']));pdf.setLineWidth(.7);pdf.line(M,48,W-M,48)
    pdf.setFillColor(HexColor(v['ink']));pdf.setFont('BookBold',7);pdf.drawString(M,34,'HUELLAS EN PAPEL · 4°D TP · CEST · 2026')
    pdf.setFont('BookSans',6.5);pdf.drawString(M,24,'Modelo ficticio · Ilustraciones con IA · No contiene testimonios reales')
    pdf.setFont('BookBold',18);pdf.drawRightString(W-M,28,f'{n:02}')
    pdf.showPage()
pdf.save();print(f'PDF: {len(pages)} páginas a color, sin desbordes.')
