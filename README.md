# THERMOVA — frontend

Kétnyelvű, szolgáltatás- és ajánlatkérés-központú frontend a THERMOVA brand board alapján. A nyilvános oldalon nincs webshop, kosár, böngészhető termékkatalógus, konkrét modell vagy készülékár. A látogató igény és márka alapján tájékozódik, majd rövid igényfelmérésen vagy közvetlen ajánlatkérésen keresztül kér személyes segítséget.

## Indítás

Node.js 20 vagy újabb szükséges. Nincs telepítendő alkalmazásfüggőség.

```sh
npm run dev
```

Előnézet: `http://localhost:4173/hu/`

```sh
npm test
npm run build
```

A `dist/` a statikus tárhelyre feltölthető kimenet. A kiszolgálás gyökere a `dist/` legyen; az alkönyvtárak `index.html` fájljait szolgálja ki, ismeretlen útvonalon pedig valódi 404-et adjon. Nem szükséges általános SPA fallback.

## Mi készült el?

- Világos, Manrope-alapú arculat az eredeti THERMOVA-logóval és helyben kiszolgált betűkészlettel.
- Magyar és angol tartalom külön URL-eken. A nyelvváltás megtartja az adott oldalt.
- Előre renderelt szolgáltatási és tartalmi oldalak, külön 404 oldallal. A korábbi termék-URL-ek már nem épülnek ki.
- Klímaoldal négy könnyen érthető felhasználási kategóriával: mindennapi hűtés, csendes hálószobai használat, fűtésre is alkalmas megoldás és prémium komfort.
- Kattintható, nagy antracit márkajelrács: a márkák közvetlenül az adott preferenciával előkészített ajánlatkéréshez vezetnek.
- A klímaoldal felhasználási kártyái közvetlenül az ajánlatkéréshez vezetnek, és a választott igényt előre kitöltik a megjegyzésben.
- Hőszivattyúoldal rendszer- és tervezési szemlélettel. Minden hőszivattyús projekt szakemberi validációhoz kötött.
- Öt szempontos klímaigény-felmérés: helyiségméret, helyiségtípus, használat, zajigény és komfortszint, opcionális márkával.
- A kérdéssor végén a felhasználó közvetlenül az ajánlatkéréshez jut. A válaszok automatikusan bekerülnek a megjegyzésbe; a Thermova egyeztetés után 2–3 megfelelő lehetőséget küld.
- Rövid, egyoldalas visszahíváskérő klímához és hőszivattyúhoz. A név, telefon, email, település és adatkezelési hozzájárulás kötelező.
- Több klímánál, illetve minden hőszivattyús projektnél emberi műszaki ellenőrzés jelzése.
- Billentyűzettel kezelhető vezérlők, szemantikus címsorok, címkézett mezők, fókuszállapotok és csökkentett animációs beállítás támogatása.
- A navigációban, kártyákon, kérdéscímeken és folyamatleírásokban nincs dekoratív sorszámozás.

A standard klímatelepítés mindenhol **109 000 Ft bruttó**.

## Szerkezet

- `src/site-data.js` — publikus márkák, kapcsolati adatok, telepítési tartalom és lead-adatmodell.
- `src/catalogue.js`, `src/catalogue-products.js` és `src/domain.js` — belső munkafájlok; a production build nem publikálja őket.
- `src/i18n.js` — nyelvi kontextus, URL-képzés, pénznemformázás és biztonságos szövegkiírás.
- `src/components.js` — közös fejléc, logó, lábléc, képek és űrlapmezők.
- `src/pages/` — főoldal, klíma- és hőszivattyú-szolgáltatási oldalak, ajánlatkérés, választó és tartalmi oldalak.
- `src/render.js` — közös kliens- és buildoldali HTML-renderelés és oldalmetaadatok.
- `src/app.js` — navigáció, űrlapállapot, választó, validálás és összefoglaló-letöltés.
- `src/styles.css` és `src/brand.css` — komponensalapok, THERMOVA-megjelenés és reszponzív állapotok.
- `public/assets/` — helyi képek, logó, betűk és licenc.
- `scripts/` — függőségmentes statikus build és helyi előnézeti kiszolgáló.
- `tests/` — üzleti és renderelési regressziós tesztek.

## Élesítés előtt

A frontend alapbeállításban nem küld adatot: ellenőrizhető és letölthető JSON-összefoglalót készít. A `config.quoteEndpoint` megadásával JSON-alapú fogadó végponthoz köthető. Nincs webshop, fizetés, rendeléskezelő backend vagy készletkapcsolat.

Élesítés előtt véglegesíteni kell a hőszivattyús márkalistát, a cégadatokat, az adatkezelési tájékoztatót és a fogadó integrációt. A standard telepítés publikus díja 109 000 Ft; készülék- és rendszerárat a weboldal nem közöl.

Az oldalak statikusan olvashatók, saját címmel, meta leírással, canonical címmel és HU/EN alternatív hivatkozásokkal. A céges és szolgáltatási oldalak indexelhetők, az űrlapok `noindex,follow` jelölést kapnak. A build sitemapet is készít.

Kapcsolati adat nem kerül tartós tárolásba; újratöltéskor az ajánlatkérési vázlat törlődik. Nincs analitika vagy külső betűszolgáltatás.

Az ellenőrzési eredményeket a `QA.md`, a képek eredetét és generálási utasításait az `ASSETS.md` tartalmazza.
