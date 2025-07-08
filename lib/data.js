// lib/data.js

// Sample data with initialized audit logs
let listings = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    price: 45,
    status: 'pending',
    location: 'New York',
    submittedBy: 'user1@example.com',
    submittedAt: '2023-05-15T10:30:00Z',
    images: []
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Accord',
    year: 2019,
    price: 40,
    status: 'approved',
    location: 'Los Angeles',
    submittedBy: 'user2@example.com',
    submittedAt: '2023-05-16T11:20:00Z',
    images: []
  },
  {
    id: 3,
    make: 'Ford',
    model: 'Mustang',
    year: 2021,
    price: 65,
    status: 'rejected',
    location: 'Chicago',
    submittedBy: 'user3@example.com',
    submittedAt: '2023-05-17T09:15:00Z',
    images: []
  },
  {
    id: 4,
    make: 'BMW',
    model: '3 Series',
    year: 2022,
    price: 75,
    status: 'pending',
    location: 'San Francisco',
    submittedBy: 'user4@example.com',
    submittedAt: '2023-05-18T14:10:00Z',
    images: []
  },
  {
    id: 5,
    make: 'Mercedes',
    model: 'C-Class',
    year: 2021,
    price: 80,
    status: 'approved',
    location: 'Seattle',
    submittedBy: 'user5@example.com',
    submittedAt: '2023-05-19T12:00:00Z',
    images: []
  },
  {
    id: 6,
    make: 'Hyundai',
    model: 'Elantra',
    year: 2018,
    price: 35,
    status: 'rejected',
    location: 'Miami',
    submittedBy: 'user6@example.com',
    submittedAt: '2023-05-20T08:45:00Z',
    images: []
  },
  {
    id: 7,
    make: 'Kia',
    model: 'Optima',
    year: 2020,
    price: 38,
    status: 'pending',
    location: 'Austin',
    submittedBy: 'user7@example.com',
    submittedAt: '2023-05-21T13:30:00Z',
    images: []
  },
  {
    id: 8,
    make: 'Nissan',
    model: 'Altima',
    year: 2019,
    price: 42,
    status: 'approved',
    location: 'Denver',
    submittedBy: 'user8@example.com',
    submittedAt: '2023-05-22T16:25:00Z',
    images: []
  },
  {
    id: 9,
    make: 'Chevrolet',
    model: 'Malibu',
    year: 2021,
    price: 50,
    status: 'pending',
    location: 'Dallas',
    submittedBy: 'user9@example.com',
    submittedAt: '2023-05-23T10:50:00Z',
    images: []
  },
  {
    id: 10,
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    price: 90,
    status: 'approved',
    location: 'San Diego',
    submittedBy: 'user10@example.com',
    submittedAt: '2023-05-24T11:00:00Z',
    images: []
  }
]


// Initialize with some sample audit logs
let auditLogs = [
  {
    action: "system_initialized",
    listingId: null,
    adminEmail: "system@example.com",
    timestamp: new Date().toISOString(),
    changes: { status: "system_start" }
  }
];

// Utility function to generate consistent log entries
const createAuditLog = (action, listingId, adminEmail, changes = {}) => {
  return {
    action,
    listingId,
    adminEmail,
    timestamp: new Date().toISOString(),
    changes
  };
};

/**
 * Get paginated and filtered listings
 */
export async function getListings(page = 1, pageSize = 10, filters = {}) {
  let filtered = [...listings];
  
  if (filters.status) {
    filtered = filtered.filter(l => l.status === filters.status);
  }

  const startIndex = (page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  // Log this query
  auditLogs.push(createAuditLog(
    "listings_query",
    null,
    "system",
    { page, pageSize, ...filters }
  ));

  return {
    data: paginated,
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize)
  };
}

/**
 * Update listing status and log the action
 */
export async function updateListingStatus(id, status, adminEmail) {
  try {
    const listing = listings.find(l => l.id === id);
    
    if (!listing) {
      console.error(`Listing ${id} not found`);
      auditLogs.push(createAuditLog(
        "update_failed",
        id,
        adminEmail,
        { error: "Listing not found" }
      ));
      return false;
    }

    const previousStatus = listing.status;
    listing.status = status;
    listing.updatedAt = new Date().toISOString();

    // Create detailed audit log
    auditLogs.push(createAuditLog(
      `${status}_listing`,
      id,
      adminEmail,
      { 
        from: previousStatus, 
        to: status,
        make: listing.make,
        model: listing.model,
        price: listing.price
      }
    ));

    return true;
  } catch (error) {
    console.error('Status update failed:', error);
    auditLogs.push(createAuditLog(
      "update_failed",
      id,
      adminEmail || "unknown",
      { error: error.message }
    ));
    return false;
  }
}

/**
 * Update listing details
 */
export async function updateListing(id, updates, adminEmail) {
  try {
    const index = listings.findIndex(l => l.id === id);
    
    if (index === -1) {
      console.error(`Listing ${id} not found`);
      auditLogs.push(createAuditLog(
        "update_failed",
        id,
        adminEmail,
        { error: "Listing not found" }
      ));
      return false;
    }

    const originalListing = {...listings[index]};
    listings[index] = { 
      ...originalListing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Determine changed fields
    const changes = {};
    for (const key in updates) {
      if (originalListing[key] !== updates[key]) {
        changes[key] = {
          from: originalListing[key],
          to: updates[key]
        };
      }
    }

    if (Object.keys(changes).length > 0) {
      auditLogs.push(createAuditLog(
        "listing_updated",
        id,
        adminEmail,
        changes
      ));
    }

    return true;
  } catch (error) {
    console.error('Update failed:', error);
    auditLogs.push(createAuditLog(
      "update_failed",
      id,
      adminEmail || "unknown",
      { error: error.message }
    ));
    return false;
  }
}

/**
 * Get all audit logs with optional filtering
 */
export async function getAuditLogs(filters = {}) {
  let logs = [...auditLogs];
  
  if (filters.listingId) {
    logs = logs.filter(log => log.listingId === filters.listingId);
  }
  
  if (filters.action) {
    logs = logs.filter(log => log.action.includes(filters.action));
  }

  return logs;
}

/**
 * Get a single listing by ID
 */
export async function getListingById(id) {
  const listing = listings.find(l => l.id === id);
  if (!listing) {
    return null;
  }
  
  // Get related audit logs
  const logs = await getAuditLogs({ listingId: id });
  
  return {
    ...listing,
    auditHistory: logs
  };
}

/**
 * Add a new listing
 */
export async function addListing(listingData, submittedBy) {
  try {
    const newListing = {
      id: listings.length > 0 ? Math.max(...listings.map(l => l.id)) + 1 : 1,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      submittedBy,
      images: [],
      ...listingData
    };
    
    listings.push(newListing);
    
    auditLogs.push(createAuditLog(
      "listing_created",
      newListing.id,
      submittedBy,
      { 
        make: newListing.make,
        model: newListing.model,
        status: newListing.status
      }
    ));

    return newListing;
  } catch (error) {
    console.error('Failed to add listing:', error);
    auditLogs.push(createAuditLog(
      "creation_failed",
      null,
      submittedBy || "unknown",
      { error: error.message }
    ));
    throw error;
  }
}