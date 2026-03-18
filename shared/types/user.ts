export interface User {
  _id: string
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  confirmPassword: string
  name: string
}
