import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contracts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('country_id').unsigned().references('countries.id')
      table.boolean('government_behalf').defaultTo(false)
      table.string('name').notNullable()
      table.bigInteger('lta_id').unsigned().references('ltas.id')
      table.bigInteger('currency_id').unsigned().references('currencies.id').notNullable()
      table.string('budget').notNullable()
      table.integer('frequency_id').unsigned().references('frequencies.id').notNullable()
      table.timestamp('start_date').notNullable()
      table.timestamp('end_date').notNullable()
      table.bigInteger('isp_id').unsigned().references('isps.id').notNullable()
      table.bigInteger('created_by').unsigned().references('users.id').notNullable()
      table.integer('status_id').unsigned().references('contract_statuses.id').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
