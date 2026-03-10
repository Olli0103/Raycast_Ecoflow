/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Access Key - Your EcoFlow Developer API Access Key from developer.ecoflow.com */
  "accessKey": string,
  /** Secret Key - Your EcoFlow Developer API Secret Key from developer.ecoflow.com */
  "secretKey": string,
  /** Region - Select your EcoFlow API region */
  "region": "eu" | "us"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `list-devices` command */
  export type ListDevices = ExtensionPreferences & {}
  /** Preferences accessible in the `device-detail` command */
  export type DeviceDetail = ExtensionPreferences & {}
  /** Preferences accessible in the `control-device` command */
  export type ControlDevice = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `list-devices` command */
  export type ListDevices = {}
  /** Arguments passed to the `device-detail` command */
  export type DeviceDetail = {
  /** Serial Number (optional) */
  "serialNumber": string
}
  /** Arguments passed to the `control-device` command */
  export type ControlDevice = {}
}

