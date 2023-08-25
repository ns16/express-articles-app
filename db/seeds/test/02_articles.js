const data = [
  {
    id: 1,
    user_id: 1,
    title: 'sint repellendus inventore',
    description:
      'Debitis assumenda molestiae facilis odio facilis. Aliquid odit reiciendis ut rerum reiciendis. Laborum numquam explicabo non.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 2,
    user_id: 1,
    title: 'deserunt tempore sit',
    description:
      'Dicta mollitia dolorem dolorum doloremque beatae. Ut eum itaque ut. Repellat magni perspiciatis suscipit ab.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 3,
    user_id: 2,
    title: 'et accusantium accusantium',
    description:
      'Dolores perspiciatis dolorum. Corrupti ullam accusamus nesciunt soluta itaque consectetur corporis earum. In amet veritatis dignissimos laudantium ipsum repellat consectetur accusamus officiis.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 4,
    user_id: 2,
    title: 'omnis id nam',
    description:
      'Totam pariatur qui culpa earum nam aperiam aperiam molestiae officiis. Libero culpa suscipit consectetur magnam porro. Molestiae doloremque ratione dolores rerum commodi optio non.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 5,
    user_id: 3,
    title: 'in fuga occaecati',
    description:
      'Tenetur doloremque explicabo voluptatem facilis expedita recusandae. Vitae perspiciatis earum quisquam alias ad itaque tempore possimus. Perferendis mollitia nobis eos libero quos perferendis doloremque enim.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 6,
    user_id: 3,
    title: 'porro maiores non',
    description:
      'Porro reiciendis quidem recusandae sint officia aut maxime accusantium. Temporibus repellat error repellat soluta. Veniam beatae minima natus aspernatur ut deleniti laudantium.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 7,
    user_id: 4,
    title: 'fugiat sed sequi',
    description:
      'Error aperiam culpa quae occaecati expedita modi eum. Mollitia mollitia et quo. Autem nulla excepturi suscipit culpa odio.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 8,
    user_id: 4,
    title: 'nemo libero porro',
    description:
      'Sint ab magnam eos perferendis. Quod nesciunt in voluptatum numquam quasi optio. Tempora doloremque quasi mollitia doloremque dolor officiis aliquid molestiae.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 9,
    user_id: 5,
    title: 'soluta placeat mollitia',
    description:
      'Voluptate distinctio natus. Eligendi dolores quae illum deserunt nostrum eveniet dicta. Voluptates sunt nisi incidunt ducimus eligendi.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 10,
    user_id: 5,
    title: 'repudiandae magnam ex',
    description:
      'Iste a laboriosam suscipit architecto corrupti placeat a. Eos voluptatem quod corporis. Corporis iste vel.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 11,
    user_id: 6,
    title: 'facere ea odit',
    description:
      'Enim modi hic labore voluptate tempore recusandae minus. Quibusdam quod quo eaque commodi beatae harum adipisci reiciendis saepe. Soluta nulla delectus impedit non beatae soluta reprehenderit eum.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 12,
    user_id: 6,
    title: 'commodi quod quis',
    description:
      'Quia voluptate vero quidem esse eveniet. Sunt et quas molestias nemo minus. Assumenda doloremque neque earum vitae.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 13,
    user_id: 7,
    title: 'ea libero minus',
    description:
      'Dicta facere sequi deserunt totam eum debitis ducimus ut. Hic est nihil in id quibusdam doloribus. Doloribus reiciendis unde minus ut.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 14,
    user_id: 7,
    title: 'asperiores numquam labore',
    description:
      'Possimus quos explicabo nisi sit dolorem ipsa animi. Esse aut mollitia modi quidem. Nemo maxime alias quibusdam esse facere.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 15,
    user_id: 8,
    title: 'adipisci ducimus occaecati',
    description:
      'Officiis sed eaque. Eius dolor incidunt. Reprehenderit optio dolores earum consectetur similique quaerat.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 16,
    user_id: 8,
    title: 'magnam voluptate expedita',
    description:
      'Voluptate culpa quidem suscipit a odio eius eligendi. Asperiores ipsa magnam quos. Quidem delectus ipsa maxime modi beatae assumenda voluptatum beatae.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 17,
    user_id: 9,
    title: 'earum neque at',
    description:
      'Provident cum nobis qui accusantium voluptatibus fuga porro. Architecto repellendus numquam. Error quo nostrum explicabo et consequuntur quis.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 18,
    user_id: 9,
    title: 'voluptatum necessitatibus totam',
    description:
      'Fugiat distinctio incidunt illo corporis dolores. Doloremque totam id consequuntur magni non. Deserunt amet laboriosam.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 19,
    user_id: 10,
    title: 'fugit debitis ut',
    description: 'Eos accusamus repellendus est culpa iste dolor. Velit porro laborum excepturi. Officiis nisi minima.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  },
  {
    id: 20,
    user_id: 10,
    title: 'saepe cupiditate exercitationem',
    description:
      'Omnis dignissimos eius voluptatum tenetur alias quibusdam. Aliquid ex ea quos dolore sunt error veritatis. Vitae esse dolor modi voluptates minima laudantium nihil beatae esse.',
    status: 'published',
    created_at: '2023-07-01 00:00:00',
    updated_at: '2023-07-01 00:00:00'
  }
]

export const seed = knex => knex('articles').del()
  .then(() => knex('articles').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
