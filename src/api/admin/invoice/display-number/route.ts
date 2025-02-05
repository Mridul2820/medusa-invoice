import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import InvoiceService from "../../../../services/invoice";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const invoiceService: InvoiceService = req.scope.resolve("invoiceService");

  const formatNumber: string | undefined = req.query.formatNumber as string;
  const forcedNumber: string | undefined = req.query.forcedNumber as string;

  try {
    const nextDisplayNumber = await invoiceService.getTestDisplayNumber(
      formatNumber,
      forcedNumber
    );
    res.status(201).json({
      displayNumber: nextDisplayNumber,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
