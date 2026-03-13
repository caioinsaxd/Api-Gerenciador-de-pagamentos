import vine from '@vinejs/vine'

export const purchaseValidator = vine.create({
  amount: vine.number().positive(),
  name: vine.string().minLength(1).maxLength(255),
  email: vine.string().email().maxLength(254),
  cardNumber: vine.string().regex(/^\d{16}$/),
  cvv: vine.string().regex(/^\d{3}$/),
})
