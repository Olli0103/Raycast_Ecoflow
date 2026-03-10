import { Color, Detail, Icon } from "@raycast/api";
import type { DeviceProperties } from "../types/device";
import { getBatteryColor } from "../types/device";
import { getDeviceDisplayName } from "../utils/device-metadata";
import {
  formatBatteryLevel,
  formatMinutes,
  formatTemperature,
  formatWatts,
} from "../utils/formatters";

export function DeviceDetailView({
  properties,
}: {
  properties: DeviceProperties;
}) {
  const batteryColor =
    properties.batteryLevel != null
      ? getBatteryColor(properties.batteryLevel)
      : Color.SecondaryText;

  const markdown = `# ${properties.name}\n\n**${getDeviceDisplayName(properties.type)}** — ${properties.online ? "Online" : "Offline"}\n\n---\n\n${
    properties.batteryLevel != null
      ? `## Battery: ${formatBatteryLevel(properties.batteryLevel)}\n\n`
      : ""
  }${
    properties.totalInputWatts != null || properties.totalOutputWatts != null
      ? `**Input:** ${formatWatts(properties.totalInputWatts)} | **Output:** ${formatWatts(properties.totalOutputWatts)}`
      : ""
  }`;

  return (
    <Detail
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Status"
            icon={properties.online ? Icon.CircleFilled : Icon.Circle}
            text={properties.online ? "Online" : "Offline"}
          />
          {properties.chargingState && (
            <Detail.Metadata.TagList title="Charging State">
              <Detail.Metadata.TagList.Item
                text={properties.chargingState}
                color={
                  properties.chargingState === "Charging"
                    ? Color.Green
                    : properties.chargingState === "Discharging"
                      ? Color.Orange
                      : properties.chargingState === "Full"
                        ? Color.Blue
                        : Color.SecondaryText
                }
              />
            </Detail.Metadata.TagList>
          )}

          <Detail.Metadata.Separator />

          {properties.batteryLevel != null && (
            <Detail.Metadata.TagList title="Battery Level">
              <Detail.Metadata.TagList.Item
                text={formatBatteryLevel(properties.batteryLevel)}
                color={batteryColor}
              />
            </Detail.Metadata.TagList>
          )}
          {properties.cycleCount != null && (
            <Detail.Metadata.Label
              title="Cycle Count"
              text={String(properties.cycleCount)}
            />
          )}
          {properties.maxChargeLevel != null && (
            <Detail.Metadata.Label
              title="Charge Limit"
              text={`${properties.maxChargeLevel}%`}
            />
          )}
          {properties.minDischargeLevel != null && (
            <Detail.Metadata.Label
              title="Discharge Limit"
              text={`${properties.minDischargeLevel}%`}
            />
          )}

          <Detail.Metadata.Separator />

          {properties.totalInputWatts != null && (
            <Detail.Metadata.Label
              title="Total Input"
              text={formatWatts(properties.totalInputWatts)}
              icon={Icon.ArrowDown}
            />
          )}
          {properties.solarInputWatts != null && (
            <Detail.Metadata.Label
              title="Solar Input"
              text={formatWatts(properties.solarInputWatts)}
              icon={Icon.Sun}
            />
          )}
          {properties.acInputWatts != null && (
            <Detail.Metadata.Label
              title="AC Input"
              text={formatWatts(properties.acInputWatts)}
              icon={Icon.Bolt}
            />
          )}

          <Detail.Metadata.Separator />

          {properties.totalOutputWatts != null && (
            <Detail.Metadata.Label
              title="Total Output"
              text={formatWatts(properties.totalOutputWatts)}
              icon={Icon.ArrowUp}
            />
          )}
          {properties.acOutputWatts != null && (
            <Detail.Metadata.Label
              title="AC Output"
              text={formatWatts(properties.acOutputWatts)}
              icon={Icon.Bolt}
            />
          )}
          {properties.dcOutputWatts != null && (
            <Detail.Metadata.Label
              title="DC Output"
              text={formatWatts(properties.dcOutputWatts)}
              icon={Icon.Bolt}
            />
          )}
          {properties.usbOutputWatts != null && (
            <Detail.Metadata.Label
              title="USB Output"
              text={formatWatts(properties.usbOutputWatts)}
              icon={Icon.Bolt}
            />
          )}

          {(properties.acOutputEnabled != null ||
            properties.dcOutputEnabled != null) && (
            <Detail.Metadata.Separator />
          )}
          {properties.acOutputEnabled != null && (
            <Detail.Metadata.TagList title="AC Output">
              <Detail.Metadata.TagList.Item
                text={properties.acOutputEnabled ? "On" : "Off"}
                color={
                  properties.acOutputEnabled ? Color.Green : Color.SecondaryText
                }
              />
            </Detail.Metadata.TagList>
          )}
          {properties.dcOutputEnabled != null && (
            <Detail.Metadata.TagList title="DC Output">
              <Detail.Metadata.TagList.Item
                text={properties.dcOutputEnabled ? "On" : "Off"}
                color={
                  properties.dcOutputEnabled ? Color.Green : Color.SecondaryText
                }
              />
            </Detail.Metadata.TagList>
          )}

          <Detail.Metadata.Separator />

          {properties.remainingChargeMinutes != null &&
            properties.remainingChargeMinutes > 0 && (
              <Detail.Metadata.Label
                title="Time to Full"
                text={formatMinutes(properties.remainingChargeMinutes)}
                icon={Icon.Clock}
              />
            )}
          {properties.remainingDischargeMinutes != null &&
            properties.remainingDischargeMinutes > 0 && (
              <Detail.Metadata.Label
                title="Time Remaining"
                text={formatMinutes(properties.remainingDischargeMinutes)}
                icon={Icon.Clock}
              />
            )}
          {properties.temperature != null && (
            <Detail.Metadata.Label
              title="Temperature"
              text={formatTemperature(properties.temperature)}
              icon={Icon.Temperature}
            />
          )}

          <Detail.Metadata.Separator />
          <Detail.Metadata.Label
            title="Serial Number"
            text={properties.serialNumber}
          />
          <Detail.Metadata.Label
            title="Device Type"
            text={getDeviceDisplayName(properties.type)}
          />
        </Detail.Metadata>
      }
    />
  );
}
