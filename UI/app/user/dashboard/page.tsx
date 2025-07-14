"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Plus,
  Star,
  User,
  Phone,
  Eye,
  KeyRound,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Header from "@/components/header"
import {
  getUserBookings,
  getDashboardStats,
} from "@/app/api/services/bookingApi"
import { changePassword } from "@/app/api/services/authApi"
import Swal from "sweetalert2"
import { formatPhoneNumber } from "@/lib/utils"

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [changing, setChanging] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      console.log("Không tìm thấy user, redirect về login")
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    const token = userData.token // ✅ dùng đúng token đã lưu trong currentUser

    const fetchData = async () => {
      try {
        const bookingData = await getUserBookings(token)
        const statData = await getDashboardStats(token)
        console.log("📊 Dashboard Stats:", statData)

        setBookings(bookingData)
        setStats(statData)
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error)
      }
    }

    fetchData()
  }, [router])


  const handleChangePassword = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      setChanging(true)
      await changePassword(
        {
          email: user.email,
          oldPassword,
          newPassword,
        },
        token
      )

      // Hiển thị thông báo Swal và đợi 2 giây trước khi logout
      await Swal.fire({
        icon: "success",
        title: "Đổi mật khẩu thành công",
        text: "Bạn sẽ được đăng xuất sau 2 giây",
        timer: 2000,
        showConfirmButton: false,
      })

      // Xoá localStorage và chuyển hướng về trang login
      localStorage.removeItem("token")
      localStorage.removeItem("currentUser")
      router.push("/login")

    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Đổi mật khẩu thất bại",
        text: err.message || "Có lỗi xảy ra, vui lòng thử lại.",
      })
    } finally {
      setChanging(false)
    }
  }



  const getStatusBadge = (status: string) => {
    const config: any = {
      pending: { label: "Chờ xác nhận", variant: "secondary" },
      confirmed: { label: "Đã xác nhận", variant: "default" },
      in_progress: { label: "Đang thực hiện", variant: "default" },
      completed: { label: "Hoàn thành", variant: "default" },
      cancelled: { label: "Đã hủy", variant: "destructive" },
    }
    const item = config[status] || config.pending
    return <Badge variant={item.variant}>{item.label}</Badge>
  }

  const getServiceName = (type: string) => {
    const services: any = {
      "home-regular": "Dọn Nhà Định Kỳ",
      office: "Dọn Văn Phòng",
      "post-construction": "Dọn Sau Xây Dựng",
      "year-end": "Dọn Cuối Năm",
    }
    return services[type] || type
  }

  if (!user) return <div>Đang tải...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <div className="pt-20 pb-16 px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Xin chào, {user.name}!</h1>
          <p className="text-gray-600">Quản lý dịch vụ vệ sinh của bạn</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Tổng đặt lịch" value={stats.totalBookings || 0} icon={<Calendar className="w-8 h-8 text-blue-600" />} />
          <StatCard label="Chờ xác nhận" value={stats.pendingBookings || 0} icon={<Clock className="w-8 h-8 text-yellow-600" />} />
          <StatCard label="Hoàn thành" value={stats.completedBookings || 0} icon={<Star className="w-8 h-8 text-green-600" />} />
          <StatCard label="Tổng chi tiêu" value={`${(stats.totalSpent || 0).toLocaleString("vi-VN")}đ`} icon={<DollarSign className="w-8 h-8 text-purple-600" />} />
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Lịch Đặt</TabsTrigger>
            <TabsTrigger value="profile">Thông Tin Cá Nhân</TabsTrigger>
            <TabsTrigger value="change-password">Đổi Mật Khẩu</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Lịch Đặt Của Bạn</h2>
              <Button asChild>
                <Link href="/booking"><Plus className="w-4 h-4 mr-2" />Đặt Lịch Mới</Link>
              </Button>
            </div>
            <div className="grid gap-6">
              {bookings.map((b) => (
                <Card key={b.id}>
                  <CardHeader className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{getServiceName(b.serviceType)}</CardTitle>
                      <CardDescription>Mã đặt lịch: #{b.id}</CardDescription>
                    </div>
                    {getStatusBadge(b.status)}
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><Calendar className="inline w-4 h-4 mr-2" />
                          {b.bookingDate ? format(new Date(b.bookingDate), "PPP", { locale: vi }) : "Không rõ ngày"}</p>
                        <p><Clock className="inline w-4 h-4 mr-2" />{b.timeSlotRange}</p>
                        <p><MapPin className="inline w-4 h-4 mr-2" />{b.address}</p>
                      </div>
                      <div>
                        <p><DollarSign className="inline w-4 h-4 mr-2" />{b.totalPrice.toLocaleString("vi-VN")}đ</p>
                        <p><User className="inline w-4 h-4 mr-2" />{b.contactName}</p>
                        <p><Phone className="inline w-4 h-4 mr-2" />{formatPhoneNumber(b.contactPhone)}</p>
                      </div>
                    </div>
                    {b.notes && <div className="mt-2 text-sm bg-gray-50 p-3 rounded">Ghi chú: {b.notes}</div>}
                    <Button asChild variant="outline" size="sm" className="mt-4">
                      <Link href={`/user/my-bookings/${b.id}`}><Eye className="h-4 w-4 mr-2" />Xem chi tiết</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4 text-lg">
                <InfoItem label="Họ và tên" value={user.name} />
                <InfoItem label="Email" value={user.email} />
                <InfoItem label="Số điện thoại" value={formatPhoneNumber(user.phone)} />
                <InfoItem label="Địa chỉ" value={user.address} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="change-password">
            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-w-sm">
                <Input type="password" placeholder="Mật khẩu hiện tại" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                <Input type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <Button onClick={handleChangePassword} disabled={changing}>
                  {changing ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const StatCard = ({ label, value, icon }: { label: string; value: any; icon: React.ReactNode }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </CardContent>
  </Card>
)

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p>{value}</p>
  </div>
)
