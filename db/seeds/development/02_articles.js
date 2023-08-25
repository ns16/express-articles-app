import { faker } from '@faker-js/faker'

const data = []

for (let id = 1; id <= 20; id++) {
  data.push({
    id,
    user_id: Math.ceil(id / 2),
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    status: 'published',
    created_at: new Date(),
    updated_at: new Date()
  })
}

export const seed = knex => knex('articles').del()
  .then(() => knex('articles').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
