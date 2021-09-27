import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Field from 'App/Models/Field'
import BookingValidator from 'App/Validators/BookingValidator'

export default class VenuesController {
    public async index({response}:HttpContextContract){
        let bookings = await Booking.query().preload('field',(
            bookingQuery)=>{
                bookingQuery.select(['name','type'])
            })
        response.status(200).json({message:'success get booking data',data:bookings})
    }

    public async show({params, response}:HttpContextContract){
        let venue = await Booking.query().where('id',params.id).preload('field',(
            fieldQuery)=>{
                fieldQuery.select(['name','type'])
            }).firstOrFail()
        return response.status(200).json({message:'success get booking data',data:venue})
    }

    public async store({request,params,response,auth}:HttpContextContract){
        try {
            const user = auth.user!
            const field = await Field.findByOrFail('id',params.field_id)
            const payload = await request.validate(BookingValidator)

            const newBooking = new Booking()
            newBooking.title = payload.title
            newBooking.play_date_start= payload.play_date_start
            newBooking.play_date_end= payload.play_date_end

            newBooking.related('field').associate(field)
            user.related('hasBookings').save(newBooking)
            response.ok({message:'stored'})
        } catch (error) {
            response.badRequest({error:error.messages})
        }
    }

    public async update({params, request,response}:HttpContextContract){
        try {
            const id = params.id
            const payload = await request.validate(BookingValidator)
            const booking = await Booking.findByOrFail('id',id)
            booking.title = payload.title
            booking.play_date_start= payload.play_date_start
            booking.play_date_end= payload.play_date_end
            await booking.save()
            response.ok({message:'updated'})
        } catch (error) {
            response.badRequest({error:error.messages})
        }
        
    }

    public async destroy({params,response}:HttpContextContract){
        let id = params.id
        // await Database.from('venues').where('id',id).delete()

        let booking = await Booking.findByOrFail('id',id)
        await booking.delete()
        response.ok({message:'deleted'})
    }

    public async join({params,auth,response}:HttpContextContract){
        const booking = await Booking.findByOrFail('id',params.id)
        let user = auth.user!

        await booking.related('participants').sync([user.id])
        return response.ok({message:'success'})
    }

    public async showForUser({params, response}:HttpContextContract){
        const booking = await Booking.query().where('id',params.id).preload('participants',(userQuery)=>{
            userQuery.select(['id','name','email'])
        }).firstOrFail()
        return response.ok({message:'success',data:booking})
}

