import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Student Learning Platform',
  description: 'A learning platform designed for students with NVLD',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-purple-50">
        {children}
      </body>
    </html>
  )
} 