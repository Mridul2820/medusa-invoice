import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PackingSlipService from "../../../services/packing-slip";
import { PackingSlipResult } from "../../../services/types/api";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const packingSlipService: PackingSlipService =
    req.scope.resolve("packingSlipService");

  try {
    const body: any = req.body as any;
    const result: PackingSlipResult = await packingSlipService.create(
      body.orderId
    );
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const packingSlipService: PackingSlipService =
    req.scope.resolve("packingSlipService");

  const id = req.query.id;
  const includeBuffer = req.query.includeBuffer;
  try {
    const result: PackingSlipResult = await packingSlipService.getPackingSlip(
      id as string,
      includeBuffer !== undefined
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
