import { spawn } from 'child_process';
import type { WatchedItem } from '@types';

export async function getSerializdData(email: string, password: string): Promise<WatchedItem[]> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [
      'scripts/serializd_client.py',
      email,
      password
    ], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PATH: `${process.cwd()}/serializd-env/bin:${process.env.PATH}`
      }
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const items = JSON.parse(stdout);
          resolve(items);
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error}`));
        }
      } else {
        reject(new Error(`Python script failed with code ${code}: ${stderr}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
}

// Fallback function that returns mock data
export function getMockSerializdData(): WatchedItem[] {
  const mockData = [
    {
      title: "House of the Dragon",
      season: 2,
      episode: "4",
      watchedDate: new Date("2024-01-15"),
      url: "https://serializd.com/show/house-of-the-dragon"
    },
    {
      title: "The Crown",
      season: 6,
      episode: "10",
      watchedDate: new Date("2024-01-12"),
      url: "https://serializd.com/show/the-crown"
    },
    {
      title: "The Bear",
      season: 2,
      episode: "10",
      watchedDate: new Date("2024-01-10"),
      url: "https://serializd.com/show/the-bear"
    },
    {
      title: "Succession",
      season: 4,
      episode: "10",
      watchedDate: new Date("2024-01-05"),
      url: "https://serializd.com/show/succession"
    },
    {
      title: "The Last of Us",
      season: 1,
      episode: "9",
      watchedDate: new Date("2023-12-25"),
      url: "https://serializd.com/show/the-last-of-us"
    },
    {
      title: "Wednesday",
      season: 1,
      episode: "8",
      watchedDate: new Date("2023-12-18"),
      url: "https://serializd.com/show/wednesday"
    },
    {
      title: "Stranger Things",
      season: 4,
      episode: "9",
      watchedDate: new Date("2023-12-15"),
      url: "https://serializd.com/show/stranger-things"
    }
  ];

  return mockData.map((item, index) => ({
    id: `serializd-${Date.now()}-${index}`,
    title: item.title,
    year: 2023,
    type: 'series' as const,
    platform: 'serializd' as const,
    watchedDate: item.watchedDate,
    url: item.url,
    season: item.season,
    episode: item.episode
  }));
} 