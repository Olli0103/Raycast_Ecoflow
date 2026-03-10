import { showToast, Toast } from "@raycast/api";
import { getClient } from "../api/client";
import { getCommandPayload } from "../utils/device-metadata";
import type { DeviceType } from "../types/device";

export async function sendDeviceCommand(
  serialNumber: string,
  deviceType: DeviceType,
  commandId: string,
  value?: number,
  onSuccess?: () => void,
) {
  const toast = await showToast({
    style: Toast.Style.Animated,
    title: "Sending command...",
  });

  try {
    const payload = getCommandPayload(deviceType, commandId, value);
    const client = getClient();
    await client.setDeviceCommand(serialNumber, payload);

    toast.style = Toast.Style.Success;
    toast.title = "Command sent successfully";

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    toast.style = Toast.Style.Failure;
    toast.title = "Command failed";
    toast.message = error instanceof Error ? error.message : "Unknown error";
  }
}
