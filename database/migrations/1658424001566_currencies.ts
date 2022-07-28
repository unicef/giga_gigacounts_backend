import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'currencies'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('code').defaultTo('')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
