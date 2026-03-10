import { Color, Icon } from "@raycast/api";

export enum DeviceType {
  DELTA_PRO = "DELTA_PRO",
  DELTA_PRO_ULTRA = "DELTA_PRO_ULTRA",
  DELTA_2 = "DELTA_2",
  DELTA_2_MAX = "DELTA_2_MAX",
  DELTA_MAX = "DELTA_MAX",
  DELTA_MINI = "DELTA_MINI",
  RIVER_2 = "RIVER_2",
  RIVER_2_MAX = "RIVER_2_MAX",
  RIVER_2_PRO = "RIVER_2_PRO",
  RIVER_PRO = "RIVER_PRO",
  POWERSTREAM = "POWERSTREAM",
  SMART_HOME_PANEL = "SMART_HOME_PANEL",
  SMART_HOME_PANEL_2 = "SMART_HOME_PANEL_2",
  SMART_PLUG = "SMART_PLUG",
  WAVE_2 = "WAVE_2",
  GLACIER = "GLACIER",
  UNKNOWN = "UNKNOWN",
}

export const POWER_STATION_TYPES = [
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
] as const;

export function isPowerStation(type: DeviceType): boolean {
  return (POWER_STATION_TYPES as readonly DeviceType[]).includes(type);
}

export interface Device {
  serialNumber: string;
  name: string;
  productName: string;
  type: DeviceType;
  online: boolean;
  batteryLevel?: number;
  inputWatts?: number;
  outputWatts?: number;
  // Smart Plug specific
  plugSwitchState?: boolean;
  plugWatts?: number;
  // PowerStream specific
  inverterOutputWatts?: number;
}

export interface DeviceProperties {
  serialNumber: string;
  name: string;
  type: DeviceType;
  online: boolean;

  // Battery
  batteryLevel?: number;
  batteryCapacity?: number;
  cycleCount?: number;

  // Power Input
  solarInputWatts?: number;
  acInputWatts?: number;
  totalInputWatts?: number;
  inputVoltage?: number;

  // Power Output
  acOutputWatts?: number;
  dcOutputWatts?: number;
  usbOutputWatts?: number;
  totalOutputWatts?: number;

  // Status
  acOutputEnabled?: boolean;
  dcOutputEnabled?: boolean;
  chargingState?: string;
  remainingChargeMinutes?: number;
  remainingDischargeMinutes?: number;

  // Limits
  maxChargeLevel?: number;
  minDischargeLevel?: number;

  // Temperature
  temperature?: number;

  // Smart Plug specific
  plugSwitchState?: boolean;
  plugWatts?: number;
  plugVoltage?: number;
  plugCurrent?: number;
  plugBrightness?: number;

  // PowerStream specific
  customLoadPower?: number;
  supplyPriority?: number;
  pv1InputWatts?: number;
  pv2InputWatts?: number;
  inverterOutputWatts?: number;

  // Glacier specific
  leftTemp?: number;
  rightTemp?: number;
  iceMaking?: boolean;
  ecoMode?: boolean;

  // Wave 2 specific
  mainMode?: number;
  setTemperature?: number;
  fanSpeed?: number;

  // Raw data for device-specific info
  rawData?: Record<string, unknown>;
}

export type ChargingState = "Charging" | "Discharging" | "Idle" | "Full";

export function getChargingState(
  inputWatts: number,
  outputWatts: number,
  batteryLevel: number,
): ChargingState {
  if (batteryLevel >= 100) return "Full";
  if (inputWatts > 0 && inputWatts > outputWatts) return "Charging";
  if (outputWatts > 0) return "Discharging";
  return "Idle";
}

export function getBatteryColor(level: number): Color {
  if (level >= 60) return Color.Green;
  if (level >= 30) return Color.Yellow;
  if (level >= 15) return Color.Orange;
  return Color.Red;
}

export function getBatteryIcon(level: number): Icon {
  if (level >= 75) return Icon.BatteryCharging;
  if (level >= 50) return Icon.Battery;
  if (level >= 25) return Icon.Battery;
  return Icon.Battery;
}
