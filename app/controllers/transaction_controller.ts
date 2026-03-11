import Transaction from '#models/transaction'
import Gateway from '#models/gateway'
import { GatewayManager } from '#services/gateway_manager'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionController {
  async index({ response }: HttpContext) {
    const transactions = await Transaction.query()
      .orderBy('createdAt', 'desc')
      .preload('client')

    return response.json({
      data: transactions.map((t) => ({
        id: t.id,
        externalId: t.externalId,
        amount: t.amount,
        status: t.status,
        cardLastNumbers: t.cardLastNumbers,
        clientId: t.clientId,
        gatewayId: t.gatewayId,
        createdAt: t.createdAt,
      })),
    })
  }

  async show({ response, params }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('client')
      .first()

    if (!transaction) {
      return response.status(404).json({ error: 'Transaction not found' })
    }

    let gatewayName = null
    if (transaction.gatewayId) {
      const gateway = await Gateway.find(transaction.gatewayId)
      gatewayName = gateway?.name
    }

    return response.json({
      data: {
        id: transaction.id,
        externalId: transaction.externalId,
        amount: transaction.amount,
        status: transaction.status,
        cardLastNumbers: transaction.cardLastNumbers,
        client: transaction.client
          ? {
              id: transaction.client.id,
              name: transaction.client.name,
              email: transaction.client.email,
            }
          : null,
        gateway: gatewayName,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    })
  }

  async refund({ response, params }: HttpContext) {
    const transaction = await Transaction.find(params.id)
    if (!transaction) {
      return response.status(404).json({ error: 'Transaction not found' })
    }

    if (!transaction.externalId) {
      return response.status(400).json({ error: 'Transaction has no external ID' })
    }

    if (transaction.status === 'REFUNDED') {
      return response.status(400).json({ error: 'Transaction already refunded' })
    }

    if (!transaction.gatewayId) {
      return response.status(400).json({ error: 'Transaction has no gateway' })
    }

    const gateway = await Gateway.find(transaction.gatewayId)
    if (!gateway) {
      return response.status(400).json({ error: 'Gateway not found' })
    }

    const gatewayManager = new GatewayManager()
    const refundResult = await gatewayManager.processRefund(
      transaction.externalId,
      gateway.name
    )

    if (!refundResult.success) {
      return response.status(400).json({
        success: false,
        error: refundResult.error,
      })
    }

    transaction.status = 'REFUNDED'
    await transaction.save()

    return response.json({
      success: true,
      message: 'Transaction refunded successfully',
      transactionId: transaction.id,
    })
  }
}
