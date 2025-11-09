import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

// Ensure this route is never prerendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('=== CHATBOT API CALLED ===');
    console.log('Request method:', request.method);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Use exact same pattern as letterboxd-analytics.ts which works
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (jsonError: any) {
      console.error('JSON parsing error:', jsonError);
      console.error('Error details:', {
        message: jsonError?.message,
        name: jsonError?.name,
        stack: jsonError?.stack
      });
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        details: jsonError?.message || 'Could not parse request body as JSON'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ 
        error: 'Invalid request body format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'Message is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Load knowledge base
    // Try file system first (for local dev and some serverless environments)
    const cwd = process.cwd();
    const possiblePaths = [
      join(cwd, 'public', 'knowledge-base.json'),
      join(cwd, 'dist', 'public', 'knowledge-base.json'),
      join(cwd, '.vercel', 'output', 'static', 'knowledge-base.json'),
      join('/var/task', 'public', 'knowledge-base.json'),
      join('/var/task', 'dist', 'public', 'knowledge-base.json'),
      join('/var/task', 'knowledge-base.json'),
    ];
    
    let knowledgeBase;
    let knowledgeBasePath = null;
    const triedPaths = [];
    
    // First, try file system paths
    for (const path of possiblePaths) {
      triedPaths.push(path);
      try {
        const kbContent = readFileSync(path, 'utf-8');
        knowledgeBase = JSON.parse(kbContent);
        knowledgeBasePath = path;
        console.log(`✅ Knowledge base loaded from file system: ${path}`);
        break;
      } catch (e: any) {
        // Try next path
        continue;
      }
    }
    
    // If file system fails, try fetching from public URL (for Vercel serverless)
    if (!knowledgeBase) {
      const siteUrl = import.meta.env.SITE || 'https://sattiyans.com';
      const publicUrl = `${siteUrl}/knowledge-base.json`;
      try {
        console.log(`Attempting to fetch knowledge base from: ${publicUrl}`);
        const response = await fetch(publicUrl);
        if (response.ok) {
          knowledgeBase = await response.json();
          knowledgeBasePath = publicUrl;
          console.log(`✅ Knowledge base loaded from public URL: ${publicUrl}`);
        } else {
          console.error(`Failed to fetch from ${publicUrl}: ${response.status} ${response.statusText}`);
        }
      } catch (fetchError: any) {
        console.error(`Error fetching knowledge base: ${fetchError.message}`);
      }
    }
    
    if (!knowledgeBase) {
      console.error('❌ Knowledge base not found. Tried file paths:', triedPaths);
      console.error('Current working directory:', cwd);
      return new Response(JSON.stringify({ 
        error: 'Knowledge base not found. Please ensure the build process generates knowledge-base.json',
        details: `Tried ${triedPaths.length} file paths and public URL. Current directory: ${cwd}`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get OpenAI API key
    const apiKey = import.meta.env.OPENAI_SECRET_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare context from knowledge base
    const context = buildContext(knowledgeBase);

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant for Sattiyan Selvarajah's portfolio website. Your role is to answer questions about Sattiyan, his projects, work experience, skills, tools, and blog posts based ONLY on the provided knowledge base.

IMPORTANT RULES:
1. Answer questions ONLY based on the knowledge base provided below
2. If a question is about something NOT in the knowledge base, politely decline: "I'm sorry, but I can only answer questions about Sattiyan's portfolio, projects, work experience, and website content. Could you ask me something about his work, projects, or skills instead?"
3. Be friendly, concise, and helpful
4. When mentioning projects or work, include relevant details like tech stack, role, and dates when available
5. If asked about contact information, you can mention the email from the knowledge base
6. Do not make up information that isn't in the knowledge base
7. If asked about topics outside the portfolio (like general programming, unrelated questions), politely redirect to portfolio-related topics
8. DO NOT mention the website URL or provide links to the website - users are already on the website, so mentioning it is redundant
9. DO NOT say things like "You can find more on the website" or "Check the website" - just provide the information directly

KNOWLEDGE BASE:
${context}`
      },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency, can be changed to gpt-4 if needed
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      let errorData = {};
      try {
        const errorText = await response.text();
        if (errorText) {
          errorData = JSON.parse(errorText);
        }
      } catch (e) {
        console.error('Error parsing OpenAI error response:', e);
      }
      console.error('OpenAI API error:', errorData, 'Status:', response.status);
      return new Response(JSON.stringify({ 
        error: 'Failed to get response from AI',
        details: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let data;
    try {
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from OpenAI');
      }
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Failed to parse AI response',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return new Response(JSON.stringify({ 
      message: aiMessage,
      usage: data.usage
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Build context string from knowledge base
function buildContext(kb: any): string {
  let context = '';

  // About section
  context += `ABOUT SATTIYAN:\n`;
  context += `Name: ${kb.about.name}\n`;
  context += `Role: ${kb.about.role}\n`;
  context += `Location: ${kb.about.location}\n`;
  context += `Email: ${kb.about.email}\n`;
  context += `Description: ${kb.about.description}\n`;
  context += `Website: ${kb.about.website}\n\n`;

  // Projects
  if (kb.projects && kb.projects.length > 0) {
    context += `PROJECTS (${kb.projects.length} total):\n`;
    kb.projects.forEach((project: any, index: number) => {
      context += `${index + 1}. ${project.title}\n`;
      context += `   Description: ${project.description}\n`;
      if (project.role) context += `   Role: ${project.role}\n`;
      if (project.client) context += `   Client: ${project.client}\n`;
      if (project.projectOwner) context += `   Project Owner: ${project.projectOwner}\n`;
      if (project.techStack && project.techStack.length > 0) {
        context += `   Tech Stack: ${project.techStack.join(', ')}\n`;
      }
      if (project.projectURL) context += `   URL: ${project.projectURL}\n`;
      if (project.content) {
        const contentPreview = project.content.substring(0, 500);
        context += `   Details: ${contentPreview}${project.content.length > 500 ? '...' : ''}\n`;
      }
      context += `   Page: ${project.url}\n\n`;
    });
  }

  // Work experience
  if (kb.work && kb.work.length > 0) {
    context += `WORK EXPERIENCE (${kb.work.length} positions):\n`;
    kb.work.forEach((work: any, index: number) => {
      context += `${index + 1}. ${work.role} at ${work.company}\n`;
      context += `   Period: ${work.dateStart} to ${work.dateEnd}\n`;
      if (work.content) {
        const contentPreview = work.content.substring(0, 300);
        context += `   Details: ${contentPreview}${work.content.length > 300 ? '...' : ''}\n`;
      }
      context += `   Page: ${work.url}\n\n`;
    });
  }

  // Blog posts
  if (kb.blog && kb.blog.length > 0) {
    context += `BLOG POSTS (${kb.blog.length} posts):\n`;
    kb.blog.forEach((post: any, index: number) => {
      context += `${index + 1}. ${post.title}\n`;
      context += `   Description: ${post.description}\n`;
      if (post.content) {
        const contentPreview = post.content.substring(0, 300);
        context += `   Content: ${contentPreview}${post.content.length > 300 ? '...' : ''}\n`;
      }
      context += `   Page: ${post.url}\n\n`;
    });
  }

  // Tools
  if (kb.tools && kb.tools.length > 0) {
    context += `TOOLS (${kb.tools.length} tools):\n`;
    kb.tools.forEach((tool: any, index: number) => {
      context += `${index + 1}. ${tool.name} - ${tool.description}\n`;
      context += `   Category: ${tool.category}\n`;
      context += `   URL: ${tool.href}\n\n`;
    });
  }

  // Skills
  if (kb.skills && kb.skills.length > 0) {
    context += `SKILLS & TECHNOLOGIES:\n`;
    context += `${kb.skills.join(', ')}\n\n`;
  }

  // Uses
  if (kb.uses) {
    context += `SETUP & TOOLS USED:\n`;
    if (kb.uses.development && kb.uses.development.length > 0) {
      context += `Development: ${kb.uses.development.map((u: any) => u.name).join(', ')}\n`;
    }
    if (kb.uses.services && kb.uses.services.length > 0) {
      context += `Services: ${kb.uses.services.map((u: any) => u.name).join(', ')}\n`;
    }
  }

  return context;
}

