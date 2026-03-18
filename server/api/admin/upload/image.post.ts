export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
    throw createError({ statusCode: 500, message: 'Cloudinary not configured' })
  }

  const body = await readBody<{ image: string; folder?: string }>(event)

  if (!body.image) {
    throw createError({ statusCode: 400, message: 'Image data is required' })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = body.folder || 'portfolio/projects'

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
  const crypto = await import('node:crypto')
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + config.cloudinaryApiSecret)
    .digest('hex')

  const formData = new URLSearchParams()
  formData.append('file', body.image)
  formData.append('api_key', config.cloudinaryApiKey)
  formData.append('timestamp', String(timestamp))
  formData.append('signature', signature)
  formData.append('folder', folder)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  )

  if (!response.ok) {
    const err = await response.text()
    throw createError({ statusCode: 500, message: `Cloudinary upload failed: ${err}` })
  }

  const result = await response.json() as { secure_url: string; public_id: string; width: number; height: number }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  }
})
