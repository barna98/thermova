# THERMOVA – Netlify élesítés

## GitHub feltöltés

1. A ZIP-et csomagold ki.
2. A `thermova-17` mappa **tartalmát** töltsd fel a GitHub repository gyökerébe.
3. A `netlify.toml` a repository gyökerében legyen, ne a `src` vagy a `src/pages` mappában.
4. A `dist` mappát nem kell feltölteni. A Netlify az `npm run build` paranccsal maga készíti el.
5. Ellenőrizd, hogy ezek biztosan felkerültek:
   - `src/site-data.js`
   - `src/pages/shop.js`
   - `src/pages/forms.js`
   - `src/app.js`
   - `src/brand.css`
   - `public/assets/brands/`
   - `public/netlify-form.html`
   - `netlify.toml`

## Netlify build

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js: 20

Ezeket a gyökérben lévő `netlify.toml` már beállítja.

## Ajánlatkérések és email értesítés

Az űrlap neve: `thermova-ajanlat`.

Az első sikeres deploy után a Netlify Forms felületén ennek az űrlapnak meg kell jelennie. Az email értesítést a Netlify felületén kell hozzáadni az `info@thermova.hu` címhez. Ez nem kerülhet biztonságosan frontend JavaScriptbe.

Az éles oldalon végzett tesztbeküldés után ellenőrizd:

- a beküldés megjelenik a Netlify Forms között;
- az email értesítés megérkezik;
- az email, telefonszám, település és érdeklődési típus szerepel a beküldésben;
- hőszivattyúnál, illetve két vagy több helyiségnél a műszaki ellenőrzés jelölése `true`.
