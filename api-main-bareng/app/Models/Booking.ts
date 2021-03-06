import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Field from './Field'

export default class Booking extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public title?: string

  @column()
  public play_date_start:DateTime

  @column()
  public play_date_end:DateTime

  @column()
  public user_id: number

  @column()
  public field_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=>User)
  public bookingOwner:BelongsTo<typeof User>

  @belongsTo(()=>Field)
  public field:BelongsTo<typeof Field>

  @manyToMany(()=>User)
  public participants:ManyToMany<typeof User>
}
