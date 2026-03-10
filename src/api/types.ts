export interface ApiResponse<T> {
  code: string;
  message: string;
  data?: T;
}

export interface ApiDevice {
  sn: string;
  online: number;
  deviceName: string;
  productName: string;
}

export type ApiDeviceQuota = Record<string, Record<string, unknown>>;
