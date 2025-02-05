import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import InvoiceService from "../../../services/invoice";
import { InvoiceResult } from "../../../services/types/api";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const invoiceService: InvoiceService = req.scope.resolve("invoiceService");

  try {
    const body: any = req.body as any;
    const result: InvoiceResult = await invoiceService.generateInvoiceForOrder(
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
  const invoiceService: InvoiceService = req.scope.resolve("invoiceService");

  const invoiceId = req.query.invoiceId;
  const includeBuffer = req.query.includeBuffer;
  try {
    const result: InvoiceResult = await invoiceService.getInvoice(
      invoiceId as string,
      includeBuffer !== undefined
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
