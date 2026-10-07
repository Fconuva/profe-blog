$ErrorActionPreference='Stop'
$base=Join-Path $PSScriptRoot '../assets/originales'
$style='Original high fantasy painterly card illustration, expressive hand painted brushwork, detailed materials, cinematic chiaroscuro, deep midnight teal with aged brass and warm ivory accents, central subject filling frame, elegant dramatic composition. '
$subjects=@{
 guardian='One woman age 35 with short dark curly hair, holding a large bronze shield in front of her body, layered emerald cloak and practical leather armor, windswept ancient courtyard, visible face. No text.'
 cronista='One man age 50 with curly grey hair and bronze glasses, holding an open illuminated book with a glowing teal blank page, dark blue robes, shelves and floating dust in a stone library, visible face. No text.'
 exploradora='One woman age 25 with black braided hair, holding a polished brass lantern and a rolled blank parchment, ochre cloak, moonlit mountain pass, visible face. No text.'
 llama='One floating flame spirit shaped like a flowing ribbon of molten brass and orange light, magical swirling sparks reflected in a dark stone bowl, deep teal background. No text.'
 sello='One circular bronze shield with a glowing emerald geometric seal, three layers of luminous protective rings and fine engraved filigree, dramatic dark teal background. No text.'
 fuentes='One closed leather-bound book with two bronze clasps, teal crystals glowing around it, a golden thread of light connecting the book and a polished glass sphere, dark wooden table. No text.'
}
foreach($name in @('guardian','cronista','exploradora','llama','sello','fuentes')){
 $prompt=Join-Path $PSScriptRoot ('prompt-'+$name+'.txt')
 [IO.File]::WriteAllText($prompt,$style+$subjects[$name],[Text.UTF8Encoding]::new($false))
 & py -3.12 'C:/Users/franc/Portabot-2026/.github/skills/crear-imagenes/scripts/generar.py' --prompt-archivo $prompt --salida (Join-Path $base ($name+'.png')) --aspecto 3:4 --variantes 3 --hoja --semilla 71482
 if($LASTEXITCODE){throw "Falló ilustración $name"}
}
