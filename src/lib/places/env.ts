// Astro inlines import.meta.env at build time; fall back to process.env at runtime.
export function env(name: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)[name];
  return fromMeta || process.env[name] || undefined;
}
