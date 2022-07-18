import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'measures'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('value', 8, 2).alter({ alterType: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
