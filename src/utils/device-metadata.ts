import { Icon } from "@raycast/api";
import { DeviceType } from "../types/device";

// Serial number prefix to device type mapping
// Based on known EcoFlow SN prefixes
const SN_PREFIX_MAP: Record<string, DeviceType> = {
  DCAB: DeviceType.DELTA_PRO,
  DCBP: DeviceType.DELTA_PRO_ULTRA,
  R331: DeviceType.DELTA_2,
  R351: DeviceType.DELTA_2_MAX,
  DAEB: DeviceType.DELTA_MAX,
  DAAB: DeviceType.DELTA_MINI,
  R611: DeviceType.RIVER_2,
  R631: DeviceType.RIVER_2_MAX,
  R621: DeviceType.RIVER_2_PRO,
  EFAB: DeviceType.RIVER_PRO,
  HW51: DeviceType.POWERSTREAM,
  SP10: DeviceType.SMART_HOME_PANEL,
  SP20: DeviceType.SMART_HOME_PANEL_2,
  HW52: DeviceType.SMART_PLUG,
  KT10: DeviceType.WAVE_2,
  BX11: DeviceType.GLACIER,
};

export function detectDeviceType(sn: string): DeviceType {
  const prefix = sn.substring(0, 4).toUpperCase();
  return SN_PREFIX_MAP[prefix] ?? DeviceType.UNKNOWN;
}

export function getDeviceIcon(type: DeviceType): Icon {
  switch (type) {
    case DeviceType.DELTA_PRO:
    case DeviceType.DELTA_PRO_ULTRA:
    case DeviceType.DELTA_2:
    case DeviceType.DELTA_2_MAX:
    case DeviceType.DELTA_MAX:
    case DeviceType.DELTA_MINI:
      return Icon.Battery;
    case DeviceType.RIVER_2:
    case DeviceType.RIVER_2_MAX:
    case DeviceType.RIVER_2_PRO:
    case DeviceType.RIVER_PRO:
      return Icon.Battery;
    case DeviceType.POWERSTREAM:
      return Icon.Sun;
    case DeviceType.SMART_HOME_PANEL:
    case DeviceType.SMART_HOME_PANEL_2:
      return Icon.House;
    case DeviceType.SMART_PLUG:
      return Icon.Plug;
    case DeviceType.WAVE_2:
      return Icon.Temperature;
    case DeviceType.GLACIER:
      return Icon.Snowflake;
    default:
      return Icon.ComputerChip;
  }
}

export function getDeviceDisplayName(type: DeviceType): string {
  const names: Record<DeviceType, string> = {
    [DeviceType.DELTA_PRO]: "Delta Pro",
    [DeviceType.DELTA_PRO_ULTRA]: "Delta Pro Ultra",
    [DeviceType.DELTA_2]: "Delta 2",
    [DeviceType.DELTA_2_MAX]: "Delta 2 Max",
    [DeviceType.DELTA_MAX]: "Delta Max",
    [DeviceType.DELTA_MINI]: "Delta Mini",
    [DeviceType.RIVER_2]: "River 2",
    [DeviceType.RIVER_2_MAX]: "River 2 Max",
    [DeviceType.RIVER_2_PRO]: "River 2 Pro",
    [DeviceType.RIVER_PRO]: "River Pro",
    [DeviceType.POWERSTREAM]: "PowerStream",
    [DeviceType.SMART_HOME_PANEL]: "Smart Home Panel",
    [DeviceType.SMART_HOME_PANEL_2]: "Smart Home Panel 2",
    [DeviceType.SMART_PLUG]: "Smart Plug",
    [DeviceType.WAVE_2]: "Wave 2",
    [DeviceType.GLACIER]: "Glacier",
    [DeviceType.UNKNOWN]: "Unknown Device",
  };
  return names[type];
}

