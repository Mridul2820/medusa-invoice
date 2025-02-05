import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { PackingSlipTemplateKind } from "../../../../services/types/template-kind";
import PackingSlipService from "../../../../services/packing-slip";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const packingSlipService: PackingSlipService =
    req.scope.resolve("packingSlipService");

  try {
    const chosenTemplate = req.query.template;
    const packingSlipResult = await packingSlipService.generatePreview(
      chosenTemplate as PackingSlipTemplateKind
    );
    res.status(201).json(packingSlipResult);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
