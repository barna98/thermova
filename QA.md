# Ellenőrzési jegyzőkönyv

## Automatizált ellenőrzés

`npm test`: 15/15 sikeres teszt.

- Standard telepítés 109 000 Ft; több készülék összegei helyesek.
- Összetett szűrés: méret, használat, ár, márka.
- Numerikus rendezés; nincs a megadott feltételeket megsértő ajánlás.
- Több klíma és minden hőszivattyú esetén emberi ellenőrzés.
- Hibás kosáradatok kizárása, régi kosáradatok biztonságos migrációja.
- Duplikált kosárváltozatok összevonása, legfeljebb 20 darabig.
- Egyetlen, szerelés nélküli készülékigény nem kap téves telepítési felülvizsgálatot.
- Minden magyar és angol útvonal renderelhető, pontosan egy h1 címsorral.
- Nem létező termék: 404. Üres kosárból nyitott készülékigény nem okoz renderelési hibát.
- Felhasználói szöveg és fájlnév HTML-escape; fájlmező opcionális.
- Vegyes kosár: csak a telepítést kérő változatokhoz számolunk szerelési díjat.
- Vegyes ajánlatban megmaradnak a szerelés nélküli készülékek; 2+ készüléknél emberi ellenőrzés szükséges.

`npm run build`: 79 statikus oldal létrejön.

## Böngészős ellenőrzés

Codex böngésző, külön localhost tesztpéldányon, kizárólag tesztadatokkal.

- Klímaszűrés: 25–35 m² és elsődleges fűtés → Nordic 35.
- Szerelés nélkül kiválasztott Comfort 35: 329 900 Ft; a kosárban 0 Ft szerelés.
- Ugyanaz a Comfort 35 szereléssel és anélkül: két külön kosársor, 659 800 Ft készülék + 109 000 Ft szerelés = 768 800 Ft.
- Vegyes kosár továbbadása: egy szerelendő helyiség, egy további szerelés nélküli készülék; az összeg változatlan.
- Az egyoldalas visszahíváskérőn a klíma/hőszivattyú választás, az opcionális helyiségszám és terület, valamint a kötelező kapcsolati adatok működnek.
- Bekötött fogadó végpont nélkül az összefoglaló egyértelműen jelzi, hogy nem történt adatküldés vagy visszahíváskérés.
- A lead-adatcsomag nem tartalmaz automatikus árat vagy nem választott alapértelmezett készüléket; két vagy több klímánál és minden hőszivattyúnál emberi ellenőrzést kér.
- Mobil termékoldal: a változatváltást követi a rögzített kosárgomb felirata és ára.
- Főoldal, angol klímakategória, klímatermékoldal és hőszivattyús ajánlatkérés: 320, 768 és 1440 px szélességen nincs vízszintes túlcsordulás.
- Asztali és 390 px mobil képi ellenőrzés: eredeti logó, hero, termék- és vásárlási felület; eredeti termékfotók egységes világos felületen, narancssárga ajánlási címkékkel és felirat nélkül.
- 390 px mobilmenü: panelanimáció, sorszámozott navigáció, stabil kör alakú bezárógomb és fókusz-visszaadás.
- A karakteres CTA-nyilak és pipák helyett egységes SVG/CSS jelek jelennek meg.
- A produkciós képernyőképek alapján javítva: megszűnt a fő tartalom kék fókuszkerete, a logó tiszta arculati-board kivágást használ, a klímakategória nyitóblokkja képes szerkesztői elrendezést kapott.
- A fő és kategória hero-képek aszimmetrikus építészeti vágást, látható narancs sarokrészletet és visszafogott képátmenetet használnak.
- Mobilon a katalógusszűrő alaphelyzetben összecsukott, az aktív szűrők száma és külön törölhető címkéi látszanak; a terméklista azonnal elérhető.
- A kosárgomb felolvasott neve tartalmazza a darabszámot, a párbeszédablak nyitáskor fókuszt kap, bezáráskor pedig visszaadja azt a kiinduló vezérlőnek.
- A teljes statikus kimeneten nincs hiányzó belső hivatkozás, duplikált HTML-azonosító vagy hibás lokális horgony; a 404 oldal nem hivatkozik nem létező nyelvi változatokra.
- A vizsgált folyamatokban nem keletkezett JavaScript konzolhiba.

A teszt nem minősül teljes WCAG-auditnak. Fizetés, szerveroldali fájlfeltöltés és valós ajánlatküldés nincs bekötve, ezért ilyen folyamat sikerességét nem állítjuk.
