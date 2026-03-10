import { Color, Icon, List } from "@raycast/api";
import type { Device } from "../types/device";
import { getBatteryColor, getChargingState } from "../types/device";
import { getDeviceDisplayName, getDeviceIcon } from "../utils/device-metadata";
import { formatBatteryLevel, formatWatts } from "../utils/formatters";
import { DeviceActionPanel } from "./DeviceActionPanel";

interface DeviceListItemProps {
  device: Device;
  onRefresh?: () => void;
}

export function DeviceListItem({ device, onRefresh }: DeviceListItemProps) {
  const typeName = getDeviceDisplayName(device.type);
  const icon = getDeviceIcon(device.type);

  const accessories: List.Item.Accessory[] = [];

  // Battery level tag
  if (device.batteryLevel != null) {
    accessories.push({
      tag: {
        value: formatBatteryLevel(device.batteryLevel),
        color: getBatteryColor(device.batteryLevel),
      },
    });
  }

  // Charging state
  if (device.inputWatts != null || device.outputWatts != null) {
    const state = getChargingState(
      device.inputWatts ?? 0,
      device.outputWatts ?? 0,
      device.batteryLevel ?? 0,
    );
    if (state === "Charging") {
      accessories.push({
        icon: { source: Icon.ArrowDown, tintColor: Color.Green },
        tooltip: `Input: ${formatWatts(device.inputWatts)}`,
      });
    } else if (state === "Discharging") {
      accessories.push({
        icon: { source: Icon.ArrowUp, tintColor: Color.Orange },
        tooltip: `Output: ${formatWatts(device.outputWatts)}`,
      });
    }
  }

  // Power values
  if (device.inputWatts != null && device.inputWatts > 0) {
    accessories.push({ text: `${formatWatts(device.inputWatts)} in` });
  }
  if (device.outputWatts != null && device.outputWatts > 0) {
    accessories.push({ text: `${formatWatts(device.outputWatts)} out` });
  }

  // Online/Offline indicator
  accessories.push({
    icon: device.online
      ? { source: Icon.CircleFilled, tintColor: Color.Green }
      : { source: Icon.Circle, tintColor: Color.SecondaryText },
    tooltip: device.online ? "Online" : "Offline",
  });

  return (
    <List.Item
      icon={icon}
      title={device.name}
      subtitle={typeName}
      accessories={accessories}
      actions={<DeviceActionPanel device={device} onRefresh={onRefresh} />}
    />
  );
}
