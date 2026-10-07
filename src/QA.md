# Ellenőrzési jegyzőkönyv

## Automatizált ellenőrzés

`npm test`: 22/22 sikeres teszt.

- Standard telepítés: 109 000 Ft.
- Összetett szűrés: méret, használat, ár, márka, zajszint és felszereltségi szint.
- Numerikus rendezés; nincs a megadott feltételeket megsértő ajánlás.
- Több klíma és minden hőszivattyú esetén emberi ellenőrzés.
- Minden magyar és angol nyilvános útvonal renderelhető, pontosan egy h1 címsorral.
- A korábbi termékútvonalak 404-et adnak, és a statikus build nem hozza létre őket.
- A production build nem tartalmaz belső katalógusfájlt vagy termékfotó-könyvtárat.
- Felhasználói szöveg és fájlnév HTML-escape; fájlmező opcionális.
- A nyilvános klíma- és hőszivattyúoldal nem mutat konkrét modellt, készülékárat, kosarat vagy termékrácsot.
- A klímaigény-felmérés helyiségtípust, méretet, használatot, zajigényt, komfortszintet és opcionális márkapreferenciát kér.
- A kérdéssor végén az ajánlatkérés nyílik meg, a válaszok pedig bekerülnek a megjegyzésbe.
- A klímaoldali igénykártyák és márkajelek közvetlenül, megfelelő kontextussal vezetnek az ajánlatkéréshez.
- A tartalmi kártyákon, kérdéscímeken és ajánlatkérési folyamatban nincs dekoratív sorszámozás.
- A hőszivattyúoldal öt ellenőrzött márkája helyi, grafit logóval és márkapreferenciát átadó ajánlatkérő hivatkozással jelenik meg.
- Az ajánlatkérő a production HTML-ben Netlify Forms által felismerhető, névvel ellátott POST űrlapként, honeypot mezővel épül ki.

`npm run build`: 25 statikus oldal létrejön.

## Böngészős ellenőrzés

- A klímaoldalon felhasználási kategóriák és márkák jelennek meg; konkrét modell, készülékár, termékrács, kereső és kosár nincs.
- A hőszivattyúoldal rendszerként kezeli a megoldást, és minden projektnél műszaki ellenőrzést jelez.
- A klímaigény-felmérés nem állít elő automatikus terméklistát vagy árat; az ajánlatkéréshez vezet, ahol személyes egyeztetés indul.
- Az egyoldalas visszahíváskérőn a klíma/hőszivattyú választás, az opcionális helyiségszám és terület, valamint a kötelező kapcsolati adatok működnek.
- A név, email, telefonszám, település és adatkezelési hozzájárulás kötelező; hibás email címmel az űrlap nem küldhető tovább.
- Helyi előnézetben valódi adat nem küldhető el; a felület ezt egyértelmű hibajelzésben közli.
- A lead-adatcsomag nem tartalmaz automatikus árat vagy nem választott alapértelmezett készüléket; két vagy több klímánál és minden hőszivattyúnál emberi ellenőrzést kér.
- A vizsgált asztali oldalaknál nincs vízszintes túlcsordulás.
- A mobil igényfelmérés és ajánlatkérés 390 px szélességen sem okoz vízszintes túlcsordulást.
- Az igényfelmérés válaszai olvasható összefoglalóként átkerülnek az ajánlatkérés megjegyzésébe.
- A klímamárka kattintása közvetlenül az ajánlatkéréshez vezet, és átadja a márkapreferenciát.
- A hőszivattyúmárkák egyetlen, azonos magasságú asztali logósorban jelennek meg; kattintásuk hőszivattyúra állított, márkapreferenciával előtöltött ajánlatkérést nyit.
- A build 26 HTML-fájljának belső hivatkozásai érvényesek; publikus modellnév vagy készülékár nem maradt bennük.
- Eredeti logó, szolgáltatási hero, márkalista és igényfelmérés képi ellenőrzése megtörtént.
- A landing hero teljes szélességű, a két fő szolgáltatáshoz közvetlen CTA-t ad, és nem használ dekoratív sorszámozást.
- A kapcsolat oldalon és a footerben kattintható email- és telefonszámhivatkozások jelennek meg.
- A választó billentyűzettel kezelhető rádiómezőket, natív márkaválasztót és jól látható fókuszállapotot használ.
- A vizsgált folyamatokban nem keletkezett JavaScript konzolhiba.

A teszt nem minősül teljes WCAG-auditnak. A Netlify-beküldés kliens- és buildoldali integrációja elkészült; a tényleges kézbesítés csak a projekt Forms-felismerésének és email-értesítésének Netlify-fiókbeli bekapcsolása, majd az új verzió deploya után ellenőrizhető.
