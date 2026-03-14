import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('transaction_id').unsigned().references('transactions.id').onDelete('CASCADE')
      table.integer('product_id').unsigned().references('products.id').onDelete('CASCADE')
      table.integer('quantity').notNullable()

      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
