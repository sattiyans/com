import type { APIRoute } from 'astro';
import type { WatchedItem } from '@types';

export const GET: APIRoute = async () => {
  try {
    // Letterboxd RSS feed URL for user activity
    const username = 'sattiyans'; // Your Letterboxd username
    const rssUrl = `https://letterboxd.com/${username}/rss/`;
    
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }
    
    const xmlText = await response.text();
    
    // Parse the RSS XML to extract watched films
    const watchedItems = await parseLetterboxdRSS(xmlText);
    
    return new Response(JSON.stringify(watchedItems), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
  } catch (error) {
    console.error('Error fetching Letterboxd data:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch Letterboxd data',
      items: [] 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
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
  // Look for star ratings in the title (★ = 1, ★★ = 2, etc.)
  const starMatch = title.match(/★{1,5}/);
  if (starMatch) {
    return starMatch[0].length; // Count the stars
  }
  
  // Look for half stars (★½ = 1.5, ★★½ = 2.5, etc.)
  const halfStarMatch = title.match(/(★{1,5})½/);
  if (halfStarMatch) {
    return halfStarMatch[1].length + 0.5;
  }
  
  // Look for just half star (½ = 0.5)
  if (title.includes('½')) {
    return 0.5;
  }
  
  return undefined;
} 