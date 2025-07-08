import { getAuditLogs } from '@/lib/data'
import { getSession } from '@/lib/auth'

export async function GET(request) {
  const session = await getSession();
  if (!session?.user?.isAdmin) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get('listingId');
  const action = searchParams.get('action');

  try {
    const logs = await getAuditLogs({ listingId, action });
    return Response.json(logs);
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}