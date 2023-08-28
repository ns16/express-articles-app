import jwt from 'jsonwebtoken'

import { Admin, Article, Content, Tag, User } from '../../app/models/index.js'
import config from '../../config.js'

export const getAuthorization = async () => Admin.forge({ username: 'ns16' }).fetch().then(admin => jwt.sign(admin.toJSON(), config.jwtKey))

export const createUser = async () => User.forge().save({
  name: 'Rosalind Trantow',
  username: 'Rosalind4',
  password: 'Y9ECfszZ',
  email: 'Rosalind.Trantow35@gmail.com'
})

export const createArticle = async () => Article.forge().save({
  user_id: 1,
  title: 'illum beatae soluta',
  description:
    'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
  status: 'published'
})

export const createContent = async () => createArticle().then(article => Content.forge().save({
  article_id: article.id,
  body:
    'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
    'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
    'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
}))

export const createTag = async () => Tag.forge().save({
  name: 'beatae'
})

export const attachTagToArticle = async () => Promise.all([
  Article.forge({ id: 1 }).fetch({ withRelated: 'tags' }),
  Tag.forge({ id: 1 }).fetch()
]).then(([article, tag]) => article.tags().attach(tag))

export const createAdmin = async () => Admin.forge().save({
  name: 'Anatoly Muravyov',
  username: 'test',
  password: 'RDnB7LAR',
  email: 'anatoly.muravyov@gmail.com'
})
