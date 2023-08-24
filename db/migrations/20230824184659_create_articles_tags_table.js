export const up = knex => knex.schema.hasTable('articles_tags')
  .then(exists => {
    if (!exists) {
      return knex.schema.createTable('articles_tags', table => {
        table.integer('article_id').unsigned().notNullable()
        table.foreign('article_id').references('id').inTable('articles').onDelete('cascade')
        table.integer('tag_id').unsigned().notNullable()
        table.foreign('tag_id').references('id').inTable('tags').onDelete('cascade')
        table.primary(['article_id', 'tag_id'])
      })
    }
  })

export const down = knex => knex.schema.dropTableIfExists('articles_tags')
