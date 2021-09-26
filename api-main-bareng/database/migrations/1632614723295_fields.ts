import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TypeField } from 'Contracts/enums'

export default class Fields extends BaseSchema {
  protected tableName = 'fields'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.enum('type',Object.values(TypeField)).defaultTo(TypeField.FUTSAL).notNullable()
      table.integer('venue_id').unsigned().references('id').inTable('venues').onDelete('CASCADE')
      table.timestamps(true,true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
