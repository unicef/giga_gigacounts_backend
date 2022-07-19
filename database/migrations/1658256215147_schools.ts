import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'schools'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('external_id').alter({ alterType: true })
      table.string('giga_id_school')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
