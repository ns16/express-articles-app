import { Article, Tag } from '../models/index.js'
import BaseRelationController from '../../lib/base_relation_controller.js'

class ArticlesTagsController extends BaseRelationController {
  constructor() {
    super()
    this.main = { model: Article, modelName: 'Article', field: 'article_id' }
    this.relation = { model: Tag, modelName: 'Tag', field: 'tag_id' }
    this.relationship = 'tags'
  }
}

export default ArticlesTagsController
