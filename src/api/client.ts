import { getPreferenceValues } from "@raycast/api";
import { API_HOSTS, API_PATHS } from "../utils/constants";
import { flattenParams, generateNonce, generateSignature } from "../utils/signing";
import type { ExtensionPreferences } from "../types/preferences";
import type { ApiDevice, ApiDeviceQuota, ApiResponse } from "./types";

class EcoFlowClient {
  private accessKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    const prefs = getPreferenceValues<ExtensionPreferences>();
    this.accessKey = prefs.accessKey;
    this.secretKey = prefs.secretKey;
    this.baseUrl = API_HOSTS[prefs.region];
  }

  private async request<T>(
    method: "GET" | "PUT",
    path: string,
    params: Record<string, string> = {},
    rawBody?: Record<string, unknown>,
  ): Promise<T> {
    const nonce = generateNonce();
    const timestamp = String(Date.now());
    const sign = generateSignature(
      params,
      this.accessKey,
      this.secretKey,
      nonce,
      timestamp,
    );

    const headers: Record<string, string> = {
      accessKey: this.accessKey,
      nonce,
      timestamp,
      sign,
      "Content-Type": "application/json;charset=UTF-8",
    };

    let url = `${this.baseUrl}${path}`;
    const fetchOptions: {
      method: string;
      headers: Record<string, string>;
      body?: string;
    } = {
      method,
      headers,
    };

    if (method === "GET" && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
      url += `?${queryString}`;
    } else if (method === "PUT") {
      fetchOptions.body = JSON.stringify(rawBody ?? params);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Invalid API credentials. Please check your Access Key and Secret Key in the extension preferences.",
        );
      }
      throw new Error(
        `EcoFlow API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as ApiResponse<T>;

    if (data.code !== "0") {
      if (data.message?.toLowerCase().includes("accesskey")) {
        throw new Error(
          "Invalid API credentials. Please check your Access Key and Secret Key in the extension preferences.",
        );
      }
      throw new Error(
        `EcoFlow API error: ${data.message || "Unknown error"} (code: ${data.code})`,
      );
    }

    return data.data as T;
  }

  async getDevices(): Promise<ApiDevice[]> {
    return this.request<ApiDevice[]>("GET", API_PATHS.deviceList);
  }

  async getDeviceProperties(sn: string): Promise<ApiDeviceQuota> {
    return this.request<ApiDeviceQuota>("GET", API_PATHS.deviceQuotaAll, {
      sn,
    });
  }

  async setDeviceCommand(
    sn: string,
    command: Record<string, unknown>,
  ): Promise<void> {
    const body = { sn, ...command };
    const flat = flattenParams(body);
    await this.request<void>("PUT", API_PATHS.deviceSetCommand, flat, body);
  }
}

let clientInstance: EcoFlowClient | null = null;

export function getClient(): EcoFlowClient {
  if (!clientInstance) {
    clientInstance = new EcoFlowClient();
  }
  return clientInstance;
}
