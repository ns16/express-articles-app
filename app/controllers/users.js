import { User } from '../models/index.js'
import BaseController from '../../lib/base_controller.js'

class UsersController extends BaseController {
  constructor() {
    super()
    this.model = User
    this.mustBeExists = []
    this.mustBeUnique = ['username', 'email']
  }
}

export default UsersController
