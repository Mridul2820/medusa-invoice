import { FlyingBox } from "@medusajs/icons";
import { Order } from "@medusajs/medusa";
import { DropdownMenu, toast } from "@medusajs/ui";
import { useAdminCustomPost } from "medusa-react";
import { PackingSlipResult } from "../../types/api";

type AdminGeneratePackingSlipPostReq = {
  orderId: string;
};

const GeneratePackingSlipDropdownButton = ({ order }: { order: Order }) => {
  const { mutate } = useAdminCustomPost<
    AdminGeneratePackingSlipPostReq,
    PackingSlipResult
  >(`/packing-slip`, ["packing-slip"]);
  const generate = () => {
    const id = toast.loading("Packing slip", {
      description: "Generating packing slip...",
      duration: Infinity,
    });
    mutate(
      {
        orderId: order.id,
      },
      {
        onSuccess: ({ response, buffer }) => {
          if (response.status == 201 && buffer) {
            const anyBuffer = buffer as any;
            const blob = new Blob([new Uint8Array(anyBuffer.data)], {
              type: "application/pdf",
            });
            toast.dismiss();
            const pdfURL = URL.createObjectURL(blob);
            window.open(pdfURL, "_blank");
          } else {
            toast.dismiss();
            toast.error("Packing slip", {
              description: "Problem happened when generating",
            });
          }
        },
        onError: (error) => {
          toast.dismiss();
          const trueError = error as any;
          toast.error("Packing slip", {
            description: trueError?.response?.data?.message,
          });
        },
      }
    );
  };

  return (
    <DropdownMenu.Item className="gap-x-2" onClick={generate}>
      <FlyingBox />
      Generate new packing slip
    </DropdownMenu.Item>
  );
};

export default GeneratePackingSlipDropdownButton;
