import { useAdminCustomQuery } from "medusa-react";
import { InvoiceResult } from "../../types/api";
import { CircularProgress } from "@mui/material";

type AdminInvoiceGetReq = {
  invoiceId: string;
};

const InvoiceNumberFromOrder = ({ invoiceId }: { invoiceId: string }) => {
  const { data, isLoading } = useAdminCustomQuery<
    AdminInvoiceGetReq,
    InvoiceResult
  >("/invoice", [""], {
    invoiceId: invoiceId,
  });

  if (isLoading) {
    return <CircularProgress size={8} />;
  }

  if (data && data.invoice) {
    return (
      <p className="text-grey-90 group-hover:text-violet-60 pl-2">
        {`Invoice: ${data.invoice.display_number}`}
      </p>
    );
  }
};

export default InvoiceNumberFromOrder;
