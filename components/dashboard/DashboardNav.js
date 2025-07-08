'use client'

import Link from 'next/link'
import { FiLogOut, FiHome, FiActivity } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function DashboardNav({ user }) {
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/')
  }

  return (
    <nav className="w-64 bg-gray-800 text-white p-4 flex flex-col h-screen fixed">
      {/* Header Section */}
      <div className="mb-8 p-4 bg-gray-700 rounded-lg">
        <h1 className="text-xl font-bold text-white">Car Rental Admin</h1>
        <p className="text-sm text-gray-300 mt-1 truncate">
          Welcome, <span className="font-medium text-blue-300">{user.name}</span>
        </p>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-2 flex-1">
        <li>
          <Link
            href="/dashboard/listings"
            className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
          >
            <FiHome className="mr-3 text-gray-400 group-hover:text-blue-400" />
            <span className="font-medium">Listings</span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/audit"
            className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
          >
            <FiActivity className="mr-3 text-gray-400 group-hover:text-blue-400" />
            <span className="font-medium">Audit Logs</span>
          </Link>
        </li>
      </ul>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="mt-auto flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
      >
        <FiLogOut className="mr-3 text-gray-400 group-hover:text-red-400" />
        <span className="font-medium">Sign Out</span>
      </button>
    </nav>
  )
}
