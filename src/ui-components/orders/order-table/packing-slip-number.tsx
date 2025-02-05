import { useAdminCustomQuery } from "medusa-react";
import { PackingSlipResult } from "../../types/api";
import { CircularProgress } from "@mui/material";

type AdminPackingSlipGetReq = {
  id: string;
};

const PackingSlipNumber = ({ packingSlipId }: { packingSlipId: string }) => {
  const { data, isLoading } = useAdminCustomQuery<
    AdminPackingSlipGetReq,
    PackingSlipResult
  >("/packing-slip", [""], {
    id: packingSlipId,
  });

  if (isLoading) {
    return <CircularProgress size={8} />;
  }

  if (data && data.packingSlip) {
    return (
      <p className="text-grey-90 group-hover:text-violet-60 pl-2">
        {`Packing slip: ${data.packingSlip.display_number}`}
      </p>
    );
  }
};

export default PackingSlipNumber;
