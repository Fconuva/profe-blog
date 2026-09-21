"""PDF A4 del mismo contenido ficticio que el modelo web; falla si una página no cabe."""
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

rl_config.useA85 = False

ROOT=Path(__file__).resolve().parents[1]
pages=json.loads(subprocess.check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./4dtp/modelo-content.js')))"],cwd=ROOT).decode('utf-8'))
fonts=Path('C:/Windows/Fonts')
pdfmetrics.registerFont(TTFont('BookSerif',str(fonts/'georgia.ttf')))
pdfmetrics.registerFont(TTFont('BookSans',str(fonts/'arial.ttf')))
pdfmetrics.registerFont(TTFont('BookBold',str(fonts/'arialbd.ttf')))
W,H=A4; margin=52; width=W-margin*2
ink=HexColor('#17354a'); red=HexColor('#a34b35'); muted=HexColor('#566773')
pdf=canvas.Canvas(str(ROOT/'4dtp/modelo-completo.pdf'),pagesize=A4)
pdf.setTitle('Huellas en papel · Modelo completo del anuario 4°D TP 2026')
pdf.setAuthor('Estudia CEST · Modelo didáctico ficticio')

def paragraph(text,y,font='BookSerif',size=11,color=ink,leading=None):
    p=Paragraph(escape(text).replace('\n','<br/>'),ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.5,textColor=color))
    _,height=p.wrap(width,H)
    p.drawOn(pdf,margin,y-height)
    return y-height

def picture(name,y,height):
    image=ImageReader(str(ROOT/'4dtp'/name)); iw,ih=image.getSize()
    # Fit the complete generated artwork; no cropping or image editing.
    scale=min(width/iw,height/ih); dw,dh=iw*scale,ih*scale
    pdf.drawImage(image,margin+(width-dw)/2,y-dh,width=dw,height=dh,mask='auto')
    return y-dh-8

for n,page in enumerate(pages,1):
    cover=page.get('cover',False)
    pdf.setFillColor(ink if cover else HexColor('#fffdf7'));pdf.rect(0,0,W,H,fill=1,stroke=0)
    pdf.setFillColor(HexColor('#c99958') if cover else red);pdf.rect(0,H-8,W,8,fill=1,stroke=0)
    color=HexColor('#ffffff') if cover else ink
    y=H-45
    y=paragraph(page.get('kicker','Huellas en papel · Edición didáctica'),y,'BookBold',8,HexColor('#f3c88d') if cover else red)-14
    y=paragraph(page['title'],y,'BookSerif',36 if cover else 26,color,31 if not cover else 40)-18
    if page.get('image'):
        max_h=390 if cover else 135 if page['id'] in ['editada','aniversario','especialidad'] else 190
        if page.get('secondImage'):max_h=150
        if page.get('back'):max_h=330
        y=picture(page['image'],y,max_h)
        y=paragraph(page.get('caption','Ilustración generada con IA · Modelo ficticio'),y,'BookSans',7,color if cover else muted,10)-12
    for text in page['text'].split('\n\n'):
        y=paragraph(text,y,'BookSans' if cover else 'BookSerif',10 if cover else 10.5,color,14.5)-10
    if page.get('secondImage'):y=picture(page['secondImage'],y,145)
    if y<65:raise ValueError(f'Página {n} desbordada: {y:.1f}')
    pdf.setStrokeColor(HexColor('#bdc4c5'));pdf.line(margin,45,W-margin,45)
    pdf.setFillColor(color);pdf.setFont('BookSans',7)
    pdf.drawString(margin,30,'4°D TP · CEST · 2026 · Modelo ficticio; no contiene testimonios reales')
    pdf.setFont('BookBold',10);pdf.drawRightString(W-margin,30,f'{n:02}')
    pdf.showPage()
pdf.save()
print(f'PDF: {len(pages)} páginas sin desbordes.')
