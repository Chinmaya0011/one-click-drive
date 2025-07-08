import Link from 'next/link'
import { signOut } from '@/lib/auth'
import { FiLogOut, FiHome, FiActivity } from 'react-icons/fi'

export default function DashboardNav({ user }) {
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
            href="/listings" 
            className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
          >
            <FiHome className="mr-3 text-gray-400 group-hover:text-blue-400" />
            <span className="font-medium">Listings</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/audit" 
            className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
          >
            <FiActivity className="mr-3 text-gray-400 group-hover:text-blue-400" />
            <span className="font-medium">Audit Logs</span>
          </Link>
        </li>
      </ul>
      
      {/* Sign Out Button */}
      <form 
        action={async () => {
          'use server'
          await signOut()
        }}
        className="mt-auto"
      >
        <button 
          type="submit"
          className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
        >
          <FiLogOut className="mr-3 text-gray-400 group-hover:text-red-400" />
          <span className="font-medium">Sign Out</span>
        </button>
      </form>
    </nav>
  )
}