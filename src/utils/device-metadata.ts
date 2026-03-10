import { Icon } from "@raycast/api";
import { DeviceType, isPowerStation } from "../types/device";

// Serial number prefix to device type mapping
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
    {
      id: "set_ac_charging_power",
      label: "Set AC Charging Power",
      description: "Set AC charging speed in watts",
      icon: Icon.Gauge,
      needsValue: true,
      valueLabel: "Charging Power (W)",
      valuePlaceholder: "200-2400",
      valueMin: 200,
      valueMax: 2400,
    },
    {
      id: "buzzer_off",
      label: "Silent Mode On",
      description: "Disable device buzzer/beep sounds",
      icon: Icon.SpeakerOff,
    },
    {
      id: "buzzer_on",
      label: "Silent Mode Off",
      description: "Enable device buzzer/beep sounds",
      icon: Icon.Speaker,
    },
  ];
}

function smartPlugCommands(): DeviceCommand[] {
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
    {
      id: "set_brightness",
      label: "Set LED Brightness",
      description: "Set indicator light brightness",
      icon: Icon.LightBulb,
      needsValue: true,
      valueLabel: "Brightness (0-1023)",
      valuePlaceholder: "0-1023",
      valueMin: 0,
      valueMax: 1023,
    },
  ];
}

function powerStreamCommands(): DeviceCommand[] {
  return [
    {
      id: "set_supply_priority",
      label: "Set Supply Priority",
      description:
        "0 = Prioritize power supply, 1 = Prioritize battery charging",
      icon: Icon.ArrowsContract,
      needsValue: true,
      valueLabel: "Priority (0 or 1)",
      valuePlaceholder: "0",
      valueMin: 0,
      valueMax: 1,
    },
    {
      id: "set_custom_load_power",
      label: "Set Custom Load Power",
      description: "Set home load power output (0-600W)",
      icon: Icon.Gauge,
      needsValue: true,
      valueLabel: "Load Power (W)",
      valuePlaceholder: "0-600",
      valueMin: 0,
      valueMax: 600,
    },
    {
      id: "set_bat_upper_limit",
      label: "Set Battery Charge Upper Limit",
      description: "Set maximum battery charge level (70-100%)",
      icon: Icon.BatteryCharging,
      needsValue: true,
      valueLabel: "Upper Limit (%)",
      valuePlaceholder: "70-100",
      valueMin: 70,
      valueMax: 100,
    },
    {
      id: "set_bat_lower_limit",
      label: "Set Battery Discharge Lower Limit",
      description: "Set minimum battery discharge level (1-30%)",
      icon: Icon.Battery,
      needsValue: true,
      valueLabel: "Lower Limit (%)",
      valuePlaceholder: "1-30",
      valueMin: 1,
      valueMax: 30,
    },
  ];
}

function wave2Commands(): DeviceCommand[] {
  return [
    {
      id: "set_main_mode",
      label: "Set Mode",
      description: "0 = Cool, 1 = Heat, 2 = Fan",
      icon: Icon.Temperature,
      needsValue: true,
      valueLabel: "Mode (0-2)",
      valuePlaceholder: "0",
      valueMin: 0,
      valueMax: 2,
    },
    {
      id: "set_temperature",
      label: "Set Temperature",
      description: "Set target temperature in °C",
      icon: Icon.Temperature,
      needsValue: true,
      valueLabel: "Temperature (°C)",
      valuePlaceholder: "16-30",
      valueMin: 16,
      valueMax: 30,
    },
    {
      id: "buzzer_on_wave",
      label: "Enable Buzzer",
      description: "Enable beep sounds",
      icon: Icon.Speaker,
    },
    {
      id: "buzzer_off_wave",
      label: "Disable Buzzer",
      description: "Disable beep sounds",
      icon: Icon.SpeakerOff,
    },
  ];
}

