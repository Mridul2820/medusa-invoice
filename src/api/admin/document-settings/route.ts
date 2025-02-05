import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import InvoiceService from "../../../services/invoice";
import { DocumentSettings } from "../../../models/document-settings";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const invoiceService: InvoiceService = req.scope.resolve("invoiceService");

  try {
    const documentSettings: DocumentSettings | undefined =
      await invoiceService.getLastDocumentSettings();
    res.status(200).json({
      settings: documentSettings,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
