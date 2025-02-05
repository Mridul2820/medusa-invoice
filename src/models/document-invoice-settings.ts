import { BeforeInsert, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { BaseEntity } from "@medusajs/medusa";

@Entity()
export class DocumentInvoiceSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  invoice_forced_number?: number;

  @Column()
  invoice_number_format?: string;

  @Column()
  invoice_template?: string;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "docinvset");
  }
}
