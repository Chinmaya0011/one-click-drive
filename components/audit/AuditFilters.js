// components/audit/AuditFilters.js
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function AuditFilters({ listingId, action }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Listing ID</label>
          <input
            type="number"
            placeholder="Filter by listing ID"
            className="w-full p-2 border rounded"
            defaultValue={listingId || ''}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams)
              if (e.target.value) {
                params.set('listingId', e.target.value)
              } else {
                params.delete('listingId')
              }
              handleFilterChange()
            }}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Action</label>
          <select
            className="w-full p-2 border rounded"
            defaultValue={action}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams)
              if (e.target.value) {
                params.set('action', e.target.value)
              } else {
                params.delete('action')
              }
              handleFilterChange()
            }}
          >
            <option value="">All Actions</option>
            <option value="approved">Approvals</option>
            <option value="rejected">Rejections</option>
            <option value="updated">Updates</option>
            <option value="created">Creations</option>
          </select>
        </div>
      </div>
    </div>
  )
}