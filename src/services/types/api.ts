import { Address } from "@medusajs/medusa";
import { Invoice } from "../../models/invoice";
import { PackingSlip } from "../../models/packing-slip";

export type DocumentAddress = Omit<Address, "customer" | "country">;

export type InvoiceResult = {
  invoice?: Invoice;
  buffer?: Buffer;
};

export type PackingSlipResult = {
  packingSlip?: PackingSlip;
  buffer?: Buffer;
};
