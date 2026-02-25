export type Site = {
  NAME: string;
  EMAIL: string;
  NUM_POSTS_ON_HOMEPAGE: number;
  NUM_WORKS_ON_HOMEPAGE: number;
  NUM_PROJECTS_ON_HOMEPAGE: number;
};

export type Metadata = {
  TITLE: string;
  DESCRIPTION: string;
};

export type Socials = {
  NAME: string;
  HREF: string;
}[];

export type WatchedItem = {
  id: string;
  title: string;
  year: number;
  type: 'film' | 'series';
  platform: 'letterboxd' | 'serializd';
  watchedDate: Date;
  rating?: number;
  reviewText?: string;
  posterUrl?: string;
  url?: string;
  episode?: string;
  season?: number;
};
