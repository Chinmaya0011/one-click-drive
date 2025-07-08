import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({ children }) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 overflow-y-auto">
        <DashboardNav user={session.user} />
      </div>

      {/* Main Content Area with proper spacing for sidebar */}
      <div className="flex-1 pl-64 min-h-screen">
        <div className="p-6 h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}