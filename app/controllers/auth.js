import BaseAuthController from '../../lib/base_auth_controller.js'
import { Admin } from '../models/index.js'

class AuthController extends BaseAuthController {
  constructor() {
    super()
    this.model = Admin
    this.mustBeExists = []
    this.mustBeUnique = ['username', 'email']
  }
}

export default AuthController
