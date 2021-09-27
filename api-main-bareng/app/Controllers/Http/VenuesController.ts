import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VenueValidator from 'App/Validators/VenueValidator'
import Venue from 'App/Models/Venue'


export default class VenuesController {
    public async index({response}:HttpContextContract){
        let venues = await Venue.query().preload('fields',(fieldQuery)=>{
            fieldQuery.select(['name','type'])
        })  
        response.status(200).json({message:'success get venues data',data:venues})
    }

    public async show({params, response}:HttpContextContract){
        let venue = await Venue.query().where('id',params.id).preload('fields',(fieldQuery)=>{
            fieldQuery.select(['name','type'])
        }).firstOrFail()
        return response.status(200).json({message:'success get venues data',data:venue})
    }

    public async store({auth,request,response}:HttpContextContract){
        try {
            const user = await auth.user!
            const payload = await request.validate(VenueValidator)
            let newVenue = new Venue()
            newVenue.name= payload.name
            newVenue.phone= payload.phone
            newVenue.address= payload.address
            newVenue.related('owner').associate(user)
            response.ok({message:'stored'})
        } catch (error) {
            response.badRequest({error:error.messages})
        }
    }

    public async update({params, request,response}:HttpContextContract){
        try {
            let id = params.id
            await request.validate(VenueValidator)
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

        let venue = await Venue.findByOrFail('id',id)
        await venue.delete()
        response.ok({message:'deleted'})
    }
}
