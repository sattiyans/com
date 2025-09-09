import type { WatchedItem } from "@types";

// Mock data - fallback when API is unavailable
export const mockWatchedData: WatchedItem[] = [
  {
    id: "1",
    title: "The Holdovers",
    year: 2023,
    type: "film",
    platform: "letterboxd",
    watchedDate: new Date("2024-01-15"),
    rating: 4.5,
    url: "https://letterboxd.com/film/the-holdovers/"
  },
  {
    id: "2",
    title: "Poor Things",
    year: 2023,
    type: "film",
    platform: "letterboxd",
    watchedDate: new Date("2024-01-12"),
    rating: 4,
    url: "https://letterboxd.com/film/poor-things-2023/"
  },
  {
    id: "3",
    title: "The Bear",
    year: 2023,
    type: "series",
    platform: "serializd",
    watchedDate: new Date("2024-01-10"),
    season: 2,
    episode: "10",
    url: "https://serializd.com/show/the-bear"
  },
  {
    id: "4",
    title: "Killers of the Flower Moon",
    year: 2023,
    type: "film",
    platform: "letterboxd",
    watchedDate: new Date("2024-01-08"),
    rating: 4.5,
    url: "https://letterboxd.com/film/killers-of-the-flower-moon/"
  },
  {
    id: "5",
    title: "Succession",
    year: 2023,
    type: "series",
    platform: "serializd",
    watchedDate: new Date("2024-01-05"),
    season: 4,
    episode: "10",
    url: "https://serializd.com/show/succession"
  },
  {
    id: "6",
    title: "Oppenheimer",
    year: 2023,
    type: "film",
    platform: "letterboxd",
    watchedDate: new Date("2024-01-03"),
    rating: 5,
    url: "https://letterboxd.com/film/oppenheimer-2023/"
  },
  {
    id: "7",
    title: "Barbie",
    year: 2023,
    type: "film",
    platform: "letterboxd",
    watchedDate: new Date("2023-12-28"),
    rating: 3.5,
    url: "https://letterboxd.com/film/barbie-2023/"
  },
  {
    id: "8",
    title: "The Last of Us",
    year: 2023,
    type: "series",
    platform: "serializd",
    watchedDate: new Date("2023-12-25"),
    season: 1,
    episode: "9",
    url: "https://serializd.com/show/the-last-of-us"
  },
  {
    id: "9",
    title: "Past Lives",
    year: 2023,
    type: "film",
    platform: "letterboxd",
    watchedDate: new Date("2023-12-20"),
    rating: 4,
    url: "https://letterboxd.com/film/past-lives-2023/"
  },
  {
    id: "10",
    title: "Wednesday",
    year: 2022,
    type: "series",
    platform: "serializd",
    watchedDate: new Date("2023-12-18"),
    season: 1,
    episode: "8",
    url: "https://serializd.com/show/wednesday"
  }
];

export async function getWatchedData(): Promise<WatchedItem[]> {
  try {
    // Try to fetch real data from Letterboxd API with cache busting
    const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
    const response = await fetch(`/api/letterboxd${cacheBuster}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        // Convert string dates back to Date objects
        const itemsWithDates = data.map((item: any) => ({
          ...item,
          watchedDate: new Date(item.watchedDate)
        }));
        
        // Sort by watched date (latest first)
        return itemsWithDates.sort((a: WatchedItem, b: WatchedItem) => 
          b.watchedDate.getTime() - a.watchedDate.getTime()
        );
      }
    }
    
    // Fallback to mock data if API fails
    console.warn('Using mock data - API unavailable');
    return mockWatchedData.sort((a, b) => 
      b.watchedDate.getTime() - a.watchedDate.getTime()
    );
    
  } catch (error) {
    console.error('Error fetching watched data:', error);
    
    // Fallback to mock data
    return mockWatchedData.sort((a, b) => 
      b.watchedDate.getTime() - a.watchedDate.getTime()
    );
  }
}

export function getWatchedStats(data: WatchedItem[]) {
  const totalWatched = data.length;
  const filmsWatched = data.filter(item => item.type === 'film').length;
  const seriesWatched = data.filter(item => item.type === 'series').length;
  const averageRating = data
    .filter(item => item.rating)
    .reduce((acc, item) => acc + (item.rating || 0), 0) / 
    data.filter(item => item.rating).length;

  return {
    totalWatched,
    filmsWatched,
    seriesWatched,
    averageRating
  };
} 