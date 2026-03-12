import { BaseGateway, type PaymentData, type PaymentResult, type RefundResult } from './base_gateway.js'
import env from '#start/env'

interface Gateway2Response {
  id?: string
  message?: string
}

export class Gateway2 extends BaseGateway {
  name = 'Gateway 2'
  baseUrl = 'http://localhost:3002'

  private get authToken(): string {
    return env.get('GATEWAY_2_TOKEN') ?? ''
  }

  private get authSecret(): string {
    return env.get('GATEWAY_2_SECRET') ?? ''
  }

  async processPayment(data: PaymentData): Promise<PaymentResult> {
    const response = await fetch(`${this.baseUrl}/transacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Gateway-Auth-Token': this.authToken,
        'Gateway-Auth-Secret': this.authSecret,
      },
      body: JSON.stringify({
        valor: data.amount,
        nome: data.name,
        email: data.email,
        numeroCartao: data.cardNumber,
        cvv: data.cvv,
      }),
    })

    const result = await response.json() as Gateway2Response

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Payment failed',
      }
    }

    return {
      success: true,
      externalId: result.id,
      gatewayName: this.name,
    }
  }

  async processRefund(externalId: string): Promise<RefundResult> {
    const response = await fetch(`${this.baseUrl}/transacoes/reembolso`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Gateway-Auth-Token': this.authToken,
        'Gateway-Auth-Secret': this.authSecret,
      },
      body: JSON.stringify({ id: externalId }),
    })

    if (!response.ok) {
      const result = await response.json() as Gateway2Response
      return {
        success: false,
        error: result.message || 'Refund failed',
      }
    }

    return { success: true }
  }
}
