import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'

export default class extends BaseSeeder {
  async run() {
    await Product.createMany([
      { name: 'Produto A', value: 1000 },
      { name: 'Produto B', value: 2500 },
      { name: 'Produto C', value: 500 },
    ])
  }
}
