import {
  Action,
  ActionPanel,
  Alert,
  confirmAlert,
  Form,
  Icon,
  List,
  useNavigation,
} from "@raycast/api";
import { useState } from "react";
import { useDevices } from "./hooks/useDevices";
import { sendDeviceCommand } from "./hooks/useDeviceCommand";
import {
  getDeviceDisplayName,
  getDeviceIcon,
  getSupportedCommands,
  type DeviceCommand,
} from "./utils/device-metadata";
import { formatBatteryLevel } from "./utils/formatters";
import { getBatteryColor, type Device } from "./types/device";

export default function ControlDeviceCommand() {
  const { data: devices, isLoading } = useDevices();
  const { push } = useNavigation();

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Select a device to control..."
    >
      {devices
        ?.filter((d) => d.online)
        .map((device) => {
          const commands = getSupportedCommands(device.type);
          return (
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
                { text: `${commands.length} commands` },
              ]}
              actions={
                <ActionPanel>
                  <Action
                    title="Select Device"
                    icon={Icon.ChevronRight}
                    onAction={() => push(<CommandList device={device} />)}
                  />
                </ActionPanel>
              }
            />
          );
        })}

      {devices &&
        devices.filter((d) => d.online).length === 0 &&
        !isLoading && (
          <List.EmptyView
            icon={Icon.XMarkCircle}
            title="No Online Devices"
            description="All your EcoFlow devices are currently offline."
          />
        )}
    </List>
  );
}

function CommandList({ device }: { device: Device }) {
  const commands = getSupportedCommands(device.type);
  const { push } = useNavigation();

  return (
    <List searchBarPlaceholder={`Commands for ${device.name}...`}>
      {commands.map((cmd) => (
        <List.Item
          key={cmd.id}
          icon={cmd.icon}
          title={cmd.label}
          subtitle={cmd.description}
          actions={
            <ActionPanel>
              {cmd.needsValue ? (
                <Action
                  title="Configure & Send"
                  icon={Icon.Gear}
                  onAction={() =>
                    push(<CommandForm device={device} command={cmd} />)
                  }
                />
              ) : (
                <Action
                  title="Send Command"
                  icon={Icon.Play}
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
                      );
                    }
                  }}
                />
              )}
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function CommandForm({
  device,
  command,
}: {
  device: Device;
  command: DeviceCommand;
}) {
  const [value, setValue] = useState(String(command.valueMin ?? 0));
  const { pop } = useNavigation();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Send Command"
            icon={Icon.Play}
            onSubmit={async (values) => {
              const numValue = Number(values.value);
              if (
                isNaN(numValue) ||
                (command.valueMin != null && numValue < command.valueMin) ||
                (command.valueMax != null && numValue > command.valueMax)
              ) {
                return;
              }
              await sendDeviceCommand(
                device.serialNumber,
                device.type,
                command.id,
                numValue,
              );
              pop();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Description title="Device" text={device.name} />
      <Form.Description title="Command" text={command.label} />
      <Form.TextField
        id="value"
        title={command.valueLabel ?? "Value"}
        placeholder={command.valuePlaceholder ?? "Enter value"}
        value={value}
        onChange={setValue}
      />
      {command.valueMin != null && command.valueMax != null && (
        <Form.Description
          text={`Valid range: ${command.valueMin} — ${command.valueMax}`}
        />
      )}
    </Form>
  );
}
