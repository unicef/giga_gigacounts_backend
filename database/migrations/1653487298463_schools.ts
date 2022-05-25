import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'schools'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('external_id')
      table.string('name').notNullable()
      table.string('address').notNullable()
      table.string('location_1')
      table.string('location_2')
      table.string('location_3')
      table.string('location_4')
      table.string('education_level').notNullable()
      table.string('geopoint')
      table.string('email')
      table.string('phone_number')
      table.string('contact_person')
      table.bigInteger('country_id').notNullable().unsigned().references('countries.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
