export const up = knex => knex.schema.hasTable('contents')
  .then(exists => {
    if (!exists) {
      return knex.schema.createTable('contents', table => {
        table.increments('id')
        table.integer('article_id').unsigned().notNullable().unique()
        table.foreign('article_id').references('id').inTable('articles').onDelete('cascade')
        table.text('body').notNullable()
        table.timestamps()
      })
    }
  })

export const down = knex => knex.schema.dropTableIfExists('contents')
