$ErrorActionPreference='Stop'
$base=Join-Path $PSScriptRoot '../assets/originales'
$style='Original high fantasy painterly card illustration, expressive hand painted brushwork, detailed materials, cinematic chiaroscuro, deep midnight teal with aged brass and warm ivory accents, central subject filling frame, elegant dramatic composition. '
$subjects=@{
 centinela='One man age 40, short brown hair and beard, wearing ornate bronze plate armor, holding a long straight sword upright by his side, stormy ancient gate, face clearly visible. No text.'
 testigo='One woman age 65, silver braided hair, weathered face, moss green cloak, holding a small brass lantern in front of a misty wooden bridge, visible face looking at viewer. No text.'
 bibliotecario='One woman age 55, long grey hair tied in a bun, round bronze spectacles, navy robe, carrying a closed leather book in both hands, warm amber archive shelves, visible face. No text.'
 cura='A single cracked emerald crystal orb repairing itself with fine glowing golden seams, gentle luminous water flowing underneath it, dark stone basin, hopeful calm magical atmosphere. No text.'
 relacion='Two blank parchment scrolls floating above a stone desk, a bright golden thread connecting both scrolls through a luminous teal orb, visual relationship and magic connection. No text.'
 contraste='Two differently shaped ancient bronze lanterns standing side by side, one glowing warm orange and the other cold teal, two beams intersecting above a dark stone tabletop, magical comparison. No text.'
 armadura='One empty ornate bronze breastplate displayed upright, emerald light flowing through engraved channels, protective luminous aura, dramatic dark ancient armory, centered object. No text.'
 cita='One ivory feather quill hovering above a blank pale parchment sheet, teal droplets of magical ink orbiting the quill, an aged bronze ink pot, ancient dark desk, dramatic magical glow. No text.'
 replica='A small bronze bell floating above a dark stone pedestal, two expanding concentric rings of teal magical light radiating outward, warm orange sparks and dramatic dark atmosphere. No text.'
 faro='A solitary ancient stone lighthouse on a coastal cliff, a strong narrow beam of amber light breaking through thick teal fog toward a calm sea, stars above, vertical dramatic composition. No text.'
}
foreach($name in @('centinela','testigo','bibliotecario','cura','relacion','contraste','armadura','cita','replica','faro')){
 $prompt=Join-Path $PSScriptRoot ('prompt-'+$name+'.txt')
 [IO.File]::WriteAllText($prompt,$style+$subjects[$name],[Text.UTF8Encoding]::new($false))
 & py -3.12 'C:/Users/franc/Portabot-2026/.github/skills/crear-imagenes/scripts/generar.py' --prompt-archivo $prompt --salida (Join-Path $base ($name+'.png')) --aspecto 3:4 --variantes 3 --hoja --semilla 71482
 if($LASTEXITCODE){throw "Falló ilustración $name"}
}
