import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import DocumentInvoiceSettingsService from "../../../../services/document-invoice-settings";
import { DocumentInvoiceSettings } from "../../../../models/document-invoice-settings";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body: any = req.body as any;
  const documentInvoiceSettingsService: DocumentInvoiceSettingsService =
    req.scope.resolve("documentInvoiceSettingsService");
  const formatNumber: string | undefined = body.formatNumber;

  try {
    const newSettings: DocumentInvoiceSettings | undefined =
      await documentInvoiceSettingsService.updateFormatNumber(formatNumber);
    if (newSettings !== undefined) {
      res.status(201).json({
        settings: newSettings,
      });
    } else {
      res.status(400).json({
        message: "Cant update forced number",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
