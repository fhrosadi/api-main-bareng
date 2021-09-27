import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OwnerOnly {
  public async handle ({auth,response}: HttpContextContract, next: () => Promise<void>) {
    const user = await auth.user!
    if(user.role!='owner'){
      return response.unauthorized({error:'Access just allowed for owner!'})
    }
    await next()
  }
}
