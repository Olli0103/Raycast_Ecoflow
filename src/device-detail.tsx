import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { useDevices } from "./hooks/useDevices";
import { DeviceDetailPanel } from "./components/DeviceDetailPanel";
import { getDeviceDisplayName, getDeviceIcon } from "./utils/device-metadata";
import { formatBatteryLevel } from "./utils/formatters";
import { getBatteryColor } from "./types/device";

interface DeviceDetailArgs {
  serialNumber?: string;
}

export default function DeviceDetailCommand(props: {
  arguments: DeviceDetailArgs;
}) {
  const serialNumber = props.arguments?.serialNumber;

  if (serialNumber) {
    return <DeviceDetailPanel serialNumber={serialNumber} />;
  }

  return <DevicePicker />;
}

function DevicePicker() {
  const { data: devices, isLoading } = useDevices();

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Select a device...">
      {devices?.map((device) => (
        <List.Item
          key={device.serialNumber}
          icon={getDeviceIcon(device.type)}
          title={device.name}
          subtitle={getDeviceDisplayName(device.type)}
          accessories={[
            ...(device.batteryLevel != null
              ? [
                  {
                    tag: {
                      value: formatBatteryLevel(device.batteryLevel),
                      color: getBatteryColor(device.batteryLevel),
                    },
                  },
                ]
              : []),
            {
              icon: device.online
                ? { source: Icon.CircleFilled, tintColor: "#34C759" }
                : { source: Icon.Circle, tintColor: "#8E8E93" },
            },
          ]}
          actions={
            <ActionPanel>
              <Action.Push
                title="View Details"
                icon={Icon.Eye}
                target={
                  <DeviceDetailPanel
                    serialNumber={device.serialNumber}
                    deviceName={device.name}
                  />
                }
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
