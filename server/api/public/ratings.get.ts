import { Comment } from '~~/server/models/Comment'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const section = query.section as string
  const targetId = query.targetId as string | undefined

  const filter: Record<string, unknown> = { approved: true }
  if (section) filter.section = section
  if (targetId) filter.targetId = targetId

  const result = await Comment.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 },
        distribution: {
          $push: '$rating',
        },
      },
    },
  ])

  if (result.length === 0) {
    return { averageRating: 0, totalRatings: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
  }

  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  result[0].distribution.forEach((r: number) => { dist[r] = (dist[r] || 0) + 1 })

  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalRatings: result[0].totalRatings,
    distribution: dist,
  }
})
