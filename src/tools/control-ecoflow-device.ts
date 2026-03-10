import { Tool } from "@raycast/api";
import { getClient } from "../api/client";
import {
  detectDeviceType,
  getCommandPayload,
  getDeviceDisplayName,
  getSupportedCommands,
} from "../utils/device-metadata";

type Input = {
  /** The name or serial number of the EcoFlow device to control. Can be a partial name match (case-insensitive). */
  deviceIdentifier: string;
  /** The command to execute. Available commands: ac_on, ac_off, dc_on, dc_off, set_charge_limit, set_discharge_limit, plug_on, plug_off */
  command: string;
  /** Optional numeric value for commands that require it (e.g., charge limit percentage) */
  value?: string;
};

export const confirmation: Tool.Confirmation<Input> = async (input) => {
  const client = getClient();
  const apiDevices = await client.getDevices();

  const identifier = input.deviceIdentifier.toLowerCase();
  const matchedDevice = apiDevices.find(
    (d) =>
      d.sn.toLowerCase() === identifier ||
      d.deviceName?.toLowerCase().includes(identifier) ||
      d.productName?.toLowerCase().includes(identifier),
  );

  if (!matchedDevice) {
    return {
      message: `No device found matching "${input.deviceIdentifier}". Cannot proceed.`,
    };
  }

  const type = detectDeviceType(matchedDevice.sn);
  const commands = getSupportedCommands(type);
  const cmd = commands.find((c) => c.id === input.command);

  const deviceName =
    matchedDevice.deviceName || matchedDevice.productName || matchedDevice.sn;
  const commandLabel = cmd?.label ?? input.command;
  const valueStr = input.value ? ` with value ${input.value}` : "";

  return {
    message: `Are you sure you want to execute "${commandLabel}"${valueStr} on ${deviceName} (${getDeviceDisplayName(type)})?`,
  };
};

export default async function tool(input: Input) {
  const client = getClient();
  const apiDevices = await client.getDevices();

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
  const value = input.value ? Number(input.value) : undefined;

  try {
    const payload = getCommandPayload(type, input.command, value);
    await client.setDeviceCommand(matchedDevice.sn, payload);

    const deviceName =
      matchedDevice.deviceName || matchedDevice.productName || matchedDevice.sn;
    return {
      success: true,
      message: `Command "${input.command}" executed successfully on ${deviceName}.`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
