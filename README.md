# THERMOVA — frontend

Kétnyelvű, szolgáltatás- és ajánlatkérés-központú frontend a THERMOVA brand board alapján. A nyilvános oldalon nincs webshop, kosár vagy böngészhető termékkatalógus. A látogató először felhasználási cél, márka és szereléssel számolt induló ár alapján tájékozódik; konkrét készülékeket és tájékoztató árakat csak a személyre szabott klímaválasztó mutat.

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
- Márkalista minden márkánál a jelenlegi katalógusból számolt legalacsonyabb, standard telepítéssel növelt induló árral.
- Hőszivattyúoldal rendszer- és tervezési szemlélettel, márkánkénti tájékoztató induló rendszerárral. Minden hőszivattyús projekt szakemberi validációhoz kötött.
- Hat szempontos klímaválasztó: helyiségméret, használat, beltéri zajszint, készülékkeret, felszereltségi szint és opcionális márka.
- A választó kitöltése után legfeljebb három konkrét készülék jelenik meg készülékárral és standard telepítéssel számolt árral. A termékfotók forrásjegyzéke a `product-image-sources.json` fájlban található.
- Ha nincs minden feltételnek megfelelő készülék, a rendszer nem lazítja fel észrevétlenül a megadott szempontokat, hanem személyes segítséget ajánl.
- Rövid, egyoldalas visszahíváskérő klímához és hőszivattyúhoz. A név, telefon, email, település és adatkezelési hozzájárulás kötelező.
- Több klímánál, illetve minden hőszivattyús projektnél emberi műszaki ellenőrzés jelzése.
- Billentyűzettel kezelhető vezérlők, szemantikus címsorok, címkézett mezők, fókuszállapotok és csökkentett animációs beállítás támogatása.

A standard klímatelepítés mindenhol **109 000 Ft bruttó**.

## Szerkezet

- `src/catalogue.js` és `src/catalogue-products.js` — a klímaválasztó modelljei és a hőszivattyúrendszerek.
- `src/domain.js` — üzleti paraméterek, szűrés, ajánlás, induló árak és ellenőrzési feltételek.
- `src/i18n.js` — nyelvi kontextus, URL-képzés, pénznemformázás és biztonságos szövegkiírás.
- `src/components.js` — közös fejléc, logó, lábléc, választóeredmények, képek és űrlapmezők.
- `src/pages/` — főoldal, klíma- és hőszivattyú-szolgáltatási oldalak, ajánlatkérés, választó és tartalmi oldalak.
- `src/render.js` — közös kliens- és buildoldali HTML-renderelés és oldalmetaadatok.
- `src/app.js` — navigáció, űrlapállapot, választó, validálás és összefoglaló-letöltés.
- `src/styles.css` és `src/brand.css` — komponensalapok, THERMOVA-megjelenés és reszponzív állapotok.
- `public/assets/` — helyi képek, logó, betűk és licenc.
- `scripts/` — függőségmentes statikus build és helyi előnézeti kiszolgáló.
- `tests/` — üzleti és renderelési regressziós tesztek.

## Élesítés előtt

A frontend alapbeállításban nem küld adatot: ellenőrizhető és letölthető JSON-összefoglalót készít. A `config.quoteEndpoint` megadásával JSON-alapú fogadó végponthoz köthető. Nincs webshop, fizetés, rendeléskezelő backend vagy készletkapcsolat.

Az induló és ajánlott árak tájékoztató jellegűek. Élesítés előtt ellenőrizni kell a Thermova aktuális kínálatát és árait, különösen a hőszivattyús márkákat és rendszerárakat, továbbá véglegesíteni kell a cégadatokat, az adatkezelési tájékoztatót és a fogadó integrációt.

Az oldalak statikusan olvashatók, saját címmel, meta leírással, canonical címmel és HU/EN alternatív hivatkozásokkal. A céges és szolgáltatási oldalak indexelhetők, az űrlapok `noindex,follow` jelölést kapnak. A build sitemapet is készít.

Kapcsolati adat nem kerül tartós tárolásba; újratöltéskor az ajánlatkérési vázlat törlődik. Nincs analitika vagy külső betűszolgáltatás.

Az ellenőrzési eredményeket a `QA.md`, a képek eredetét és generálási utasításait az `ASSETS.md` tartalmazza.
