import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'

export default class extends BaseSeeder {
  async run() {
    await Product.createMany([
      { name: 'Produto A', amount: 1000 },
      { name: 'Produto B', amount: 2500 },
      { name: 'Produto C', amount: 500 },
    ])
  }
}
