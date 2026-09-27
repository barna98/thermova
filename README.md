# THERMOVA — frontend

Átdolgozott, kétnyelvű frontend a feltöltött prototípus és a THERMOVA brand board alapján. A legújabb változat eredeti logóképet, egységesen megjelenített valódi termékfotókat és **alapszereléssel / szerelés nélkül** kosárba tehető klímákat tartalmaz.

## Indítás

Node.js 20 vagy újabb szükséges. Nincs telepítendő alkalmazásfüggőség.

```sh
npm run dev
```

Előnézet: http://localhost:4173/hu/

```sh
npm test
npm run build
```

A `dist/` a statikus tárhelyre feltölthető kimenet. A mappát HTTP-kiszolgálón kell megnyitni, nem `file://` hivatkozásként. A kiszolgálás gyökere a `dist/` legyen; az alkönyvtárak `index.html` fájljait szolgálja ki, ismeretlen útvonalon pedig valódi 404-et adjon. Nem szükséges általános SPA fallback.

## Mi készült el?

- Világos, Manrope-alapú arculat, az eredeti THERMOVA-logóval. A feltöltött logófájlt használjuk, nem újragépelt betűket. A logó körüli üres margót CSS maszkolja, a fájl változatlan.
- Helyben kiszolgált latin és latin-ext Manrope WOFF2; a magyar ékezetek is támogatottak.
- Optimalizált arculati WebP-képek, valamint modellenként ellenőrizhető forrásból származó, eredeti termékfotók. A termékfotók egységes, világos képfelületen jelennek meg, a forrásjegyzék a `product-image-sources.json` fájlban található.
- Magyar és angol tartalom külön URL-eken. A nyelvváltás megtartja az adott oldalt, a szűrőket és a memóriában lévő ajánlatkérési adatokat.
- Előre renderelt termék- és tartalmi oldalak: 62 lokalizált oldal és magyar gyökéroldal, külön 404 oldallal.
- Klímakategória méret-, használat-, ár- és márkaszűrőkkel; rendezés és keresés.
- Háromkérdéses választó, legfeljebb három, a feltételeknek megfelelő ajánlással.
- Klímatermékoldal, árak, választási szempontok, standard telepítés teljes tartalma, lenyitható specifikáció és legfeljebb három alternatíva.
- Valódi kosárállapot mennyiségekkel és törléssel. Ugyanaz a modell két külön változatként szerepelhet: **csak készülék** vagy **alapszereléssel**. Telepítési díj kizárólag a kért darabokra kerül rá. Mobilon a rögzített kosárgomb is a kiválasztott változatot követi.
- A csak készülékből álló kosár kapcsolati adatokhoz vezet; a telepítést is tartalmazó kosár helyszíni kérdéseket kér. Vegyes kosárban a szerelés nélküli készülékek megmaradnak az összegzésben.
- Rövid, egyoldalas visszahíváskérő klímához és hőszivattyúhoz. A helyiségek száma és területe opcionális; a részletes műszaki felmérés telefonos egyeztetéskor történik.
- Két vagy több klímánál, illetve minden hőszivattyús projektnél emberi műszaki ellenőrzés jelzése.
- Billentyűzettel kezelhető vezérlők, szemantikus címsorok, címkézett mezők, natív dialógus, fókuszvisszaadás, csökkentett animációs beállítás támogatása.

## Rövid audit: mi maradt, mi változott?

A kiindulási ZIP egy 199 111 bájtos HTML-fájlt és egy leírást tartalmazott. A megjelenítés, az adatbázis és az eseménykezelés egyetlen állományban élt. A kosárgomb csak visszajelzést írt ki, a fotófeltöltés csak számlálót növelt. A telepítési díj 149 900 Ft volt. Az angol változat és valódi fotóanyag hiányzott.

Megtartottuk a termékadatok kiinduló szerkezetét, a klíma/rendszer különválasztását, a rövid döntéstámogatást, a helyszíni kérdések logikáját és az emberi ellenőrzés elvét. Az adatokat külön modulba költöztettük. A teljes vizuális réteget, a navigációt, a kosarat, a fájlkiválasztást, az űrlapokat és a nyelvi működést újraírtuk. A standard telepítés mindenhol **109 000 Ft bruttó**.

## Szerkezet

- `src/catalogue.js` — a megadott, 20 klímából álló katalógus és a hőszivattyúrendszerek.
- `src/domain.js` — üzleti paraméterek, szűrés, ajánlás, kosár- és ajánlatösszegek, ellenőrzési feltételek.
- `src/i18n.js` — nyelvi kontextus, URL-képzés, pénznemformázás, biztonságos szövegkiírás.
- `src/components.js` — közös fejléc, logó, lábléc, termékkártyák, képek, űrlapmezők és arculati szekciók.
- `src/pages/` — főoldal, webshop, ajánlatkérés/választó, tartalmi oldalak.
- `src/render.js` — közös kliens- és buildoldali HTML-renderelés, oldalmetaadatok.
- `src/app.js` — navigáció, kosár, keresés, űrlapállapot, validálás és letöltés.
- `src/styles.css` — komponensalapok és reszponzív állapotok.
- `src/brand.css` — THERMOVA megjelenés, eredeti logókezelés, fotós elrendezések és vásárlási változatok.
- `public/assets/` — helyi képek, logó, betűk és licenc.
- `scripts/` — függőségmentes statikus build és helyi előnézeti kiszolgáló.
- `tests/` — üzleti és renderelési regressziós tesztek.

## Mi szükséges az éles működéshez?

A frontend nem állítja, hogy sikeres rendelés vagy üzenetküldés történt: alapbeállításban ellenőrizhető, letölthető JSON-összefoglalót készít. A `config.quoteEndpoint` megadásával JSON-alapú fogadó végponthoz köthető. Nincs fizetés, rendeléskezelő backend vagy készletkapcsolat.

A klímakatalógus a megadott valós modelleket és külön dokumentált termékfotó-forrásokat használja. Az online árak tájékoztató jellegűek; élesítés előtt a készletet, a Thermova tényleges eladási árait, a cégadatokat, az adatkezelési tájékoztatót, a kereskedelmi feltételeket és a fogadó integrációt szükséges véglegesíteni.

Az oldalak statikusan olvashatók, saját címmel, meta leírással, canonical címmel és HU/EN alternatív hivatkozásokkal. A céges és szolgáltatási oldalak indexelhetők, a minta termékoldalak és űrlapok `noindex,follow` jelölést kapnak. A build sitemapet is készít. A termékkatalógus csak hiteles termékadatok beállítása után tehető indexelhetővé és egészíthető ki valós Product/Offer strukturált adatokkal.

A kosár helyi tárolóban marad. Kapcsolati adat és feltöltött fájl nem kerül tartós tárolásba; újratöltéskor az ajánlatkérési vázlat törlődik. Nincs analitika vagy külső betűszolgáltatás.

## Ellenőrzés

Az eredményeket a `QA.md`, a képek eredetét és generálási utasításait az `ASSETS.md` tartalmazza.
