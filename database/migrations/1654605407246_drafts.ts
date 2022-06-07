import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'drafts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('country_id').unsigned().references('countries.id')
      table.boolean('government_behalf').defaultTo(false)
      table.string('name').notNullable()
      table.bigInteger('lta_id').unsigned().references('ltas.id')
      table.bigInteger('currency_id').unsigned().references('currencies.id')
      table.string('budget')
      table.integer('frequency_id').unsigned().references('frequencies.id')
      table.timestamp('start_date')
      table.timestamp('end_date')
      table.bigInteger('isp_id').unsigned().references('isps.id')
      table.bigInteger('created_by').unsigned().references('users.id')
      table.jsonb('attachments')
      table.jsonb('schools')
      table.jsonb('expected_metrics')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
