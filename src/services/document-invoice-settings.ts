import { TransactionBaseService } from "@medusajs/medusa";
import { DocumentInvoiceSettings } from "../models/document-invoice-settings";
import { MedusaError } from "@medusajs/utils";
import { InvoiceTemplateKind } from "./types/template-kind";

export default class DocumentInvoiceSettingsService extends TransactionBaseService {
  private copySettingsIfPossible(
    newSettings: DocumentInvoiceSettings,
    lastSettings?: DocumentInvoiceSettings
  ) {
    if (lastSettings) {
      newSettings.invoice_forced_number = lastSettings.invoice_forced_number;
      newSettings.invoice_number_format = lastSettings.invoice_number_format;
      newSettings.invoice_template = lastSettings.invoice_template;
    }
  }

  async getInvoiceForcedNumber(): Promise<string | undefined> {
    const lastDocumentInvoiceSettings =
      await this.getLastDocumentInvoiceSettings();
    if (
      lastDocumentInvoiceSettings &&
      lastDocumentInvoiceSettings.invoice_forced_number
    ) {
      const nextNumber: string =
        lastDocumentInvoiceSettings.invoice_forced_number.toString();
      return nextNumber;
    }
    return undefined;
  }

  async resetForcedNumberByCreatingNewSettings(): Promise<DocumentInvoiceSettings> {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(
      DocumentInvoiceSettings
    );
    const newDocumentInvoiceSettings = this.activeManager_.create(
      DocumentInvoiceSettings
    );
    const lastDocumentInvoiceSettings =
      await this.getLastDocumentInvoiceSettings();
    this.copySettingsIfPossible(
      newDocumentInvoiceSettings,
      lastDocumentInvoiceSettings
    );

    newDocumentInvoiceSettings.invoice_forced_number = undefined;

    const result = await documentInvoiceSettingsRepository.save(
      newDocumentInvoiceSettings
    );
    return result;
  }

  async getLastDocumentInvoiceSettings(): Promise<
    DocumentInvoiceSettings | undefined
  > {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(
      DocumentInvoiceSettings
    );
    const lastDocumentInvoiceSettings: DocumentInvoiceSettings | null =
      await documentInvoiceSettingsRepository
        .createQueryBuilder("documentInvoiceSettings")
        .orderBy("documentInvoiceSettings.created_at", "DESC")
        .getOne();

    if (lastDocumentInvoiceSettings === null) {
      return undefined;
    }

    return lastDocumentInvoiceSettings;
  }

  async getInvoiceTemplate(): Promise<string | undefined> {
    const lastDocumentInvoiceSettings =
      await this.getLastDocumentInvoiceSettings();
    if (lastDocumentInvoiceSettings) {
      return lastDocumentInvoiceSettings.invoice_template;
    }
    return undefined;
  }

  async updateInvoiceForcedNumber(
    forcedNumber: string | undefined
  ): Promise<DocumentInvoiceSettings | undefined> {
    if (forcedNumber && !isNaN(Number(forcedNumber))) {
      const documentInvoiceSettingsRepository =
        this.activeManager_.getRepository(DocumentInvoiceSettings);
      const lastDocumentInvoiceSettings =
        await this.getLastDocumentInvoiceSettings();
      const newDocumentInvoiceSettings = this.activeManager_.create(
        DocumentInvoiceSettings
      );
      this.copySettingsIfPossible(
        newDocumentInvoiceSettings,
        lastDocumentInvoiceSettings
      );
      newDocumentInvoiceSettings.invoice_forced_number = parseInt(forcedNumber);
      const result = await documentInvoiceSettingsRepository.save(
        newDocumentInvoiceSettings
      );

      return result;
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "You need to set proper number"
      );
    }
  }

  async updateInvoiceTemplate(
    invoiceTemplate: InvoiceTemplateKind | undefined
  ): Promise<DocumentInvoiceSettings | undefined> {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(
      DocumentInvoiceSettings
    );
    const lastDocumentInvoiceSettings =
      await this.getLastDocumentInvoiceSettings();
    const newDocumentInvoiceSettings = this.activeManager_.create(
      DocumentInvoiceSettings
    );
    this.copySettingsIfPossible(
      newDocumentInvoiceSettings,
      lastDocumentInvoiceSettings
    );
    newDocumentInvoiceSettings.invoice_template = invoiceTemplate;
    const result = await documentInvoiceSettingsRepository.save(
      newDocumentInvoiceSettings
    );

    return result;
  }

  async updateFormatNumber(
    newFormatNumber: string | undefined
  ): Promise<DocumentInvoiceSettings | undefined> {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(
      DocumentInvoiceSettings
    );
    const lastDocumentInvoiceSettings =
      await this.getLastDocumentInvoiceSettings();
    const newDocumentInvoiceSettings = this.activeManager_.create(
      DocumentInvoiceSettings
    );
    this.copySettingsIfPossible(
      newDocumentInvoiceSettings,
      lastDocumentInvoiceSettings
    );
    newDocumentInvoiceSettings.invoice_number_format = newFormatNumber;
    const result = await documentInvoiceSettingsRepository.save(
      newDocumentInvoiceSettings
    );

    return result;
  }

  async updateSettings(
    newFormatNumber?: string,
    forcedNumber?: string,
    invoiceTemplate?: InvoiceTemplateKind
  ): Promise<DocumentInvoiceSettings | undefined> {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(
      DocumentInvoiceSettings
    );
    const newDocumentInvoiceSettings = this.activeManager_.create(
      DocumentInvoiceSettings
    );
    const lastDocumentInvoiceSettings =
      await this.getLastDocumentInvoiceSettings();
    this.copySettingsIfPossible(
      newDocumentInvoiceSettings,
      lastDocumentInvoiceSettings
    );
    if (newFormatNumber) {
      newDocumentInvoiceSettings.invoice_number_format = newFormatNumber;
    }
    if (forcedNumber !== undefined && !isNaN(Number(forcedNumber))) {
      newDocumentInvoiceSettings.invoice_forced_number = parseInt(forcedNumber);
    }
    if (invoiceTemplate) {
      newDocumentInvoiceSettings.invoice_template = invoiceTemplate;
    }
    const result = await documentInvoiceSettingsRepository.save(
      newDocumentInvoiceSettings
    );
    return result;
  }
}
