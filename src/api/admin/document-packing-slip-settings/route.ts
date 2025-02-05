import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import DocumentPackingSlipSettingsService from "../../../services/document-packing-slip-settings";
import { DocumentPackingSlipSettings } from "../../../models/document-packing-slip-settings";
import { PackingSlipTemplateKind } from "../../../services/types/template-kind";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const documentPackingSlipSettingsService: DocumentPackingSlipSettingsService =
    req.scope.resolve("documentPackingSlipSettingsService");

  try {
    const lastDocumentPackingSlipSettings:
      | DocumentPackingSlipSettings
      | undefined =
      await documentPackingSlipSettingsService.getLastDocumentPackingSlipSettings();
    res.status(200).json({
      settings: lastDocumentPackingSlipSettings,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body: any = req.body as any;
  const documentPackingSlipSettingsService: DocumentPackingSlipSettingsService =
    req.scope.resolve("documentPackingSlipSettingsService");
  const formatNumber: string | undefined = body.formatNumber;
  const forcedNumber: string | undefined = body.forcedNumber;
  const template: string | undefined = body.template;

  try {
    const newSettings: DocumentPackingSlipSettings | undefined =
      await documentPackingSlipSettingsService.updateSettings(
        formatNumber,
        forcedNumber,
        template as PackingSlipTemplateKind
      );
    if (newSettings !== undefined) {
      res.status(201).json({
        settings: newSettings,
      });
    } else {
      res.status(400).json({
        message: "Cant update settings",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
