import './globals.css'

export const metadata = {
  title: 'Car Rental Admin',
  description: 'Admin dashboard for managing car rental listings',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}