import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { BaseEntity, Order } from "@medusajs/medusa";
import { DocumentSettings } from "./document-settings";
import { DocumentInvoiceSettings } from "./document-invoice-settings";

@Entity()
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  number: string;

  @Column()
  display_number: string;

  @OneToOne(() => Order, { eager: true })
  @JoinColumn({ name: "order_id" })
  order: Order;

  @OneToOne(() => DocumentSettings, { eager: true })
  @JoinColumn({ name: "document_settings_id" })
  document_settings: DocumentSettings;

  @OneToOne(() => DocumentInvoiceSettings, { nullable: true })
  @JoinColumn({ name: "document_invoice_settings_id" })
  document_invoice_settings: DocumentInvoiceSettings;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "invoice");
  }
}
