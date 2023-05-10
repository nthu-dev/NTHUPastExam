import './globals.css'
import React from "react";

export const metadata = {
    title: '清大考古題系統',
    description: '整理所有清大考古題',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh">
        <body>
           {children}
        </body>
        </html>
    )
}
