import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

export interface IUser {
  email: string
  passwordHash: string
  name: string
  role: 'admin' | 'user'
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const User = models.User || model<IUser>('User', UserSchema)
