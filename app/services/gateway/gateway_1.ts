import { BaseGateway, type PaymentData, type PaymentResult, type RefundResult } from './base_gateway.js'

interface Gateway1LoginResponse {
  token: string
}

interface Gateway1Response {
  id?: number
  message?: string
}

export class Gateway1 extends BaseGateway {
  name = 'Gateway 1'
  get baseUrl() {
    const env = process.env.NODE_ENV || 'development'
    if (env === 'docker' || env === 'test') {
      return 'http://gateways:3001'
    }
    return 'http://localhost:3001'
  }

  private token: string | null = null

  async login(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dev@betalent.tech',
        token: 'FEC9BB078BF338F464F96B48089EB498',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to login to Gateway 1')
    }

    const data = await response.json() as Gateway1LoginResponse
    this.token = data.token
  }

  async processPayment(data: PaymentData): Promise<PaymentResult> {
    if (!this.token) {
      await this.login()
    }

    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        amount: data.amount,
        name: data.name,
        email: data.email,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
      }),
    })

    const result = await response.json() as Gateway1Response

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Payment failed',
      }
    }

    return {
      success: true,
      externalId: String(result.id),
      gatewayName: this.name,
    }
  }

  async processRefund(externalId: string): Promise<RefundResult> {
    if (!this.token) {
      await this.login()
    }

    const response = await fetch(`${this.baseUrl}/transactions/${externalId}/charge_back`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    })

    if (!response.ok) {
      const result = await response.json() as Gateway1Response
      return {
        success: false,
        error: result.message || 'Refund failed',
      }
    }

    return { success: true }
  }
}
