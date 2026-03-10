import { Action, ActionPanel, Icon, List } from "@raycast/api";

export function EmptyView({ isLoading }: { isLoading: boolean }) {
  if (isLoading) return null;

  return (
    <List.EmptyView
      icon={Icon.Battery}
      title="No EcoFlow Devices Found"
      description="Make sure your Access Key and Secret Key are set correctly in the extension preferences. You can get your API credentials from developer.ecoflow.com."
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            title="Get Api Credentials"
            url="https://developer.ecoflow.com"
          />
          <Action title="Open Extension Preferences" onAction={() => {}} />
        </ActionPanel>
      }
    />
  );
}
