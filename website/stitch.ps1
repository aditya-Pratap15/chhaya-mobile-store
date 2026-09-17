# stitch.ps1 — Transform all raw HTML files into connected website pages
# Run from: c:\Users\prata\Downloads\stitch_chhaya_mobiles_store_platform\website\

$websiteDir = "c:\Users\prata\Downloads\stitch_chhaya_mobiles_store_platform\website"

# ─── NAV LINK MAPPING ───────────────────────────────────────────────────────
$navPaths = @{
  'home'                   = 'index.html'
  'products-and-gadgets'   = 'products.html'
  'repair-services'        = 'repairs.html'
  'meet-the-owner'         = 'owner.html'
  'store-location-and-map' = 'location.html'
  'store-and-map'          = 'location.html'
  'storefront'             = 'index.html'
  'reviews'                = 'reviews.html'
  'admin-login'            = 'admin-login.html'
  'admin-portal'           = 'admin-login.html'
  'admin-setup'            = 'admin-setup.html'
  'admin-dashboard'        = 'admin-dashboard.html'
  'admin-home'             = 'admin-dashboard.html'
  'admin-profile'          = 'admin-profile.html'
  'admin-stock'            = 'admin-stock.html'
  'stock-and-gadgets'      = 'admin-stock.html'
  'admin-inventory'        = 'admin-stock.html'
  'admin-repairs'          = 'admin-repairs.html'
  'admin-repair-services'  = 'admin-repairs.html'
  'admin-owner'            = 'admin-dashboard.html'
}

function Replace-DataPaths($html) {
  foreach ($path in $navPaths.Keys) {
    $file = $navPaths[$path]
    # Replace data-path="X" href="#"  ->  data-path="X" href="file"
    $html = $html -replace "data-path=`"$path`" href=`"#`"", "data-path=`"$path`" href=`"$file`""
    # Also handle reversed attribute order: href="#" data-path="X"
    $html = $html -replace "href=`"#`" data-path=`"$path`"", "href=`"$file`" data-path=`"$path`""
  }
  return $html
}

function Fix-HtmlTag($html) {
  # Remove fixed-size style from <html> tag
  $html = $html -replace '<html lang="en" style="[^"]*">', '<html lang="en">'
  $html = $html -replace '<html lang="en" style=''[^'']*''>', '<html lang="en">'
  return $html
}

function Add-TitleTag($html, $title) {
  if ($html -notmatch '<title>') {
    $html = $html -replace '</head>', "<title>$title | Chhaya Mobiles</title></head>"
  }
  return $html
}

function Add-SharedJs($html) {
  # Inject shared.js just before </body>
  if ($html -notmatch 'shared\.js') {
    $html = $html -replace '</body>', '<script src="shared.js"></script></body>'
  }
  return $html
}

function Add-MetaDescription($html, $desc) {
  if ($html -notmatch 'name="description"') {
    $meta = "<meta name=`"description`" content=`"$desc`">"
    $html = $html -replace '</head>', "$meta</head>"
  }
  return $html
}

# ─── PAGE DEFINITIONS ────────────────────────────────────────────────────────
$pages = @(
  @{ raw='index_raw.html';      out='index.html';          title='Home — Certified Pre-Owned Phones & Repairs';  desc='Chhaya Mobiles, Sony Dharmshala Chitrakoot Dham M.P., Kamta Nath Mandir Road. Certified pre-owned smartphones, screen repairs, and battery replacements. Pay at store — Cash/UPI only.' }
  @{ raw='products_raw.html';   out='products.html';       title='Products & Gadgets';  desc='Browse certified pre-owned iPhones, Samsung, OnePlus, Xiaomi & accessories at Chhaya Mobiles, Sony Dharmshala Chitrakoot Dham M.P.' }
  @{ raw='repairs_raw.html';    out='repairs.html';        title='Repair Services & Diagnostic Clinic';  desc='Open-bench phone & gadget repairs with 90–180 day warranty. Screen, battery, motherboard, charging port & liquid revival.' }
  @{ raw='owner_raw.html';      out='owner.html';          title='Meet the Owner — Pushpendra Prajapati';  desc='Meet Pushpendra Prajapati, Level 4 micro-soldering specialist and founder of Chhaya Mobiles at Sony Dharmshala Chitrakoot Dham M.P.' }
  @{ raw='location_raw.html';   out='location.html';       title='Store Location & Map — Sony Dharmshala Chitrakoot Dham M.P.';  desc='Visit Chhaya Mobiles at Sony Dharmshala Chitarkoot Dham M.P., Kamta Nath Mandir Road Chitrakoot, Chitrakoot, Madhya Pradesh 485334. Open Mon–Sat 10AM–9:30PM, Sunday 11AM–6PM.' }
  @{ raw='reviews_raw.html';    out='reviews.html';        title='Customer Reviews & Testimonials';  desc='640+ verified walk-in customer reviews for Chhaya Mobiles. 4.9/5 rating for transparent bench repairs and certified phones.' }
  @{ raw='adminlogin_raw.html'; out='admin-login.html';    title='Admin Login Portal';  desc='Chhaya Mobiles CMS — Restricted staff access portal.' }
  @{ raw='adminsetup_raw.html'; out='admin-setup.html';    title='First-Time Admin Setup';  desc='One-time master admin account initialization for Chhaya Mobiles CMS.' }
  @{ raw='dashboard_raw.html';  out='admin-dashboard.html'; title='Admin Dashboard — CMS Command Center';  desc='Chhaya Mobiles CMS Dashboard — manage storefront content, images, and metrics.' }
  @{ raw='profile_raw.html';    out='admin-profile.html';  title='Admin Profile & Account Settings';  desc='Admin profile settings for Chhaya Mobiles CMS.' }
  @{ raw='stock_raw.html';      out='admin-stock.html';    title='Stock & Gadgets Management';  desc='Manage product inventory and stock for Chhaya Mobiles.' }
  @{ raw='adminrepairs_raw.html'; out='admin-repairs.html'; title='Repair Services Management';  desc='Manage repair service listings and pricing for Chhaya Mobiles.' }
)

foreach ($page in $pages) {
  $rawPath = Join-Path $websiteDir $page.raw
  $outPath = Join-Path $websiteDir $page.out

  if (-not (Test-Path $rawPath)) {
    Write-Host "SKIP (not found): $($page.raw)"
    continue
  }

  $html = Get-Content $rawPath -Raw -Encoding UTF8

  $html = Fix-HtmlTag $html
  $html = Add-TitleTag $html $page.title
  $html = Add-MetaDescription $html $page.desc
  $html = Replace-DataPaths $html
  $html = Add-SharedJs $html

  Set-Content $outPath -Value $html -Encoding UTF8
  Write-Host "OK: $($page.out)"
}

Write-Host "Done!"
