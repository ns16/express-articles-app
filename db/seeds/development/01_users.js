import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

const data = []

for (let id = 1; id <= 10; id++) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  data.push({
    id,
    name: faker.person.fullName({ firstName, lastName }),
    username: faker.internet.userName({ firstName, lastName }),
    password: bcrypt.hashSync('123456', 12),
    email: faker.internet.email({ firstName, lastName }),
    created_at: new Date(),
    updated_at: new Date()
  })
}

export const seed = knex => knex('users').del()
  .then(() => knex('users').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
