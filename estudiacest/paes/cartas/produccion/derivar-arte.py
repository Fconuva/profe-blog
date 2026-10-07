from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
import json
base=Path(__file__).resolve().parent.parent/'assets'
selected={'guardian':1,'cronista':1,'exploradora':1,'llama':1,'sello':2,'fuentes':1,'centinela':1,'testigo':1,'bibliotecario':2,'cura':1,'relacion':1,'contraste':1,'armadura':1,'cita':1,'replica':1,'faro':1}
for name,v in selected.items():
    source=base/'originales'/f'{name}_v{v}.png'
    im=Image.open(source).convert('RGB')
    im.thumbnail((640,840),Image.Resampling.LANCZOS)
    im.save(base/f'{name}.webp',quality=88)
boards=[]
for j in range(1,4):
    p=base/'originales'/f'tablero-higgsfield-v{j}.png'
    if p.exists():
        im=Image.open(p).convert('RGB');im.thumbnail((640,360));boards.append(im)
if len(boards)==3:
    sheet=Image.new('RGB',(1920,390),'white');d=ImageDraw.Draw(sheet)
    for i,im in enumerate(boards):sheet.paste(im,(i*640,30));d.text((i*640+10,10),f'Tablero v{i+1}',fill='black')
    sheet.save(base/'originales'/'tablero_hoja.png')
json.dump({'selected':selected,'provider':'ComfyUI local Z-Image Turbo','transform':'thumbnail Lanczos y WebP; originales sin cambios','rationale':'v1 de personajes y hechizos sin marcos ni pseudotexto; sello v2 conserva figura aislada; bibliotecario v2 tiene libro cerrado y rostro diferenciado'},open(base/'originales'/'seleccion-local.json','w',encoding='utf8'),ensure_ascii=False,indent=2)
