import TagsController from '../controllers/tags.js'
import TagsValidator from '../validators/tags.js'

const TagsRoutes = [
  {
    method: 'get',
    path: '/tags',
    auth: true,
    validator: TagsValidator,
    controller: TagsController,
    action: 'index'
  },
  {
    method: 'get',
    path: '/tags/all',
    auth: true,
    validator: TagsValidator,
    controller: TagsController,
    action: 'all'
  },
  {
    method: 'get',
    path: '/tags/:id',
    auth: true,
    validator: TagsValidator,
    controller: TagsController,
    action: 'show'
  },
  {
    method: 'post',
    path: '/tags',
    auth: true,
    validator: TagsValidator,
    controller: TagsController,
    action: 'create'
  },
  {
    method: 'put',
    path: '/tags/:id',
    auth: true,
    validator: TagsValidator,
    controller: TagsController,
    action: 'update'
  },
  {
    method: 'delete',
    path: '/tags/:id',
    auth: true,
    validator: TagsValidator,
    controller: TagsController,
    action: 'destroy'
  }
]

export default TagsRoutes
