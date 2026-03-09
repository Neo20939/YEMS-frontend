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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="font-sans">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
