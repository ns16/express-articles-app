import bcrypt from 'bcrypt'

const data = [
  {
    id: 1,
    name: 'Sheldon Bahringer',
    username: 'Sheldon52',
    password: bcrypt.hashSync('123456', 12),
    email: 'Sheldon_Bahringer6@yahoo.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 2,
    name: 'Harmony Sawayn',
    username: 'Harmony_Sawayn36',
    password: bcrypt.hashSync('123456', 12),
    email: 'Harmony.Sawayn12@gmail.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 3,
    name: 'Hollie Hintz',
    username: 'Hollie_Hintz',
    password: bcrypt.hashSync('123456', 12),
    email: 'Hollie_Hintz49@hotmail.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 4,
    name: 'Celestine Rolfson',
    username: 'Celestine_Rolfson',
    password: bcrypt.hashSync('123456', 12),
    email: 'Celestine_Rolfson49@hotmail.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 5,
    name: "Elmore O'Kon II",
    username: 'Elmore77',
    password: bcrypt.hashSync('123456', 12),
    email: 'Elmore.OKon4@yahoo.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 6,
    name: 'Hester Schowalter',
    username: 'Hester_Schowalter67',
    password: bcrypt.hashSync('123456', 12),
    email: 'Hester1@yahoo.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 7,
    name: 'Alysha Rath',
    username: 'Alysha.Rath',
    password: bcrypt.hashSync('123456', 12),
    email: 'Alysha94@gmail.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 8,
    name: 'Rita Cremin',
    username: 'Rita_Cremin64',
    password: bcrypt.hashSync('123456', 12),
    email: 'Rita47@yahoo.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 9,
    name: 'Albina Kuphal-Zieme',
    username: 'Albina_Kuphal-Zieme',
    password: bcrypt.hashSync('123456', 12),
    email: 'Albina_Kuphal-Zieme@hotmail.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 10,
    name: 'Kevin Keeling',
    username: 'Kevin12',
    password: bcrypt.hashSync('123456', 12),
    email: 'Kevin3@hotmail.com',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  }
]

export const seed = knex => knex('users').del()
  .then(() => knex('users').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
