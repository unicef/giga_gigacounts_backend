import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'status_transitions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('who').unsigned().references('users.id')
      table.bigInteger('contract_id').unsigned().references('contracts.id')
      table.integer('initial_status').notNullable()
      table.integer('final_status').notNullable()
      table.timestamp('when', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
