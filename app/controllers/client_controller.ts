import Client from '#models/client'
import Transaction from '#models/transaction'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientController {
  async index({ response }: HttpContext) {
    const clients = await Client.query().orderBy('createdAt', 'desc')
    return response.json({ data: clients })
  }

  async show({ response, params }: HttpContext) {
    const client = await Client.find(params.id)
    if (!client) {
      return response.status(404).json({ error: 'Client not found' })
    }

    const transactions = await Transaction.query()
      .where('client_id', client.id)
      .orderBy('createdAt', 'desc')

    return response.json({
      data: {
        id: client.id,
        name: client.name,
        email: client.email,
        createdAt: client.createdAt,
        transactions: transactions.map((t) => ({
          id: t.id,
          externalId: t.externalId,
          amount: t.amount,
          status: t.status,
          cardLastNumbers: t.cardLastNumbers,
          createdAt: t.createdAt,
        })),
      },
    })
  }
}
