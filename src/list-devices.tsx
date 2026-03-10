import { List } from "@raycast/api";
import { useDevices } from "./hooks/useDevices";
import { DeviceListItem } from "./components/DeviceListItem";
import { EmptyView } from "./components/EmptyView";

export default function ListDevicesCommand() {
  const { data: devices, isLoading, revalidate } = useDevices();

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search devices...">
      {devices && devices.length > 0 ? (
        devices.map((device) => (
          <DeviceListItem
            key={device.serialNumber}
            device={device}
            onRefresh={revalidate}
          />
        ))
      ) : (
        <EmptyView isLoading={isLoading} />
      )}
    </List>
  );
}
