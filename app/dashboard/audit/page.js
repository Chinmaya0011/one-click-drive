import { getAuditLogs } from '@/lib/data'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AuditPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const logs = await getAuditLogs()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Action</th>
              <th className="py-2 px-4 border">Listing ID</th>
              <th className="py-2 px-4 border">Admin</th>
              <th className="py-2 px-4 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">{log.action}</td>
                <td className="py-2 px-4 border">{log.listingId}</td>
                <td className="py-2 px-4 border">{log.adminEmail}</td>
                <td className="py-2 px-4 border">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}