import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/VenueValidator'
// import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { schema } from '@ioc:Adonis/Core/Validator'


export default class AuthsController {
    public async register({request,response}:HttpContextContract){
        try {
            const data = await request.validate(UserValidator)

            await User.create(data)

            return response.created({message:'registered'})
        } catch (error) {
            return response.unprocessableEntity({error:error.message})
        }
    }
    public async login({request,response,auth}:HttpContextContract){
        const userSchema = schema.create({
            email: schema.string(),
            password: schema.string()
        })
        try {
            await request.validate({schema:userSchema})
            const email = request.input('email')
            const password = request.input('password')
            const token = await auth.use('api').attempt(email,password)
            return response.ok({message:'login success',token})
        } catch (error) {
            if(error.guard){
                return response.badRequest({message:'login error', error:error.message})
            }else{
                return response.badRequest({message:'login error', error:error.messages})
            }
        }
    }
}
