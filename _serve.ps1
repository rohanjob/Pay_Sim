$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:7070/")
$listener.Start()
Write-Host "Server started at http://localhost:7070/"

$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
}

$root = "C:\Users\Admin\Music\cyberpunk-gateway\frontend"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $localPath = $context.Request.Url.LocalPath
    if ($localPath -eq "/") { $localPath = "/index.html" }
    $filePath = Join-Path $root $localPath.TrimStart("/")
    $response = $context.Response
    if (Test-Path $filePath) {
        $ext = [System.IO.Path]::GetExtension($filePath)
        $ct = $mimeTypes[$ext]
        if (-not $ct) { $ct = "application/octet-stream" }
        $response.ContentType = $ct
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}
