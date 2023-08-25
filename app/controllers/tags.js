import { Tag } from '../models/index.js'
import BaseController from '../../lib/base_controller.js'

class TagsController extends BaseController {
  constructor() {
    super()
    this.model = Tag
    this.mustBeExists = []
    this.mustBeUnique = []
  }
}

export default TagsController
