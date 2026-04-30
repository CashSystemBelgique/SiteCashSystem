// Netlify Function : envoie un email de remerciement automatique au prospect
// après chaque submission Netlify Form (contact ou leasing).
//
// Trigger : nom magique "submission-created" → déclenché automatiquement par
// Netlify Forms à chaque soumission, sans webhook à configurer dans l'UI.
// Cf. https://docs.netlify.com/forms/notifications/#trigger-notifications-from-a-serverless-function
//
// Variables d'environnement requises (Netlify dashboard → Site settings → Environment variables) :
//   SMTP_HOST  (ex: smtp.ionos.fr)
//   SMTP_PORT  (ex: 465)
//   SMTP_USER  (ex: sales@cashsystem.be)
//   SMTP_PASS  (mot de passe boîte IONOS)

import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.ionos.fr';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  if (!SMTP_USER || !SMTP_PASS) {
    console.error('SMTP credentials missing');
    return { statusCode: 500, body: 'SMTP not configured' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  // submission-created trigger : body = { payload: { form_name, data, ... } }
  // outgoing webhook (legacy) : body = { form_name, data, ... } directement
  // On gère les deux formats.
  const payload = body.payload || body;
  const formName = payload.form_name || payload.formName;
  const data = payload.data || payload;
  const prospectEmail = (data.email || '').trim();
  const prospectNom = (data.nom || data.name || 'Bonjour').trim();

  if (!prospectEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(prospectEmail)) {
    console.warn('Invalid prospect email, skipping', prospectEmail);
    return { statusCode: 200, body: 'No valid email, skipped' };
  }

  let subject, html, text;
  if (formName === 'leasing') {
    subject = 'Votre dossier leasing CashSystem est en cours de traitement';
    html = renderLeasingThanks(prospectNom, data);
    text = renderLeasingTextFallback(prospectNom, data);
  } else {
    subject = 'Bien reçu, on s\'occupe de votre demande — CashSystem';
    html = renderContactThanks(prospectNom, data);
    text = renderContactTextFallback(prospectNom, data);
  }

  try {
    await transporter.sendMail({
      from: '"CashSystem" <sales@cashsystem.be>',
      to: prospectEmail,
      replyTo: 'sales@cashsystem.be',
      subject,
      html,
      text,
    });
    console.log(`Thank-you sent to ${prospectEmail} for form=${formName}`);
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('SMTP error', err);
    return { statusCode: 500, body: 'Mail error' };
  }
};

// ─── Email templates ────────────────────────────────────────────

function renderContactThanks(nom, data) {
  return baseTemplate({
    preheader: 'Votre demande est bien arrivée. Réponse sous 4h en jours ouvrés.',
    heading: `Merci ${escapeHtml(nom)}, on s'occupe de vous.`,
    intro: `Votre message vient d'arriver dans notre boîte. On revient vers vous sous <strong>4h en jours ouvrés</strong> avec un premier élément de réponse concret.`,
    extraSection: '',
  });
}

