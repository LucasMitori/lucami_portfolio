import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

export interface IArticle {
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string
  tags: string[]
  published: boolean
  author: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ArticleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  published: {
    type: Boolean,
    default: false,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

ArticleSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

ArticleSchema.index({ slug: 1 })
ArticleSchema.index({ published: 1 })

export const Article = models.Article || model<IArticle>('Article', ArticleSchema)
