import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contract_attachments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('contract_id').notNullable().unsigned().references('contracts.id')
      table.bigInteger('attachment_id').notNullable().unsigned().references('attachments.id')
      table.unique(['contract_id', 'attachment_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