function renderLeasingThanks(nom, data) {
  const machines = data.machines || '1';
  const duree = data.duree || '60';
  const mensualite = data.mensualite || '170';

  const recap = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #e5e7eb;border-radius:12px;background:#fafaf7;">
      <tr>
        <td style="padding:16px 20px;">
          <div style="font-size:11px;font-weight:700;color:#009d72;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;">Votre configuration</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:14px;">Machines</td>
              <td style="padding:6px 0;text-align:right;font-weight:700;color:#0a0e0d;font-size:14px;">${escapeHtml(machines)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:14px;">Durée</td>
              <td style="padding:6px 0;text-align:right;font-weight:700;color:#0a0e0d;font-size:14px;">${escapeHtml(duree)} mois</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:14px;">Mensualité estimée</td>
              <td style="padding:6px 0;text-align:right;font-weight:700;color:#009d72;font-size:16px;">${escapeHtml(mensualite)} €/mois HT</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 12px;color:#6b7280;font-size:14px;line-height:1.6;">
      <em>Estimation indicative. Le tarif final est validé par notre partenaire financier après analyse de votre dossier.</em>
    </p>
  `;

  return baseTemplate({
    preheader: 'Votre dossier leasing est en cours d\'analyse — réponse sous 4h ouvrées.',
    heading: `Merci ${escapeHtml(nom)}, votre dossier est en route.`,
    intro: `On a bien reçu votre demande de leasing avec les documents fournis (carte d'identité + bilan). Notre partenaire financier traite votre dossier — vous recevrez l'offre détaillée sous <strong>4h en jours ouvrés</strong>.`,
    extraSection: recap,
  });
}

function baseTemplate({ preheader, heading, intro, extraSection }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CashSystem</title>
</head>
<body style="margin:0;padding:0;background:#fafaf7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0e0d;">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;font-size:1px;line-height:1px;color:transparent;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.04);">

          <tr>
            <td style="padding:32px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:24px;">
                    <a href="https://www.cashsystem.be" style="text-decoration:none;">
                      <img src="https://www.cashsystem.be/assets/logo-h.png" alt="CashSystem" width="140" style="display:block;border:0;height:auto;"/>
                    </a>
                  </td>
                </tr>
              </table>
              <div style="display:inline-block;padding:6px 12px;border-radius:9999px;background:rgba(0,197,142,.12);color:#009d72;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:16px;">✓ Demande reçue</div>
              <h1 style="margin:0 0 12px;font-size:28px;font-weight:800;letter-spacing:-.02em;line-height:1.15;color:#0a0e0d;">${heading}</h1>
              <p style="margin:0 0 20px;color:#6b7280;font-size:16px;line-height:1.6;">${intro}</p>
              ${extraSection}
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e0d;border-radius:16px;">
                <tr>
                  <td style="padding:24px;">
                    <div style="color:#00C58E;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;">★ Si c'est urgent</div>
                    <p style="margin:0 0 16px;color:#ffffff;font-size:16px;font-weight:600;line-height:1.4;">Vous avez besoin d'une réponse maintenant ?</p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:8px;">
                          <a href="https://wa.me/32456407362" style="display:inline-block;background:#00C58E;color:#0a0e0d;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:9999px;font-size:14px;">WhatsApp</a>
                        </td>
                        <td>
                          <a href="tel:+32456407362" style="display:inline-block;background:transparent;color:#ffffff;text-decoration:none;font-weight:600;padding:10px 18px;border-radius:9999px;font-size:14px;border:1px solid rgba(255,255,255,.2);">+32 456 40 73 62</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin-top:16px;">
          <tr>
            <td align="center" style="padding:8px 16px;color:#9ca3af;font-size:12px;line-height:1.5;">
              CashSystem · Leuvensesteenweg 21/L, 3070 Kortenberg, Belgique<br>
              <a href="https://www.cashsystem.be" style="color:#9ca3af;text-decoration:underline;">www.cashsystem.be</a> · <a href="mailto:sales@cashsystem.be" style="color:#9ca3af;text-decoration:underline;">sales@cashsystem.be</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderContactTextFallback(nom, data) {
  return `Bonjour ${nom},

Votre message vient d'arriver dans notre boîte. On revient vers vous sous 4h en jours ouvrés avec un premier élément de réponse concret.

Si c'est urgent :
WhatsApp : https://wa.me/32456407362
Téléphone : +32 456 40 73 62

À très vite,
L'équipe CashSystem
www.cashsystem.be
`;
}

function renderLeasingTextFallback(nom, data) {
  const machines = data.machines || '1';
  const duree = data.duree || '60';
  const mensualite = data.mensualite || '170';
  return `Bonjour ${nom},

On a bien reçu votre demande de leasing avec vos documents. Notre partenaire financier traite votre dossier — vous recevrez l'offre détaillée sous 4h en jours ouvrés.

Votre configuration :
- Machines : ${machines}
- Durée : ${duree} mois
- Mensualité estimée : ${mensualite} €/mois HT

Estimation indicative. Le tarif final est validé par notre partenaire financier après analyse.

Si c'est urgent :
WhatsApp : https://wa.me/32456407362
Téléphone : +32 456 40 73 62

À très vite,
L'équipe CashSystem
www.cashsystem.be
`;
}

function escapeHtml(s) {
  if (typeof s !== 'string') s = String(s ?? '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
