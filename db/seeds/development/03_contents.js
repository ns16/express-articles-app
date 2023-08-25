import { faker } from '@faker-js/faker'

const data = []

for (let id = 1; id <= 20; id++) {
  data.push({
    id,
    article_id: id,
    body: faker.lorem.paragraphs(),
    created_at: new Date(),
    updated_at: new Date()
  })
}

export const seed = knex => knex('contents').del()
  .then(() => knex('contents').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
