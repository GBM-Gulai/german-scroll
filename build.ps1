# Packs the app into one self-contained file: dist/german-scroll.html
# Run after changing content or code:   powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Read-Text($rel) { [IO.File]::ReadAllText((Join-Path $root $rel), $utf8) }

$index = Read-Text "index.html"
$body = [regex]::Match($index, '(?s)<body>\s*(.*?)\s*<script').Groups[1].Value
$fonts = [regex]::Match($index, '<link href="https://fonts\.googleapis\.com[^>]*>').Value
$scripts = [regex]::Matches($index, '<script src="([^"]+)"></script>') | ForEach-Object { Read-Text $_.Groups[1].Value }

$out = @"
<title>German Scroll</title>
$fonts
<style>
$(Read-Text "style.css")
</style>
$body
<script>window.STANDALONE_BUNDLE = true;</script>
<script>
$($scripts -join "`n")
</script>
"@

New-Item -ItemType Directory -Force (Join-Path $root "dist") | Out-Null
[IO.File]::WriteAllText((Join-Path $root "dist\german-scroll.html"), $out, $utf8)
"Built dist\german-scroll.html ($([math]::Round($out.Length / 1KB)) KB)"
