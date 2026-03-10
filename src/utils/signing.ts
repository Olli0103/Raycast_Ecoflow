import crypto from "crypto";

export function generateSignature(
  params: Record<string, string>,
  accessKey: string,
  secretKey: string,
  nonce: string,
  timestamp: string,
): string {
  // Combine request params with auth params, then sort all together by key
  const allParams: Record<string, string> = {
    ...params,
    accessKey,
    nonce,
    timestamp,
  };
  const queryString = Object.keys(allParams)
    .sort()
    .map((key) => `${key}=${allParams[key]}`)
    .join("&");

  return crypto
    .createHmac("sha256", secretKey)
    .update(queryString)
    .digest("hex");
}

export function flattenParams(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(
        result,
        flattenParams(value as Record<string, unknown>, fullKey),
      );
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

export function generateNonce(): string {
  return String(Math.floor(Math.random() * 900000 + 100000));
}
