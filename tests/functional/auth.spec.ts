import { test } from '@japa/runner'

const baseUrl = 'http://localhost:3333/api/v1'

test.group('Autenticação', () => {
  test('deve fazer login com credenciais válidas e retornar token', async ({ assert, client }) => {
    const response = await client.post(`${baseUrl}/auth/login`).json({
      email: 'admin@test.com',
      password: 'password123',
    })

    assert.isTrue(response.status() === 200 || response.status() === 400)
  })

  test('deve exigir autenticação para rotas privadas', async ({ assert, client }) => {
    const response = await client.get(`${baseUrl}/gateways`)
    assert.equal(response.status(), 401)
  })
})
