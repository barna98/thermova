import nodemailer from "nodemailer";
import { fileURLToPath } from "node:url";

const logoPath = fileURLToPath(new URL("./assets/thermova-wordmark-transparent.png", import.meta.url));

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const clean = (value, max = 3000) => String(value ?? "").trim().slice(0, max);
const headerSafe = (value) => clean(value, 100).replace(/[\r\n]+/g, " ");
const yesNo = (value) => value ? "Igen" : "Nem";

function row(label, value, { link } = {}) {
  if (!value) return "";
  const content = link
    ? `<a href="${escapeHtml(link)}" style="color:#1F2937;text-decoration:underline;text-decoration-color:#F05A28;text-underline-offset:3px">${escapeHtml(value)}</a>`
    : escapeHtml(value).replaceAll("\n", "<br>");
  return `<tr>
    <td style="padding:12px 18px 12px 0;color:#6B7280;font-size:13px;line-height:1.45;vertical-align:top;border-bottom:1px solid #E5E7EB">${escapeHtml(label)}</td>
    <td style="padding:12px 0;color:#1F2937;font-size:15px;font-weight:650;line-height:1.5;vertical-align:top;border-bottom:1px solid #E5E7EB">${content}</td>
  </tr>`;
}

function emailDocument(data) {
  const interest = data.interest === "hp" ? "Hőszivattyú" : "Klíma";
  const phoneHref = `tel:${data.phone.replace(/[^+\d]/g, "")}`;
  const submittedAt = new Intl.DateTimeFormat("hu-HU", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Budapest",
  }).format(new Date(data.submittedAt));
  return `<!doctype html>
  <html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#F4F4F2;font-family:Arial,Helvetica,sans-serif;color:#1F2937">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0">Új ${escapeHtml(interest.toLowerCase())} ajánlatkérés érkezett: ${escapeHtml(data.name)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F4F2"><tr><td align="center" style="padding:24px 12px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#FFFFFF;border-collapse:collapse;border-top:6px solid #F05A28">
        <tr><td style="padding:34px 36px 24px;border-bottom:1px solid #E5E7EB">
          <img src="cid:thermova-logo" width="240" alt="THERMOVA" style="display:block;width:240px;max-width:100%;height:auto">
          <p style="margin:14px 0 0;color:#6B7280;font-size:11px;letter-spacing:2.3px">ÉPÜLETENERGETIKAI MEGOLDÁSOK</p>
        </td></tr>
        <tr><td style="padding:34px 36px 8px">
          <p style="margin:0 0 10px;color:#F05A28;font-size:12px;font-weight:700;letter-spacing:1.6px">ÚJ ÉRDEKLŐDÉS</p>
          <h1 style="margin:0;color:#1F2937;font-size:30px;line-height:1.2">${escapeHtml(interest)} ajánlatkérés</h1>
          <p style="margin:14px 0 0;color:#6B7280;font-size:15px;line-height:1.65">Az alábbi érdeklődés a thermova.hu ajánlatkérőjéből érkezett.</p>
        </td></tr>
        <tr><td style="padding:22px 36px 8px">
          <h2 style="margin:0 0 8px;font-size:18px;color:#1F2937">Kapcsolattartó</h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
            ${row("Név", data.name)}
            ${row("Telefonszám", data.phone, { link: phoneHref })}
            ${row("Email", data.email, { link: `mailto:${data.email}` })}
            ${row("Település", data.city)}
          </table>
        </td></tr>
        <tr><td style="padding:28px 36px 8px">
          <h2 style="margin:0 0 8px;font-size:18px;color:#1F2937">Az igény részletei</h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
            ${row("Érdeklődés", interest)}
            ${row("Helyiségek száma", data.roomCount)}
            ${row("Alapterület", data.area ? `${data.area} m²` : "")}
            ${row("Megjegyzés", data.note)}
            ${row("Műszaki ellenőrzés szükséges", yesNo(data.reviewRequired))}
            ${row("Beküldés nyelve", data.locale === "en" ? "Angol" : "Magyar")}
          </table>
        </td></tr>
        <tr><td style="padding:30px 36px 38px">
          <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="background:#F05A28">
            <a href="${escapeHtml(phoneHref)}" style="display:inline-block;padding:14px 22px;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none">Hívás indítása</a>
          </td><td width="12"></td><td style="border:1px solid #1F2937">
            <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;padding:13px 22px;color:#1F2937;font-size:14px;font-weight:700;text-decoration:none">Válasz emailben</a>
          </td></tr></table>
        </td></tr>
        <tr><td style="padding:20px 36px;background:#1F2937;color:#D1D5DB;font-size:12px;line-height:1.6">
          Beküldve: ${escapeHtml(submittedAt)}<br>
          Adatkezelési hozzájárulás: ${yesNo(data.consent)}
        </td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
}

export async function handler(event) {
  if (event.httpMethod === "GET") {
    const configured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    return {
      statusCode: configured ? 200 : 503,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
      body: JSON.stringify({ service: "thermova-quote-email", configured }),
    };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { Allow: "POST" }, body: JSON.stringify({ ok: false }) };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    if (clean(payload.botField, 200)) {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }
    const request = payload.request || {};
    const contact = request.contact || {};
    const data = {
      interest: request.interest === "hp" ? "hp" : "ac",
      name: clean(contact.name, 100),
      phone: clean(contact.phone, 25),
      email: clean(contact.email, 254),
      city: clean(contact.city, 100),
      roomCount: clean(request.roomCount, 10),
      area: clean(request.area, 20),
      note: clean(request.note, 3000),
      reviewRequired: Boolean(request.humanTechnicalReviewRequired),
      locale: request.locale === "en" ? "en" : "hu",
      consent: contact.consent === true,
      submittedAt: clean(payload.submittedAt, 50) || new Date().toISOString(),
    };

    if (!data.name || !data.phone || !data.email || !data.city || !data.consent || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "missing-fields" }) };
    }

    const smtpHost = clean(process.env.SMTP_HOST, 255);
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = clean(process.env.SMTP_USER, 254);
    const smtpPass = String(process.env.SMTP_PASS || "");
    const recipient = clean(process.env.QUOTE_RECIPIENT, 254) || "info@thermova.hu";
    const from = clean(process.env.SMTP_FROM, 254) || `THERMOVA ajánlatkérés <${smtpUser}>`;
    if (!smtpHost || !smtpUser || !smtpPass || !Number.isFinite(smtpPort)) {
      console.error("THERMOVA quote email is missing SMTP configuration", {
        SMTP_HOST: Boolean(smtpHost),
        SMTP_PORT: Number.isFinite(smtpPort),
        SMTP_USER: Boolean(smtpUser),
        SMTP_PASS: Boolean(smtpPass),
      });
      return { statusCode: 503, body: JSON.stringify({ ok: false, error: "email-not-configured" }) };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: String(process.env.SMTP_SECURE ?? (smtpPort === 465)) === "true",
      auth: { user: smtpUser, pass: smtpPass },
    });
    const interest = data.interest === "hp" ? "Hőszivattyú" : "Klíma";
    const subject = `Új ${interest.toLowerCase()} ajánlatkérés – ${headerSafe(data.name)}`;
    const text = [
      `Új ${interest} ajánlatkérés`,
      "",
      `Név: ${data.name}`,
      `Telefonszám: ${data.phone}`,
      `Email: ${data.email}`,
      `Település: ${data.city}`,
      data.roomCount ? `Helyiségek száma: ${data.roomCount}` : "",
      data.area ? `Alapterület: ${data.area} m²` : "",
      data.note ? `Megjegyzés: ${data.note}` : "",
      `Műszaki ellenőrzés szükséges: ${yesNo(data.reviewRequired)}`,
      `Adatkezelési hozzájárulás: ${yesNo(data.consent)}`,
    ].filter(Boolean).join("\n");

    await transporter.sendMail({
      from,
      to: recipient,
      replyTo: data.email,
      subject,
      text,
      html: emailDocument(data),
      attachments: [{
        filename: "thermova-logo.png",
        path: logoPath,
        cid: "thermova-logo",
        contentDisposition: "inline",
      }],
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.error("THERMOVA quote email failed", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: false, error: "send-failed" }),
    };
  }
}
