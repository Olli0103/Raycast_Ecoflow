import { useCachedPromise } from "@raycast/utils";
import { getClient } from "../api/client";
import {
  detectDeviceType,
  extractDeviceProperties,
} from "../utils/device-metadata";
import { DeviceType, type Device } from "../types/device";

export function useDevices() {
  return useCachedPromise(
    async () => {
      const client = getClient();
      const apiDevices = await client.getDevices();

      // Fetch device properties sequentially to avoid API rate limiting
      const devices: Device[] = [];
      for (const apiDevice of apiDevices) {
        const type = detectDeviceType(apiDevice.sn);
        const device: Device = {
          serialNumber: apiDevice.sn,
          name: apiDevice.deviceName || apiDevice.productName || apiDevice.sn,
          productName: apiDevice.productName,
          type,
          online: apiDevice.online === 1,
        };

        try {
          const rawData = await client.getDeviceProperties(apiDevice.sn);
          const props = extractDeviceProperties(type, rawData);

          if (type === DeviceType.SMART_PLUG) {
            device.plugSwitchState = props.plugSwitchState as
              | boolean
              | undefined;
            device.plugWatts = props.plugWatts as number | undefined;
          } else if (type === DeviceType.POWERSTREAM) {
            device.batteryLevel = props.batteryLevel as number | undefined;
            device.inputWatts = props.solarInputWatts as number | undefined;
            device.inverterOutputWatts = props.inverterOutputWatts as
              | number
              | undefined;
            device.outputWatts = props.totalOutputWatts as number | undefined;
          } else {
            device.batteryLevel = props.batteryLevel as number | undefined;
            device.inputWatts = props.totalInputWatts as number | undefined;
            device.outputWatts = props.totalOutputWatts as number | undefined;
          }
        } catch {
          // Device properties may not be available for all devices
        }

        devices.push(device);
      }

      return devices;
    },
    [],
    {
      keepPreviousData: true,
    },
  );
}
