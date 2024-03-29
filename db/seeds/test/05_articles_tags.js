const data = [
  { article_id: 1, tag_id: 2 },
  { article_id: 1, tag_id: 3 },
  { article_id: 1, tag_id: 5 },
  { article_id: 2, tag_id: 1 },
  { article_id: 2, tag_id: 2 },
  { article_id: 2, tag_id: 3 },
  { article_id: 3, tag_id: 2 },
  { article_id: 3, tag_id: 3 },
  { article_id: 3, tag_id: 4 },
  { article_id: 4, tag_id: 1 },
  { article_id: 4, tag_id: 4 },
  { article_id: 4, tag_id: 5 },
  { article_id: 5, tag_id: 3 },
  { article_id: 5, tag_id: 4 },
  { article_id: 5, tag_id: 5 },
  { article_id: 6, tag_id: 1 },
  { article_id: 6, tag_id: 2 },
  { article_id: 6, tag_id: 3 },
  { article_id: 7, tag_id: 1 },
  { article_id: 7, tag_id: 2 },
  { article_id: 7, tag_id: 5 },
  { article_id: 8, tag_id: 3 },
  { article_id: 8, tag_id: 4 },
  { article_id: 8, tag_id: 5 },
  { article_id: 9, tag_id: 1 },
  { article_id: 9, tag_id: 4 },
  { article_id: 9, tag_id: 5 },
  { article_id: 10, tag_id: 2 },
  { article_id: 10, tag_id: 3 },
  { article_id: 10, tag_id: 4 },
  { article_id: 11, tag_id: 1 },
  { article_id: 11, tag_id: 2 },
  { article_id: 11, tag_id: 5 },
  { article_id: 12, tag_id: 1 },
  { article_id: 12, tag_id: 4 },
  { article_id: 12, tag_id: 5 },
  { article_id: 13, tag_id: 2 },
  { article_id: 13, tag_id: 4 },
  { article_id: 13, tag_id: 5 },
  { article_id: 14, tag_id: 1 },
  { article_id: 14, tag_id: 3 },
  { article_id: 14, tag_id: 5 },
  { article_id: 15, tag_id: 1 },
  { article_id: 15, tag_id: 2 },
  { article_id: 15, tag_id: 4 },
  { article_id: 16, tag_id: 1 },
  { article_id: 16, tag_id: 3 },
  { article_id: 16, tag_id: 5 },
  { article_id: 17, tag_id: 2 },
  { article_id: 17, tag_id: 3 },
  { article_id: 17, tag_id: 5 },
  { article_id: 18, tag_id: 1 },
  { article_id: 18, tag_id: 2 },
  { article_id: 18, tag_id: 3 },
  { article_id: 19, tag_id: 1 },
  { article_id: 19, tag_id: 3 },
  { article_id: 19, tag_id: 4 },
  { article_id: 20, tag_id: 1 },
  { article_id: 20, tag_id: 3 },
  { article_id: 20, tag_id: 5 }
]

export const seed = knex => knex('articles_tags').del()
  .then(() => knex('articles_tags').insert(data))
  .catch(error => console.error(error)) // eslint-disable-line no-console
