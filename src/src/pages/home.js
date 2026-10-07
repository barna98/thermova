import { config } from "../site-data.js";
import {
  arrow,
  image,
  sectionHead,
  installBlock,
  helpBanner,
  brandGallery,
  livingStory,
} from "../components.js";

export function home(c) {
  return `
 <section class="hero container">
  <div class="hero-copy">
   <p class="eyebrow"><span class="orange-line"></span>${c.t("OTTHONODNAK ÉS VÁLLALKOZÁSODNAK", "FOR YOUR HOME AND BUSINESS")}</p>
   <h1>${c.t("Nem gépet adunk.<br><span>Megoldást építünk.</span>", "We don’t just supply equipment.<br><span>We build solutions.</span>")}</h1>
   <p class="hero-lead">${c.t("Klíma, hőszivattyú és szakszerű telepítés otthonoknak és vállalkozásoknak — átlátható árakkal, szakértő segítséggel.", "Air conditioning, heat pumps and professional installation for homes and businesses — with clear pricing and expert guidance.")}</p>
   <div class="hero-actions"><a class="button" href="${c.url("klimak")}">${c.t("Klímát választok", "Choose air conditioning")} ${arrow}</a><a class="text-link" href="${c.url("hoszivattyuk")}">${c.t("Hőszivattyút választok", "Choose a heat pump")} ${arrow}</a></div>
   <div class="hero-foot"><span>${c.t("Készülékek szereléssel vagy anélkül", "Units with or without installation")}</span></div>
  </div>
  <div class="hero-image">${image("architecture", c.t("Modern otthon, meleg belső fényekkel – építészeti látványkép", "Modern home with warm interior light — architectural concept"), { hero: true })}</div>
 </section>
 <section class="container category-paths" aria-label="${c.t("Válassz megoldást", "Choose a solution")}">
  <a class="category-path" href="${c.url("klimak")}"><div><p class="eyebrow">${c.t("KLÍMÁK", "AIR CONDITIONING")}</p><h2>${c.t("Klímák hűtésre<br>és fűtésre.", "Air conditioning<br>for cooling and heating.")}</h2><span>${c.t("Készülék és telepítés egy helyen", "Your unit and installation in one place")} ${arrow}</span></div>${image("climate", c.t("THERMOVA klíma látványkép", "THERMOVA air conditioner concept"), { small: true })}</a>
  <a class="category-path" href="${c.url("hoszivattyuk")}"><div><p class="eyebrow">${c.t("HŐSZIVATTYÚK", "HEAT PUMPS")}</p><h2>${c.t("Fűtés és hűtés<br>hőszivattyúval.", "Heating and cooling<br>with a heat pump.")}</h2><span>${c.t("Személyre szabott rendszertervezés", "System design tailored to you")} ${arrow}</span></div>${image("system", c.t("THERMOVA hőszivattyúrendszer látványkép", "THERMOVA heat pump system concept"), { small: true })}</a>
 </section>
 <section class="container section selection-section home-guidance">
  ${sectionHead(c, c.t("SZEMÉLYESEN ÖSSZEÁLLÍTOTT AJÁNLAT", "A QUOTE PREPARED FOR YOU"), c.t("Előbb az igény.<br>Utána az ajánlat.", "Your needs first.<br>Your quote follows."), ["valaszto", c.t("Segítsetek választani", "Help me choose")])}
  <p class="section-intro">${c.t("Néhány kérdésből megismerjük az igényeidet, telefonon pontosítjuk a részleteket, majd 2–3 megfelelő lehetőséget küldünk.", "A few questions help us understand your needs, we confirm the details by phone, then send two or three suitable options.")}</p>
  <div class="home-guidance-grid"><div><strong>${c.t("Rövid igényfelmérés", "Short needs assessment")}</strong><span>${c.t("helyiség, használat és zajszint", "room, use and noise preference")}</span></div><div><strong>${c.t("Személyes egyeztetés", "Personal consultation")}</strong><span>${c.t("telefonon pontosítjuk a részleteket", "we confirm the details by phone")}</span></div><div><strong>${c.t("2–3 megfelelő lehetőség", "Two or three suitable options")}</strong><span>${c.t("a végleges ajánlatban", "in your final quote")}</span></div></div>
  <a class="button" href="${c.url("valaszto")}">${c.t("Segítsetek választani", "Help me choose")} ${arrow}</a>
 </section>
 <div class="container">${livingStory(c)}</div>
 <div class="container help-section">${helpBanner(c)}</div>
 <section class="container section split-editorial heatpump-story">
  <div class="editorial-image">${image("system", c.t("THERMOVA hőszivattyúrendszer márkázott látványterve", "Branded THERMOVA heat pump system concept"))}<span class="system-caption">THERMOVA / ${c.t("HŐSZIVATTYÚRENDSZEREK", "HEAT PUMP SYSTEMS")}</span></div>
  <div><p class="eyebrow">${c.t("ÚJ ÉPÍTÉSHEZ ÉS KORSZERŰSÍTÉSHEZ", "FOR NEW BUILDS AND RENOVATIONS")}</p><h2>${c.t("Fűtés, hűtés<br>és melegvíz.", "Heating, cooling<br>and hot water.")}</h2><p>${c.t("A megfelelő hőszivattyú kiválasztásához az egész épületet és a meglévő fűtést is megvizsgáljuk. Az ajánlatot az igényekhez és a műszaki lehetőségekhez igazítjuk.", "We consider the whole building and existing heating before recommending a heat pump. The quote reflects your needs and the technical requirements.")}</p><a class="button button-outline" href="${c.url("hoszivattyuk")}">${c.t("Megnézem a rendszereket", "Explore the systems")} ${arrow}</a><p class="small">${c.t("Minden projektet műszaki szakember ellenőriz.", "Every project is reviewed by a technical specialist.")}</p></div>
 </section>
 <div class="container">${installBlock(c)}</div>
 <div class="container">${brandGallery(c)}</div>
 <section class="container closing-statement"><p class="eyebrow">${c.t("AJÁNLATKÉRÉS", "REQUEST A QUOTE")}</p><h2>${c.t("Kérj ajánlatot<br>a telepítésre.", "Get a quote<br>for installation.")}</h2><p>${c.t("Néhány alapadat és az elérhetőséged elég. Felhívunk, átbeszéljük az igényeidet, és ezek alapján készítünk ajánlatot.", "Share a few basic details and how to reach you. We’ll call to discuss your needs before preparing a quote.")}</p><a class="button" href="${c.url("ajanlat")}">${c.t("Klímatelepítési ajánlatot kérek", "Request an AC installation quote")} ${arrow}</a></section>`;
}
