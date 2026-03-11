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
}
