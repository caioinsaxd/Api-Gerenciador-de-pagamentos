import { test } from '@japa/runner'
import { GatewayManager } from '#services/gateway_manager'

test.group('Serviço de Gateway', () => {
  test('deve processar pagamento via Gateway 1', async ({ assert }) => {
    const manager = new GatewayManager()
    
    const result = await manager.processPayment({
      amount: 1000,
      name: 'Usuário Teste',
      email: 'test@test.com',
      cardNumber: '5569000000006063',
      cvv: '010',
    })

    assert.isTrue(result.success)
    assert.exists(result.externalId)
  })

  test('deve fallback para Gateway 2 quando Gateway 1 falha', async ({ assert }) => {
    const manager = new GatewayManager()
    
    const result = await manager.processPayment({
      amount: 1000,
      name: 'Usuário Teste',
      email: 'test@test.com',
      cardNumber: '5569000000006063',
      cvv: '100',
    })

    assert.isTrue(result.success)
    assert.exists(result.externalId)
  })

  test('deve processar estorno via gateway correto', async ({ assert }) => {
    const manager = new GatewayManager()
    
    const paymentResult = await manager.processPayment({
      amount: 1000,
      name: 'Usuário Teste',
      email: 'test@test.com',
      cardNumber: '5569000000006063',
      cvv: '010',
    })

    assert.isTrue(paymentResult.success)

    const refundResult = await manager.processRefund(paymentResult.externalId!, 'Gateway 1')
    assert.isTrue(refundResult.success)
  })
})
