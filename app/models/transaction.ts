import { TransactionSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Client from './client.js'

export default class Transaction extends TransactionSchema {
  static table = 'transactions'

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>
}
