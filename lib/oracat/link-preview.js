const previewCache = globalThis.__mintcatPreviewCache || new Map();
const previewFailures = globalThis.__mintcatPreviewFailures || new Map();
globalThis.__mintcatPreviewCache = previewCache;
globalThis.__mintcatPreviewFailures = previewFailures;

function extractMeta(html, selectors) {
  for (const selector of selectors) {
    const match = html.match(selector);
    if (match?.[1]) {
      return decode(match[1].trim());
    }
  }
  return "";
}

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function extractUrls(text = "") {
  return Array.from(new Set((String(text).match(/https?:\/\/[^\s]+/g) || []).map((url) => url.trim())));
}

export async function fetchLinkPreview(url) {
  const target = new URL(url);
  if (!["http:", "https:"].includes(target.protocol)) {
    throw new Error("Unsupported protocol.");
  }
  assertAllowedPreviewUrl(target);

  const cached = previewCache.get(target.toString());
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const failures = previewFailures.get(target.hostname);
  if (failures && failures.count >= 3 && failures.resetAt > Date.now()) {
    throw new Error("Preview circuit is temporarily open for this host.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(target.toString(), {
      headers: {
        "User-Agent": "MintCatBot/1.0 (+https://mintcat.world)"
      },
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Preview fetch failed: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return {
        url: target.toString(),
        title: target.hostname,
        description: "",
        siteName: target.hostname,
        image: ""
      };
    }

    const html = await response.text();
    const preview = {
      url: target.toString(),
      title: extractMeta(html, [
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
        /<title[^>]*>([^<]+)<\/title>/i
      ]) || target.hostname,
      description: extractMeta(html, [
        /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i
      ]),
      siteName: extractMeta(html, [
        /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i
      ]) || target.hostname,
      image: extractMeta(html, [
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
      ])
    };

    previewCache.set(target.toString(), {
      value: preview,
      expiresAt: Date.now() + 30 * 60_000
    });
    previewFailures.delete(target.hostname);
    return preview;
  } catch (error) {
    recordFailure(target.hostname);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function buildLinkPreviews(text) {
  const urls = extractUrls(text).slice(0, 3);
  const previews = await Promise.all(
    urls.map(async (url) => {
      try {
        return await fetchLinkPreview(url);
      } catch (_error) {
        return {
          url,
          title: new URL(url).hostname,
          description: "",
          siteName: new URL(url).hostname,
          image: ""
        };
      }
    })
  );

  return previews;
}

function assertAllowedPreviewUrl(target) {
  const hostname = target.hostname.toLowerCase();
  const whitelist = String(process.env.ORACAT_LINK_PREVIEW_ALLOWLIST || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (whitelist.length && !whitelist.some((entry) => hostname === entry || hostname.endsWith(`.${entry}`))) {
    throw new Error("Host is not in the preview allowlist.");
  }

  const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
  const privatePatterns = [
    /^10\./,
    /^127\./,
    /^169\.254\./,
    /^172\.(1[6-9]|2\d|3[0-1])\./,
    /^192\.168\./
  ];

  if (blockedHosts.includes(hostname) || privatePatterns.some((pattern) => pattern.test(hostname))) {
    throw new Error("Host is blocked for security reasons.");
  }
}

function recordFailure(hostname) {
  const current = previewFailures.get(hostname);
  const nextCount = (current?.count || 0) + 1;
  previewFailures.set(hostname, {
    count: nextCount,
    resetAt: Date.now() + 5 * 60_000
  });
}
