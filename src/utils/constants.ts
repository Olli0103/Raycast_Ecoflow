export const API_HOSTS = {
  us: "https://api-a.ecoflow.com",
  eu: "https://api-e.ecoflow.com",
} as const;

export const API_PATHS = {
  deviceList: "/iot-open/sign/device/list",
  deviceQuotaAll: "/iot-open/sign/device/quota/all",
  deviceQuota: "/iot-open/sign/device/quota",
  deviceSetCommand: "/iot-open/sign/device/quota",
} as const;

export const CACHE_DURATION_MS = 30_000;
export const REFRESH_INTERVAL_MS = 10_000;
