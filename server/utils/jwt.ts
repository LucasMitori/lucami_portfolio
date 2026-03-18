import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: string
  role: string
}

export function signToken(payload: TokenPayload): string {
  const config = useRuntimeConfig()

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d',
  })
}

export function verifyToken(token: string): TokenPayload {
  const config = useRuntimeConfig()

  return jwt.verify(token, config.jwtSecret) as TokenPayload
}
