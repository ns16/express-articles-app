import { Admin } from '../models/index.js'
import BaseController from '../../lib/base_controller.js'

class AdminsController extends BaseController {
  constructor() {
    super()
    this.model = Admin
    this.mustBeExists = []
    this.mustBeUnique = ['username', 'email']
  }
}

export default AdminsController
