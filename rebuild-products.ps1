$idx = @(Get-Content "C:\Users\Mayn\.openclaw\workspace\ounin-clone\index.html")
$headerBlock = ($idx[53..137] -join "`n") + "`n"
$footerBlock = ($idx[562..1134] -join "`n")

# Product data: file|name|price|priceOrig|badge|desc|productId|imgA|imgB|isBundle(0/1)
$pages = @(
    "product-pro-embedded.html|Ounin Pro Embedded|1299|1499|Bestseller|75L Capacity 12 Cooking Modes WiFi Connected|pro-embedded|product-1a.jpg|product-1b.jpg|0",
    "product-compact.html|Ounin Compact|699||New|40L Capacity 8 Cooking Modes Countertop|compact|product-2a.jpg|product-2b.jpg|0",
    "product-mini.html|Ounin Mini|399|||25L Capacity 5 Cooking Modes Portable|mini|product-3a.jpg|product-3b.jpg|0",
    "product-elite-bundle.html|Ounin Elite Bundle|1599|1999|-20|Pro Oven + Accessories Kit + Cookbook|elite-bundle|product-4a.jpg|product-4b.jpg|1",
    "product-accessory-kit.html|Premium Accessory Kit|149|||Steam Tray Wire Rack Cookbook Cleaning Kit|accessory-kit|product-5a.jpg|product-5b.jpg|0",
    "product-baking-stone.html|Premium Baking Stone|79||New|Cordierite Stone Perfect Pizza Bread|baking-stone|product-6a.jpg|product-6b.jpg|0"
)

$specs = @{
    "pro-embedded" = "Precise Steam Control|75L Large Capacity|12 Smart Cooking Modes|WiFi App Control|Touch Screen Display|2-Year Warranty"
    "compact" = "40L Compact Capacity|8 Smart Cooking Modes|Countertop Design|Touch Control Panel|1-Year Warranty"
    "mini" = "25L Portable Size|5 Essential Cooking Modes|Lightweight Portable|Simple Knob Controls"
    "baking-stone" = "Premium Cordierite Material|Food-Grade Safe|Natural Cordierite|Up to 500F Heat"
}

