import { Color, Detail, Icon } from "@raycast/api";
import { DeviceType, type DeviceProperties } from "../types/device";
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
  const isSmartPlug = properties.type === DeviceType.SMART_PLUG;
  const isPowerStream = properties.type === DeviceType.POWERSTREAM;
  const isGlacier = properties.type === DeviceType.GLACIER;
  const isWave2 = properties.type === DeviceType.WAVE_2;

  const markdown = buildMarkdown(properties);

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

          {isSmartPlug && <SmartPlugMetadata properties={properties} />}
          {isPowerStream && <PowerStreamMetadata properties={properties} />}
          {isGlacier && <GlacierMetadata properties={properties} />}
          {isWave2 && <Wave2Metadata properties={properties} />}
          {!isSmartPlug && !isPowerStream && !isGlacier && !isWave2 && (
            <PowerStationMetadata properties={properties} />
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

function buildMarkdown(p: DeviceProperties): string {
  const header = `# ${p.name}\n\n**${getDeviceDisplayName(p.type)}** — ${p.online ? "Online" : "Offline"}\n\n---\n\n`;

  if (p.type === DeviceType.SMART_PLUG) {
    const stateText =
      p.plugSwitchState != null
        ? p.plugSwitchState
          ? "**On**"
          : "**Off**"
        : "";
    const powerText =
      p.plugWatts != null ? `Power: ${formatWatts(p.plugWatts)}` : "";
    return header + [stateText, powerText].filter(Boolean).join(" | ");
  }

  if (p.type === DeviceType.POWERSTREAM) {
    const parts = [];
    if (p.pv1InputWatts != null || p.pv2InputWatts != null) {
      parts.push(
        `**Solar:** PV1 ${formatWatts(p.pv1InputWatts)} | PV2 ${formatWatts(p.pv2InputWatts)}`,
      );
    }
    if (p.inverterOutputWatts != null) {
      parts.push(`**Inverter Output:** ${formatWatts(p.inverterOutputWatts)}`);
    }
    return header + parts.join("\n\n");
  }

  if (p.type === DeviceType.GLACIER) {
    const parts = [];
    if (p.rightTemp != null)
      parts.push(`**Right Zone:** ${formatTemperature(p.rightTemp)}`);
    if (p.leftTemp != null)
      parts.push(`**Left Zone:** ${formatTemperature(p.leftTemp)}`);
    return header + parts.join(" | ");
  }

  // Power station / default
  const parts = [];
  if (p.batteryLevel != null) {
    parts.push(`## Battery: ${formatBatteryLevel(p.batteryLevel)}`);
  }
  if (p.totalInputWatts != null || p.totalOutputWatts != null) {
    parts.push(
      `**Input:** ${formatWatts(p.totalInputWatts)} | **Output:** ${formatWatts(p.totalOutputWatts)}`,
    );
  }
  return header + parts.join("\n\n");
}

function SmartPlugMetadata({
  properties: p,
}: {
  properties: DeviceProperties;
}) {
  return (
    <>
      <Detail.Metadata.Separator />

      {p.plugSwitchState != null && (
        <Detail.Metadata.TagList title="Switch">
          <Detail.Metadata.TagList.Item
            text={p.plugSwitchState ? "On" : "Off"}
            color={p.plugSwitchState ? Color.Green : Color.SecondaryText}
          />
        </Detail.Metadata.TagList>
      )}
      {p.plugWatts != null && (
        <Detail.Metadata.Label
          title="Power"
          text={formatWatts(p.plugWatts)}
          icon={Icon.Bolt}
        />
      )}
      {p.plugVoltage != null && (
        <Detail.Metadata.Label
          title="Voltage"
          text={`${Math.round(p.plugVoltage)} V`}
          icon={Icon.Bolt}
        />
      )}
      {p.plugCurrent != null && (
        <Detail.Metadata.Label
          title="Current"
          text={`${p.plugCurrent.toFixed(1)} A`}
          icon={Icon.Bolt}
        />
      )}

      <Detail.Metadata.Separator />

      {p.temperature != null && (
        <Detail.Metadata.Label
          title="Temperature"
          text={formatTemperature(p.temperature)}
          icon={Icon.Temperature}
        />
      )}
      {p.plugBrightness != null && (
        <Detail.Metadata.Label
          title="LED Brightness"
          text={String(p.plugBrightness)}
          icon={Icon.LightBulb}
        />
      )}
    </>
  );
}

function PowerStreamMetadata({
  properties: p,
}: {
  properties: DeviceProperties;
}) {
  const batteryColor =
    p.batteryLevel != null
      ? getBatteryColor(p.batteryLevel)
      : Color.SecondaryText;

  return (
    <>
      <Detail.Metadata.Separator />

      {p.batteryLevel != null && (
        <Detail.Metadata.TagList title="Battery Level">
          <Detail.Metadata.TagList.Item
            text={formatBatteryLevel(p.batteryLevel)}
            color={batteryColor}
          />
        </Detail.Metadata.TagList>
      )}

      <Detail.Metadata.Separator />

      {p.pv1InputWatts != null && (
        <Detail.Metadata.Label
          title="PV1 Solar Input"
          text={formatWatts(p.pv1InputWatts)}
          icon={Icon.Sun}
        />
      )}
      {p.pv2InputWatts != null && (
        <Detail.Metadata.Label
          title="PV2 Solar Input"
          text={formatWatts(p.pv2InputWatts)}
          icon={Icon.Sun}
        />
      )}
      {p.solarInputWatts != null && (
        <Detail.Metadata.Label
          title="Total Solar Input"
          text={formatWatts(p.solarInputWatts)}
          icon={Icon.Sun}
        />
      )}

      <Detail.Metadata.Separator />

      {p.inverterOutputWatts != null && (
        <Detail.Metadata.Label
          title="Inverter Output"
          text={formatWatts(p.inverterOutputWatts)}
          icon={Icon.ArrowUp}
        />
      )}
      {p.customLoadPower != null && (
        <Detail.Metadata.Label
          title="Custom Load Power"
          text={formatWatts(p.customLoadPower)}
          icon={Icon.Gauge}
        />
      )}
      {p.supplyPriority != null && (
        <Detail.Metadata.Label
          title="Supply Priority"
          text={p.supplyPriority === 0 ? "Power Supply" : "Battery Charging"}
          icon={Icon.ArrowsContract}
        />
      )}
    </>
  );
}

function GlacierMetadata({ properties: p }: { properties: DeviceProperties }) {
  const batteryColor =
    p.batteryLevel != null
      ? getBatteryColor(p.batteryLevel)
      : Color.SecondaryText;

  return (
    <>
      <Detail.Metadata.Separator />

      {p.batteryLevel != null && (
        <Detail.Metadata.TagList title="Battery Level">
          <Detail.Metadata.TagList.Item
            text={formatBatteryLevel(p.batteryLevel)}
            color={batteryColor}
          />
        </Detail.Metadata.TagList>
      )}

      <Detail.Metadata.Separator />

      {p.rightTemp != null && (
        <Detail.Metadata.Label
          title="Right Zone"
          text={formatTemperature(p.rightTemp)}
          icon={Icon.Temperature}
        />
      )}
      {p.leftTemp != null && (
        <Detail.Metadata.Label
          title="Left Zone"
          text={formatTemperature(p.leftTemp)}
          icon={Icon.Temperature}
        />
      )}

      <Detail.Metadata.Separator />

      {p.iceMaking != null && (
        <Detail.Metadata.TagList title="Ice Making">
          <Detail.Metadata.TagList.Item
            text={p.iceMaking ? "Active" : "Off"}
            color={p.iceMaking ? Color.Blue : Color.SecondaryText}
          />
        </Detail.Metadata.TagList>
      )}
      {p.ecoMode != null && (
        <Detail.Metadata.TagList title="Eco Mode">
          <Detail.Metadata.TagList.Item
            text={p.ecoMode ? "On" : "Off"}
            color={p.ecoMode ? Color.Green : Color.SecondaryText}
          />
        </Detail.Metadata.TagList>
      )}
    </>
  );
}

function Wave2Metadata({ properties: p }: { properties: DeviceProperties }) {
  const modeNames: Record<number, string> = { 0: "Cool", 1: "Heat", 2: "Fan" };
  const batteryColor =
    p.batteryLevel != null
      ? getBatteryColor(p.batteryLevel)
      : Color.SecondaryText;

  return (
    <>
      <Detail.Metadata.Separator />

      {p.batteryLevel != null && (
        <Detail.Metadata.TagList title="Battery Level">
          <Detail.Metadata.TagList.Item
            text={formatBatteryLevel(p.batteryLevel)}
            color={batteryColor}
          />
        </Detail.Metadata.TagList>
      )}

      <Detail.Metadata.Separator />

      {p.mainMode != null && (
        <Detail.Metadata.Label
          title="Mode"
          text={modeNames[p.mainMode] ?? String(p.mainMode)}
          icon={Icon.Temperature}
        />
      )}
      {p.setTemperature != null && (
        <Detail.Metadata.Label
          title="Target Temperature"
          text={formatTemperature(p.setTemperature)}
          icon={Icon.Temperature}
        />
      )}
      {p.temperature != null && (
        <Detail.Metadata.Label
          title="Environment Temperature"
          text={formatTemperature(p.temperature)}
          icon={Icon.Temperature}
        />
      )}
      {p.fanSpeed != null && (
        <Detail.Metadata.Label
          title="Fan Speed"
          text={String(p.fanSpeed)}
          icon={Icon.Gauge}
        />
      )}
    </>
  );
}

function PowerStationMetadata({
  properties: p,
}: {
  properties: DeviceProperties;
}) {
  const batteryColor =
    p.batteryLevel != null
      ? getBatteryColor(p.batteryLevel)
      : Color.SecondaryText;

  return (
    <>
      <Detail.Metadata.Separator />

      {p.batteryLevel != null && (
        <Detail.Metadata.TagList title="Battery Level">
          <Detail.Metadata.TagList.Item
            text={formatBatteryLevel(p.batteryLevel)}
            color={batteryColor}
          />
        </Detail.Metadata.TagList>
      )}
      {p.cycleCount != null && (
        <Detail.Metadata.Label
          title="Cycle Count"
          text={String(p.cycleCount)}
        />
      )}
      {p.maxChargeLevel != null && (
        <Detail.Metadata.Label
          title="Charge Limit"
          text={`${p.maxChargeLevel}%`}
        />
      )}
      {p.minDischargeLevel != null && (
        <Detail.Metadata.Label
          title="Discharge Limit"
          text={`${p.minDischargeLevel}%`}
        />
      )}

      <Detail.Metadata.Separator />

      {p.totalInputWatts != null && (
        <Detail.Metadata.Label
          title="Total Input"
          text={formatWatts(p.totalInputWatts)}
          icon={Icon.ArrowDown}
        />
      )}
      {p.solarInputWatts != null && (
        <Detail.Metadata.Label
          title="Solar Input"
          text={formatWatts(p.solarInputWatts)}
          icon={Icon.Sun}
        />
      )}
      {p.acInputWatts != null && (
        <Detail.Metadata.Label
          title="AC Input"
          text={formatWatts(p.acInputWatts)}
          icon={Icon.Bolt}
        />
      )}

      <Detail.Metadata.Separator />

      {p.totalOutputWatts != null && (
        <Detail.Metadata.Label
          title="Total Output"
          text={formatWatts(p.totalOutputWatts)}
          icon={Icon.ArrowUp}
        />
      )}
      {p.acOutputWatts != null && (
        <Detail.Metadata.Label
          title="AC Output"
          text={formatWatts(p.acOutputWatts)}
          icon={Icon.Bolt}
        />
      )}
      {p.dcOutputWatts != null && (
        <Detail.Metadata.Label
          title="DC Output"
          text={formatWatts(p.dcOutputWatts)}
          icon={Icon.Bolt}
        />
      )}
      {p.usbOutputWatts != null && (
        <Detail.Metadata.Label
          title="USB Output"
          text={formatWatts(p.usbOutputWatts)}
          icon={Icon.Bolt}
        />
      )}

      {(p.acOutputEnabled != null || p.dcOutputEnabled != null) && (
        <Detail.Metadata.Separator />
      )}
      {p.acOutputEnabled != null && (
        <Detail.Metadata.TagList title="AC Output">
          <Detail.Metadata.TagList.Item
            text={p.acOutputEnabled ? "On" : "Off"}
            color={p.acOutputEnabled ? Color.Green : Color.SecondaryText}
          />
        </Detail.Metadata.TagList>
      )}
      {p.dcOutputEnabled != null && (
        <Detail.Metadata.TagList title="DC Output">
          <Detail.Metadata.TagList.Item
            text={p.dcOutputEnabled ? "On" : "Off"}
            color={p.dcOutputEnabled ? Color.Green : Color.SecondaryText}
          />
        </Detail.Metadata.TagList>
      )}

      <Detail.Metadata.Separator />

      {p.remainingChargeMinutes != null && p.remainingChargeMinutes > 0 && (
        <Detail.Metadata.Label
          title="Time to Full"
          text={formatMinutes(p.remainingChargeMinutes)}
          icon={Icon.Clock}
        />
      )}
      {p.remainingDischargeMinutes != null &&
        p.remainingDischargeMinutes > 0 && (
          <Detail.Metadata.Label
            title="Time Remaining"
            text={formatMinutes(p.remainingDischargeMinutes)}
            icon={Icon.Clock}
          />
        )}
      {p.temperature != null && (
        <Detail.Metadata.Label
          title="Temperature"
          text={formatTemperature(p.temperature)}
          icon={Icon.Temperature}
        />
      )}
    </>
  );
}
