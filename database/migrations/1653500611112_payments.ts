import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.timestamp('due_date').notNullable()
      table.timestamp('paid_date')
      table.bigInteger('invoice_id').notNullable().unsigned().references('attachments.id')
      table.bigInteger('receipt_id').unsigned().references('attachments.id')
      table.boolean('is_verified').defaultTo(false)
      table.bigInteger('contract_id').notNullable().unsigned().references('contracts.id')
      table.bigInteger('paid_by').unsigned().references('users.id')
      table.integer('amount').notNullable()
      table.bigInteger('currency_id').unsigned().references('currencies.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
