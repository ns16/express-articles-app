import ContentsController from '../controllers/contents.js'
import ContentsValidator from '../validators/contents.js'

const ContentsRoutes = [
  {
    method: 'get',
    path: '/contents',
    auth: true,
    validator: ContentsValidator,
    controller: ContentsController,
    action: 'index'
  },
  {
    method: 'get',
    path: '/contents/all',
    auth: true,
    validator: ContentsValidator,
    controller: ContentsController,
    action: 'all'
  },
  {
    method: 'get',
    path: '/contents/:id',
    auth: true,
    validator: ContentsValidator,
    controller: ContentsController,
    action: 'show'
  },
  {
    method: 'post',
    path: '/contents',
    auth: true,
    validator: ContentsValidator,
    controller: ContentsController,
    action: 'create'
  },
  {
    method: 'put',
    path: '/contents/:id',
    auth: true,
    validator: ContentsValidator,
    controller: ContentsController,
    action: 'update'
  },
  {
    method: 'delete',
    path: '/contents/:id',
    auth: true,
    validator: ContentsValidator,
    controller: ContentsController,
    action: 'destroy'
  }
]

export default ContentsRoutes
