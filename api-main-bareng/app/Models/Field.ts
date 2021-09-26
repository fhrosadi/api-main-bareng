import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { TypeField } from 'Contracts/enums'
import Booking from './Booking'
import Venue from './Venue'


export default class Field extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: TypeField

  @column()
  public venue_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(()=>Booking)
  public bookings: HasMany<typeof Booking>

  @belongsTo(()=>Venue)
  public venue:BelongsTo<typeof Venue>
}
