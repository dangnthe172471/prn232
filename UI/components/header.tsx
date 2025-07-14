"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Menu, X, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
    router.push("/")
  }

  const getDashboardLink = () => {
    if (!user) return "/login"
    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "cleaner":
        return "/cleaner/dashboard"
      default:
        return "/user/dashboard"
    }
  }

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareU
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Trang Chủ
            </Link>
            <Link href="/booking" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Đặt Lịch
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Dịch Vụ
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Tin Tức
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Về Chúng Tôi
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="capitalize border-blue-200 text-blue-700">
                  {user.role === "admin" ? "Quản trị" : user.role === "cleaner" ? "Nhân viên" : "Khách hàng"}
                </Badge>
                <Button asChild variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Link href={getDashboardLink()}>
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Link>
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-600">
                  <Link href="/login">Đăng Nhập</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6"
                >
                  <Link href="/register">Đăng Ký</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Trang Chủ
              </Link>
              <Link href="/booking" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Đặt Lịch
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Dịch Vụ
              </Link>
              <Link href="/news" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Tin Tức
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Về Chúng Tôi
              </Link>
              {user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Badge variant="outline" className="w-fit capitalize border-blue-200 text-blue-700">
                    {user.role === "admin" ? "Quản trị" : user.role === "cleaner" ? "Nhân viên" : "Khách hàng"}
                  </Badge>
                  <Button asChild variant="outline" size="sm" className="w-fit border-blue-200 text-blue-700">
                    <Link href={getDashboardLink()}>
                      <User className="w-4 h-4 mr-2" />
                      {user.name}
                    </Link>
                  </Button>
                  <Button onClick={handleLogout} variant="ghost" size="sm" className="w-fit text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng Xuất
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Button asChild variant="ghost" className="w-fit text-gray-700">
                    <Link href="/login">Đăng Nhập</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-fit rounded-full"
                  >
                    <Link href="/register">Đăng Ký</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
