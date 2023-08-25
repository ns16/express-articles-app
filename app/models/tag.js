import db from '../../lib/db.js'

export default db.model('Tag', {
  hasTimestamps: true,
  requireFetch: false,
  tableName: 'tags',
  articles() {
    return this.belongsToMany('Article')
  }
})
