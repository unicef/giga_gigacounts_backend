import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/RoleService'


export default class RolesController {
    public async getRoles({ auth, response }: HttpContextContract) {
        if (!auth.user) return
    
        const roles = await service.getRoles()
        
        return response.ok(roles)
      }
}
