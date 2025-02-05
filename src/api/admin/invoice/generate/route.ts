import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { InvoiceTemplateKind } from "../../../../services/types/template-kind";
import InvoiceService from "../../../../services/invoice";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const invoiceService: InvoiceService = req.scope.resolve("invoiceService");

  try {
    const chosenTemplate = req.query.template;
    const invoiceResult = await invoiceService.generateTestInvoice(
      chosenTemplate as InvoiceTemplateKind
    );
    res.status(201).json(invoiceResult);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
