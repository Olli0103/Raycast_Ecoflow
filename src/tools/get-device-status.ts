import { getClient } from "../api/client";
import {
  detectDeviceType,
  extractDeviceProperties,
  getDeviceDisplayName,
} from "../utils/device-metadata";
import { getChargingState } from "../types/device";
import { formatMinutes } from "../utils/formatters";

type Input = {
  /** The name or serial number of the EcoFlow device to check. Can be a partial name match (case-insensitive). */
  deviceIdentifier: string;
};

export default async function tool(input: Input) {
  const client = getClient();
  const apiDevices = await client.getDevices();

  // Find matching device by name (fuzzy) or serial number (exact)
  const identifier = input.deviceIdentifier.toLowerCase();
  const matchedDevice = apiDevices.find(
    (d) =>
      d.sn.toLowerCase() === identifier ||
      d.deviceName?.toLowerCase().includes(identifier) ||
      d.productName?.toLowerCase().includes(identifier),
  );

  if (!matchedDevice) {
    return {
      error: `No device found matching "${input.deviceIdentifier}". Available devices: ${apiDevices.map((d) => d.deviceName || d.sn).join(", ")}`,
    };
  }

  const type = detectDeviceType(matchedDevice.sn);
  const rawData = await client.getDeviceProperties(matchedDevice.sn);
  const extracted = extractDeviceProperties(type, rawData);

  const totalInput = extracted.totalInputWatts ?? 0;
  const totalOutput = extracted.totalOutputWatts ?? 0;
  const battery = extracted.batteryLevel ?? 0;

  return {
    name:
      matchedDevice.deviceName || matchedDevice.productName || matchedDevice.sn,
    serialNumber: matchedDevice.sn,
    type: getDeviceDisplayName(type),
    online: matchedDevice.online === 1,
    batteryLevel: extracted.batteryLevel,
    chargingState: getChargingState(totalInput, totalOutput, battery),
    totalInputWatts: extracted.totalInputWatts,
    totalOutputWatts: extracted.totalOutputWatts,
    solarInputWatts: extracted.solarInputWatts,
    acInputWatts: extracted.acInputWatts,
    acOutputWatts: extracted.acOutputWatts,
    dcOutputWatts: extracted.dcOutputWatts,
    acOutputEnabled: extracted.acOutputEnabled,
    dcOutputEnabled: extracted.dcOutputEnabled,
    remainingChargeTime: formatMinutes(extracted.remainingChargeMinutes),
    remainingDischargeTime: formatMinutes(extracted.remainingDischargeMinutes),
    maxChargeLevel: extracted.maxChargeLevel,
    minDischargeLevel: extracted.minDischargeLevel,
    temperature: extracted.temperature,
  };
}
