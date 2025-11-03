import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D Pixel Boy',
  description: 'A 3D pixel art boy model',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>{children}</body>
    </html>
  )
}
