import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Field from './Field'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

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
  public owner:BelongsTo<typeof User>

  @belongsTo(()=>Field)
  public field:BelongsTo<typeof Field>

  // @manyToMany(()=>User)
  // public participants:ManyToMany<typeof User>
}
