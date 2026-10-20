const dns = require('dns').promises;
const net = require('net');

/**
 * Checks whether an IP address belongs to private, loopback, link-local,
 * multicast, or other restricted address spaces.
 */
function isPrivateOrRestrictedIp(ip) {
  if (!ip || typeof ip !== 'string') return true;

  // Handle IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1)
  if (ip.startsWith('::ffff:')) {
    const rawIpv4 = ip.substring(7);
    if (net.isIPv4(rawIpv4)) {
      return isPrivateOrRestrictedIp(rawIpv4);
    }
  }

  // IPv4 Checks
  if (net.isIPv4(ip)) {
    const octets = ip.split('.').map((o) => parseInt(o, 10));
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
    if (ip === '255.255.255.255') return true;

    return false;
  }

  // IPv6 Checks
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    // Loopback ::1
    if (lower === '::1' || lower === '0000:0000:0000:0000:0000:0000:0000:0001') return true;
    // Unspecified ::
    if (lower === '::' || lower === '0000:0000:0000:0000:0000:0000:0000:0000') return true;
    // Unique local fc00::/7
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
    // Link-local unicast fe80::/10
    if (/^fe[89ab]/i.test(lower)) return true;
    // Multicast ff00::/8
    if (lower.startsWith('ff')) return true;

    return false;
  }

  return true;
}

/**
 * Validates any external URL to prevent SSRF vulnerabilities:
 * - Restricts protocol to http: and https: only.
 * - Rejects embedded user credentials.
 * - Restricts ports to standard 80 / 443 only.
 * - Blocks internal hostnames (.localhost, .local, .internal, metadata.google.internal, etc.).
 * - Resolves DNS and verifies all underlying IP addresses against private / reserved ranges.
 */
async function validateUrlForSsrf(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return { valid: false, reason: 'URL parameter is missing or not a string' };
  }

  let parsed;
  try {
    parsed = new URL(urlString.trim());
  } catch {
    return { valid: false, reason: 'Malformed or invalid URL syntax' };
  }

  // 1. Only allow http and https protocols
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, reason: `Unsupported protocol '${parsed.protocol}'. Only HTTP and HTTPS are permitted.` };
  }

  // 2. Reject credentials in URL
  if (parsed.username || parsed.password) {
    return { valid: false, reason: 'Embedded authentication credentials in URL are prohibited.' };
  }

  // 3. Port check: only standard HTTP/HTTPS ports (80, 443) or no port specified
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return { valid: false, reason: `Destination port '${parsed.port}' is blocked. Only standard web ports (80, 443) are allowed.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 4. Block common internal/cloud metadata hostnames
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.home.arpa') ||
    hostname === 'metadata.google.internal' ||
    hostname === 'instance-data'
  ) {
    return { valid: false, reason: `Access to internal hostname '${hostname}' is forbidden.` };
  }

  // 5. If hostname is an IP literal, validate immediately
  if (net.isIP(hostname)) {
    if (isPrivateOrRestrictedIp(hostname)) {
      return { valid: false, reason: `Access to private or reserved IP address '${hostname}' is forbidden.` };
    }
  }

  // 6. Perform DNS lookup to inspect resolved IP addresses
  try {
    const addresses = await dns.lookup(hostname, { all: true });
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
    return { valid: false, reason: `DNS lookup failed for '${hostname}': ${dnsErr.message}` };
  }

  return { valid: true, parsedUrl: parsed };
}

module.exports = {
  isPrivateOrRestrictedIp,
  validateUrlForSsrf,
};
