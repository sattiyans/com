import type { APIRoute } from 'astro';

export const prerender = false;

type LatestEpisode = {
  showTitle: string;
  season?: number;
  episode?: string;
  watchedDate?: string;
  url?: string;
};

const USERNAME = 'sattiyans';
const DIARY_URL = `https://www.serializd.com/user/${USERNAME}/diary`;

export const GET: APIRoute = async () => {
  try {
    const latestEpisode = await getLatestEpisodeFromDiary();

    return new Response(JSON.stringify({
      success: Boolean(latestEpisode),
      source: latestEpisode ? 'scrape' : 'fallback',
      latestEpisode
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800'
      }
    });
  } catch (error) {
    console.error('Error in Serializd API:', error);

    return new Response(JSON.stringify({
      success: false,
      source: 'error',
      latestEpisode: null
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
  }
};

async function getLatestEpisodeFromDiary(): Promise<LatestEpisode | null> {
  try {
    const response = await fetch(DIARY_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    return parseLatestEpisodeFromHtml(html);
  } catch (error) {
    console.error('Failed to fetch Serializd diary:', error);
    return null;
  }
}

function parseLatestEpisodeFromHtml(html: string): LatestEpisode | null {
  // Try to parse visible diary links if Serializd renders them server-side.
  // If the page only hydrates on client, this will correctly return null.
  const episodeLinkMatch = html.match(
    /href="(\/show\/[^"]*?season\/(\d+)[^"]*?episode\/(\d+)[^"]*)"/i
  );

  if (!episodeLinkMatch) {
    return null;
  }

  const episodePath = episodeLinkMatch[1];
  const season = Number(episodeLinkMatch[2]);
  const episode = episodeLinkMatch[3];

  const titleContext = html.slice(
    Math.max(0, episodeLinkMatch.index ? episodeLinkMatch.index - 600 : 0),
    Math.min(html.length, (episodeLinkMatch.index || 0) + 600)
  );

  const titleMatch =
    titleContext.match(/"showName":"([^"]+)"/i) ||
    titleContext.match(/title="([^"]+)"/i) ||
    titleContext.match(/aria-label="([^"]+)"/i);

  const showTitle = titleMatch?.[1]?.trim() || 'Latest episode';

  return {
    showTitle,
    season: Number.isFinite(season) ? season : undefined,
    episode,
    url: `https://www.serializd.com${episodePath}`
  };
}