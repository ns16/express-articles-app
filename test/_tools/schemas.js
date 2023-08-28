export const userSchema = {
  type: 'object',
  required: ['id', 'name', 'username', 'email', 'created_at', 'updated_at'],
  properties: {
    id: { type: 'number', minimum: 1 },
    name: { type: 'string', maxLength: 100 },
    username: { type: 'string', maxLength: 100 },
    email: { type: 'string', maxLength: 100, format: 'email' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  },
  additionalProperties: false
}
export const usersListSchema = { type: 'array', items: userSchema }

export const articleSchema = {
  type: 'object',
  required: ['id', 'user_id', 'title', 'description', 'status', 'created_at', 'updated_at'],
  properties: {
    id: { type: 'number', minimum: 1 },
    user_id: { type: 'number', minimum: 1 },
    title: { type: 'string', maxLength: 100 },
    description: { type: 'string', maxLength: 500 },
    status: { type: 'string', enum: ['published', 'draft'] },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  },
  additionalProperties: false
}
export const articlesListSchema = { type: 'array', items: articleSchema }

export const contentSchema = {
  type: 'object',
  required: ['id', 'article_id', 'body', 'created_at', 'updated_at'],
  properties: {
    id: { type: 'number', minimum: 1 },
    article_id: { type: 'number', minimum: 1 },
    body: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  },
  additionalProperties: false
}
export const contentsListSchema = { type: 'array', items: contentSchema }

export const tagSchema = {
  type: 'object',
  required: ['id', 'name', 'created_at', 'updated_at'],
  properties: {
    id: { type: 'number', minimum: 1 },
    name: { type: 'string', maxLength: 100 },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  },
  additionalProperties: false
}
export const tagsListSchema = { type: 'array', items: tagSchema }

export const adminSchema = {
  type: 'object',
  required: ['id', 'name', 'username', 'email', 'created_at', 'updated_at'],
  properties: {
    id: { type: 'number', minimum: 1 },
    name: { type: 'string', maxLength: 100 },
    username: { type: 'string', maxLength: 100 },
    email: { type: 'string', maxLength: 100, format: 'email' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  },
  additionalProperties: false
}
export const adminsListSchema = { type: 'array', items: adminSchema }

export const userWithArticlesSchema = {
  type: 'object',
  required: [...userSchema.required, 'articles'],
  properties: {
    ...userSchema.properties,
    articles: articlesListSchema
  },
  additionalProperties: false
}
export const usersWithArticlesListSchema = { type: 'array', items: userWithArticlesSchema }

export const articleWithUserSchema = {
  type: 'object',
  required: [...articleSchema.required, 'user'],
  properties: {
    ...articleSchema.properties,
    user: userSchema
  },
  additionalProperties: false
}
export const articlesWithUserListSchema = { type: 'array', items: articleWithUserSchema }

export const articleWithContentSchema = {
  type: 'object',
  required: [...articleSchema.required, 'content'],
  properties: {
    ...articleSchema.properties,
    content: contentSchema
  },
  additionalProperties: false
}
export const articlesWithContentListSchema = { type: 'array', items: articleWithContentSchema }

export const articleWithTagsSchema = {
  type: 'object',
  required: [...articleSchema.required, 'tags'],
  properties: {
    ...articleSchema.properties,
    tags: tagsListSchema
  },
  additionalProperties: false
}
export const articlesWithTagsListSchema = { type: 'array', items: articleWithTagsSchema }

export const contentWithArticleSchema = {
  type: 'object',
  required: [...contentSchema.required, 'article'],
  properties: {
    ...contentSchema.properties,
    article: articleSchema
  },
  additionalProperties: false
}
export const contentsWithArticleListSchema = { type: 'array', items: contentWithArticleSchema }

export const tagWithArticlesSchema = {
  type: 'object',
  required: [...tagSchema.required, 'articles'],
  properties: {
    ...tagSchema.properties,
    articles: articlesListSchema
  },
  additionalProperties: false
}
export const tagsWithArticlesListSchema = { type: 'array', items: tagWithArticlesSchema }

export const paginationSchema = {
  type: 'object',
  required: ['page', 'pageSize', 'rowCount', 'pageCount'],
  properties: {
    page: { type: 'number', minimum: 1 },
    pageSize: { type: 'number', minimum: 1 },
    rowCount: { type: 'number', minimum: 0 },
    pageCount: { type: 'number', minimum: 0 }
  },
  additionalProperties: false
}
