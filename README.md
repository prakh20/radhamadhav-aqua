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
