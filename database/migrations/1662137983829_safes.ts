import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'safes'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name').unique().notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
