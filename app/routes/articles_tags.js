import ArticlesTagsController from '../controllers/articles_tags.js'
import ArticlesTagsValidator from '../validators/articles_tags.js'

const ArticlesTagsRoutes = [
  {
    method: 'post',
    path: '/articles-tags',
    auth: true,
    validator: ArticlesTagsValidator,
    controller: ArticlesTagsController,
    action: 'create'
  },
  {
    method: 'delete',
    path: '/articles-tags',
    auth: true,
    validator: ArticlesTagsValidator,
    controller: ArticlesTagsController,
    action: 'destroy'
  }
]

export default ArticlesTagsRoutes
