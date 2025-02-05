import { Container, Heading, Text } from "@medusajs/ui";
import { Grid } from "@mui/material";
import AddressChangeModal from "../settings/settings-address";
import LogoChangeModal from "../settings/settings-logo";
import InvoiceSettingsModal from "../settings/settings-invoice";

export const SettingsTab = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6} xl={6}>
        <Container>
          <Grid container>
            <Grid item>
              <Heading level="h1">Store information</Heading>
            </Grid>
            <Grid item>
              <Text size="small">
                Change information about your store to have it included in
                generated documents
              </Text>
            </Grid>
          </Grid>
          <Grid container marginTop={5} direction={"row"} columnSpacing={2}>
            <Grid item>
              <AddressChangeModal />
            </Grid>
            <Grid item>
              <LogoChangeModal />
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid item xs={6} md={6} xl={6}>
        <Container>
          <Grid container direction={"column"}>
            <Grid item>
              <Heading level="h1">Invoice</Heading>
            </Grid>
            <Grid item>
              <Text size="small">
                Change settings how invoices are generated
              </Text>
            </Grid>
          </Grid>
          <Grid container marginTop={5} direction={"row"} columnSpacing={2}>
            <Grid item>
              <InvoiceSettingsModal />
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};
