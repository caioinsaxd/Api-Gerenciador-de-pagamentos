import { purchaseValidator } from '#validators/purchase'
import Client from '#models/client'
import Gateway from '#models/gateway'
import Transaction from '#models/transaction'
import { GatewayManager } from '#services/gateway_manager'
import type { HttpContext } from '@adonisjs/core/http'

export default class PurchaseController {
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(purchaseValidator)

    let client = await Client.findBy('email', data.email)
    if (!client) {
      client = await Client.create({
        name: data.name,
        email: data.email,
      })
    }

    const gatewayManager = new GatewayManager()
    const paymentResult = await gatewayManager.processPayment({
      amount: data.amount,
      name: data.name,
      email: data.email,
      cardNumber: data.cardNumber,
      cvv: data.cvv,
    })

    if (!paymentResult.success) {
      return response.status(400).json({
        success: false,
        error: paymentResult.error,
      })
    }

    const gateway = await Gateway.query().orderBy('priority', 'asc').first()

    const transaction = await Transaction.create({
      clientId: client.id,
      gatewayId: gateway?.id,
      externalId: paymentResult.externalId,
      amount: data.amount,
      cardLastNumbers: data.cardNumber.slice(-4),
      status: 'APPROVED',
    })

    return response.json({
      success: true,
      transactionId: transaction.id,
      externalId: paymentResult.externalId,
      amount: data.amount,
      status: transaction.status,
    })
  }
}
