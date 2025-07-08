// app/(dashboard)/listings/page.js
import { getListings } from '@/lib/data'
import ListingsTable from '@/components/listings/ListingTable'
export const dynamic = 'force-dynamic' // Crucial for instant updates

export default async function ListingsPage({ searchParams }) {
  const page = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.pageSize) || 10
  const status = searchParams.status // No default value

  // Debug: log current filters
  console.log('Current filters:', { page, pageSize, status })

  const result = await getListings(page, pageSize, { status })

  return (
    <div className="container mx-auto px-4 py-8">
      <ListingsTable 
        initialData={{
          data: result.data,
          page,
          pageSize,
          totalPages: result.totalPages,
          total: result.total
        }}
        searchParams={searchParams}
      />
    </div>
  )
}