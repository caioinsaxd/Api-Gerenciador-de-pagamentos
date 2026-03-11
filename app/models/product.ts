import { ProductSchema } from '#database/schema'

export default class Product extends ProductSchema {
  static table = 'products'
}
