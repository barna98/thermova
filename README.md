# THERMOVA — frontend

Átdolgozott, kétnyelvű frontend a feltöltött prototípus és a THERMOVA brand board alapján. A legújabb változat eredeti logóképet, bővített arculati fotóanyagot és **alapszereléssel / szerelés nélkül** kosárba tehető klímákat tartalmaz.

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
- Optimalizált WebP-képek két felbontásban: épület, enteriőr, szervizautó, munkaruházat, két klímaváltozat, hőszivattyúrendszer.
- Magyar és angol tartalom külön URL-eken. A nyelvváltás megtartja az adott oldalt, a szűrőket és a memóriában lévő ajánlatkérési adatokat.
- Előre renderelt termék- és tartalmi oldalak: 62 lokalizált oldal és magyar gyökéroldal, külön 404 oldallal.
- Klímakategória méret-, használat-, ár- és márkaszűrőkkel; rendezés és keresés.
- Háromkérdéses választó, legfeljebb három, a feltételeknek megfelelő ajánlással.
- Klímatermékoldal, árak, választási szempontok, standard telepítés teljes tartalma, lenyitható specifikáció és legfeljebb három alternatíva.
- Valódi kosárállapot mennyiségekkel és törléssel. Ugyanaz a modell két külön változatként szerepelhet: **csak készülék** vagy **alapszereléssel**. Telepítési díj kizárólag a kért darabokra kerül rá. Mobilon a rögzített kosárgomb is a kiválasztott változatot követi.
- A csak készülékből álló kosár kapcsolati adatokhoz vezet; a telepítést is tartalmazó kosár helyszíni kérdéseket kér. Vegyes kosárban a szerelés nélküli készülékek megmaradnak az összegzésben.
- Négylépéses klímás és hőszivattyús ajánlatkérés. Fotó/dokumentum opcionális, fájltípus-, méret- és darabszám-ellenőrzéssel. Visszalépéskor a kitöltött adatok megmaradnak.
- Két vagy több klímánál, illetve minden hőszivattyús projektnél emberi műszaki ellenőrzés jelzése.
- Billentyűzettel kezelhető vezérlők, szemantikus címsorok, címkézett mezők, natív dialógus, fókuszvisszaadás, csökkentett animációs beállítás támogatása.

## Rövid audit: mi maradt, mi változott?

A kiindulási ZIP egy 199 111 bájtos HTML-fájlt és egy leírást tartalmazott. A megjelenítés, az adatbázis és az eseménykezelés egyetlen állományban élt. A kosárgomb csak visszajelzést írt ki, a fotófeltöltés csak számlálót növelt. A telepítési díj 149 900 Ft volt. Az angol változat és valódi fotóanyag hiányzott.

Megtartottuk a termékadatok kiinduló szerkezetét, a klíma/rendszer különválasztását, a rövid döntéstámogatást, a helyszíni kérdések logikáját és az emberi ellenőrzés elvét. Az adatokat külön modulba költöztettük. A teljes vizuális réteget, a navigációt, a kosarat, a fájlkiválasztást, az űrlapokat és a nyelvi működést újraírtuk. A standard telepítés mindenhol **109 000 Ft bruttó**.

## Szerkezet

- `src/catalogue.js` — a kapott mintakatalógus, 12 klíma és 6 rendszer.
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

A frontend nem állítja, hogy sikeres rendelés vagy üzenetküldés történt: jelenleg letölthető JSON-összefoglalót készít. Nincs fizetés, rendeléskezelő backend, készletkapcsolat vagy levélküldés. A fájlokat csak a böngésző memóriájában tartja; a JSON a fájlneveket és metaadatokat tartalmazza, a fájlokat nem.

A kapott Aeris, Nordiq, Valtek és Sensa modellek, specifikációk és készülékárak mintaadatok. A képek arculati látványtervek. Élesítés előtt a valódi katalógust, gyártói képeket, cégadatokat, adatkezelési tájékoztatót, kereskedelmi feltételeket és a tényleges integrációt szükséges megadni. Ezeket nem találtuk ki.

Az oldalak statikusan olvashatók, saját címmel, meta leírással és HU/EN alternatív hivatkozásokkal. A mintakatalógus miatt a bemutató tudatosan `noindex` és robots-tiltást használ. Élesítéskor ezt a hiteles katalógussal és végleges domainnel együtt kell átállítani; ekkor készíthető végleges canonical, sitemap és valós Product/Offer strukturált adat.

A kosár helyi tárolóban marad. Kapcsolati adat és feltöltött fájl nem kerül tartós tárolásba; újratöltéskor az ajánlatkérési vázlat törlődik. Nincs analitika vagy külső betűszolgáltatás.

## Ellenőrzés

Az eredményeket a `QA.md`, a képek eredetét és generálási utasításait az `ASSETS.md` tartalmazza.
