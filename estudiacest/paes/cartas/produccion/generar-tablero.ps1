$ErrorActionPreference='Stop'
$base=Join-Path $PSScriptRoot '../assets/originales'
$prompt='Original high fantasy painterly landscape, an ancient circular library carved into a sea cliff, a broad round dark stone terrace in the foreground surrounded by bronze lanterns, towering arches, teal ocean mist and soft amber light, empty central terrace, intricate architecture, cinematic hand painted brushwork, panoramic view, strong central perspective and deep atmospheric layers. No text.'
[IO.File]::WriteAllText((Join-Path $PSScriptRoot 'prompt-tablero.txt'),$prompt,[Text.UTF8Encoding]::new($false))
for($i=1;$i -le 3;$i++){
 $file=Join-Path $base "tablero-higgsfield-v$i.json"
 if(Test-Path -LiteralPath $file){throw 'Ya existe una generación; consultar su identificador antes de repetir.'}
 $raw=& 'C:/Users/franc/.local/bin/higgsfield.exe' generate create nano_banana_pro --prompt $prompt --aspect_ratio 16:9 --resolution 2k --wait --json
 [IO.File]::WriteAllText($file,($raw -join "`n"),[Text.UTF8Encoding]::new($false))
 if($LASTEXITCODE){throw 'Fallo Higgsfield; revisar trabajo guardado antes de repetir consumo.'}
 Write-Output "Tablero v${i}: resultado conservado."
}
