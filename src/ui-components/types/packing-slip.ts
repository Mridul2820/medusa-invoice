import { Order } from "@medusajs/medusa";

export type PackingSlip = {
  id: string;
  number: string;
  display_number: string;
  order: Order;
  created_at: Date;
};
