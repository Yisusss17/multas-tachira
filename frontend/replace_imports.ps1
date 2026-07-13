$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$path = "c:\Users\Lozad\OneDrive\Escritorio\multas tachira\frontend\src\admin"
$files = Get-ChildItem -Path $path -Include *.ts,*.tsx,*.js,*.jsx -Recurse
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    if ($content -match "['""]src/") {
        $newContent = [regex]::Replace($content, "(['""])src/", "`$1src/admin/")
        [System.IO.File]::WriteAllText($file.FullName, $newContent, $utf8NoBom)
    }
}
