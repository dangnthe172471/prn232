import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CareU",
  description: "Ứng dụng hỗ trợ đăng ký và tìm kiếm nhân viên vệ sinh",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="515*485" />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
