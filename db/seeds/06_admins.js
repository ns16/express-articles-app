import bcrypt from 'bcrypt'

const data = [
  {
    id: 1,
    name: 'Nikolay Shamayko',
    username: 'ns16',
    password: bcrypt.hashSync('123456', 12),
    email: 'nikolay.shamayko@gmail.com',
    created_at: new Date(),
    updated_at: new Date()
  }
]

export const seed = knex => knex('admins').del()
  .then(() => knex('admins').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
