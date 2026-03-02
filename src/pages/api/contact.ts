import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Ensure this route is never prerendered
export const prerender = false;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const name = `${formData.get('name') || ''}`.trim();
    const email = `${formData.get('email') || ''}`.trim();
    const subject = `${formData.get('subject') || ''}`.trim();
    const message = `${formData.get('message') || ''}`.trim();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid email address'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(JSON.stringify({
        success: false,
        error: 'Email service is not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
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
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to send message'
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message sent successfully!',
      id: data?.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
