import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const response = await fetch('https://api.github.com/users/sattiyans/events', {
      headers: {
        'User-Agent': 'sattiyans.com',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events = await response.json();
    
    // Process the events to create a simplified activity feed
    const activities = events.slice(0, 10).map((event: any) => {
      let message = '';
      let date = event.created_at;
      
      switch (event.type) {
        case 'PushEvent':
          const commits = event.payload.commits || [];
          const repo = event.repo.name;
          message = `Pushed ${commits.length} commit${commits.length > 1 ? 's' : ''} to ${repo}`;
          break;
        case 'CreateEvent':
          message = `Created ${event.payload.ref_type} in ${event.repo.name}`;
          break;
        case 'WatchEvent':
          message = `Starred ${event.repo.name}`;
          break;
        case 'ForkEvent':
          message = `Forked ${event.repo.name}`;
          break;
        case 'IssuesEvent':
          const action = event.payload.action;
          message = `${action.charAt(0).toUpperCase() + action.slice(1)} issue in ${event.repo.name}`;
          break;
        case 'PullRequestEvent':
          const prAction = event.payload.action;
          message = `${prAction.charAt(0).toUpperCase() + prAction.slice(1)} pull request in ${event.repo.name}`;
          break;
        default:
          message = `Activity in ${event.repo.name}`;
      }
      
      return {
        message,
        date,
        type: event.type,
        repo: event.repo.name,
        url: `https://github.com/${event.repo.name}`
      };
    });

    return new Response(JSON.stringify(activities), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch GitHub activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
