import { Raleway } from "next/font/google"
import "./globals.css"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})

export const metadata = {
  title: "Education Platform",
  description: "Student dashboard and exam interface built with Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={raleway.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
