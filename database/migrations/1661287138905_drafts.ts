import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'drafts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('attachments')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
