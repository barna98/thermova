# Ellenőrzési jegyzőkönyv

## Automatizált ellenőrzés

`npm test`: 20/20 sikeres teszt.

- Standard telepítés: 109 000 Ft.
- Összetett szűrés: méret, használat, ár, márka, zajszint és felszereltségi szint.
- Numerikus rendezés; nincs a megadott feltételeket megsértő ajánlás.
- Több klíma és minden hőszivattyú esetén emberi ellenőrzés.
- Minden magyar és angol nyilvános útvonal renderelhető, pontosan egy h1 címsorral.
- A korábbi termékútvonalak 404-et adnak, és a statikus build nem hozza létre őket.
- Felhasználói szöveg és fájlnév HTML-escape; fájlmező opcionális.
- A nyilvános klíma- és hőszivattyúoldal márkákat és induló árakat mutat, kosarat és termékrácsot nem.
- A klímaválasztó zajszint alapján is szűr, és legfeljebb három árazott modellt jelenít meg.

`npm run build`: 25 statikus oldal létrejön.

## Böngészős ellenőrzés

- A klímaoldalon felhasználási kategóriák, márkák és standard telepítéssel növelt induló árak jelennek meg; termékrács, kereső és kosár nem.
- A hőszivattyúoldal rendszerként kezeli a megoldást, márkánként tájékoztató induló árat mutat, és minden projektnél műszaki ellenőrzést jelez.
- A klímaválasztó kitöltés előtt nem mutat modellt. A hat szempont megadása után legfeljebb három találat jelenik meg készülékárral és alapszereléssel számolt árral.
- Túl szigorú, találat nélküli feltételeknél a felület személyes segítséget ajánl, és nem lazítja fel rejtetten a szűrést.
- Az egyoldalas visszahíváskérőn a klíma/hőszivattyú választás, az opcionális helyiségszám és terület, valamint a kötelező kapcsolati adatok működnek.
- A név, email, telefonszám, település és adatkezelési hozzájárulás kötelező; hibás email címmel az űrlap nem küldhető tovább.
- Bekötött fogadó végpont nélkül az összefoglaló egyértelműen jelzi, hogy nem történt adatküldés vagy visszahíváskérés.
- A lead-adatcsomag nem tartalmaz automatikus árat vagy nem választott alapértelmezett készüléket; két vagy több klímánál és minden hőszivattyúnál emberi ellenőrzést kér.
- A vizsgált asztali oldalaknál nincs vízszintes túlcsordulás.
- Eredeti logó, szolgáltatási hero, márkalista és választóeredmények képi ellenőrzése megtörtént.
- A landing hero teljes szélességű, a két fő szolgáltatáshoz közvetlen CTA-t ad, és nem használ dekoratív sorszámozást.
- A kapcsolat oldalon és a footerben kattintható email- és telefonszámhivatkozások jelennek meg.
- A választó billentyűzettel kezelhető rádiómezőket, natív márkaválasztót, jól látható fókuszállapotot és egyértelmű üres állapotot használ.
- A vizsgált folyamatokban nem keletkezett JavaScript konzolhiba.

A teszt nem minősül teljes WCAG-auditnak. Valós ajánlatküldés nincs bekötve, ezért annak sikerességét nem állítjuk.
