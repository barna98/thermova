import {
  breadcrumb,
  image,
  arrow,
  installBlock,
  helpBanner,
  brandGallery,
} from "../components.js";
import { contactDetails } from "../site-data.js";
export function information(c, path) {
  const titles = {
    telepites: c.t("Standard telepítés", "Standard installation"),
    rolunk: c.t("A Thermováról", "About Thermova"),
    szolgaltatasok: c.t("Szolgáltatásaink", "Our services"),
    tudastar: c.t("Útmutató a választáshoz", "Buying guide"),
    kapcsolat: c.t("Kapcsolat és ajánlatkérés", "Contact and quote requests"),
    adatkezeles: c.t("Adatkezelési információk", "Privacy information"),
  };
  if (!titles[path]) return null;
  let body = "";
  if (path === "telepites")
    body = `${installBlock(c, true)}${brandGallery(c)}<section class="section narrow"><h2>${c.t("Mikor szükséges egyedi ajánlat?", "When do you need an individual quote?")}</h2><p>${c.t("Három méternél hosszabb csövezés, nehéz megközelítés, nagy munkamagasság, speciális falazat vagy villamoshálózat-átalakítás esetén a helyszíni feltételek alapján egyeztetünk. A kábelcsatornázás minden esetben külön tétel.", "Pipework over three metres, difficult access, work at height, special wall materials or electrical alterations are assessed for your site. Cable trunking is always a separate item.")}</p><a class="button" href="${c.url("ajanlat")}">${c.t("Ajánlatot kérek telepítéssel", "Get an installation quote")} ${arrow}</a></section>`;
  if (path === "rolunk")
    body = `<section class="split-editorial section"><div><p class="eyebrow">${c.t("NEM GÉPET ADUNK. MEGOLDÁST ÉPÍTÜNK.", "WE DON’T JUST SUPPLY EQUIPMENT. WE BUILD SOLUTIONS.")}</p><h2>${c.t("Készülékválasztás<br>és telepítés egy helyen.", "Equipment and installation<br>in one place.")}</h2><p>${c.t("Klímák és hőszivattyús rendszerek kiválasztásában és telepítésében segítünk lakossági és céges ügyfeleknek. A helyiség, az épület és a tervezett használat alapján ajánlunk megoldást.", "We help households and businesses choose and install air conditioning and heat pump systems. Recommendations take the space, building and intended use into account.")}</p><p>${c.t("Megmutatjuk, mire elég egy modell, mikor érdemes többet választani, és mikor kérünk műszaki ellenőrzést.", "We explain what a model can do, when to consider another option and when technical review is needed.")}</p></div>${image("architecture", c.t("Modern otthon – építészeti látványkép", "Modern home — architectural concept"))}</section><section class="principles">${[
      [
        c.t("Érthető választás", "A clear choice"),
        c.t(
          "Műszaki adat helyett először az igényedből indulunk ki.",
          "We start with your needs, before the specification sheet.",
        ),
      ],
      [
        c.t("Átlátható árak", "Transparent pricing"),
        c.t(
          "Külön látod a készülék és a standard telepítés árát.",
          "See the unit and standard installation price separately.",
        ),
      ],
      [
        c.t("Gondos megvalósítás", "Careful delivery"),
        c.t(
          "Egyeztetett műszaki tartalom és dokumentált beüzemelés.",
          "Agreed technical scope and documented commissioning.",
        ),
      ],
    ]
      .map(
        ([t, p]) => `<div><h3>${t}</h3><p>${p}</p></div>`,
      )
      .join("")}</section>${brandGallery(c)}${helpBanner(c)}`;
  if (path === "szolgaltatasok")
    body = `<div class="service-list">${[
      [
        c.t("Klímatelepítés", "AC installation"),
        c.t(
          "Készülékválasztás, helyszíni feltételek egyeztetése és standard telepítés, tételes tartalommal.",
          "Unit selection, site assessment and installation with an itemised scope.",
        ),
        "telepites",
      ],
      [
        c.t("Hőszivattyúrendszerek", "Heat pump systems"),
        c.t(
          "Épülethez méretezett megoldások, minden esetben emberi műszaki validációval.",
          "Building-specific solutions, with human technical validation on every project.",
        ),
        "hoszivattyuk",
      ],
      [
        c.t("Karbantartás", "Maintenance"),
        c.t(
          "Tisztítás, állapotellenőrzés és a karbantartási igény egyeztetése a készülék és használat alapján.",
          "Cleaning, condition checks and a maintenance scope based on the equipment and its use.",
        ),
        "kapcsolat",
      ],
      [
        c.t("Energetikai egyeztetés", "Energy consultation"),
        c.t(
          "Új építés és korszerűsítés: az épület és a gépészet közös átgondolása.",
          "New builds and renovations: considering the building and its systems together.",
        ),
        "kapcsolat",
      ],
      [
        c.t("Vállalkozásoknak", "For businesses"),
        c.t(
          "Több helyiség és összetettebb igények esetén egyedi egyeztetéssel indulunk.",
          "Individual consultation for multiple rooms and more complex requirements.",
        ),
        "kapcsolat",
      ],
    ]
      .map(
        ([t, p, u]) =>
          `<a href="${c.url(u)}"><div><h2>${t}</h2><p>${p}</p></div>${arrow}</a>`,
      )
      .join("")}</div>`;
  if (path === "tudastar")
    body = `<div class="guide-list">${[
      [
        c.t(
          "Mekkora klíma kell a szobába?",
          "What AC size does your room need?",
        ),
        c.t(
          "A négyzetméter hasznos kiindulópont. A tájolás, az üvegfelületek, a szigetelés, a belmagasság és az egybenyitott terek miatt ugyanakkora szobákhoz is eltérő teljesítmény lehet megfelelő. A választóval szűkítsd a kört, a végleges méretezést pedig egyeztessük.",
          "Floor area is a useful starting point. Orientation, glazing, insulation, ceiling height and connected spaces can make rooms of the same size need different capacities. Use the finder to narrow the options, then confirm the final sizing.",
        ),
      ],
      [
        c.t(
          "Fűtésre is használnám. Mire figyeljek?",
          "I also want heating. What should I consider?",
        ),
        c.t(
          "Más igény az őszi ráfűtés és a téli főfűtés. Ha elsősorban fűtésre választasz, a hideg időben elérhető teljesítményt és az épület hőigényét együtt kell vizsgálni.",
          "Occasional autumn heating differs from primary winter heating. For a heating-first choice, available capacity in cold weather must be considered together with the building’s heat demand.",
        ),
      ],
      [
        c.t(
          "Mit jelent a telepítéssel megadott ár?",
          "What does the installed price mean?",
        ),
        c.t(
          "A készülékárhoz 109 000 Ft bruttó standard telepítési díj adódik. A csomag legfeljebb 3 m csövezést és egy normál faláttörést tartalmaz. A kábelcsatornázás külön tétel; az eltérő helyszíni igényeket egyeztetjük.",
          "The unit price plus 109,000 HUF including VAT for standard installation. The package includes up to 3 m of pipework and one standard wall penetration. Cable trunking is extra; other site requirements are agreed separately.",
        ),
      ],
      [
        c.t(
          "Miért más a hőszivattyús ajánlatkérés?",
          "Why is a heat pump request different?",
        ),
        c.t(
          "A hőszivattyú a teljes épületgépészeti rendszer része. A hőleadók, a hőveszteség, a melegvízigény és a kívánt hűtés befolyásolják a tervezést. Ezért minden projekthez emberi műszaki validáció szükséges.",
          "A heat pump is part of the building’s complete mechanical system. Emitters, heat loss, hot water demand and cooling requirements inform the design. That is why every project requires human technical validation.",
        ),
      ],
    ]
      .map(
        ([t, p], i) =>
          `<details ${i === 0 ? "open" : ""}><summary>${t}<span aria-hidden="true">+</span></summary><p>${p}</p></details>`,
      )
      .join("")}</div>${helpBanner(c)}`;
  if (path === "kapcsolat")
    body = `<section class="contact-options"><div><p class="eyebrow">${c.t("KEZDJÜK AZ IGÉNYEIDDEL", "START WITH YOUR NEEDS")}</p><h2>${c.t("Miben segíthetünk?", "How can we help?")}</h2><p>${c.t("Válaszd ki, milyen megoldást keresel, vagy keress minket közvetlenül.", "Choose the solution you need, or contact us directly.")}</p><address class="contact-direct"><a href="mailto:${contactDetails.email}"><span>${c.t("Email", "Email")}</span><strong>${contactDetails.email}</strong></a>${contactDetails.phones.map((phone) => `<a href="tel:${phone.href}"><span>${c.t("Telefon", "Phone")}</span><strong>${phone.display}</strong></a>`).join("")}</address></div><div><a href="${c.url("ajanlat")}"><h3>${c.t("Klíma és telepítés", "Air conditioning and installation")}</h3>${arrow}</a><a href="${c.url("rendszer-ajanlat")}"><h3>${c.t("Hőszivattyús rendszer", "Heat pump system")}</h3>${arrow}</a><a href="${c.url("ajanlat")}?service=consultation"><h3>${c.t("Karbantartás vagy egyedi kérdés", "Maintenance or individual enquiry")}</h3>${arrow}</a></div></section>`;
  if (path === "adatkezeles")
    body = `<article class="prose narrow"><p class="notice">${c.t("Ez a frontend bemutatójára vonatkozó működési tájékoztató, nem a végleges szolgáltatás adatkezelési szabályzata.", "This describes the frontend preview, not the privacy policy of the final service.")}</p><h2>${c.t("Mi történik a megadott adatokkal?", "What happens to your details?")}</h2><p>${c.t("Az ajánlatkérőben megadott adatok a böngésző memóriájában maradnak. Nem küldjük őket szerverre. Az oldal újratöltésekor törlődnek. A letöltött összefoglaló a saját eszközödre kerül.", "Request details remain in browser memory. They are not sent to a server and are cleared when the page reloads. Downloaded summaries are saved to your own device.")}</p><h2>${c.t("Helyi tárolás", "Local storage")}</h2><p>${c.t("Személyes kapcsolattartási adatot nem tárolunk tartósan. Analitikát és marketingkövetést sem használunk.", "Contact details are not stored persistently. No analytics or marketing tracking is included.")}</p><h2>${c.t("Betűtípus", "Typeface")}</h2><p>${c.t("A Manrope betűtípus helyben, az oldal saját fájljaiból töltődik be. A betűk megjelenítéséhez nem kapcsolódunk külső szolgáltatáshoz.", "The Manrope typeface loads locally from the site’s own files. No external font service is contacted.")}</p><h2>${c.t("Éles szolgáltatás előtt", "Before launch")}</h2><p>${c.t("A tényleges adatkezelő adatait, az adatkezelés jogalapját, időtartamát, az adatfeldolgozókat és az érintetti jogok gyakorlásának módját az üzemeltetőnek kell megadnia és jóváhagynia. Addig az űrlapok nem továbbítanak adatot.", "The operator must supply and approve the controller details, lawful basis, retention period, processors and how individuals can exercise their rights. Until then, the forms do not transmit data.")}</p></article>`;
  return `<div class="container">${breadcrumb(c, [[titles[path]]])}<section class="page-intro"><p class="eyebrow">THERMOVA</p><h1>${titles[path]}</h1></section>${body}</div>`;
}
