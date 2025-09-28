import type { APIRoute } from 'astro';
import { loadEnv } from 'vite';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Load environment variables
    const env = loadEnv('all', process.cwd(), '');
    
    const githubToken = env.GITHUB_TOKEN; // Optional, for higher rate limits
    const username = 'sattiyans';
    
    // GitHub API headers
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'sattiyans.com'
    };
    
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    
    // Get user's public events (commits, pushes, etc.)
    const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
      headers
    });
    
    if (!eventsResponse.ok) {
      throw new Error(`GitHub API error: ${eventsResponse.status}`);
    }
    
    const events = await eventsResponse.json();
    
    // Filter for push events (commits)
    const pushEvents = events.filter((event: any) => event.type === 'PushEvent');
    
    // Extract commit dates
    const commitDates = new Set<string>();
    
    pushEvents.forEach((event: any) => {
      if (event.payload && event.payload.commits) {
        event.payload.commits.forEach((commit: any) => {
          const date = new Date(event.created_at);
          const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
          commitDates.add(dateStr);
        });
      }
    });
    
    // Convert to sorted array of dates
    const sortedDates = Array.from(commitDates).sort().reverse();
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Check if there's a commit today or yesterday
    let checkDate = new Date(today);
    let foundCommit = false;
    
    // Look back up to 2 days to find the most recent commit
    for (let i = 0; i < 2; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        foundCommit = true;
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    if (foundCommit) {
      // Calculate consecutive days from the most recent commit
      let streakDate = new Date(checkDate);
      
      while (true) {
        const dateStr = streakDate.toISOString().split('T')[0];
        if (sortedDates.includes(dateStr)) {
          currentStreak++;
          streakDate.setDate(streakDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;
    
    for (const dateStr of sortedDates) {
      const currentDate = new Date(dateStr);
      
      if (lastDate === null) {
        tempStreak = 1;
      } else {
        const diffTime = lastDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      
      lastDate = currentDate;
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Calculate this year's commits
    const currentYear = new Date().getFullYear();
    const thisYearCommits = sortedDates.filter(dateStr => 
      dateStr.startsWith(currentYear.toString())
    ).length;
    
    return new Response(JSON.stringify({
      currentStreak,
      longestStreak,
      thisYearCommits,
      totalCommits: sortedDates.length,
      lastCommitDate: sortedDates[0] || null
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=7200', // Cache for 2 hours
      },
    });
    
  } catch (error) {
    console.error('GitHub streak API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch GitHub streak data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 200, // Return 200 so the UI shows error state instead of breaking
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache errors for 5 minutes
      },
    });
  }
};
