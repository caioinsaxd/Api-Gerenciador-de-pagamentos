import env from '#start/env'

export interface PaymentData {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export interface PaymentResult {
  success: boolean
  externalId?: string
  gatewayName?: string
  error?: string
}

export interface RefundResult {
  success: boolean
  error?: string
}

export abstract class BaseGateway {
  abstract name: string
  abstract baseUrl: string

  abstract processPayment(data: PaymentData): Promise<PaymentResult>
  abstract processRefund(externalId: string): Promise<RefundResult>

  protected getCardLastNumbers(cardNumber: string): string {
    return cardNumber.slice(-4)
  }

  protected get timeout(): number {
    return env.get('GATEWAY_TIMEOUT') || 30000
  }

  protected async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      return response
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request to ${this.name} timed out after ${this.timeout}ms`)
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }
}
