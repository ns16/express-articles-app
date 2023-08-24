import { faker } from '@faker-js/faker'

const data = []

for (let articleId = 1; articleId <= 20; articleId++) {
  const tagIds = faker.helpers.arrayElements([1, 2, 3, 4, 5], 3)
  for (const tagId of tagIds) {
    data.push({
      article_id: articleId,
      tag_id: tagId
    })
  }
}

export const seed = knex => knex('articles_tags').del()
  .then(() => knex('articles_tags').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