function glacierCommands(): DeviceCommand[] {
  return [
    {
      id: "set_glacier_temp",
      label: "Set Temperature",
      description: "Set right zone temperature in °C",
      icon: Icon.Temperature,
      needsValue: true,
      valueLabel: "Temperature (°C)",
      valuePlaceholder: "-25 to 10",
      valueMin: -25,
      valueMax: 10,
    },
    {
      id: "eco_mode_on",
      label: "Enable Eco Mode",
      description: "Turn on energy-saving eco mode",
      icon: Icon.Leaf,
    },
    {
      id: "eco_mode_off",
      label: "Disable Eco Mode",
      description: "Turn off eco mode",
      icon: Icon.Leaf,
    },
    {
      id: "ice_making_on",
      label: "Start Ice Making",
      description: "Begin making ice",
      icon: Icon.Snowflake,
    },
    {
      id: "ice_making_off",
      label: "Stop Ice Making",
      description: "Stop ice making",
      icon: Icon.Snowflake,
    },
    {
      id: "buzzer_on_glacier",
      label: "Enable Buzzer",
      description: "Enable beep sounds",
      icon: Icon.Speaker,
    },
    {
      id: "buzzer_off_glacier",
      label: "Disable Buzzer",
      description: "Disable beep sounds",
      icon: Icon.SpeakerOff,
    },
  ];
}

export function getSupportedCommands(type: DeviceType): DeviceCommand[] {
  if (isPowerStation(type)) return powerStationCommands();

  switch (type) {
    case DeviceType.SMART_PLUG:
      return smartPlugCommands();
    case DeviceType.POWERSTREAM:
      return powerStreamCommands();
    case DeviceType.WAVE_2:
      return wave2Commands();
    case DeviceType.GLACIER:
      return glacierCommands();
    default:
      return [];
  }
}

