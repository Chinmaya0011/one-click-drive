import { getListings, updateListingStatus, updateListing } from '@/lib/data'
import { getSession } from '@/lib/auth'

export async function GET(request) {
  const session = await getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
  const status = searchParams.get('status') // may be null

  try {
    const filters = {}
    if (status) filters.status = status

    const result = await getListings(page, pageSize, filters)
    return Response.json(result)
  } catch (error) {
    console.error('GET /api/listings error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

// PATCH /api/listings
// Body: { id, status } OR { id, updates }
export async function PATCH(request) {
  const session = await getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { id, status, updates } = await request.json()

    if (!id) {
      return new Response('Missing listing ID', { status: 400 })
    }

    if (status) {
      const success = await updateListingStatus(id, status, session.user.email)
      return Response.json({ success })
    }

    if (updates) {
      const success = await updateListing(id, updates, session.user.email)
      return Response.json({ success })
    }

    return new Response('Nothing to update', { status: 400 })
  } catch (error) {
    console.error('PATCH /api/listings error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
