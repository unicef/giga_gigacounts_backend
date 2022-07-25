import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'schools'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('external_id').alter({ alterType: true }).unique()
      table.string('giga_id_school').unique()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
