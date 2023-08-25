import { faker } from '@faker-js/faker'

const data = []

for (let id = 1; id <= 5; id++) {
  data.push({
    id,
    name: faker.lorem.word(),
    created_at: new Date(),
    updated_at: new Date()
  })
}

export const seed = knex => knex('tags').del()
  .then(() => knex('tags').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
