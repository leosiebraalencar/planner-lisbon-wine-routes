import nodemailer from 'nodemailer';

const NOTIFY_EMAIL = 'contacto@lisbonwineroutes.com';

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendProRequestNotification(data: {
  name: string;
  email: string;
  phone?: string;
  duration?: number;
  budget?: string;
  preferences?: string;
}) {
  const transport = createTransport();
  if (!transport) {
    console.log('[email] SMTP not configured — skipping Pro Request notification email');
    return;
  }

  const subject = `Novo Pro Request — ${data.name}`;
  const text = [
    `Novo pedido Pro recebido em Lisbon Wine Routes.`,
    ``,
    `Nome: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Telefone: ${data.phone}` : null,
    data.duration ? `Duração: ${data.duration} dias` : null,
    data.budget ? `Orçamento: ${data.budget}` : null,
    data.preferences ? `Preferências:\n${data.preferences}` : null,
  ].filter(Boolean).join('\n');

  try {
    await transport.sendMail({
      from: `"Lisbon Wine Routes" <${process.env.SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject,
      text,
    });
    console.log(`[email] Pro Request notification sent to ${NOTIFY_EMAIL}`);
  } catch (err) {
    console.error('[email] Failed to send Pro Request notification:', err);
  }
}
