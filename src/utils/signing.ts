import crypto from "crypto";

export function generateSignature(
  params: Record<string, string>,
  accessKey: string,
  secretKey: string,
  nonce: string,
  timestamp: string,
): string {
  // Step 1: Sort request params by key (ASCII order)
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  // Step 2: Append accessKey, nonce, timestamp (fixed order, after request params)
  const authStr = `accessKey=${accessKey}&nonce=${nonce}&timestamp=${timestamp}`;
  const queryString = sortedParams ? `${sortedParams}&${authStr}` : authStr;

  return crypto
    .createHmac("sha256", secretKey)
    .update(queryString)
    .digest("hex");
}

export function flattenParams(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenParams(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

export function generateNonce(): string {
  return String(Math.floor(Math.random() * 900000 + 100000));
}
