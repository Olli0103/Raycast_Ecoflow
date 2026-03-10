import crypto from "crypto";

export function generateSignature(
  params: Record<string, string>,
  accessKey: string,
  secretKey: string,
  nonce: string,
  timestamp: string,
): string {
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

export function generateNonce(): string {
  return String(Math.floor(Math.random() * 900000 + 100000));
}
