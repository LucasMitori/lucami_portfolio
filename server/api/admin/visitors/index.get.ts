import { Visitor } from '~~/server/models/Visitor'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const query = getQuery(event)
  const from = query.from as string | undefined
  const to = query.to as string | undefined

  const dateFilter: Record<string, unknown> = {}
  if (from || to) {
    dateFilter.timestamp = {}
    if (from) (dateFilter.timestamp as Record<string, unknown>).$gte = new Date(from)
    if (to) (dateFilter.timestamp as Record<string, unknown>).$lte = new Date(to)
  }

  const [total, byPage, byTheme, byLocale, byDay] = await Promise.all([
    Visitor.countDocuments(dateFilter),

    Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$theme', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$locale', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Visitor.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ])

  return {
    total,
    byPage: byPage.map((item) => ({ page: item._id, count: item.count })),
    byTheme: byTheme.map((item) => ({ theme: item._id, count: item.count })),
    byLocale: byLocale.map((item) => ({ locale: item._id, count: item.count })),
    byDay: byDay.map((item) => ({ date: item._id, count: item.count })),
  }
})
