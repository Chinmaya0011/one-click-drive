'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { FiEdit, FiCheck, FiX, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useState, useEffect } from 'react'

export default function ListingsTable({ initialData, searchParams }) {
  // Safe defaults for initialData
  const safeData = {
    data: initialData?.data || [],
    page: initialData?.page || 1,
    pageSize: initialData?.pageSize || 10,
    totalPages: initialData?.totalPages || 1,
    totalCount: initialData?.total || 0,
  }

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()

  // Reset editing when data changes
  useEffect(() => {
    setEditingId(null)
  }, [safeData.data])

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }
  
  const handleEdit = (listing) => {
    setEditingId(listing.id)
    setEditForm({
      make: listing.make,
      model: listing.model,
      year: listing.year,
      price: listing.price,
      location: listing.location
    })
  }
  
  const handleEditSubmit = async (id) => {
    try {
      const response = await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: editForm })
      })
      
      if (response.ok) {
        setEditingId(null)
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update listing:', error)
    }
  }
  
  const handleFilter = (status) => {
    const params = new URLSearchParams(currentSearchParams)
    params.set('page', '1')
    
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="p-6">
      {/* Filter Section */}
      <div className="flex items-center mb-6">
        <div className="relative bg-white rounded-lg shadow-lg p-1.5 border border-gray-200">
          <select
            value={searchParams?.status || ''}
            onChange={(e) => handleFilter(e.target.value)}
            className="appearance-none bg-transparent pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <FiFilter className="text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl shadow-2xl">
        <table className="min-w-full bg-white border-separate border-spacing-0">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <th className="py-4 px-6 text-left font-semibold first:rounded-tl-xl last:rounded-tr-xl">Make</th>
              <th className="py-4 px-6 text-left font-semibold">Model</th>
              <th className="py-4 px-6 text-left font-semibold">Year</th>
              <th className="py-4 px-6 text-left font-semibold">Price</th>
              <th className="py-4 px-6 text-left font-semibold">Location</th>
              <th className="py-4 px-6 text-left font-semibold">Status</th>
              <th className="py-4 px-6 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeData.data.length > 0 ? (
              safeData.data.map((listing, index) => (
                <tr 
                  key={listing.id} 
                  className={`hover:bg-blue-50 transition-colors duration-200 ${
                    index === safeData.data.length - 1 ? 
                      'last:rounded-b-xl' : 
                      'border-b border-gray-200'
                  }`}
                >
                  <td className={`py-4 px-6 ${index === safeData.data.length - 1 ? 'first:rounded-bl-xl' : ''}`}>
                    {editingId === listing.id ? (
                      <input
                        type="text"
                        value={editForm.make}
                        onChange={(e) => setEditForm({...editForm, make: e.target.value})}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="font-medium">{listing.make}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingId === listing.id ? (
                      <input
                        type="text"
                        value={editForm.model}
                        onChange={(e) => setEditForm({...editForm, model: e.target.value})}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      listing.model
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingId === listing.id ? (
                      <input
                        type="number"
                        value={editForm.year}
                        onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      listing.year
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingId === listing.id ? (
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="font-semibold text-blue-600">${listing.price}/day</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingId === listing.id ? (
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      listing.location
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      listing.status === 'approved' ? 'bg-green-100 text-green-800 shadow-green-sm' :
                      listing.status === 'rejected' ? 'bg-red-100 text-red-800 shadow-red-sm' :
                      'bg-yellow-100 text-yellow-800 shadow-yellow-sm'
                    }`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </td>
                  <td className={`py-4 px-6 ${index === safeData.data.length - 1 ? 'last:rounded-br-xl' : ''}`}>
                    {editingId === listing.id ? (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditSubmit(listing.id)}
                          className="p-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-200 transform hover:scale-110"
                          title="Save Changes"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200 transform hover:scale-110"
                          title="Cancel"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleStatusUpdate(listing.id, 'approved')}
                          className={`p-2 rounded-full shadow-sm transition-all duration-200 transform hover:scale-110 ${
                            listing.status === 'approved' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-white text-gray-500 hover:bg-green-50 hover:text-green-600'
                          }`}
                          title="Approve"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(listing.id, 'rejected')}
                          className={`p-2 rounded-full shadow-sm transition-all duration-200 transform hover:scale-110 ${
                            listing.status === 'rejected' 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-white text-gray-500 hover:bg-red-50 hover:text-red-600'
                          }`}
                          title="Reject"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(listing)}
                          className="p-2 bg-white text-blue-500 rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:shadow-md transition-all duration-200 transform hover:scale-110"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No listings found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {safeData.data.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={safeData.page <= 1}
            onClick={() => {
              const params = new URLSearchParams(currentSearchParams)
              params.set('page', safeData.page - 1)
              router.replace(`${pathname}?${params.toString()}`)
            }}
            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all duration-200 ${
              safeData.page <= 1 ? 
                'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg transform hover:-translate-x-1'
            }`}
          >
            <FiChevronLeft className="mr-2" />
            Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page <span className="text-blue-600 font-bold">{safeData.page}</span> of <span className="font-bold">{safeData.totalPages}</span>
          </span>
          <button
            disabled={safeData.page >= safeData.totalPages}
            onClick={() => {
              const params = new URLSearchParams(currentSearchParams)
              params.set('page', safeData.page + 1)
              router.replace(`${pathname}?${params.toString()}`)
            }}
            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all duration-200 ${
              safeData.page >= safeData.totalPages ? 
                'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg transform hover:translate-x-1'
            }`}
          >
            Next
            <FiChevronRight className="ml-2" />
          </button>
        </div>
      )}
    </div>
  )
}