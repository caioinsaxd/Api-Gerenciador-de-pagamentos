import { test } from '@japa/runner'

const baseUrl = 'http://localhost:3333/api/v1'

test.group('Fluxo de Compra', () => {
  test('deve criar transação com compra', async ({ assert, client }) => {
    const email = `compra${Date.now()}@test.com`

    const response = await client.post(`${baseUrl}/purchase`).json({
      products: [{ id: 1, quantity: 1 }],
      name: 'Teste Compra',
      email,
      cardNumber: '5569000000006063',
      cvv: '010',
    })

    assert.isTrue(response.status() === 200)
    assert.isTrue(response.body().success)
  })

  test('deve criar cliente na primeira compra', async ({ assert, client }) => {
    const email = `novocliente${Date.now()}@test.com`

    const response = await client.post(`${baseUrl}/purchase`).json({
      products: [{ id: 1, quantity: 1 }],
      name: 'Novo Cliente',
      email,
      cardNumber: '5569000000006063',
      cvv: '010',
    })

    assert.isTrue(response.status() === 200)
  })
})
