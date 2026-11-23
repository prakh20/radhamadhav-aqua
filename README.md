# Radha Madhav Aqua – Website

Static site (HTML + CSS + vanilla JS). No build step, no backend, no database, nothing to maintain.

```
index.html      – all page content (edit text, products here)
css/style.css   – styles (brand colours at the top in :root)
js/main.js      – mobile menu, scroll effects, enquiry form → WhatsApp
assets/logo.jpg – logo (also used as favicon)
```

## Run locally
Open `index.html` directly, or:
```
python -m http.server 5500
```

## How the enquiry form works
It has no server. The form builds a WhatsApp message and opens `wa.me/917853034678`, and the customer taps **Send**.
To change the number, edit `WHATSAPP_NUMBER` in `js/main.js` and the `wa.me` / `tel:` links in `index.html`.

## Recommended hosting: Cloudflare Pages (free)
1. Push this folder to a GitHub repo.
2. In Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → choose the repo.
3. Framework preset **None**, build command empty, output directory `/`.
4. Every `git push` redeploys automatically. You get free HTTPS, a global CDN, and unlimited bandwidth.

Alternatives that work just as well: Netlify (drag-and-drop the folder) or GitHub Pages.

## Domain
- Buy something like `radhamadhavaqua.in` or `.com`. Cloudflare Registrar sells at cost; GoDaddy, Hostinger and BigRock are also fine for `.in`.
- In Cloudflare Pages → Custom domains → add the domain. DNS and SSL are configured automatically.

## Before going live – checklist
- [ ] Add FSSAI / BIS licence numbers in the footer (there's a commented placeholder) – customers look for these.
- [ ] Confirm the product sizes and descriptions in the Products section.
- [ ] Replace the CSS-drawn bottles with real product photos when available (`.product__img`).
- [ ] Ideally get a transparent PNG/SVG version of the logo.
- [ ] Update `og:image` in `index.html` to the full URL (`https://yourdomain/assets/logo.jpg`) once the domain is live.
- [ ] Create a free **Google Business Profile** for the plant, which matters most for local search and Maps.
- [ ] Set the map pin: replace the iframe `src` with the exact embed link from Google Maps → Share → Embed.

## Security & production notes
- **No backend, no database, no cookies, no stored user data.** The enquiry form never submits anywhere; it only opens WhatsApp with a pre-filled message (`form-action 'none'` blocks native submission).
- **Content-Security-Policy** (meta tag in `index.html` / `404.html`): only this site, Google Fonts and the Google Maps iframe may load. No inline scripts or inline styles are allowed, and Trusted Types are required.
  If you add a new external service (analytics, chat widget, etc.) you must add its origin to the CSP or it will be blocked.
- **Never add `style="..."` attributes or inline `<script>`**; put styles in `css/` and code in `js/`.
- External links use `rel="noopener noreferrer"`; the map iframe is sandboxed; referrer policy is `strict-origin-when-cross-origin`.
- Form input is length-limited in HTML and cleaned in JS (control characters removed, trimmed, capped).
- Without JavaScript the page still shows all content (`css/noscript.css`).
- `404.html` uses `<base href="/radhamadhav-aqua/">` — change it to `/` when a custom domain is added.

### Limits of GitHub Pages
GitHub Pages can't send custom HTTP headers, so these can't be set yet: `Strict-Transport-Security` (github.io is already HSTS-preloaded), `X-Frame-Options` / CSP `frame-ancestors` (clickjacking), `Permissions-Policy`, `X-Content-Type-Options` (GitHub already sends `nosniff`).
When a custom domain is bought, put **Cloudflare** (free) in front and add these headers with a Transform Rule:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```
`robots.txt` and `.well-known/security.txt` only take effect at a domain root, i.e. after moving to a custom domain.
