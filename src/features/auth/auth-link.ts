// Reads the links in Supabase emails (account confirmation, password reset). They come back
// to the app as …/auth/callback#access_token=…&refresh_token=…&type=recovery, or with
// error / error_code / error_description when the link is no longer valid.

export type AuthLink =
  | { kind: 'session'; accessToken: string; refreshToken: string; type: string | null }
  | { kind: 'error'; code: string | null; description: string | null }
  | { kind: 'none' };

function decode(text: string): string {
  try {
    return decodeURIComponent(text.replace(/\+/g, ' '));
  } catch {
    return text; // malformed escape: keep it as typed
  }
}

/** Parameters from the query and the #fragment of a link; the first value of a name wins. */
export function linkParams(url: string): Record<string, string> {
  const hashAt = url.indexOf('#');
  const beforeHash = hashAt === -1 ? url : url.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : url.slice(hashAt + 1);
  const queryAt = beforeHash.indexOf('?');
  const query = queryAt === -1 ? '' : beforeHash.slice(queryAt + 1);

  const params = new Map<string, string>();
  for (const pair of `${query}&${hash}`.split('&')) {
    if (!pair) continue;
    const eq = pair.indexOf('=');
    const name = decode(eq === -1 ? pair : pair.slice(0, eq));
    if (name && !params.has(name)) params.set(name, decode(eq === -1 ? '' : pair.slice(eq + 1)));
  }
  return Object.fromEntries(params);
}

export function parseAuthLink(url: string): AuthLink {
  const params = linkParams(url);

  const code = params.error_code || null;
  const description = params.error_description || params.error || null;
  if (code || description) return { kind: 'error', code, description };

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;
  if (!accessToken || !refreshToken) return { kind: 'none' };
  return { kind: 'session', accessToken, refreshToken, type: params.type || null };
}