// Map command IDs to API command payloads
// Power stations use: { operateType, moduleType, params }
// Smart Plug / PowerStream use: { cmdCode, params }
// Wave 2 uses: { operateType, params }
// Glacier uses: { operateType, moduleType, params }
export function getCommandPayload(
  type: DeviceType,
  commandId: string,
  value?: number,
): Record<string, unknown> {
  if (isPowerStation(type)) {
    switch (commandId) {
      case "ac_on":
        return {
          operateType: "acAutoOutConfig",
          moduleType: 1,
          params: { acAutoOutConfig: 1, minAcOutSoc: 0 },
        };
      case "ac_off":
        return {
          operateType: "acAutoOutConfig",
          moduleType: 1,
          params: { acAutoOutConfig: 0, minAcOutSoc: 0 },
        };
      case "dc_on":
        return {
          operateType: "mpptCar",
          moduleType: 5,
          params: { carState: 1 },
        };
      case "dc_off":
        return {
          operateType: "mpptCar",
          moduleType: 5,
          params: { carState: 0 },
        };
      case "set_charge_limit":
        return {
          operateType: "upsConfig",
          moduleType: 2,
          params: { maxChgSoc: value ?? 100 },
        };
      case "set_discharge_limit":
        return {
          operateType: "dsgCfg",
          moduleType: 2,
          params: { minDsgSoc: value ?? 0 },
        };
      case "set_ac_charging_power":
        return {
          operateType: "acChgCfg",
          moduleType: 5,
          params: { chgWatts: value ?? 200, chgPauseFlag: 0 },
        };
      case "buzzer_off":
        return {
          operateType: "quietCfg",
          moduleType: 5,
          params: { enabled: 1 },
        };
      case "buzzer_on":
        return {
          operateType: "quietCfg",
          moduleType: 5,
          params: { enabled: 0 },
        };
    }
  }

  if (type === DeviceType.SMART_PLUG) {
    switch (commandId) {
      case "plug_on":
        return {
          cmdCode: "WN511_SOCKET_SET_PLUG_SWITCH_MESSAGE",
          params: { plugSwitch: 1 },
        };
      case "plug_off":
        return {
          cmdCode: "WN511_SOCKET_SET_PLUG_SWITCH_MESSAGE",
          params: { plugSwitch: 0 },
        };
      case "set_brightness":
        return {
          cmdCode: "WN511_SOCKET_SET_BRIGHTNESS_PACK",
          params: { brightness: value ?? 0 },
        };
    }
  }

  if (type === DeviceType.POWERSTREAM) {
    switch (commandId) {
      case "set_supply_priority":
        return {
          cmdCode: "WN511_SET_SUPPLY_PRIORITY_PACK",
          params: { supplyPriority: value ?? 0 },
        };
      case "set_custom_load_power":
        return {
          cmdCode: "WN511_SET_PERMANENT_WATTS_PACK",
          params: { permanentWatts: (value ?? 0) * 10 },
        };
      case "set_bat_upper_limit":
        return {
          cmdCode: "WN511_SET_BAT_UPPER_PACK",
          params: { upperLimit: value ?? 100 },
        };
      case "set_bat_lower_limit":
        return {
          cmdCode: "WN511_SET_BAT_LOWER_PACK",
          params: { lowerLimit: value ?? 1 },
        };
    }
  }

  if (type === DeviceType.WAVE_2) {
    switch (commandId) {
      case "set_main_mode":
        return {
          operateType: "mainMode",
          params: { mainMode: value ?? 0 },
        };
      case "set_temperature":
        return {
          operateType: "temp",
          params: { setTemp: value ?? 24 },
        };
      case "buzzer_on_wave":
        return {
          operateType: "beepEn",
          params: { enabled: 1 },
        };
      case "buzzer_off_wave":
        return {
          operateType: "beepEn",
          params: { enabled: 0 },
        };
    }
  }

  if (type === DeviceType.GLACIER) {
    switch (commandId) {
      case "set_glacier_temp":
        return {
          operateType: "temp",
          moduleType: 1,
          params: { tmpR: value ?? 0, tmpL: 0, tmpM: 0 },
        };
      case "eco_mode_on":
        return {
          operateType: "ecoMode",
          moduleType: 1,
          params: { mode: 1 },
        };
      case "eco_mode_off":
        return {
          operateType: "ecoMode",
          moduleType: 1,
          params: { mode: 0 },
        };
      case "ice_making_on":
        return {
          operateType: "iceMake",
          moduleType: 1,
          params: { enable: 1, iceShape: 0 },
        };
      case "ice_making_off":
        return {
          operateType: "iceMake",
          moduleType: 1,
          params: { enable: 0, iceShape: 0 },
        };
      case "buzzer_on_glacier":
        return {
          operateType: "beep",
          moduleType: 1,
          params: { flag: 0 },
        };
      case "buzzer_off_glacier":
        return {
          operateType: "beep",
          moduleType: 1,
          params: { flag: 3 },
        };
    }
  }

  throw new Error(`Unknown command ${commandId} for device type ${type}`);
}

// Extract common properties from raw API quota data
export function extractDeviceProperties(
  type: DeviceType,
  rawData: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  if (type === DeviceType.SMART_PLUG) {
    return extractSmartPlugProperties(rawData);
  }
  if (type === DeviceType.POWERSTREAM) {
    return extractPowerStreamProperties(rawData);
  }
  if (type === DeviceType.GLACIER) {
    return extractGlacierProperties(rawData);
  }
  if (type === DeviceType.WAVE_2) {
    return extractWave2Properties(rawData);
  }
  return extractPowerStationProperties(rawData);
}

