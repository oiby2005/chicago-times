import dns from "dns";
import net from "net";

export interface SsrfValidationResult {
  valid: boolean;
  reason?: string;
  parsedUrl?: URL;
}

export interface SafeFetchImageResult {
  ok: boolean;
  status?: number;
  error?: string;
  buffer?: Buffer;
  contentType?: string;
}

/**
 * Checks whether an IP address belongs to private, loopback, link-local,
 * multicast, or other restricted address spaces.
 */
export function isPrivateOrRestrictedIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return true;

  // Handle IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1)
  if (ip.startsWith("::ffff:")) {
    const rawIpv4 = ip.substring(7);
    if (net.isIPv4(rawIpv4)) {
      return isPrivateOrRestrictedIp(rawIpv4);
    }
  }

  // IPv4 Checks
  if (net.isIPv4(ip)) {
    const octets = ip.split(".").map((o) => parseInt(o, 10));
    if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
      return true;
    }

    // 0.0.0.0/8 (Current network / default route)
    if (octets[0] === 0) return true;

    // 10.0.0.0/8 (Private network RFC 1918)
    if (octets[0] === 10) return true;

    // 100.64.0.0/10 (Carrier-grade NAT RFC 6598)
    if (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) return true;

    // 127.0.0.0/8 (Loopback RFC 1122)
    if (octets[0] === 127) return true;

    // 169.254.0.0/16 (Link Local / Cloud Metadata RFC 3927)
    if (octets[0] === 169 && octets[1] === 254) return true;

    // 172.16.0.0/12 (Private network RFC 1918)
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;

    // 192.0.0.0/24 (IETF protocol assignments)
    if (octets[0] === 192 && octets[1] === 0 && octets[2] === 0) return true;

    // 192.0.2.0/24 (TEST-NET-1 RFC 5737)
    if (octets[0] === 192 && octets[1] === 0 && octets[2] === 2) return true;

    // 192.88.99.0/24 (6to4 Relay Anycast)
    if (octets[0] === 192 && octets[1] === 88 && octets[2] === 99) return true;

    // 192.168.0.0/16 (Private network RFC 1918)
    if (octets[0] === 192 && octets[1] === 168) return true;

    // 198.18.0.0/15 (Network benchmark RFC 2544)
    if (octets[0] === 198 && (octets[1] === 18 || octets[1] === 19)) return true;

    // 198.51.100.0/24 (TEST-NET-2 RFC 5737)
    if (octets[0] === 198 && octets[1] === 51 && octets[2] === 100) return true;

    // 203.0.113.0/24 (TEST-NET-3 RFC 5737)
    if (octets[0] === 203 && octets[1] === 0 && octets[2] === 113) return true;

    // 224.0.0.0/4 (Multicast RFC 5771)
    if (octets[0] >= 224 && octets[0] <= 239) return true;

    // 240.0.0.0/4 (Reserved RFC 1112)
    if (octets[0] >= 240) return true;

    // 255.255.255.255 (Broadcast)
    if (ip === "255.255.255.255") return true;

    return false;
  }

  // IPv6 Checks
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    // Loopback ::1
    if (lower === "::1" || lower === "0000:0000:0000:0000:0000:0000:0000:0001") return true;
    // Unspecified ::
    if (lower === "::" || lower === "0000:0000:0000:0000:0000:0000:0000:0000") return true;
    // Unique local fc00::/7
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
    // Link-local unicast fe80::/10
    if (/^fe[89ab]/i.test(lower)) return true;
    // Multicast ff00::/8
    if (lower.startsWith("ff")) return true;

    return false;
  }

  return true;
}

/**
 * Validates any external URL to prevent SSRF vulnerabilities:
 * - Restricts protocol to http: and https: only.
 * - Rejects embedded user credentials (user:pass@host).
 * - Restricts ports to standard 80 / 443 only.
 * - Blocks internal hostnames (.localhost, .local, .internal, metadata.google.internal, etc.).
 * - Resolves DNS and verifies all underlying IP addresses against private / reserved ranges.
 */
