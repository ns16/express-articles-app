export const up = knex => knex.schema.hasTable('tags')
  .then(exists => {
    if (!exists) {
      return knex.schema.createTable('tags', table => {
        table.increments('id')
        table.string('name', 100).notNullable()
        table.timestamps()
      })
    }
  })

export const down = knex => knex.schema.dropTableIfExists('tags')
