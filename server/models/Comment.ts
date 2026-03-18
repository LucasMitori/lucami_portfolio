import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

export interface IComment {
  authorName: string
  authorEmail?: string
  content: string
  rating: number // 1-5 stars
  section: string // 'games' | 'projects' | 'articles' | 'general' | 'testimonial'
  targetId?: string // optional: specific project/article id
  userId?: mongoose.Types.ObjectId // if logged in user
  approved: boolean
  createdAt: Date
}

const CommentSchema = new Schema<IComment>({
  authorName: { type: String, required: true, trim: true, maxlength: 50 },
  authorEmail: { type: String, trim: true, lowercase: true },
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  section: { type: String, required: true, enum: ['games', 'projects', 'articles', 'general', 'testimonial'] },
  targetId: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  approved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

CommentSchema.index({ section: 1, targetId: 1 })
CommentSchema.index({ createdAt: -1 })

export const Comment = models.Comment || model<IComment>('Comment', CommentSchema)
