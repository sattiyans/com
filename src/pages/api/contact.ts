import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

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

    // Prepare email content
    const emailSubject = subject ? `[${subject}] Contact from ${name}` : `Contact from ${name}`;
    const emailBody = `
New contact form submission:

Name: ${name}
Email: ${email}
Subject: ${subject || 'No subject specified'}

Message:
${message}

---
Sent from sattiyans.com contact form
    `.trim();

    // For now, we'll just log the email content
    // In production, you would integrate with an email service like:
    // - SendGrid
    // - Resend
    // - Nodemailer
    // - Netlify Forms
    
    console.log('=== NEW CONTACT FORM SUBMISSION ===');
    console.log('To: satt.works@gmail.com');
    console.log('Subject:', emailSubject);
    console.log('Body:', emailBody);
    console.log('=====================================');

    // TODO: Replace this with actual email sending
    // Example with a hypothetical email service:
    /*
    await sendEmail({
      to: 'satt.works@gmail.com',
      subject: emailSubject,
      text: emailBody,
      replyTo: email
    });
    */

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message sent successfully!' 
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
