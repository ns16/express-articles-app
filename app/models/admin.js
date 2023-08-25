import db from '../../lib/db.js'

export default db.model('Admin', {
  hasTimestamps: true,
  hidden: ['password'],
  requireFetch: false,
  tableName: 'admins',
  bcrypt: {
    field: 'password'
  }
})
