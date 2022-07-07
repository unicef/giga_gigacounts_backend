import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contracts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name').unique().alter()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
