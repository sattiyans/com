import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Load environment variables directly from process.env
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return new Response(JSON.stringify({ 
        error: 'Spotify credentials not configured',
        isPlaying: false
      }), {
        status: 200, // Return 200 so the UI shows "not playing" instead of error
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        },
      });
    }

    // Get access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get currently playing track
    const nowPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (nowPlayingResponse.status === 204) {
      // No content - not playing anything
      return new Response(JSON.stringify({ 
        isPlaying: false,
        message: 'No music currently playing'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    if (!nowPlayingResponse.ok) {
      throw new Error(`Spotify API error: ${nowPlayingResponse.status}`);
    }

    const data = await nowPlayingResponse.json();

    if (!data.item) {
      return new Response(JSON.stringify({ 
        isPlaying: false,
        message: 'No track data available'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    const track = data.item;
    const album = track.album;
    const artists = track.artists;

    const response = {
      isPlaying: data.is_playing || false,
      trackName: track.name,
      artistName: artists.map((artist: any) => artist.name).join(', '),
      albumName: album.name,
      albumImage: album.images[0]?.url || '/placeholder-album.png',
      trackUrl: track.external_urls.spotify,
      albumUrl: album.external_urls.spotify,
      artistUrl: artists[0]?.external_urls.spotify,
      duration: track.duration_ms,
      progress: data.progress_ms || 0,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30', // Cache for 30 seconds since music changes frequently
      },
    });
  } catch (error) {
    console.error('Spotify API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch Spotify data',
      isPlaying: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 200, // Return 200 so the UI shows "not playing" instead of error
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }
};
