import { TransactionSchema } from '#database/schema'

export default class Transaction extends TransactionSchema {
  static table = 'transactions'
}
