import { BeforeInsert, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { BaseEntity } from "@medusajs/medusa";

@Entity()
export class DocumentPackingSlipSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  forced_number?: number;

  @Column()
  number_format: string;

  @Column()
  template?: string;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "docpacksset");
  }
}
