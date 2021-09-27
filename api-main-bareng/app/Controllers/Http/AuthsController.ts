import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'
import User from 'App/Models/User'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'


export default class AuthsController {
    public async register({request,response}:HttpContextContract){
        try {
            const data = await request.validate(UserValidator)

            const newUser = await User.create(data)

            let otp_code: number = Math.floor(100000+Math.random()*900000)
            await Database.table('otp_codes').insert({otp_code:otp_code,user_id:newUser.id})
            await Mail.send((message) => {
                message
                  .from('admin@sanberdev.com')
                  .to(data.email)
                  .subject('Welcome Onboard!')
                  .htmlView('mail/otp_verification', { name: data.name,otp_code:otp_code })
              })
          


            return response.created({status:'registered',data:newUser,message:'Silakan melakukan verifikasi kode OTP'})
        } catch (error) {
            return response.unprocessableEntity({error:error.message})
        }
    }
    public async login({request,response,auth}:HttpContextContract){
        const loginSchema = schema.create({
            email: schema.string({trim:true},[
                rules.email()
            ]),
            password: schema.string()
        })
        try {
            await request.validate({schema:loginSchema})
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
    public async otp_verification({request,response}:HttpContextContract){
        const otp_code = request.input('otp_code')
        const email = request.input('email')

        const user = await User.findByOrFail('email',email)

        const dataOtp = await Database.from('otp_codes').where('otp_code',otp_code).firstOrFail()

        if(user.id==dataOtp.user_id){
            user.is_verified = true
            await user.save()
            return response.ok({status:'success',data:'OTP verification succeeded'})
        }else{
            return response.badRequest({status:'error',data:'OTP verification failed'})
        }
    }
}
