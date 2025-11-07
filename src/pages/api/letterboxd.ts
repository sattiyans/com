import type { APIRoute } from 'astro';
import type { WatchedItem } from '@types';

// Ensure this route is never prerendered or cached
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Letterboxd RSS feed URL for user activity with aggressive cache busting
    const username = 'sattiyans'; // Your Letterboxd username
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const cacheBuster = `?t=${timestamp}&r=${randomId}&v=${Math.floor(Math.random() * 10000)}`;
    const rssUrl = `https://letterboxd.com/${username}/rss/${cacheBuster}`;
    
    console.log('🔄 Fetching Letterboxd RSS with cache busting:', rssUrl);
    console.log('⏰ Request timestamp:', new Date(timestamp).toISOString());
    
    const response = await fetch(rssUrl, {
      method: 'GET',
      cache: 'no-store', // Force no caching
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT',
        'If-None-Match': `"${timestamp}-${randomId}"`,
        'User-Agent': `Mozilla/5.0 (compatible; PortfolioBot/1.0; ${timestamp})`,
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log('RSS feed fetched successfully, length:', xmlText.length);
    
    // Parse the RSS XML to extract watched films
    const watchedItems = await parseLetterboxdRSS(xmlText);
    console.log('Parsed items:', watchedItems.length);
    
    const responseTimestamp = Date.now();
    const responseETag = `"${responseTimestamp}-${Math.random().toString(36).substring(2, 15)}"`;
    
    // Add timestamp to response data to help with cache debugging
    const responseData = {
      items: watchedItems,
      timestamp: responseTimestamp,
      fetchedAt: new Date(responseTimestamp).toISOString()
    };
    
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private',
        'Pragma': 'no-cache',
        'Expires': 'Thu, 01 Jan 1970 00:00:00 GMT',
        'Last-Modified': new Date(responseTimestamp).toUTCString(),
        'ETag': responseETag,
        'Vary': 'Accept-Encoding, User-Agent',
        'X-Cache-Status': 'MISS',
        'X-Response-Time': `${Date.now() - timestamp}ms`,
        'X-Timestamp': responseTimestamp.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Cache-Control, Pragma'
      }
    });
    
  } catch (error) {
    console.error('Error fetching Letterboxd data:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch Letterboxd data',
      items: [],
      timestamp: Date.now()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private',
        'Pragma': 'no-cache',
        'Expires': 'Thu, 01 Jan 1970 00:00:00 GMT',
        'X-Cache-Status': 'ERROR'
      }
    });
  }
};

async function parseLetterboxdRSS(xmlText: string): Promise<WatchedItem[]> {
  const items: WatchedItem[] = [];
  
  try {
    // Simple XML parsing using regex (for now)
    // In production, you might want to use a proper XML parser
    
    // Extract item entries
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const itemsMatch = xmlText.match(itemRegex);
    
    if (!itemsMatch) {
      return items;
    }
    
    for (const itemXml of itemsMatch) {
      try {
        // Extract title
        const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].trim() : '';
        console.log('Raw RSS title:', title);
        
        // Extract link
        const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
        const link = linkMatch ? linkMatch[1].trim() : '';
        
        // Extract pubDate (watched date)
        const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
        const pubDate = dateMatch ? new Date(dateMatch[1].trim()) : new Date();
        
        // Extract description to check if it's a review
        const descMatch = itemXml.match(/<description>(.*?)<\/description>/);
        const description = descMatch ? descMatch[1].trim() : '';
        
        // Only include films (not lists or other activity)
        if (title && link && link.includes('/film/') && !link.includes('/list/')) {
          // Clean title - remove rating and year from title
          let cleanTitle = title;
          let year = new Date().getFullYear();
          
          // Extract year from title (e.g., "Film Title, 2023 - ★★★★")
          const yearMatch = title.match(/, (\d{4}) - /);
          if (yearMatch) {
            year = parseInt(yearMatch[1]);
            // Remove year and rating from title
            cleanTitle = title.replace(/, \d{4} - [★☆½]+$/, '');
          } else {
            // Try to extract year from link
            const linkYearMatch = link.match(/\/film\/.*?(\d{4})\//);
            if (linkYearMatch) {
              year = parseInt(linkYearMatch[1]);
            }
          }
          
          // Remove any remaining rating from title
          cleanTitle = cleanTitle.replace(/ - [★☆½]+$/, '');
          
          // Only fetch poster for first 12 items to keep it fast
          let posterUrl: string | undefined = undefined;
          if (items.length < 12) {
            posterUrl = await getPosterUrl(cleanTitle, year);
          }
          
          items.push({
            id: `letterboxd-${Date.now()}-${Math.random()}`,
            title: cleanTitle,
            year,
            type: 'film',
            platform: 'letterboxd',
            watchedDate: pubDate,
            url: link,
            posterUrl,
            // Extract rating if available
            rating: extractRating(title)
          });
        }
      } catch (itemError) {
        console.error('Error parsing item:', itemError);
        continue;
      }
    }
    
  } catch (parseError) {
    console.error('Error parsing RSS:', parseError);
  }
  
  // Return only the latest 12 items
  return items.slice(0, 12);
}

async function getPosterUrl(title: string, year: number): Promise<string | undefined> {
  try {
    // TMDB API search
    const tmdbApiKey = process.env.TMDB_API_KEY || 'e3c7714600bab722db34afd7278579a4';
    
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}&year=${year}`;
    const response = await fetch(searchUrl);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const posterPath = data.results[0].poster_path;
        if (posterPath) {
          return `https://image.tmdb.org/t/p/w500${posterPath}`;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching poster:', error);
  }
  
  return undefined;
}

function extractRating(title: string): number | undefined {
  console.log('Extracting rating from title:', title);
  
  // Look for patterns like "Film Title, 2023 - ★★★½" or "Film Title - ★★★½"
  const ratingMatch = title.match(/(?:, \d{4} - | - )([★☆½]+)$/);
  if (ratingMatch) {
    const ratingStr = ratingMatch[1];
    console.log('Found rating string:', ratingStr);
    
    // Count full stars
    const fullStars = (ratingStr.match(/★/g) || []).length;
    
    // Check for half star
    const hasHalfStar = ratingStr.includes('½');
    
    const rating = fullStars + (hasHalfStar ? 0.5 : 0);
    console.log('Calculated rating:', rating);
    return rating;
  }
  
  // Fallback: look for any star pattern in the title
  const starMatch = title.match(/★{1,5}/);
  if (starMatch) {
    const fullStars = starMatch[0].length;
    const hasHalfStar = title.includes('½');
    return fullStars + (hasHalfStar ? 0.5 : 0);
  }
  
  return undefined;
} 