function extractPowerStationProperties(
  rawData: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const pd = rawData["pd"] ?? rawData["20_1"] ?? {};
  const bms = rawData["bms_bmsStatus"] ?? rawData["2_1"] ?? {};
  const ems = rawData["bms_emsStatus"] ?? {};
  const inv = rawData["inv"] ?? rawData["3_1"] ?? {};
  const mppt = rawData["mppt"] ?? rawData["5_1"] ?? {};

  return {
    batteryLevel: asNumber(
      pd["soc"] ?? ems["lcdShowSoc"] ?? ems["f32LcdShowSoc"] ?? bms["soc"],
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
      ems["chgRemainTime"] ?? pd["chgRemainTime"] ?? bms["chgRemainTime"],
    ),
    remainingDischargeMinutes: asNumber(
      ems["dsgRemainTime"] ?? pd["dsgRemainTime"] ?? bms["dsgRemainTime"],
    ),
    maxChargeLevel: asNumber(
      ems["maxChgSoc"] ?? bms["maxChgSoc"] ?? pd["maxChgSoc"],
    ),
    minDischargeLevel: asNumber(
      ems["minDsgSoc"] ?? bms["minDsgSoc"] ?? pd["minDsgSoc"],
    ),
    temperature: asNumber(bms["temp"] ?? pd["deviceTemps"]),
    cycleCount: asNumber(bms["cycles"] ?? bms["cycleCnt"]),
  };
}

function extractSmartPlugProperties(
  rawData: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const data = rawData["2_1"] ?? {};

  return {
    plugSwitchState: asBool(data["switchSta"]),
    plugWatts: asNumber(data["watts"]),
    plugVoltage: asNumber(data["volt"]),
    plugCurrent: asNumber(data["current"]),
    plugBrightness: asNumber(data["brightness"]),
    temperature: asNumber(data["temp"]),
  };
}

function extractPowerStreamProperties(
  rawData: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const data = rawData["20_1"] ?? {};

  return {
    batteryLevel: asNumber(data["batSoc"]),
    pv1InputWatts: asNumber(data["pv1InputWatts"]),
    pv2InputWatts: asNumber(data["pv2InputWatts"]),
    solarInputWatts: addNumbers(
      asNumber(data["pv1InputWatts"]),
      asNumber(data["pv2InputWatts"]),
    ),
    inverterOutputWatts: asNumber(data["invOutputWatts"]),
    totalOutputWatts: asNumber(data["invOutputWatts"]),
    totalInputWatts: addNumbers(
      asNumber(data["pv1InputWatts"]),
      asNumber(data["pv2InputWatts"]),
    ),
    customLoadPower:
      asNumber(data["permanentWatts"]) !== undefined
        ? Math.round((asNumber(data["permanentWatts"]) ?? 0) / 10)
        : undefined,
    supplyPriority: asNumber(data["supplyPriority"]),
  };
}

function extractGlacierProperties(
  rawData: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const bms = rawData["bms_bmsStatus"] ?? rawData["2_1"] ?? {};
  const pd = rawData["pd"] ?? rawData["20_1"] ?? {};

  return {
    batteryLevel: asNumber(bms["soc"] ?? pd["soc"]),
    temperature: asNumber(pd["tmpR"]),
    leftTemp: asNumber(pd["tmpL"]),
    rightTemp: asNumber(pd["tmpR"]),
    iceMaking: asBool(pd["iceMkMode"]),
    ecoMode: asBool(pd["ecoMode"]),
  };
}

function extractWave2Properties(
  rawData: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const pd = rawData["pd"] ?? rawData["20_1"] ?? {};
  const bms = rawData["bms_bmsStatus"] ?? rawData["2_1"] ?? {};

  return {
    batteryLevel: asNumber(bms["soc"] ?? pd["soc"]),
    temperature: asNumber(pd["envTemp"]),
    mainMode: asNumber(pd["mainMode"]),
    setTemperature: asNumber(pd["setTemp"]),
    fanSpeed: asNumber(pd["fanValue"]),
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

function addNumbers(
  a: number | undefined,
  b: number | undefined,
): number | undefined {
  if (a === undefined && b === undefined) return undefined;
  return (a ?? 0) + (b ?? 0);
}
