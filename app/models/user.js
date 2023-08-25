import db from '../../lib/db.js'

export default db.model('User', {
  hasTimestamps: true,
  hidden: ['password'],
  requireFetch: false,
  tableName: 'users',
  bcrypt: {
    field: 'password'
  },
  articles() {
    return this.hasMany('Article')
  }
})
