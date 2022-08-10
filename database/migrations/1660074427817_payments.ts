import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('description', 255)
      table.integer('status').notNullable().defaultTo(0)
      table.bigInteger('created_by').unsigned().references('users.id').notNullable()
      table.jsonb('metrics')
      table.timestamp('paid_date').notNullable().alter()
      table.renameColumn('due_date', 'date_from')
      table.renameColumn('paid_date', 'date_to')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
