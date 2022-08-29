import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('safe_id').unsigned().references('safes.id').nullable()
      table.string('wallet_address').unique()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
