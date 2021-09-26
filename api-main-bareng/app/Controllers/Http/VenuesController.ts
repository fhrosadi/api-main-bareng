import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VenueValidator from 'App/Validators/VenueValidator'
// import Database from '@ioc:Adonis/Lucid/Database'
import Venue from 'App/Models/Venue'


export default class VenuesController {
    public async index({request, response}:HttpContextContract){
        let venues
        if(request.qs().name){
            // venues = await Database.from('venues').select('id','name','phone','address').where('name',request.qs().name)
            venues = await Venue.findByOrFail('name',request.qs().name)
        }else{
            // venues = await Database.from('venues').select('id','name','phone','address')
            venues = await Venue.all()
        }
        response.status(200).json({message:'success get venues data',data:venues})
    }

    public async show({params, response}:HttpContextContract){
        // let venue = await Database.from('venues').where('id',params.id).select('id','name','phone','address').firstOrFail()
        let venue = await Venue.findBy('id',params.id)
        return response.status(200).json({message:'success get venues data',data:venue})

    }

    public async store({request,response}:HttpContextContract){
        try {
            await request.validate(VenueValidator)
            // Query builder

            // await Database.table('venues').returning('id').insert({
            //     name: request.input('name'),
            //     phone: request.input('phone'),
            //     address: request.input('address'),
            // })

            // ORM

            let newVenue = new Venue()
            newVenue.name= request.input('name')
            newVenue.phone= request.input('phone')
            newVenue.address= request.input('address')
            await newVenue.save()
            response.ok({message:'stored'})
        } catch (error) {
            response.badRequest({error:error.messages})
        }
    }

    public async update({params, request,response}:HttpContextContract){
        try {
            let id = params.id
            await request.validate(VenueValidator)
            // await Database.from('venues').where('id',id).update({
            // name: request.input('name'),
            // phone: request.input('phone'),
            // address: request.input('address'),
        // })
            let venue = await Venue.findByOrFail('id',id)
            venue.name= request.input('name')
            venue.phone= request.input('phone')
            venue.address= request.input('address')
            await venue.save()
            response.ok({message:'updated'})
        } catch (error) {
            response.badRequest({error:error.messages})
        }
        
    }

    public async destroy({params,response}:HttpContextContract){
        let id = params.id
        // await Database.from('venues').where('id',id).delete()

        let venue = await Venue.findByOrFail('id',id)
        await venue.delete()
        response.ok({message:'deleted'})
    }
}
