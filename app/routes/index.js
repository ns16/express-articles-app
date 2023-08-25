import AdminsRoutes from './admins.js'
import ArticlesRoutes from './articles.js'
import ArticlesTagsRoutes from './articles_tags.js'
import AuthRoutes from './auth.js'
import ContentsRoutes from './contents.js'
import TagsRoutes from './tags.js'
import UsersRoutes from './users.js'

export default [
  ...AdminsRoutes,
  ...ArticlesRoutes,
  ...ArticlesTagsRoutes,
  ...AuthRoutes,
  ...ContentsRoutes,
  ...TagsRoutes,
  ...UsersRoutes
]
