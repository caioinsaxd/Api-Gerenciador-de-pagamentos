import db from '@adonisjs/lucid/services/db'

export default class {
  async run() {
    const now = new Date()
    await db.table('gateways').multiInsert([
      {
        name: 'Gateway 1',
        is_active: true,
        priority: 1,
        created_at: now,
      },
      {
        name: 'Gateway 2',
        is_active: true,
        priority: 2,
        created_at: now,
      },
    ])
  }
}
