import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

export interface IFavorite {
  sessionId: string
  projectName: string
  projectUrl: string
  createdAt: Date
}

const FavoriteSchema = new Schema<IFavorite>({
  sessionId: { type: String, required: true },
  projectName: { type: String, required: true },
  projectUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

FavoriteSchema.index({ sessionId: 1, projectName: 1 }, { unique: true })

export const Favorite = models.Favorite || model<IFavorite>('Favorite', FavoriteSchema)
