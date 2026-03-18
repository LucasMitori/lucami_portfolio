import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

export interface IVisitor {
  sessionId: string
  page: string
  theme: string
  locale: string
  userAgent: string
  referrer: string
  timestamp: Date
}

const VisitorSchema = new Schema<IVisitor>({
  sessionId: {
    type: String,
  },
  page: {
    type: String,
  },
  theme: {
    type: String,
  },
  locale: {
    type: String,
  },
  userAgent: {
    type: String,
    default: '',
  },
  referrer: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

VisitorSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 })

export const Visitor = models.Visitor || model<IVisitor>('Visitor', VisitorSchema)
