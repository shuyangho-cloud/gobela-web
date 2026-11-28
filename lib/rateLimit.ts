import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Simple fixed-window rate limiter backed by Supabase (no in-memory state,
 * since Vercel's serverless functions don't share memory between
 * invocations). Buckets requests into windowSeconds-wide windows per
 * (route, identifier) pair and rejects once count exceeds max within the
 * current window.
 *
 * Returns true if the request is allowed, false if it should be rejected.
 * Fails open (allows the request) if the rate-limit check itself errors —
 * a broken limiter should never be the reason a real signup is lost.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  {
    route,
    identifier,
    max,
    windowSeconds,
  }: { route: string; identifier: string; max: number; windowSeconds: number },
): Promise<boolean> {
  try {
    const windowMs = windowSeconds * 1000;
    const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs).toISOString();

    const { data: existing, error: selectErr } = await supabase
      .from("rate_limits")
      .select("count")
      .eq("route", route)
      .eq("identifier", identifier)
      .eq("window_start", windowStart)
      .maybeSingle();

    if (selectErr) {
      console.error(`Rate limit select error (failing open, route=${route}):`, selectErr.message);
      return true;
    }

    if (!existing) {
      const { error: insertErr } = await supabase
        .from("rate_limits")
        .insert({ route, identifier, window_start: windowStart, count: 1 });
      // A unique-violation here means another concurrent request just
      // created the row first — treat that as "this request is the 2nd in
      // the window", i.e. still allowed, rather than erroring.
      if (insertErr && insertErr.code !== "23505") {
        console.error("Rate limit insert error:", insertErr.message);
      }
      return true;
    }

    if (existing.count >= max) {
      return false;
    }

    const { error: updateErr } = await supabase
      .from("rate_limits")
      .update({ count: existing.count + 1 })
      .eq("route", route)
      .eq("identifier", identifier)
      .eq("window_start", windowStart);

    if (updateErr) {
      console.error("Rate limit update error:", updateErr.message);
    }

    return true;
  } catch (err) {
    console.error(`Rate limit check failed (failing open, route=${route}):`, err instanceof Error ? err.message : err);
    return true;
  }
}

export function clientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
