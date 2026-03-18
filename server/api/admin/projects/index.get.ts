import Project from '~~/server/models/Project'

export default defineEventHandler(async () => {
  const projects = await Project.find().sort({ order: 1 })
  return projects
})
