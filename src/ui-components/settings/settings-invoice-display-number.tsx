import { Input } from "@medusajs/ui";
import { Grid } from "@mui/material";
import { useAdminCustomQuery } from "medusa-react";

type AdminStoreDocumentInvoiceSettingsDisplayNumberQueryReq = {
  formatNumber: string;
  forcedNumber: number;
};

type StoreDocumentInvoiceSettingsDisplayNumberResult = {
  displayNumber: string;
};

const InvoiceSettingsDisplayNumber = ({
  formatNumber,
  forcedNumber,
}: {
  formatNumber?: string;
  forcedNumber?: number;
}) => {
  const { data, isLoading } = useAdminCustomQuery<
    AdminStoreDocumentInvoiceSettingsDisplayNumberQueryReq,
    StoreDocumentInvoiceSettingsDisplayNumberResult
  >("/invoice/display-number", [formatNumber, forcedNumber], {
    formatNumber: formatNumber,
    forcedNumber: forcedNumber,
  });

  if (isLoading) {
    return (
      <Grid item>
        <Input readOnly={true} />
      </Grid>
    );
  }

  return (
    <Grid item>
      <Input
        key={`display-number-${data.displayNumber}`}
        defaultValue={data.displayNumber}
        readOnly={true}
      />
    </Grid>
  );
};

export default InvoiceSettingsDisplayNumber;
