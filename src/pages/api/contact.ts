import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Ensure this route is never prerendered
export const prerender = false;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JSON_HEADERS = { 'Content-Type': 'application/json' };

function jsonResponse(payload: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = `${request.headers.get('content-type') || ''}`.toLowerCase();

    let name = '';
    let email = '';
    let subject = '';
    let message = '';

    if (
      contentType.includes('multipart/form-data') ||
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      const formData = await request.formData();
      name = `${formData.get('name') || ''}`.trim();
      email = `${formData.get('email') || ''}`.trim();
      subject = `${formData.get('subject') || ''}`.trim();
      message = `${formData.get('message') || ''}`.trim();
    } else if (contentType.includes('application/json')) {
      let body: Record<string, unknown> = {};
      try {
        body = await request.json();
      } catch {
        return jsonResponse({
          success: false,
          error: 'Invalid JSON payload'
        }, 400);
      }
      name = `${body.name || ''}`.trim();
      email = `${body.email || ''}`.trim();
      subject = `${body.subject || ''}`.trim();
      message = `${body.message || ''}`.trim();
    } else {
      return jsonResponse({
        success: false,
        error: 'Unsupported content type. Use multipart/form-data or application/json'
      }, 415);
    }

    // Validate required fields
    if (!name || !email || !message) {
      return jsonResponse({
        success: false,
        error: 'Missing required fields'
      }, 400);
    }

    if (!EMAIL_REGEX.test(email)) {
      return jsonResponse({
        success: false,
        error: 'Invalid email address'
      }, 400);
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured');
      return jsonResponse({
        success: false,
        error: 'Email service is not configured'
      }, 500);
    }

    const resend = new Resend(apiKey);
    const toEnv = `${import.meta.env.CONTACT_TO_EMAILS || import.meta.env.CONTACT_TO_EMAIL || 'hey@sattiyans.com'}`;
    const to = toEnv
      .split(',')
      .map((addr) => addr.trim())
      .filter(Boolean);
    const from = `${import.meta.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'}`;

    const emailSubject = subject ? `[${subject}] Contact from ${name}` : `Contact from ${name}`;
    const emailBodyText = `
New contact form submission:

Name: ${name}
Email: ${email}
Subject: ${subject || 'No subject specified'}

Message:
${message}

---
Sent from sattiyans.com contact form
    `.trim();

    const emailBodyHtml = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || 'No subject specified'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
      <hr />
      <p>Sent from sattiyans.com contact form</p>
    `;

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: emailSubject,
      text: emailBodyText,
      html: emailBodyHtml,
      replyTo: email
    });

    if (error) {
      console.error('Resend error:', error);
      return jsonResponse({
        success: false,
        error: 'Failed to send message'
      }, 502);
    }

    return jsonResponse({
      success: true,
      message: 'Message sent successfully!',
      id: data?.id
    }, 200);

  } catch (error) {
    console.error('Contact form error:', error);

    return jsonResponse({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
};
