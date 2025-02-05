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
import { DocumentPackingSlipSettings } from "./document-packing-slip-settings";

@Entity()
export class PackingSlip extends BaseEntity {
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

  @OneToOne(() => DocumentPackingSlipSettings, { nullable: true })
  @JoinColumn({ name: "document_packing_slip_settings_id" })
  document_packing_slip_settings: DocumentPackingSlipSettings;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "packs");
  }
}
