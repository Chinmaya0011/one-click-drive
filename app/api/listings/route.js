import { getListings, updateListingStatus, updateListing } from '@/lib/data'
import { getSession } from '@/lib/auth'

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const status = searchParams.get('status');

  try {
    const result = await getListings(page, pageSize, { status });
    return Response.json(result);
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { id, status, updates } = await request.json();
    
    if (status) {
      const success = await updateListingStatus(id, status, session.user.email);
      return Response.json({ success });
    }
    
    if (updates) {
      const success = await updateListing(id, updates, session.user.email);
      return Response.json({ success });
    }
    
    return new Response('Bad Request', { status: 400 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}