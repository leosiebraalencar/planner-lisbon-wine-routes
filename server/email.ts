const NOTIFY_EMAIL = 'contacto@lisbonwineroutes.com';
const RESEND_API_URL = 'https://api.resend.com/emails';

export async function sendProRequestNotification(data: {
  name: string;
  email: string;
  phone?: string;
  duration?: number;
  budget?: string;
  preferences?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[email] RESEND_API_KEY is not configured — skipping Pro Request notification email');
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
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Lisbon Wine Routes <contacto@lisbonwineroutes.com>',
        to: [NOTIFY_EMAIL],
        subject,
        text,
      }),
    });

    if (!response.ok) {
      console.error(`[email] Resend request failed (${response.status}): ${await response.text()}`);
      return;
    }

    console.log(`[email] Pro Request notification sent to ${NOTIFY_EMAIL}`);
  } catch (err) {
    console.error('[email] Failed to send Pro Request notification through Resend:', err);
  }
}
