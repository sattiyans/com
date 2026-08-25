/**
 * Resolve a project-owner company name to a logo under /public/work.
 * Keys are matched case-insensitively via includes().
 */
const OWNER_LOGOS: { match: string; logo: string }[] = [
  { match: "g6 labs", logo: "/work/g6labs.png" },
  { match: "dotkod", logo: "/work/dotkod.png" },
  { match: "trisquare", logo: "/work/trisquare.png" },
  { match: "craveasia", logo: "/work/craveasia.png" },
  { match: "dmc fincap", logo: "/work/dmcfincap.png" },
  { match: "dmcfincap", logo: "/work/dmcfincap.png" },
];

export function getProjectOwnerLogo(owner?: string): string | null {
  if (!owner) return null;
  const key = owner.toLowerCase().trim();
  const hit = OWNER_LOGOS.find((row) => key.includes(row.match));
  return hit?.logo ?? null;
}
