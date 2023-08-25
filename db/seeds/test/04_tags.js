const data = [
  {
    id: 1,
    name: 'rem',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 2,
    name: 'perferendis',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 3,
    name: 'aliquam',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 4,
    name: 'nulla',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 5,
    name: 'veniam',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  }
]

export const seed = knex => knex('tags').del()
  .then(() => knex('tags').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
