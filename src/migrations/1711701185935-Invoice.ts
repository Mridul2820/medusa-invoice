import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Invoice1711701185935 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "invoice",
        columns: [
          { name: "id", type: "character varying", isPrimary: true },
          { name: "number", type: "character varying" },
          { name: "display_number", type: "character varying" },
          { name: "order_id", type: "character varying" },
          { name: "document_settings_id", type: "character varying" },
          {
            name: "created_at",
            type: "TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()",
          },
          {
            name: "updated_at",
            type: "TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()",
          },
          {
            name: "deleted_at",
            type: "TIMESTAMP WITH TIME ZONE",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["order_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "public.order",
          },
          {
            columnNames: ["document_settings_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "public.document_settings",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("invoice", true);
    await queryRunner.query(
      `UPDATE "order" SET metadata = metadata #- '{invoice_id}'`
    );
  }
}
