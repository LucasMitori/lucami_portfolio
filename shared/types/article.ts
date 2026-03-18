export interface Article {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string
  tags: string[]
  published: boolean
  author?: string
  createdAt: string
  updatedAt: string
}

export interface ArticleCreatePayload {
  title: string
  content: string
  excerpt: string
  coverImage?: string
  tags?: string[]
  published?: boolean
}

export interface ArticleUpdatePayload extends Partial<ArticleCreatePayload> {
  slug?: string
}
