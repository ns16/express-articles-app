import db from '../../lib/db.js'

export default db.model('Article', {
  hasTimestamps: true,
  requireFetch: false,
  tableName: 'articles',
  user() {
    return this.belongsTo('User')
  },
  content() {
    return this.hasOne('Content')
  },
  tags() {
    return this.belongsToMany('Tag')
  }
})
