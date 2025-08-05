import type { APIRoute } from 'astro';
import type { WatchedItem } from '@types';

export const GET: APIRoute = async () => {
  try {
    console.log('Serializd API called - returning empty data');

    // Return empty array since we cannot get real Serializd user data
    // The serializd-py library doesn't provide access to user's watched shows
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('Error in Serializd API:', error);

    return new Response(JSON.stringify({
      error: 'Serializd integration not available',
      items: []
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 