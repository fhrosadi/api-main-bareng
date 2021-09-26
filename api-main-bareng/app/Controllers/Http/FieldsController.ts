import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FieldValidator from 'App/Validators/FieldValidator'
// import Database from '@ioc:Adonis/Lucid/Database'
import Field from 'App/Models/Field'

export default class FieldsController {

    public async index({response}:HttpContextContract){
    // let fields = await Database.from('fields').select('id','name','type','venue_id')
    let fields = await Field.all()
    response.status(200).json({message:'success get fields data',data:fields})
    }

    public async show({params, response}:HttpContextContract){
        // let field = await Database.from('fields').where('id',params.id).select('id','name','type','venue_id').firstOrFail()
        let field = await Field.findByOrFail('id',params.id)
        return response.status(200).json({message:'success get fields data',data:field})

    }

    public async store({params, request,response}:HttpContextContract){
        try {
            let venue_id = params.venue_id
            await request.validate(FieldValidator)

            // await Database.table('fields').returning('id').insert({
            //     name: request.input('name'),
            //     type: request.input('type'),
            //     venue_id: venue_id,
        //     })
            let newField = await new Field()
            newField.name= request.input('name')
            newField.type= request.input('type')
            newField.venue_id= venue_id
        response.ok({message:'stored'})
        } catch (error) {
            response.badRequest({error:error.messages})
        }
    }

    public async update({params, request,response}:HttpContextContract){
        try {
            let id = params.id
            await request.validate(FieldValidator)
        //     await Database.from('fields').where('id',id).update({
        //     name: request.input('name'),
        //     type: request.input('type'),
        //     venue_id: request.input('venue_id'),
        // })
            let field = await Field.findByOrFail('id',id)
            field.name = request.input('name')
            field.type = request.input('type')
            field.venue_id = request.input('venue_id')
            field.save()
            response.ok({message:'updated'})
            
        } catch (error) {
            response.badRequest({error:error.messages})
        }
        
    }

    public async destroy({params,response}:HttpContextContract){
        let id = params.id
        // await Database.from('fields').where('id',id).delete()
        let field = await Field.findByOrFail('id',id)
        await field.delete()
        response.ok({message:'deleted'})
    }
}
