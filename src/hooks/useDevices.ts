import { useCachedPromise } from "@raycast/utils";
import { getClient } from "../api/client";
import { detectDeviceType } from "../utils/device-metadata";
import type { Device } from "../types/device";

export function useDevices() {
  return useCachedPromise(
    async () => {
      const client = getClient();
      const apiDevices = await client.getDevices();

      const devices: Device[] = await Promise.all(
        apiDevices.map(async (apiDevice) => {
          const type = detectDeviceType(apiDevice.sn);
          let batteryLevel: number | undefined;
          let inputWatts: number | undefined;
          let outputWatts: number | undefined;

          try {
            const props = await client.getDeviceProperties(apiDevice.sn);
            const pd = props["pd"] ?? props["20_1"] ?? {};
            const bms = props["bms_bmsStatus"] ?? props["2_1"] ?? {};
            batteryLevel = asNumber(pd["soc"] ?? bms["soc"]);
            inputWatts = asNumber(pd["wattsInSum"]);
            outputWatts = asNumber(pd["wattsOutSum"]);
          } catch {
            // Device properties may not be available for all devices
          }

          return {
            serialNumber: apiDevice.sn,
            name: apiDevice.deviceName || apiDevice.productName || apiDevice.sn,
            productName: apiDevice.productName,
            type,
            online: apiDevice.online === 1,
            batteryLevel,
            inputWatts,
            outputWatts,
          };
        }),
      );

      return devices;
    },
    [],
    {
      keepPreviousData: true,
    },
  );
}

function asNumber(val: unknown): number | undefined {
  if (val === undefined || val === null) return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}
