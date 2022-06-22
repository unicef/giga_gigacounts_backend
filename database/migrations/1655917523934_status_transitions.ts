import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'status_transitions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.jsonb('data')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
