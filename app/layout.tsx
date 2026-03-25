import { Raleway } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/contexts/UserContext"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})

export const metadata = {
  title: "Education Platform",
  description: "Student dashboard and exam interface built with Next.js",
}

export const viewport = {
  width: 'device-width',
  initialScale: 0.9,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={raleway.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0"
        />
      </head>
      <body className="font-sans">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
