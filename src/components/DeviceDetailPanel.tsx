import { Detail } from "@raycast/api";
import { useDeviceProperties } from "../hooks/useDeviceProperties";
import { DeviceDetailView } from "./DeviceDetailView";

export function DeviceDetailPanel({
  serialNumber,
  deviceName,
}: {
  serialNumber: string;
  deviceName?: string;
}) {
  const { data: properties, isLoading } = useDeviceProperties(
    serialNumber,
    deviceName,
  );

  if (isLoading || !properties) {
    return <Detail isLoading={true} />;
  }

  return <DeviceDetailView properties={properties} />;
}
