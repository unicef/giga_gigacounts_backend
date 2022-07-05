import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'measures'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('contract_id').notNullable().unsigned().references('contracts.id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
