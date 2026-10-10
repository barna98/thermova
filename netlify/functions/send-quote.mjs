import nodemailer from "nodemailer";
const thermovaLogoBase64 = "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";

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
        content: Buffer.from(thermovaLogoBase64, "base64"),
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
