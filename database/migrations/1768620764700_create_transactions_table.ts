import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('client_id').unsigned().references('clients.id').onDelete('CASCADE')
      table.integer('gateway_id').unsigned().references('gateways.id').onDelete('SET NULL')
      table.string('external_id').nullable()
      table.enum('status', ['PENDING', 'APPROVED', 'DECLINED', 'REFUNDED']).defaultTo('PENDING')
      table.integer('amount').notNullable()
      table.string('card_last_numbers', 4).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
