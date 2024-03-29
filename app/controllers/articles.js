import BaseController from '../../lib/base_controller.js'
import { Article, User } from '../models/index.js'

class ArticlesController extends BaseController {
  constructor() {
    super()
    this.model = Article
    this.mustBeExists = [
      { model: User, modelName: 'User', field: 'user_id' }
    ]
    this.mustBeUnique = []
  }
}

export default ArticlesController
