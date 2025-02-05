import { PackingSlipTemplateKind } from "../types/template-kind";
import basicTemplate, {
  validateInput as validateInputBasic,
} from "../templates/packing-slips/basic/basic";
import smallTemplate, {
  validateInput as validateInputSmall,
} from "../templates/packing-slips/basic/small";
import { Order } from "@medusajs/medusa";
import { PackingSlip } from "../../models/packing-slip";
import { DocumentSettings } from "../../models/document-settings";

export function validateInputForProvidedKind(
  templateKind: PackingSlipTemplateKind,
  documentSettings: DocumentSettings
): [boolean, string] {
  switch (templateKind) {
    case PackingSlipTemplateKind.BASIC:
      return validateInputBasic(documentSettings);
    case PackingSlipTemplateKind.BASIC_SMALL:
      return validateInputSmall(documentSettings);
    default:
      return [false, "Not supported template"];
  }
}

export function generate(
  kind: PackingSlipTemplateKind,
  documentSettings: DocumentSettings,
  packingSlip: PackingSlip,
  order: Order
): Promise<Buffer> | undefined {
  switch (kind) {
    case PackingSlipTemplateKind.BASIC:
      return basicTemplate(documentSettings, packingSlip, order);
    case PackingSlipTemplateKind.BASIC_SMALL:
      return smallTemplate(documentSettings, packingSlip, order);
    default:
      return Promise.resolve(Buffer.from("Not supported template"));
  }
}
