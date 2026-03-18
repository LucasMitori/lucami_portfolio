import mongoose from 'mongoose'
import { Article } from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required' })
  }

  if (mongoose.connection.readyState !== 1) {
    throw createError({ statusCode: 503, message: 'Database not available' })
  }

  try {
    const article = await Article.findOne({ slug, published: true })

    if (!article) {
      throw createError({ statusCode: 404, message: 'Article not found' })
    }

    return article
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({ statusCode: 503, message: 'Database not available' })
  }
})
