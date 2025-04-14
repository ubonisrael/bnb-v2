import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./../../../styles/globals.css"
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
    title: "Perfect Finishz",
    description: "",
}

export default function PerfectFinishzLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html className="p-0 m-0 overflow-x-hidden w-screen" lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} w-screen font-sans antialiased m-0 p-0 overflow-x-hidden`}>

                {children}

                <Toaster />
            </body>
        </html>
    )
}