export interface DeviceCommand {
  id: string;
  label: string;
  description: string;
  icon: Icon;
  needsValue?: boolean;
  valueLabel?: string;
  valuePlaceholder?: string;
  valueMin?: number;
  valueMax?: number;
}

function powerStationCommands(): DeviceCommand[] {
  return [
    {
      id: "ac_on",
      label: "Turn AC Output On",
      description: "Enable AC power output",
      icon: Icon.Bolt,
    },
    {
      id: "ac_off",
      label: "Turn AC Output Off",
      description: "Disable AC power output",
      icon: Icon.BoltDisabled,
    },
    {
      id: "dc_on",
      label: "Turn DC Output On",
      description: "Enable 12V DC power output",
      icon: Icon.Bolt,
    },
    {
      id: "dc_off",
      label: "Turn DC Output Off",
      description: "Disable 12V DC power output",
      icon: Icon.BoltDisabled,
    },
    {
      id: "set_charge_limit",
      label: "Set Charge Limit",
      description: "Set maximum battery charge level",
      icon: Icon.BatteryCharging,
      needsValue: true,
      valueLabel: "Charge Limit (%)",
      valuePlaceholder: "50-100",
      valueMin: 50,
      valueMax: 100,
    },
    {
      id: "set_discharge_limit",
      label: "Set Discharge Limit",
      description: "Set minimum battery discharge level",
      icon: Icon.Battery,
      needsValue: true,
      valueLabel: "Discharge Limit (%)",
      valuePlaceholder: "0-30",
      valueMin: 0,
      valueMax: 30,
    },
  ];
}

export function getSupportedCommands(type: DeviceType): DeviceCommand[] {
  switch (type) {
    case DeviceType.DELTA_PRO:
    case DeviceType.DELTA_PRO_ULTRA:
    case DeviceType.DELTA_2:
    case DeviceType.DELTA_2_MAX:
    case DeviceType.DELTA_MAX:
    case DeviceType.DELTA_MINI:
    case DeviceType.RIVER_2:
    case DeviceType.RIVER_2_MAX:
    case DeviceType.RIVER_2_PRO:
    case DeviceType.RIVER_PRO:
      return powerStationCommands();
    case DeviceType.SMART_PLUG:
      return [
        {
          id: "plug_on",
          label: "Turn On",
          description: "Turn the smart plug on",
          icon: Icon.Plug,
        },
        {
          id: "plug_off",
          label: "Turn Off",
          description: "Turn the smart plug off",
          icon: Icon.XMarkCircle,
        },
      ];
    case DeviceType.POWERSTREAM:
      return [
        {
          id: "set_supply_priority",
          label: "Set Supply Priority",
          description:
            "Set power supply priority (0=prioritize power supply, 1=prioritize battery charging)",
          icon: Icon.ArrowsContract,
          needsValue: true,
          valueLabel: "Priority (0 or 1)",
          valuePlaceholder: "0",
          valueMin: 0,
          valueMax: 1,
        },
      ];
    default:
      return [];
  }
}

// Map command IDs to API command payloads
export function getCommandPayload(
  type: DeviceType,
  commandId: string,
  value?: number,
): Record<string, unknown> {
  // Power station commands (Delta/River series)
  if (
    [
      DeviceType.DELTA_PRO,
      DeviceType.DELTA_PRO_ULTRA,
      DeviceType.DELTA_2,
      DeviceType.DELTA_2_MAX,
      DeviceType.DELTA_MAX,
      DeviceType.DELTA_MINI,
      DeviceType.RIVER_2,
      DeviceType.RIVER_2_MAX,
      DeviceType.RIVER_2_PRO,
      DeviceType.RIVER_PRO,
    ].includes(type)
  ) {
    switch (commandId) {
      case "ac_on":
        return { cmdSet: 32, id: 66, enabled: 1 };
      case "ac_off":
        return { cmdSet: 32, id: 66, enabled: 0 };
      case "dc_on":
        return { cmdSet: 32, id: 69, enabled: 1 };
      case "dc_off":
        return { cmdSet: 32, id: 69, enabled: 0 };
      case "set_charge_limit":
        return { cmdSet: 32, id: 49, maxChgSoc: value ?? 100 };
      case "set_discharge_limit":
        return { cmdSet: 32, id: 51, minDsgSoc: value ?? 0 };
    }
  }

  if (type === DeviceType.SMART_PLUG) {
    switch (commandId) {
      case "plug_on":
        return { cmdSet: 11, id: 24, enabled: 1 };
      case "plug_off":
        return { cmdSet: 11, id: 24, enabled: 0 };
    }
  }

  if (type === DeviceType.POWERSTREAM) {
    if (commandId === "set_supply_priority") {
      return { cmdSet: 11, id: 52, supplyPriority: value ?? 0 };
    }
  }

  throw new Error(`Unknown command ${commandId} for device type ${type}`);
}

