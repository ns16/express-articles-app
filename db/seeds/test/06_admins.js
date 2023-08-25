import bcrypt from 'bcrypt'

const data = [
  {
    id: 1,
    name: 'Nikolay Shamayko',
    username: 'ns16',
    password: bcrypt.hashSync('123456', 12),
    email: 'nikolay.shamayko@gmail.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  }
]

export const seed = knex => knex('admins').del()
  .then(() => knex('admins').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
