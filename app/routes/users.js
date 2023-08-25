import UsersController from '../controllers/users.js'
import UsersValidator from '../validators/users.js'

const UsersRoutes = [
  {
    method: 'get',
    path: '/users',
    auth: true,
    validator: UsersValidator,
    controller: UsersController,
    action: 'index'
  },
  {
    method: 'get',
    path: '/users/all',
    auth: true,
    validator: UsersValidator,
    controller: UsersController,
    action: 'all'
  },
  {
    method: 'get',
    path: '/users/:id',
    auth: true,
    validator: UsersValidator,
    controller: UsersController,
    action: 'show'
  },
  {
    method: 'post',
    path: '/users',
    auth: true,
    validator: UsersValidator,
    controller: UsersController,
    action: 'create'
  },
  {
    method: 'put',
    path: '/users/:id',
    auth: true,
    validator: UsersValidator,
    controller: UsersController,
    action: 'update'
  },
  {
    method: 'delete',
    path: '/users/:id',
    auth: true,
    validator: UsersValidator,
    controller: UsersController,
    action: 'destroy'
  }
]

export default UsersRoutes
