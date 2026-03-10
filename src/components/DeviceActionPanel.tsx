import { Action, ActionPanel, Alert, confirmAlert, Icon } from "@raycast/api";
import type { Device } from "../types/device";
import { getSupportedCommands } from "../utils/device-metadata";
import { sendDeviceCommand } from "../hooks/useDeviceCommand";
import { DeviceDetailPanel } from "./DeviceDetailPanel";

interface DeviceActionPanelProps {
  device: Device;
  onRefresh?: () => void;
}

export function DeviceActionPanel({
  device,
  onRefresh,
}: DeviceActionPanelProps) {
  const commands = getSupportedCommands(device.type);

  return (
    <ActionPanel>
      <ActionPanel.Section title="View">
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
        {onRefresh && (
          <Action
            title="Refresh"
            icon={Icon.ArrowClockwise}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
            onAction={onRefresh}
          />
        )}
      </ActionPanel.Section>

      {commands.length > 0 && device.online && (
        <ActionPanel.Section title="Controls">
          {commands
            .filter((cmd) => !cmd.needsValue)
            .map((cmd) => (
              <Action
                key={cmd.id}
                title={cmd.label}
                icon={cmd.icon}
                onAction={async () => {
                  if (
                    await confirmAlert({
                      title: cmd.label,
                      message: `${cmd.description} on ${device.name}?`,
                      primaryAction: {
                        title: "Confirm",
                        style: Alert.ActionStyle.Default,
                      },
                    })
                  ) {
                    await sendDeviceCommand(
                      device.serialNumber,
                      device.type,
                      cmd.id,
                      undefined,
                      onRefresh,
                    );
                  }
                }}
              />
            ))}
        </ActionPanel.Section>
      )}

      <ActionPanel.Section title="Copy">
        <Action.CopyToClipboard
          title="Copy Serial Number"
          content={device.serialNumber}
          shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}
