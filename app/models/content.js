import db from '../../lib/db.js'

export default db.model('Content', {
  hasTimestamps: true,
  requireFetch: false,
  tableName: 'contents',
  article() {
    return this.belongsTo('Article')
  }
})
