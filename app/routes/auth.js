import AuthController from '../controllers/auth.js'
import AuthValidator from '../validators/auth.js'

const AuthRoutes = [
  {
    method: 'post',
    path: '/auth/login',
    validator: AuthValidator,
    controller: AuthController,
    action: 'login'
  },
  {
    method: 'get',
    path: '/auth/me',
    auth: true,
    validator: AuthValidator,
    controller: AuthController,
    action: 'me'
  }
]

export default AuthRoutes
