import BaseController from '../../lib/base_controller.js'
import { Article, Content } from '../models/index.js'

class ContentsController extends BaseController {
  constructor() {
    super()
    this.model = Content
    this.mustBeExists = [
      { model: Article, modelName: 'Article', field: 'article_id' }
    ]
    this.mustBeUnique = ['article_id']
  }
}

export default ContentsController
