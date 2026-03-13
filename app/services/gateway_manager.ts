import type {
  BaseGateway,
  PaymentData,
  PaymentResult,
  RefundResult,
} from './gateway/base_gateway.js'
import { Gateway1 } from './gateway/gateway_1.js'
import { Gateway2 } from './gateway/gateway_2.js'
import Gateway from '#models/gateway'

export class GatewayManager {
  private gateways: Map<string, BaseGateway> = new Map()

  constructor() {
    this.gateways.set('Gateway 1', new Gateway1())
    this.gateways.set('Gateway 2', new Gateway2())
  }

  async processPayment(data: PaymentData): Promise<PaymentResult> {
    const activeGateways = await Gateway.query().where('isActive', true).orderBy('priority', 'asc')

    for (const dbGateway of activeGateways) {
      const gateway = this.gateways.get(dbGateway.name)

      if (!gateway) {
        console.warn(`Gateway ${dbGateway.name} not found in implementation`)
        continue
      }

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
    const gateway = this.gateways.get(gatewayName)

    if (!gateway) {
      return {
        success: false,
        error: 'Gateway not found',
      }
    }

    return gateway.processRefund(externalId)
  }
}