export async function validateUrlForSsrf(urlString: string): Promise<SsrfValidationResult> {
  if (!urlString || typeof urlString !== "string") {
    return { valid: false, reason: "URL parameter is missing or not a string" };
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString.trim());
  } catch {
    return { valid: false, reason: "Malformed or invalid URL syntax" };
  }

  // 1. Only allow http and https protocols
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, reason: `Unsupported protocol '${parsed.protocol}'. Only HTTP and HTTPS are permitted.` };
  }

  // 2. Reject credentials in URL
  if (parsed.username || parsed.password) {
    return { valid: false, reason: "Embedded authentication credentials in URL are prohibited." };
  }

  // 3. Port check: only standard HTTP/HTTPS ports (80, 443) or no port specified
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    return { valid: false, reason: `Destination port '${parsed.port}' is blocked. Only standard web ports (80, 443) are allowed.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 4. Block common internal/cloud metadata hostnames
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan") ||
    hostname.endsWith(".home.arpa") ||
    hostname === "metadata.google.internal" ||
    hostname === "instance-data"
  ) {
    return { valid: false, reason: `Access to internal hostname '${hostname}' is forbidden.` };
  }

  // 5. If hostname is an IP literal, validate immediately
  if (net.isIP(hostname)) {
    if (isPrivateOrRestrictedIp(hostname)) {
      return { valid: false, reason: `Access to private or reserved IP address '${hostname}' is forbidden.` };
    }
  }

  // 6. Perform DNS lookup to inspect resolved IP addresses (prevents DNS rebinding and malicious redirects)
  try {
    const addresses = await dns.promises.lookup(hostname, { all: true });
    if (!addresses || addresses.length === 0) {
      return { valid: false, reason: `Could not resolve hostname '${hostname}'.` };
    }

    for (const record of addresses) {
      if (isPrivateOrRestrictedIp(record.address)) {
        return {
          valid: false,
          reason: `Hostname '${hostname}' resolved to prohibited IP address '${record.address}'.`,
        };
      }
    }
  } catch (dnsErr) {
    const message = dnsErr instanceof Error ? dnsErr.message : "Lookup failed";
    return { valid: false, reason: `DNS lookup failed for '${hostname}': ${message}` };
  }

  return { valid: true, parsedUrl: parsed };
}

/**
 * Safely fetches a remote image URL with SSRF protection:
 * - Validates original URL.
 * - Enforces manual redirect handling, validating every redirect target.
 * - Caps max redirect hops (default 3).
 * - Enforces timeout and maximum payload size (15MB).
 * - Verifies Content-Type is a valid non-SVG image.
 */
export async function fetchSafeExternalImage(
  initialUrl: string,
  maxRedirects: number = 3,
  timeoutMs: number = 6000
): Promise<SafeFetchImageResult> {
  const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 Megabytes
  let currentUrl = initialUrl.trim();
  let hops = 0;

  while (hops <= maxRedirects) {
    const validation = await validateUrlForSsrf(currentUrl);
    if (!validation.valid || !validation.parsedUrl) {
      return {
        ok: false,
        status: 403,
        error: validation.reason || "Forbidden URL destination",
      };
    }

    let res: Response;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      res = await fetch(currentUrl, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "image/webp,image/avif,image/jpeg,image/png,image/*;q=0.8",
        },
        redirect: "manual",
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timer);
      const errMsg = fetchErr instanceof Error ? fetchErr.message : "Network fetch failed";
      return { ok: false, status: 502, error: errMsg };
    } finally {
      clearTimeout(timer);
    }

    // Handle HTTP Redirects securely
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      hops++;
      if (hops > maxRedirects) {
        return { ok: false, status: 508, error: "Too many redirects encountered" };
      }

      const locationHeader = res.headers.get("location");
      if (!locationHeader) {
        return { ok: false, status: 502, error: "Redirect response missing location header" };
      }

      try {
        currentUrl = new URL(locationHeader, currentUrl).toString();
      } catch {
        return { ok: false, status: 400, error: "Malformed redirect location URL" };
      }
      continue;
    }

    if (!res.ok) {
      return { ok: false, status: res.status, error: `Upstream returned status ${res.status}` };
    }

    // Validate Content-Type: Must be an image and strictly NOT SVG (to prevent Stored/Reflected SVG XSS)
    const contentType = res.headers.get("content-type") || "";
    const isImage = contentType.toLowerCase().startsWith("image/");
    const isSvg = contentType.toLowerCase().includes("svg");

    if (!isImage || isSvg) {
      return {
        ok: false,
        status: 415,
        error: "Requested resource is not a supported raster image (SVG and non-image formats are rejected).",
      };
    }

    // Verify Content-Length header if present
    const contentLengthHeader = res.headers.get("content-length");
    if (contentLengthHeader) {
      const parsedLength = parseInt(contentLengthHeader, 10);
      if (!isNaN(parsedLength) && parsedLength > MAX_IMAGE_BYTES) {
        return { ok: false, status: 413, error: "Image file exceeds the 15MB size limit." };
      }
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
      return { ok: false, status: 413, error: "Image file exceeds the 15MB size limit." };
    }

    return {
      ok: true,
      status: 200,
      buffer: Buffer.from(arrayBuffer),
      contentType,
    };
  }

  return { ok: false, status: 508, error: "Exceeded maximum redirect limit." };
}
