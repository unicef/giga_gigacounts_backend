import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'isps'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('country_id').unsigned().references('countries.id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
