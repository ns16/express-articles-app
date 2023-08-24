export const up = knex => knex.schema.hasTable('articles')
  .then(exists => {
    if (!exists) {
      return knex.schema.createTable('articles', table => {
        table.increments('id')
        table.integer('user_id').unsigned().notNullable()
        table.foreign('user_id').references('id').inTable('users').onDelete('cascade')
        table.string('title', 100).notNullable()
        table.string('description', 500).notNullable()
        table.enum('status', ['published', 'draft']).notNullable()
        table.timestamps()
      })
    }
  })

export const down = knex => knex.schema.dropTableIfExists('articles')
