/** Strip Letterboxd RSS suffixes that break title/poster parsing. */
export function stripLetterboxdTitleSuffixes(title: string): string {
  return title
    .replace(/\s*\(contains spoilers\)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractLetterboxdRating(title: string): number | undefined {
  const normalized = stripLetterboxdTitleSuffixes(title);

  const ratingMatch = normalized.match(/(?:, \d{4} - | - )([★☆½]+)$/);
  if (ratingMatch) {
    const ratingStr = ratingMatch[1];
    const fullStars = (ratingStr.match(/★/g) || []).length;
    const hasHalfStar = ratingStr.includes("½");
    return fullStars + (hasHalfStar ? 0.5 : 0);
  }

  const starMatch = normalized.match(/★{1,5}/);
  if (starMatch) {
    const fullStars = starMatch[0].length;
    const hasHalfStar = normalized.includes("½");
    return fullStars + (hasHalfStar ? 0.5 : 0);
  }

  return undefined;
}

export function cleanLetterboxdTitle(title: string, link?: string): {
  title: string;
  year: number;
} {
  const normalized = stripLetterboxdTitleSuffixes(title);
  let cleanTitle = normalized;
  let year = new Date().getFullYear();

  const yearMatch = normalized.match(/, (\d{4}) - /);
  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
    cleanTitle = normalized.replace(/, \d{4} - [★☆½]+$/, "");
  } else if (link) {
    const linkYearMatch = link.match(/\/film\/.*?(\d{4})\//);
    if (linkYearMatch) {
      year = parseInt(linkYearMatch[1], 10);
    }
  }

  cleanTitle = cleanTitle.replace(/ - [★☆½]+$/, "").trim();

  return { title: cleanTitle, year };
}