// Extract common properties from raw API quota data
export function extractDeviceProperties(
  type: DeviceType,
  rawData: Record<string, Record<string, unknown>>,
): Partial<{
  batteryLevel: number;
  totalInputWatts: number;
  totalOutputWatts: number;
  solarInputWatts: number;
  acInputWatts: number;
  acOutputWatts: number;
  dcOutputWatts: number;
  usbOutputWatts: number;
  acOutputEnabled: boolean;
  dcOutputEnabled: boolean;
  remainingChargeMinutes: number;
  remainingDischargeMinutes: number;
  maxChargeLevel: number;
  minDischargeLevel: number;
  temperature: number;
  cycleCount: number;
}> {
  // Try common EcoFlow data structures
  const pd = rawData["pd"] ?? rawData["20_1"] ?? {};
  const bms = rawData["bms_bmsStatus"] ?? rawData["2_1"] ?? {};
  const inv = rawData["inv"] ?? rawData["3_1"] ?? {};
  const mppt = rawData["mppt"] ?? rawData["5_1"] ?? {};

  return {
    batteryLevel: asNumber(
      (pd["soc"] ?? bms["soc"] ?? pd["wattsInSum"] != null)
        ? asNumber(bms["soc"])
        : undefined,
    ),
    totalInputWatts: asNumber(pd["wattsInSum"]),
    totalOutputWatts: asNumber(pd["wattsOutSum"]),
    solarInputWatts: asNumber(mppt["inWatts"] ?? pd["mpptInWatts"]),
    acInputWatts: asNumber(inv["inputWatts"] ?? pd["acInWatts"]),
    acOutputWatts: asNumber(inv["outputWatts"] ?? pd["acOutWatts"]),
    dcOutputWatts: asNumber(pd["carWatts"] ?? pd["dcOutWatts"]),
    usbOutputWatts: asNumber(pd["typecWatts"] ?? pd["usbWatts"]),
    acOutputEnabled: asBool(inv["cfgAcEnabled"] ?? pd["acAutoOutConfig"]),
    dcOutputEnabled: asBool(mppt["carState"] ?? pd["carSwitch"]),
    remainingChargeMinutes: asNumber(
      pd["chgRemainTime"] ?? bms["chgRemainTime"],
    ),
    remainingDischargeMinutes: asNumber(
      pd["dsgRemainTime"] ?? bms["dsgRemainTime"],
    ),
    maxChargeLevel: asNumber(bms["maxChgSoc"] ?? pd["maxChgSoc"]),
    minDischargeLevel: asNumber(bms["minDsgSoc"] ?? pd["minDsgSoc"]),
    temperature: asNumber(bms["temp"] ?? pd["deviceTemps"]),
    cycleCount: asNumber(bms["cycles"] ?? bms["cycleCnt"]),
  };
}

function asNumber(val: unknown): number | undefined {
  if (val === undefined || val === null) return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

function asBool(val: unknown): boolean | undefined {
  if (val === undefined || val === null) return undefined;
  return val === 1 || val === true || val === "1";
}
