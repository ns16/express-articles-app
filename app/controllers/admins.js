import BaseController from '../../lib/base_controller.js'
import { Admin } from '../models/index.js'

class AdminsController extends BaseController {
  constructor() {
    super()
    this.model = Admin
    this.mustBeExists = []
    this.mustBeUnique = ['username', 'email']
  }
}

export default AdminsController
