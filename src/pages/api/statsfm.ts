import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log('Fetching Stats.fm stats...');
    
    // Stats.fm profile URL
    const username = 'sattiyans';
    const profileUrl = `https://stats.fm/${username}`;
    
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebsiteBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Stats.fm API error: ${response.status}`);
    }

    const html = await response.text();
    
    // Try to extract stats from the HTML
    // Stats.fm displays stats in various formats, we'll look for common patterns
    let totalTracks = 0;
    let totalMinutes = 0;
    
    // Look for patterns like "X,XXX tracks" or "XXX tracks"
    const tracksMatch = html.match(/([\d,]+)\s+tracks?/i) || html.match(/tracks?[:\s]+([\d,]+)/i);
    if (tracksMatch) {
      totalTracks = parseInt(tracksMatch[1].replace(/,/g, '')) || 0;
    }
    
    // Look for minutes/streams patterns
    const minutesMatch = html.match(/([\d,]+)\s+minutes?/i) || html.match(/minutes?[:\s]+([\d,]+)/i);
    if (minutesMatch) {
      totalMinutes = parseInt(minutesMatch[1].replace(/,/g, '')) || 0;
    }
    
    // Alternative: Look for data attributes or JSON in script tags
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (scriptMatches) {
      for (const script of scriptMatches) {
        // Look for JSON data that might contain stats
        const jsonMatch = script.match(/"totalTracks":\s*(\d+)/i) || 
                         script.match(/"tracks":\s*(\d+)/i) ||
                         script.match(/"streams":\s*(\d+)/i);
        if (jsonMatch && !totalTracks) {
          totalTracks = parseInt(jsonMatch[1]) || 0;
        }
      }
    }
    
    console.log('Extracted Stats.fm data:', { totalTracks, totalMinutes });

    return new Response(JSON.stringify({ 
      totalTracks,
      totalMinutes,
      success: totalTracks > 0 || totalMinutes > 0
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Stats.fm stats error:', error);
    return new Response(JSON.stringify({ 
      totalTracks: 0,
      totalMinutes: 0,
      success: false,
      error: 'Failed to fetch stats'
    }), {
      status: 200, // Return 200 so UI doesn't break
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
};

