import { test } from '@japa/runner'

const baseUrl = 'http://localhost:3333/api/v1'

test.group('Fluxo de Estorno', () => {
  test('deve realizar estorno de transação', async ({ assert, client }) => {
    const email = `refund${Date.now()}@test.com`

    const purchaseResponse = await client.post(`${baseUrl}/purchase`).json({
      products: [{ id: 1, quantity: 1 }],
      name: 'Teste reembolso',
      email,
      cardNumber: '4532123456789012',
      cvv: '123',
    })

    assert.isTrue(purchaseResponse.status() === 200)

    const transactionId = purchaseResponse.body().transactionId
    assert.exists(transactionId)

    const loginResponse = await client.post(`${baseUrl}/auth/login`).json({
      email: 'admin@test.com',
      password: 'password123',
    })

    const token = loginResponse.body().data?.token
    assert.exists(token)

    const refundResponse = await client
      .post(`${baseUrl}/transactions/${transactionId}/refund`)
      .header('Authorization', `Bearer ${token}`)
      .json({})

    assert.isTrue(refundResponse.status() === 200, `Esperado status 200 mas resultado foi ${refundResponse.status()}: ${JSON.stringify(refundResponse.body())}`)
    assert.isTrue(refundResponse.body().success)
  })
})
