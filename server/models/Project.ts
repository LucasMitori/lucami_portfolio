import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  repoId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  customImage: { type: String, default: '' },
  category: { type: String, enum: ['frontend', 'backend', 'fullstack'], default: 'fullstack' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Project || mongoose.model('Project', projectSchema)
