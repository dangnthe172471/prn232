"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, User, Phone, Star } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import {
  getCleanerAvailableJobs,
  getCleanerMyJobs,
  getCleanerProfile,
  acceptCleanerJob,
  updateCleanerJobStatus,
} from "@/app/api/services/cleanerApi"
import { formatPhoneNumber } from "@/lib/utils"


export default function CleanerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [availableJobs, setAvailableJobs] = useState<any[]>([])
  const [myJobs, setMyJobs] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) return router.push("/login")

    const userData = JSON.parse(currentUser)
    if (userData.role !== "cleaner") return router.push("/")

    setUser(userData)
    const token = userData.token

    loadJobs(token)
    loadProfile(token)
  }, [router])

  const loadJobs = async (token: string) => {
    try {
      const available = await getCleanerAvailableJobs(token)
      const mine = await getCleanerMyJobs(token)
      setAvailableJobs(available)
      setMyJobs(mine)
    } catch (err) {
      console.error("Lỗi khi load jobs:", err)
    }
  }

  const loadProfile = async (token: string) => {
    try {
      const profile = await getCleanerProfile(token)
      setUser((prev: any) => ({ ...prev, ...profile }))
    } catch (err) {
      console.error(err)
    }
  }


  const acceptJob = async (jobId: number) => {
    try {
      await acceptCleanerJob(jobId, user.token) // gọi đúng api
      await loadJobs(user.token)
    } catch (err) {
      console.error("Lỗi khi nhận việc:", err)
    }
  }


  const updateJobStatus = async (jobId: number, newStatus: string) => {
    try {
      await updateCleanerJobStatus(jobId, newStatus, user.token)
      await loadJobs(user.token)
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err)
    }
  }


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chờ xác nhận", variant: "secondary" as const },
      confirmed: { label: "Đã xác nhận", variant: "default" as const },
      in_progress: { label: "Đang thực hiện", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
      cancelled: { label: "Đã hủy", variant: "destructive" as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getServiceName = (serviceType: string) => {
    const services = {
      "home-regular": "Dọn Nhà Định Kỳ",
      office: "Dọn Văn Phòng",
      "post-construction": "Dọn Sau Xây Dựng",
      "year-end": "Dọn Cuối Năm",
    }
    return services[serviceType as keyof typeof services] || serviceType
  }

  if (!user) {
    return <div>Đang tải...</div>
  }

  if (user.status === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Alert>
              <AlertDescription>
                Tài khoản của bạn đang chờ phê duyệt từ quản trị viên. Vui lòng chờ email xác nhận hoặc liên hệ hotline
                để biết thêm chi tiết.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Xin chào, {user.name}!</h1>
            <p className="text-gray-600">Quản lý công việc dọn vệ sinh của bạn</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Việc có sẵn</p>
                    <p className="text-2xl font-bold">{availableJobs.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Việc của tôi</p>
                    <p className="text-2xl font-bold">{myJobs.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                    <p className="text-2xl font-bold">{myJobs.filter((j) => j.status === "completed").length}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Thu nhập</p>
                    <p className="text-2xl font-bold">
                      {myJobs
                        .filter((j) => j.status === "completed")
                        .reduce((sum, j) => sum + (j.totalPrice || 0), 0)
                        .toLocaleString("vi-VN")}
                      đ
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="available" className="space-y-6">
            <TabsList>
              <TabsTrigger value="available">Việc Có Sẵn ({availableJobs.length})</TabsTrigger>
              <TabsTrigger value="my-jobs">Việc Của Tôi ({myJobs.length})</TabsTrigger>
              <TabsTrigger value="profile">Hồ Sơ</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-6">
              <h2 className="text-2xl font-bold">Việc Có Sẵn</h2>

              {availableJobs.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Không có việc mới</h3>
                    <p className="text-gray-600">Hiện tại không có công việc nào cần thực hiện. Hãy quay lại sau!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {availableJobs.map((job) => (
                    <Card key={job.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{getServiceName(job.serviceType)}</CardTitle>
                            <CardDescription>Mã công việc: #{job.id}</CardDescription>
                          </div>
                          <Badge variant="secondary">Mới</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {job.date ? format(new Date(job.date), "PPP", { locale: vi }) : "Chưa xác định"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {job.timeSlot || "Chưa xác định"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {job.address}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="w-4 h-4 mr-2" />
                              {job.totalPrice?.toLocaleString("vi-VN")}đ
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              {job.contactName}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              {formatPhoneNumber(job.contactPhone)}
                            </div>
                          </div>
                        </div>
                        {job.notes && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Ghi chú:</strong> {job.notes}
                            </p>
                          </div>
                        )}
                        <Button onClick={() => acceptJob(job.id)} className="w-full">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Nhận Việc
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-jobs" className="space-y-6">
              <h2 className="text-2xl font-bold">Việc Của Tôi</h2>

              {myJobs.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có việc nào</h3>
                    <p className="text-gray-600">Bạn chưa nhận việc nào. Hãy xem tab "Việc Có Sẵn" để nhận việc mới!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {myJobs.map((job) => (
                    <Card key={job.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{getServiceName(job.serviceType)}</CardTitle>
                            <CardDescription>Mã công việc: #{job.id}</CardDescription>
                          </div>
                          {getStatusBadge(job.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {job.date ? format(new Date(job.date), "PPP", { locale: vi }) : "Chưa xác định"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {job.timeSlot || "Chưa xác định"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {job.address}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="w-4 h-4 mr-2" />
                              {job.totalPrice?.toLocaleString("vi-VN")}đ
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              {job.contactName}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              {formatPhoneNumber(job.contactPhone)}
                            </div>
                          </div>
                        </div>
                        {job.notes && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Ghi chú:</strong> {job.notes}
                            </p>
                          </div>
                        )}

                        {job.status === "confirmed" && (
                          <div className="flex gap-2">
                            <Button onClick={() => updateJobStatus(job.id, "in_progress")} className="flex-1">
                              Bắt Đầu Làm Việc
                            </Button>
                          </div>
                        )}

                        {job.status === "in_progress" && (
                          <div className="flex gap-2">
                            <Button onClick={() => updateJobStatus(job.id, "completed")} className="flex-1">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Hoàn Thành
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <h2 className="text-2xl font-bold">Hồ Sơ Nhân Viên</h2>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>Thông tin hồ sơ nhân viên dọn vệ sinh</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Họ và tên</Label>
                      <p className="text-lg">{user.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Số điện thoại</Label>
                      <p className="text-lg">{formatPhoneNumber(user.phone)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Kinh nghiệm</Label>
                      <p className="text-lg">{user.experience}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Địa chỉ</Label>
                      <p className="text-lg">{user.address}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Trạng thái</Label>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status === "active" ? "Đang hoạt động" : "Chờ phê duyệt"}
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline">Chỉnh Sửa Hồ Sơ</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
