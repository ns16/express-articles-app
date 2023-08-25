import ArticlesController from '../controllers/articles.js'
import ArticlesValidator from '../validators/articles.js'

const ArticlesRoutes = [
  {
    method: 'get',
    path: '/articles',
    auth: true,
    validator: ArticlesValidator,
    controller: ArticlesController,
    action: 'index'
  },
  {
    method: 'get',
    path: '/articles/all',
    auth: true,
    validator: ArticlesValidator,
    controller: ArticlesController,
    action: 'all'
  },
  {
    method: 'get',
    path: '/articles/:id',
    auth: true,
    validator: ArticlesValidator,
    controller: ArticlesController,
    action: 'show'
  },
  {
    method: 'post',
    path: '/articles',
    auth: true,
    validator: ArticlesValidator,
    controller: ArticlesController,
    action: 'create'
  },
  {
    method: 'put',
    path: '/articles/:id',
    auth: true,
    validator: ArticlesValidator,
    controller: ArticlesController,
    action: 'update'
  },
  {
    method: 'delete',
    path: '/articles/:id',
    auth: true,
    validator: ArticlesValidator,
    controller: ArticlesController,
    action: 'destroy'
  }
]

export default ArticlesRoutes
