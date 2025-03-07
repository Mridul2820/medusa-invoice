import { RouteConfig } from "@medusajs/admin";
import { Tabs, Toaster } from "@medusajs/ui";
import { DocumentText } from "@medusajs/icons";
import { Box, Grid } from "@mui/material";
import { OrdersTab } from "../../../ui-components/tabs/orders-tab";
import { TemplatesTab } from "../../../ui-components/tabs/templates-tab/templates-tab";
import { SettingsTab } from "../../../ui-components/tabs/settings-tab";
import { ProTab } from "../../../ui-components/tabs/pro-tab";

const DocumentsPage = () => {
  return (
    <Tabs defaultValue="orders">
      <Toaster position="top-right" />
      <Tabs.List>
        <Tabs.Trigger value="orders">Orders</Tabs.Trigger>
        <Tabs.Trigger value="templates">Templates</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="orders">
        <Box height={20}></Box>
        <OrdersTab />
      </Tabs.Content>
      <Tabs.Content value="templates">
        <Box height={20}></Box>
        <TemplatesTab />
      </Tabs.Content>
      <Tabs.Content value="settings">
        <Box height={20}></Box>
        <SettingsTab />
      </Tabs.Content>
      {process.env.MEDUSA_ADMIN_MEDUSA_DOCUMENTS_HIDE_PRO === undefined && (
        <Tabs.Content value="pro">
          <Box height={20}></Box>
          <ProTab />
        </Tabs.Content>
      )}
    </Tabs>
  );
};
export const config: RouteConfig = {
  link: {
    label: "Documents",
    icon: DocumentText,
  },
};

export default DocumentsPage;
