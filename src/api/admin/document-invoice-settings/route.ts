import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import DocumentInvoiceSettingsService from "../../../services/document-invoice-settings";
import { DocumentInvoiceSettings } from "../../../models/document-invoice-settings";
import { InvoiceTemplateKind } from "../../../services/types/template-kind";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const documentInvoiceSettingsService: DocumentInvoiceSettingsService =
    req.scope.resolve("documentInvoiceSettingsService");

  try {
    const lastDocumentInvoiceSettings: DocumentInvoiceSettings | undefined =
      await documentInvoiceSettingsService.getLastDocumentInvoiceSettings();
    res.status(200).json({
      settings: lastDocumentInvoiceSettings,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const documentInvoiceSettingsService: DocumentInvoiceSettingsService =
    req.scope.resolve("documentInvoiceSettingsService");
  const body: any = req.body as any;
  const formatNumber: string | undefined = body.formatNumber;
  const forcedNumber: string | undefined = body.forcedNumber;
  const invoiceTemplate: string | undefined = body.template;

  try {
    const newSettings: DocumentInvoiceSettings | undefined =
      await documentInvoiceSettingsService.updateSettings(
        formatNumber,
        forcedNumber,
        invoiceTemplate as InvoiceTemplateKind
      );
    if (newSettings !== undefined) {
      res.status(201).json({
        settings: newSettings,
      });
    } else {
      res.status(400).json({
        message: "Cant update invoice settings",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
