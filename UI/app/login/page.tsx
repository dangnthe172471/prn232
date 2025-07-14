"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Eye, EyeOff, User, Shield, Briefcase } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { login } from "@/app/api/services/authApi" // ✅ import hàm gọi API

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const demoAccounts = {
    user: { email: "user@demo.com", password: "123456" },
    cleaner: { email: "cleaner@demo.com", password: "123456" },
    admin: { email: "admin@demo.com", password: "123456" },
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await login({ email, password })

      // ✅ Ghi đúng định dạng vào localStorage
      localStorage.setItem("token", response.token)
      localStorage.setItem("currentUser", JSON.stringify({
        name: response.name,
        email: response.email,
        phone: response.phone,
        address: response.address,
        role: response.role,
        token: response.token // ✅ THÊM token vào đây
      }))

      // ✅ Điều hướng theo vai trò
      switch (response.role) {
        case "admin":
          router.push("/admin/dashboard")
          break
        case "cleaner":
          router.push("/cleaner/dashboard")
          break
        default:
          router.push("/user/dashboard")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role: "user" | "cleaner" | "admin") => {
    const account = demoAccounts[role]
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Đăng Nhập
              </span>
            </h1>
            <p className="text-gray-600 text-lg">Chào mừng bạn quay trở lại CareU!</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Đăng nhập vào tài khoản</CardTitle>
              <CardDescription className="text-base">Nhập thông tin đăng nhập của bạn để tiếp tục</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 border-gray-300 focus:border-blue-500 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="text-right mt-1">
                    <Link href="/forgot-password" className="text-blue-600 hover:text-purple-600 text-sm font-medium hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm">
                <span className="text-gray-600">Chưa có tài khoản? </span>
                <Link href="/register" className="text-blue-600 hover:text-purple-600 font-medium hover:underline">
                  Đăng ký ngay
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
