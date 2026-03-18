import Project from '~~/server/models/Project'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const project = await Project.findOneAndUpdate(
    { repoId: Number(id) },
    {
      repoId: Number(id),
      name: body.name,
      customImage: body.customImage || '',
      category: body.category || 'fullstack',
      featured: body.featured || false,
      order: body.order || 0,
      updatedAt: new Date(),
    },
    { upsert: true, new: true },
  )

  return project
})