foreach ($page in $pages) {
    $p = $page.Split('|')
    $file = $p[0]; $name = $p[1]; $price = $p[2]; $priceOrig = $p[3]
    $badge = $p[4]; $desc = $p[5]; $productId = $p[6]
    $imgA = $p[7]; $imgB = $p[8]; $isBundle = $p[9] -eq "1"

    $badgeHtml = if ($badge) { "<div class=""product-badge"">$badge</div>`n          " } else { "" }
    $priceOrigHtml = if ($priceOrig) { "<span class=""price-original"">`$$priceOrig</span>" } else { "" }

    $specsHtml = ""
    if ($specs.ContainsKey($productId)) {
        $specItems = $specs[$productId].Split('|')
        $specsHtml = "`n        <div class=""product-specs"">"
        foreach ($sp in $specItems) {
            $specsHtml += @"

          <div class=""spec-item""><svg fill=""none"" stroke=""currentColor"" viewBox=""0 0 24 24"" width=""20"" height=""20""><path stroke-linecap=""round"" stroke-linejoin=""round"" stroke-width=""1.5"" d=""M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z""/></svg><span>$sp</span></div>
"@
        }
        $specsHtml += "`n        </div>"
    }

    $bundleHtml = ""
    if ($isBundle) {
        $bundleHtml = "`n        <div class=""bundle-includes"" style=""background: var(--color-bg-alt); border-radius: 12px; padding: 20px; margin-bottom: 24px;""><h4 style=""margin-bottom: 12px;"">What's Included:</h4><div style=""display: flex; flex-direction: column; gap: 8px;""><span>&#10003; Ounin Pro Embedded (75L)</span><span>&#10003; Premium Accessories Kit</span><span>&#10003; Official Ounin Cookbook</span><span style=""color: var(--color-accent); font-weight: 600;"">Save `$599 vs. buying separately!</span></div></div>"
    }

    $productSection = @"
  <section class=""recipe-detail-header"" style=""min-height: 70vh; background-color: var(--color-bg); padding: 80px 0;"">
    <div class=""container"">
      <div class=""product-hero-grid"">
        <div class=""product-hero-gallery"">
          <div class=""product-gallery-main"">
            <img src=""assets/images/$imgA"" alt=""$name"" class=""product-detail-img"" id=""main-img"">
          </div>
          <div class=""product-gallery-thumbs"">
            <img src=""assets/images/$imgA"" alt=""Main view"" class=""thumb active"" onclick=""switchImage(this, 'assets/images/$imgA')"">
            <img src=""assets/images/$imgB"" alt=""Detail view"" class=""thumb"" onclick=""switchImage(this, 'assets/images/$imgB')"">
          </div>
        </div>
        <div class=""product-hero-info"">
          $badgeHtml
          <h1 style=""font-family: var(--font-serif); font-size: 42px; color: var(--color-secondary); margin: 16px 0 20px; line-height: 1.2;"">$name</h1>
          <p style=""font-size: 18px; color: var(--color-text-light); margin-bottom: 24px;"">$desc</p>
          <div style=""margin: 24px 0; display: flex; align-items: baseline; gap: 12px;"">
            <span style=""font-size: 36px; font-weight: 700; color: var(--color-secondary);"">`$$price</span>
            $priceOrigHtml
          </div>
$specsHtml
$bundleHtml
          <div style=""margin-top: 32px;"">
            <button class=""btn btn-primary"" style=""width: 100%; margin-bottom: 12px; padding: 16px; font-size: 16px;"" onclick=""buyNow('$productId', '$name', $price)"">Buy Now — `$$price</button>
            <button class=""btn btn-outline"" style=""width: 100%; padding: 14px; font-size: 15px;"" onclick=""addToCart('$productId', '$name', $price)"">Add to Cart</button>
          </div>
          <div style=""margin-top: 24px; display: flex; gap: 20px; flex-wrap: wrap; align-items: center;"">
            <span style=""font-size: 13px; color: var(--color-text-light);"">Secure Checkout</span>
            <span style=""font-size: 13px; color: var(--color-text-light);"">Free Shipping</span>
            <span style=""font-size: 13px; color: var(--color-text-light);"">30-Day Returns</span>
          </div>
        </div>
      </div>
    </div>
  </section>
"@

    $body = $headerBlock + $productSection + "`n`n" + $footerBlock

    $cartScript = @"

  <script>
    function switchImage(thumb, src) {
      var m = document.getElementById('main-img');
      if (m) m.src = src;
      document.querySelectorAll('.thumb').forEach(function(t){ t.classList.remove('active'); });
      if (thumb) thumb.classList.add('active');
    }
    function addToCart(product, name, price) {
      var cart = JSON.parse(localStorage.getItem('ounin-cart') || '[]');
      var ex = cart.find(function(i){ return i.product === product; });
      if (ex) { ex.qty += 1; } else { cart.push({ product: product, name: name, price: price, qty: 1 }); }
      localStorage.setItem('ounin-cart', JSON.stringify(cart));
      updateCartCount();
      var t = document.createElement('div');
      t.className = 'toast toast-visible';
      t.textContent = name + ' added to cart!';
      document.body.appendChild(t);
      setTimeout(function(){ t.classList.remove('toast-visible'); }, 3000);
    }
    function buyNow(product, name, price) {
      localStorage.setItem('ounin-cart', JSON.stringify([{ product: product, name: name, price: price, qty: 1 }]));
      window.location.href = 'cart.html';
    }
    function updateCartCount() {
      var cart = JSON.parse(localStorage.getItem('ounin-cart') || '[]');
      var el = document.getElementById('cart-count');
      if (el) el.textContent = cart.reduce(function(s,i){ return s + i.qty; }, 0);
    }
    updateCartCount();
  </script>
"@

    $body = $body -replace '</body>', "$cartScript`n`n</body>"
    $body = $body -replace '<title>.*?</title>', "<title>$name | Ounin</title>"

    [System.IO.File]::WriteAllText("C:\Users\Mayn\.openclaw\workspace\ounin-clone\$file", $body, [System.Text.Encoding]::UTF8)
    Write-Host "Done: $file"
}
Write-Host "All 6 pages rebuilt!"