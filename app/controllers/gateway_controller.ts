import Gateway from '#models/gateway'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const updateGatewayValidator = vine.create({
  isActive: vine.boolean().optional(),
  priority: vine.number().positive().optional(),
  name: vine.string().minLength(1).maxLength(255).optional(),
})

export default class GatewayController {
  async index({ response }: HttpContext) {
    const gateways = await Gateway.query().orderBy('priority', 'asc')
    return response.json({ data: gateways })
  }

  async update({ request, response, params }: HttpContext) {
    const gateway = await Gateway.find(params.id)
    if (!gateway) {
      return response.status(404).json({ error: 'Gateway not found' })
    }

    const data = await request.validateUsing(updateGatewayValidator)

    if (data.isActive !== undefined) {
      gateway.isActive = data.isActive
    }
    if (data.priority !== undefined) {
      gateway.priority = data.priority
    }
    if (data.name !== undefined) {
      gateway.name = data.name
    }

    await gateway.save()

    return response.json({ data: gateway })
  }
}
