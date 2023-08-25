import AdminsController from '../controllers/admins.js'
import AdminsValidator from '../validators/admins.js'

const AdminsRoutes = [
  {
    method: 'get',
    path: '/admins',
    auth: true,
    validator: AdminsValidator,
    controller: AdminsController,
    action: 'index'
  },
  {
    method: 'get',
    path: '/admins/all',
    auth: true,
    validator: AdminsValidator,
    controller: AdminsController,
    action: 'all'
  },
  {
    method: 'get',
    path: '/admins/:id',
    auth: true,
    validator: AdminsValidator,
    controller: AdminsController,
    action: 'show'
  },
  {
    method: 'post',
    path: '/admins',
    auth: true,
    validator: AdminsValidator,
    controller: AdminsController,
    action: 'create'
  },
  {
    method: 'put',
    path: '/admins/:id',
    auth: true,
    validator: AdminsValidator,
    controller: AdminsController,
    action: 'update'
  },
  {
    method: 'delete',
    path: '/admins/:id',
    auth: true,
    validator: AdminsValidator,
    controller: AdminsController,
    action: 'destroy'
  }
]

export default AdminsRoutes
