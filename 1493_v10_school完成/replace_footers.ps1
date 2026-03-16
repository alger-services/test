$utf8 = New-Object System.Text.UTF8Encoding $false
$template = [IO.File]::ReadAllText("c:\Users\Hana\Desktop\1493_v7\footer_template.txt", $utf8)

$files = @(
    "EMBA\index.html",
    "SCHOOL\about.html",
    "SCHOOL\contact.html",
    "SCHOOL\environment.html",
    "SCHOOL\faq.html",
    "SCHOOL\index.html",
    "SCHOOL\news\article-01.html",
    "SCHOOL\news\article-02.html",
    "SCHOOL\news\article-03.html",
    "SCHOOL\news\article-04.html",
    "SCHOOL\news\article-05.html",
    "SCHOOL\news.html",
    "SCHOOL\plans.html",
    "SCHOOL\stories.html",
    "index.html",
    "sitemap.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $path = (Resolve-Path $file).Path
        $content = [IO.File]::ReadAllText($path, $utf8)
        
        $parts = $file -split '\\'
        $depth = $parts.Length
        
        $school = ""
        $emba = ""
        $root = ""
        
        if ($depth -eq 1) {
            $school = "SCHOOL/"
            $emba = ""
            $root = ""
        } elseif ($depth -eq 2) {
            if ($parts[0] -eq "EMBA") {
                $school = "../SCHOOL/"
                $emba = "../"
                $root = "../"
            } else {
                $school = ""
                $emba = "../"
                $root = "../"
            }
        } elseif ($depth -eq 3) {
            $school = "../"
            $emba = "../../"
            $root = "../../"
        }
        
        $new_footer = $template.Replace("{0}", $school).Replace("{1}", $emba).Replace("{2}", $root)
        $content = $content -replace '(?s)<footer id="footer">.*?</footer>', $new_footer
        
        [IO.File]::WriteAllText($path, $content, $utf8)
        Write-Host "Fixed $file"
    }
}
