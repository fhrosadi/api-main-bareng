import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { RoleUser } from 'Contracts/enums'
import Booking from './Booking'
import Venue from './Venue'

/**
 * @swagger
 * definitions:
 *  User:
 *    type: Object
 *    properties:
 *      id:
 *        type: integer
 *      name:
 *        type: string
 *      email:
 *        type: string
 *      password:
 *        type: string
 *      role:
 *        type: string
 *      is_verified:
 *        type: boolean
 *    required:
 *      - name
 *      - email
 *      - password
 *      - role
 */

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public role: RoleUser

  @column()
  public rememberMeToken?: string

  @column()
  public is_verified: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(()=>Venue)
  public venues:HasMany<typeof Venue>

  @hasMany(()=>Booking)
  public hasBookings:HasMany<typeof Booking>
  
  @manyToMany(()=>Booking)
  public hasJoins:ManyToMany<typeof Booking>
}
