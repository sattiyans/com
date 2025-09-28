import type { APIRoute } from 'astro';
import type { WatchedItem } from '@types';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Request method:', request.method);
    
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const username = body.username;
    console.log('Username from request body:', username);
    
    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // Use the same approach as the watched page
    const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
    const rssUrl = `https://letterboxd.com/${username}/rss/${cacheBuster}`;
    
    console.log('Fetching Letterboxd RSS for analytics:', rssUrl);
    
    const response = await fetch(rssUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log('RSS feed fetched successfully for analytics, length:', xmlText.length);
    
    // Parse the RSS XML to extract watched films (reuse the same function)
    const watchedItems = await parseLetterboxdRSS(xmlText);
    console.log('Parsed items for analytics:', watchedItems.length);
    
    // Calculate analytics
    const analytics = calculateAnalytics(watchedItems);
    
    return new Response(JSON.stringify(analytics), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('Error fetching Letterboxd analytics:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch Letterboxd data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


// Reuse the same parsing function from letterboxd.ts
async function parseLetterboxdRSS(xmlText: string): Promise<WatchedItem[]> {
  const items: WatchedItem[] = [];
  
  // Extract items using regex (same as watched page)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  console.log('Starting to parse RSS items...');
  
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    console.log('Processing item:', itemContent.substring(0, 200));
    
    // Extract title - the RSS format doesn't use CDATA, it's just <title>content</title>
    const titleMatch = itemContent.match(/<title>(.*?)<\/title>/);
    if (!titleMatch) {
      console.log('No title match found');
      continue;
    }
    
    const fullTitle = titleMatch[1];
    console.log('Full title:', fullTitle);
    
    const rating = extractRating(fullTitle);
    console.log('Extracted rating:', rating);
    
    // Extract year from title
    const yearMatch = fullTitle.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
    
    // Clean title (remove year and rating)
    const cleanTitle = fullTitle
      .replace(/, \d{4} - [★☆½]+$/, '')
      .replace(/ - [★☆½]+$/, '')
      .trim();
    
    console.log('Clean title:', cleanTitle);
    
    // Extract link
    const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
    const url = linkMatch ? linkMatch[1] : '';
    
    // Extract pubDate
    const dateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
    const pubDate = dateMatch ? new Date(dateMatch[1]) : new Date();
    
    // Format watched date
    const watchedDate = pubDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    console.log('Adding item:', { title: cleanTitle, year, rating, watchedDate, url });
    
    items.push({
      id: `letterboxd-${items.length}`,
      type: 'film',
      platform: 'letterboxd',
      title: cleanTitle,
      year,
      rating,
      watchedDate: new Date(watchedDate),
      url
    });
  }
  
  console.log('Total items parsed:', items.length);
  return items;
}

function extractRating(title: string): number {
  // Extract rating from title like "Film Title, 2023 - ★★★½" or "Film Title - ★★★½"
  const ratingMatch = title.match(/(?:, \d{4} - | - )([★☆½]+)$/);
  if (!ratingMatch) return 0;
  
  const ratingStr = ratingMatch[1];
  let rating = 0;
  
  // Count full stars
  const fullStars = (ratingStr.match(/★/g) || []).length;
  rating += fullStars;
  
  // Check for half star
  if (ratingStr.includes('½')) {
    rating += 0.5;
  }
  
  return rating;
}

function calculateAnalytics(films: WatchedItem[]) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Filter films by year and month
  const thisYearFilms = films.filter(film => {
    const filmDate = new Date(film.watchedDate);
    return filmDate.getFullYear() === currentYear;
  });
  
  const thisMonthFilms = films.filter(film => {
    const filmDate = new Date(film.watchedDate);
    return filmDate.getFullYear() === currentYear && filmDate.getMonth() === currentMonth;
  });
  
  // Calculate average rating (only for films with ratings)
  const ratedFilms = films.filter(film => film.rating && film.rating > 0);
  const averageRating = ratedFilms.length > 0
    ? ratedFilms.reduce((sum, film) => sum + (film.rating || 0), 0) / ratedFilms.length
    : 0;
  
  // Calculate rating distribution
  const ratingDistribution: Record<number, number> = {};
  for (let rating = 0.5; rating <= 5; rating += 0.5) {
    ratingDistribution[rating] = 0;
  }
  
  ratedFilms.forEach(film => {
    if (film.rating && ratingDistribution.hasOwnProperty(film.rating)) {
      ratingDistribution[film.rating]++;
    }
  });
  
  return {
    totalFilms: films.length,
    averageRating,
    thisYear: thisYearFilms.length,
    thisMonth: thisMonthFilms.length,
    recentFilms: films.slice(0, 20), // Most recent 20 films
    ratingDistribution
  };
}
