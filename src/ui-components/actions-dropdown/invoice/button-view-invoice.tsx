import { DocumentText } from "@medusajs/icons";
import { Order } from "@medusajs/medusa";
import { DropdownMenu, toast } from "@medusajs/ui";
import { useAdminCustomQuery } from "medusa-react";
import { InvoiceResult } from "../../types/api";

type AdminGenerateInvoiceQueryReq = {
  invoiceId: string;
  includeBuffer: boolean;
};

const ViewInvoiceDropdownButton = ({ order }: { order: Order }) => {
  const { data, refetch } = useAdminCustomQuery<
    AdminGenerateInvoiceQueryReq,
    InvoiceResult
  >(
    "/invoice",
    [],
    {
      invoiceId: order.metadata["invoice_id"] as string,
      includeBuffer: true,
    },
    {
      enabled: false,
    }
  );
  const handleClick = async () => {
    toast.loading("Invoice", {
      description: "Preparing invoice...",
      duration: Infinity,
    });
    try {
      const result = await refetch();
      if (result.data && result.data.buffer) {
        toast.dismiss();
        openPdf(result.data);
      } else {
        toast.dismiss();
        toast.error("Invoice", {
          description: "Problem happened when preparing invoice",
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Invoice", {
        description: error,
      });
    } finally {
      toast.dismiss();
    }
  };

  const openPdf = (invoiceResult?: InvoiceResult) => {
    if (invoiceResult && invoiceResult.buffer) {
      const anyBuffer = invoiceResult.buffer as any;
      const blob = new Blob([new Uint8Array(anyBuffer.data)], {
        type: "application/pdf",
      });
      const pdfURL = URL.createObjectURL(blob);
      window.open(pdfURL, "_blank");
    }
  };

  return (
    <DropdownMenu.Item
      className="gap-x-2"
      onClick={handleClick}
      disabled={order.metadata["invoice_id"] == undefined}
    >
      <DocumentText />
      View invoice
    </DropdownMenu.Item>
  );
};

export default ViewInvoiceDropdownButton;
