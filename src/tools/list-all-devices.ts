import { getClient } from "../api/client";
import { detectDeviceType } from "../utils/device-metadata";
import { getDeviceDisplayName } from "../utils/device-metadata";

export default async function tool() {
  const client = getClient();
  const apiDevices = await client.getDevices();

  const devices = await Promise.all(
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
        // Properties may not be available
      }

      return {
        name: apiDevice.deviceName || apiDevice.productName || apiDevice.sn,
        serialNumber: apiDevice.sn,
        type: getDeviceDisplayName(type),
        online: apiDevice.online === 1,
        batteryLevel,
        inputWatts,
        outputWatts,
      };
    }),
  );

  return devices;
}

function asNumber(val: unknown): number | undefined {
  if (val === undefined || val === null) return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}
