from pathlib import Path
from PIL import Image
import json
base=Path(__file__).resolve().parent.parent/'assets'
im=Image.open(base/'originales'/'tablero-higgsfield-v1.png').convert('RGB')
im.thumbnail((1920,1080),Image.Resampling.LANCZOS)
im.save(base/'tablero.webp',quality=87)
for i in range(1,4):
    raw=json.loads((base/'originales'/f'tablero-higgsfield-v{i}.json').read_text(encoding='utf8'))[0]
    safe={k:raw[k] for k in ['id','created_at','display_name','job_type','params','status']}
    safe.update({'estimatedCredits':2,'provider':'Higgsfield','selected':i==1,'selectionReason':'v1: terraza central despejada, profundidad y paleta teal/bronce coherente; las otras variantes se conservan.'})
    (base/'originales'/f'tablero-procedencia-v{i}.json').write_text(json.dumps(safe,ensure_ascii=False,indent=2),encoding='utf8')
(base/'originales'/'.gitignore').write_text('tablero-higgsfield-v*.json\n',encoding='utf8')
