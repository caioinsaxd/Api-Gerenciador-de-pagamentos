import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import PurchaseController from '#controllers/purchase_controller'
import GatewayController from '#controllers/gateway_controller'
import ClientController from '#controllers/client_controller'
import TransactionController from '#controllers/transaction_controller'
import SwaggerController from '#controllers/swagger_controller'

router.get('/', () => {
  return { hello: 'world' }
})

router.get('/docs', [SwaggerController, 'index'])
router.get('/docs/openapi.json', [SwaggerController, 'spec'])

const publicRoutes = router.group(() => {
  router.post('purchase', [PurchaseController, 'store'])
})

const authRoutes = router.group(() => {
  router
    .group(() => {
      router.post('signup', [controllers.NewAccount, 'store'])
      router.post('login', [controllers.AccessToken, 'store'])
      router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
    })
    .prefix('auth')
    .as('auth')

  router.get('gateways', [GatewayController, 'index'])
  router.patch('gateways/:id', [GatewayController, 'update'])

  router.get('clients', [ClientController, 'index'])
  router.get('clients/:id', [ClientController, 'show'])

  router.get('transactions', [TransactionController, 'index'])
  router.get('transactions/:id', [TransactionController, 'show'])
  router.post('transactions/:id/refund', [TransactionController, 'refund'])
}).use(middleware.auth())

router
  .group(() => {
    publicRoutes
    authRoutes
  })
  .prefix('/api/v1')
