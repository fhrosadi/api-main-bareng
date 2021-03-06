import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { RoleUser } from 'Contracts/enums'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.boolean('is_verified').defaultTo(false)
      table.enum('role',Object.values(RoleUser)).defaultTo(RoleUser.USER).notNullable()
      table.string('remember_me_token').nullable()
 

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true,true)
    })
  }


  public async down () {
    this.schema.dropTable(this.tableName)
  }

}
