# inject_admin_guards.ps1 — Adds session route guard and logout to admin pages

$websiteDir = "c:\Users\prata\Downloads\stitch_chhaya_mobiles_store_platform\website"

$adminPages = @('admin-dashboard.html', 'admin-profile.html', 'admin-stock.html', 'admin-repairs.html')

# Guard script to inject right after <body ...>
$guardScript = @'
<script>
// Admin route guard — runs before page renders
(function() {
  var session = localStorage.getItem('chhayaAdminSession');
  if (!session) { window.location.replace('admin-login.html'); }
})();
</script>
'@

foreach ($page in $adminPages) {
  $path = Join-Path $websiteDir $page
  if (-not (Test-Path $path)) { Write-Host "SKIP $page"; continue }

  $html = Get-Content $path -Raw -Encoding UTF8

  # 1. Inject guard script immediately after the opening <body> tag (before any content)
  if ($html -notmatch 'Admin route guard') {
    $html = $html -replace '(<body[^>]*>)', "`$1$guardScript"
  }

  # 2. Wire logout button — replace any href="#" logout-style link that mentions "logout" or "sign out"
  #    Also wire the profile image click area to show logout option
  #    We add a floating logout button to ensure it always works
  if ($html -notmatch 'adminLogout()') {
    $logoutBtn = @'
<!-- Injected Logout Button -->
<div style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;">
  <button onclick="adminLogout()" title="Sign Out of Admin Panel"
    style="display:inline-flex;align-items:center;gap:6px;background:#ba1a1a;color:#fff;font-family:Inter,sans-serif;font-size:12px;font-weight:700;padding:8px 16px;border-radius:9999px;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(186,26,26,0.35);letter-spacing:0.04em;transition:background 0.2s;">
    <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">logout</span>
    Sign Out
  </button>
</div>
'@
    $html = $html -replace '</body>', "$logoutBtn`n</body>"
  }

  Set-Content $path -Value $html -Encoding UTF8
  Write-Host "OK: $page"
}

Write-Host "Guards injected!"
