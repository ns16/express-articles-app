export const up = knex => knex.schema.hasTable('admins')
  .then(exists => {
    if (!exists) {
      return knex.schema.createTable('admins', table => {
        table.increments('id')
        table.string('name', 100).notNullable()
        table.string('username', 100).notNullable().unique()
        table.specificType('password', 'char(60)').notNullable()
        table.string('email', 100).notNullable().unique()
        table.timestamps()
      })
    }
  })

export const down = knex => knex.schema.dropTableIfExists('admins')
