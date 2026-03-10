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

      const totalInput = extracted.totalInputWatts ?? 0;
      const totalOutput = extracted.totalOutputWatts ?? 0;
      const battery = extracted.batteryLevel ?? 0;

      const properties: DeviceProperties = {
        serialNumber: sn,
        name: deviceName ?? sn,
        type,
        online: true,
        batteryLevel: extracted.batteryLevel,
        totalInputWatts: extracted.totalInputWatts,
        totalOutputWatts: extracted.totalOutputWatts,
        solarInputWatts: extracted.solarInputWatts,
        acInputWatts: extracted.acInputWatts,
        acOutputWatts: extracted.acOutputWatts,
        dcOutputWatts: extracted.dcOutputWatts,
        usbOutputWatts: extracted.usbOutputWatts,
        acOutputEnabled: extracted.acOutputEnabled,
        dcOutputEnabled: extracted.dcOutputEnabled,
        chargingState: getChargingState(totalInput, totalOutput, battery),
        remainingChargeMinutes: extracted.remainingChargeMinutes,
        remainingDischargeMinutes: extracted.remainingDischargeMinutes,
        maxChargeLevel: extracted.maxChargeLevel,
        minDischargeLevel: extracted.minDischargeLevel,
        temperature: extracted.temperature,
        cycleCount: extracted.cycleCount,
        rawData: rawData as Record<string, unknown>,
      };

      return properties;
    },
    [serialNumber],
    {
      keepPreviousData: true,
    },
  );
}
