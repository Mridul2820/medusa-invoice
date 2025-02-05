import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class DocumentSettings1711700828113 implements MigrationInterface {
  name = "DocumentSettings1711700828113";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "document_settings",
        columns: [
          { name: "id", type: "character varying", isPrimary: true },
          {
            name: "store_address",
            type: "character varying",
            isNullable: true,
          },
          {
            name: "store_logo_source",
            type: "character varying",
            isNullable: true,
          },
          {
            name: "invoice_number_format",
            type: "character varying",
            isNullable: true,
          },
          {
            name: "invoice_template",
            type: "character varying",
            isNullable: true,
          },
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
            columnNames: ["store_address"],
            referencedColumnNames: ["id"],
            referencedTableName: "public.address",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("document_settings", true);
  }
}
