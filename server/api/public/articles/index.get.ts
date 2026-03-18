import mongoose from 'mongoose'
import { Article } from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  if (mongoose.connection.readyState !== 1) {
    return { articles: [], total: 0, page: 1, totalPages: 0 }
  }

  try {
    const query = getQuery(event)
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 10))
    const skip = (page - 1) * limit

    const [articles, total] = await Promise.all([
      Article.find({ published: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments({ published: true }),
    ])

    return {
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }
  catch {
    return { articles: [], total: 0, page: 1, totalPages: 0 }
  }
})
