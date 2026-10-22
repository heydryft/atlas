import type { AppSettings } from "@/features/settings/lib/app-settings";

type SearchEngine = AppSettings["browserSearchEngine"];

const SEARCH_URLS: Record<SearchEngine, string> = {
  google: "https://www.google.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  bing: "https://www.bing.com/search?q=",
  brave: "https://search.brave.com/search?q=",
  kagi: "https://kagi.com/search?q=",
};

/** Address-bar resolution, as a normal browser's: a URL or a host stays an
 *  address, and anything else is searched with `browserSearchEngine`. */
export function toNavUrl(input: string, engine: SearchEngine): string {
  const t = input.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  // A bare host (has a dot, no spaces) or localhost → treat as a URL.
  const looksLikeUrl = /^localhost(:\d+)?(\/.*)?$/i.test(t) || /^[^\s]+\.[^\s]{2,}(\/.*)?$/.test(t);
  if (looksLikeUrl) return `https://${t}`;
  return `${SEARCH_URLS[engine] ?? SEARCH_URLS.google}${encodeURIComponent(t)}`;
}
