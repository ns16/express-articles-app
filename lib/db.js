import bookshelf from 'bookshelf'
import bookshelfBCrypt from 'bookshelf-bcrypt'
import bookshelfCascadeDelete from 'bookshelf-cascade-delete'
import bookshelfJsonColumns from 'bookshelf-json-columns'
import knex from 'knex'

import knexfile from '../knexfile.js'

const knexInstance = knex(knexfile[process.env.NODE_ENV || 'development'])
const bookshelfInstance = bookshelf(knexInstance)

bookshelfInstance.plugin(bookshelfBCrypt)
bookshelfInstance.plugin(bookshelfCascadeDelete)
bookshelfInstance.plugin(bookshelfJsonColumns)

export default bookshelfInstance
