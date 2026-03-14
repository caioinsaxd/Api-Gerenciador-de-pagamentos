import { purchaseValidator } from '#validators/purchase'
import Client from '#models/client'
import Gateway from '#models/gateway'
import Product from '#models/product'
import Transaction from '#models/transaction'
import { GatewayManager } from '#services/gateway_manager'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class PurchaseController {
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(purchaseValidator)

    const productIds = data.products.map((p) => p.id)
    const products = await Product.query().whereIn('id', productIds)

    if (products.length !== productIds.length) {
      return response.status(400).json({
        success: false,
        error: 'One or more products not found',
      })
    }

    const productMap = new Map(products.map((p) => [p.id, p]))

    let totalAmount = 0
    for (const item of data.products) {
      const product = productMap.get(item.id)
      totalAmount += product!.amount * item.quantity
    }

    let client = await Client.findBy('email', data.email)
    if (!client) {
      client = await Client.create({
        name: data.name,
        email: data.email,
      })
    }

    const gatewayManager = new GatewayManager()
    const paymentResult = await gatewayManager.processPayment({
      amount: totalAmount,
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

    let gateway = null
    if (paymentResult.gatewayName) {
      gateway = await Gateway.query().where('name', paymentResult.gatewayName).first()
    }
    if (!gateway) {
      gateway = await Gateway.query().orderBy('priority', 'asc').first()
    }

    const transaction = await Transaction.create({
      clientId: client.id,
      gatewayId: gateway?.id,
      externalId: paymentResult.externalId,
      amount: totalAmount,
      cardLastNumbers: data.cardNumber.slice(-4),
      status: 'APPROVED',
    })

    for (const item of data.products) {
      await db.table('transaction_products').insert({
        transaction_id: transaction.id,
        product_id: item.id,
        quantity: item.quantity,
        created_at: new Date(),
      })
    }

    return response.json({
      success: true,
      transactionId: transaction.id,
      externalId: paymentResult.externalId,
      amount: totalAmount,
      status: transaction.status,
    })
  }
}
