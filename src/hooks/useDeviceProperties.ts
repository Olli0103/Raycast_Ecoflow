import { useCachedPromise } from "@raycast/utils";
import { getClient } from "../api/client";
import {
  detectDeviceType,
  extractDeviceProperties,
} from "../utils/device-metadata";
import { getChargingState, type DeviceProperties } from "../types/device";

export function useDeviceProperties(serialNumber: string, deviceName?: string) {
  return useCachedPromise(
    async (sn: string) => {
      const client = getClient();
      const rawData = await client.getDeviceProperties(sn);
      const type = detectDeviceType(sn);
      const extracted = extractDeviceProperties(type, rawData);

      const totalInput = (extracted.totalInputWatts as number) ?? 0;
      const totalOutput = (extracted.totalOutputWatts as number) ?? 0;
      const battery = (extracted.batteryLevel as number) ?? 0;

      const properties: DeviceProperties = {
        serialNumber: sn,
        name: deviceName ?? sn,
        type,
        online: true,
        chargingState: getChargingState(totalInput, totalOutput, battery),
        rawData: rawData as Record<string, unknown>,
        // Spread all extracted properties
        ...Object.fromEntries(
          Object.entries(extracted).filter(([, v]) => v !== undefined),
        ),
      } as DeviceProperties;

      return properties;
    },
    [serialNumber],
    {
      keepPreviousData: true,
    },
  );
}
