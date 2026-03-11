import { BaseGateway, type PaymentData, type PaymentResult, type RefundResult } from './gateway/base_gateway.js'
import { Gateway1 } from './gateway/gateway_1.js'
import { Gateway2 } from './gateway/gateway_2.js'

export class GatewayManager {
  private gateways: BaseGateway[] = []

  constructor() {
    this.gateways = [
      new Gateway1(),
      new Gateway2(),
    ]
  }

  async processPayment(data: PaymentData): Promise<PaymentResult> {
    for (const gateway of this.gateways) {
      try {
        const result = await gateway.processPayment(data)
        if (result.success) {
          return result
        }
      } catch (error) {
        console.error(`Gateway ${gateway.name} failed:`, error)
        continue
      }
    }

    return {
      success: false,
      error: 'All gateways failed',
    }
  }

  async processRefund(externalId: string, gatewayName: string): Promise<RefundResult> {
    const gateway = this.gateways.find((g) => g.name === gatewayName)

    if (!gateway) {
      return {
        success: false,
        error: 'Gateway not found',
      }
    }

    return gateway.processRefund(externalId)
  }
}
