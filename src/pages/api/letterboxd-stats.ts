import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log('Fetching Letterboxd stats...');
    
    // Fetch the Letterboxd profile page
    const response = await fetch('https://letterboxd.com/sattiyans/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebsiteBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Letterboxd API error: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract movie count from the HTML
    // Look for patterns like "1,071 films" or "123 movies" (with commas)
    const movieCountMatch = html.match(/([\d,]+)\s+(?:films?|movies?)/i);
    const movieCount = movieCountMatch ? parseInt(movieCountMatch[1].replace(/,/g, '')) : 0;
    
    console.log('Extracted movie count:', movieCount);

    return new Response(JSON.stringify({ 
      movieCount,
      success: true
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate', // No caching
      },
    });
  } catch (error) {
    console.error('Letterboxd stats error:', error);
    return new Response(JSON.stringify({ 
      movieCount: 0,
      success: false,
      error: 'Failed to fetch movie count'
    }), {
      status: 200, // Return 200 so UI doesn't break
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
};
