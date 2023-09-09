import BaseController from '../../lib/base_controller.js'
import { Tag } from '../models/index.js'

class TagsController extends BaseController {
  constructor() {
    super()
    this.model = Tag
    this.mustBeExists = []
    this.mustBeUnique = []
  }
}

export default TagsController
