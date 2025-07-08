import { cookies } from 'next/headers'

export const mockUsers = [
  {
    id: 1,
    email: 'chinmaya@oneclickdrive.com',
    password: 'Chinmaya123',
    name: 'Chinmaya',
    role: 'admin'
  }
]

export async function signIn(email, password) {
  const user = mockUsers.find(u => u.email === email && u.password === password)
  if (!user) return null
  
  const session = { user: { id: user.id, email: user.email, name: user.name } }
  cookies().set('session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  })
  
  return session
}

export async function getSession(request) {
  // For middleware usage
  if (request?.cookies) {
    const session = request.cookies.get('session')?.value
    if (!session) return null
    return JSON.parse(session)
  }
  
  // For component usage
  const session = cookies().get('session')?.value
  if (!session) return null
  return JSON.parse(session)
}

export async function signOut() {
  cookies().delete('session')
}