"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CreditCard,
  Star,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getBookingById } from "@/app/api/services/bookingApi"
import { reviewApi, CreateReviewRequest } from "@/app/api/services/reviewApi"
import Header from "@/components/header"
import { formatPhoneNumber } from "@/lib/utils"

// Interface cho dữ liệu từ API
interface BookingDetailDto {
  id: number;
  serviceName: string;
  areaSizeName: string;
  timeSlotRange: string;
  bookingDate: string;
  address: string;
  contactName: string;
  contactPhone: string;
  notes?: string;
  totalPrice: number;
  status: string;
  cleanerId?: number;
  cleanerName?: string;
  createdAt: string;
  updatedAt?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200"
    case "in_progress":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "confirmed":
      return "bg-orange-100 text-orange-700 border-orange-200"
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Hoàn thành"
    case "in_progress":
      return "Đang thực hiện"
    case "confirmed":
      return "Đã xác nhận"
    case "pending":
      return "Chờ xác nhận"
    case "cancelled":
      return "Đã hủy"
    default:
      return status
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "in_progress":
      return <PlayCircle className="h-5 w-5 text-blue-600" />
    case "confirmed":
      return <Clock className="h-5 w-5 text-orange-600" />
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-600" />
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-600" />
    default:
      return <Clock className="h-5 w-5 text-gray-600" />
  }
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [review, setReview] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editRating, setEditRating] = useState(5)
  const [editComment, setEditComment] = useState("")
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        // Lấy token từ localStorage
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const bookingId = parseInt(params.id as string)
        const data = await getBookingById(bookingId, token)
        setBooking(data)

        // Kiểm tra xem user đã đánh giá chưa
        if (data.status === "completed") {
          try {
            const reviewed = await reviewApi.checkUserReviewedBooking(bookingId, token)
            setHasReviewed(reviewed)

            if (reviewed) {
              const reviewData = await reviewApi.getReviewByBookingId(bookingId, token)
              setReview(reviewData)
            }
          } catch (error) {
            console.error("Error checking review:", error)
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra'
        setError(errorMessage)
        toast.error(errorMessage)

        // Nếu lỗi 401, redirect về login
        if (errorMessage.includes('token không hợp lệ')) {
          localStorage.removeItem('token')
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBookingDetail()
    }
  }, [params.id, router])

  const handleSubmitFeedback = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Vui lòng chọn số sao từ 1-5")
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Bạn cần đăng nhập để sử dụng tính năng này")
        router.push("/login")
        return
      }

      const reviewData: CreateReviewRequest = {
        bookingId: booking!.id,
        rating,
        comment: comment.trim() || undefined,
      }

      const createdReview = await reviewApi.createReview(reviewData, token)
      toast.success("Đánh giá của bạn đã được gửi thành công!")
      setIsDialogOpen(false)
      setRating(5)
      setComment("")

      // Cập nhật state sau khi đánh giá thành công
      setHasReviewed(true)
      setReview(createdReview)
    } catch (error: any) {
      console.error("Error submitting review:", error)
      const errorMessage = error.message || "Có lỗi xảy ra khi gửi đánh giá"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Khi mở dialog sửa, set lại giá trị cũ
  const openEditDialog = () => {
    setEditRating(review.rating)
    setEditComment(review.comment || "")
    setIsEditDialogOpen(true)
  }

  const handleEditFeedback = async () => {
    if (editRating < 1 || editRating > 5) {
      toast.error("Vui lòng chọn số sao từ 1-5")
      return
    }
    setIsEditSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Bạn cần đăng nhập để sử dụng tính năng này")
        router.push("/login")
        return
      }
      const updated = await reviewApi.updateReview(booking!.id, { rating: editRating, comment: editComment.trim() || undefined }, token)
      toast.success("Cập nhật đánh giá thành công!")
      setReview(updated)
      setIsEditDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Có lỗi khi cập nhật đánh giá")
    } finally {
      setIsEditSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải thông tin đơn hàng</h2>
          <p className="text-gray-600 mb-4">{error || 'Đơn hàng không tồn tại'}</p>
          <Button asChild>
            <Link href="/user/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/user/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi tiết booking #{booking.id}</h1>
                <div className="flex items-center gap-3">
                  {getStatusIcon(booking.status)}
                  <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                </div>
              </div>

              {booking.status === "completed" && (
                <div className="flex gap-2">
                  {hasReviewed ? (
                    <Button variant="outline" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Đã đánh giá
                    </Button>
                  ) : (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Đánh giá dịch vụ
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-blue-500" />
                            Đánh giá dịch vụ
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Thông tin booking */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Thông tin dịch vụ:</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p><strong>Dịch vụ:</strong> {booking.serviceName}</p>
                              <p><strong>Địa chỉ:</strong> {booking.address}</p>
                              <p><strong>Ngày thực hiện:</strong> {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</p>
                              <p><strong>Nhân viên:</strong> {booking.cleanerName || "Chưa có"}</p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div>
                            <Label className="text-base font-medium text-gray-900 mb-3 block">
                              Đánh giá của bạn:
                            </Label>
                            <div className="flex justify-center space-x-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className="focus:outline-none transition-colors"
                                >
                                  <Star
                                    className={`w-10 h-10 ${star <= rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300 hover:text-yellow-300"
                                      }`}
                                  />
                                </button>
                              ))}
                            </div>
                            <p className="text-center mt-2 text-sm text-gray-600">
                              {rating === 1 && "Rất không hài lòng"}
                              {rating === 2 && "Không hài lòng"}
                              {rating === 3 && "Bình thường"}
                              {rating === 4 && "Hài lòng"}
                              {rating === 5 && "Rất hài lòng"}
                            </p>
                          </div>

                          {/* Comment */}
                          <div>
                            <Label htmlFor="comment" className="text-base font-medium text-gray-900 mb-2 block">
                              Nhận xét (không bắt buộc):
                            </Label>
                            <Textarea
                              id="comment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                              className="min-h-[120px] resize-none"
                              maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {comment.length}/500 ký tự
                            </p>
                          </div>

                          {/* Submit button */}
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                              disabled={isSubmitting}
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={handleSubmitFeedback}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Đang gửi...
                                </>
                              ) : (
                                "Gửi đánh giá"
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">🏠</span>
                    {booking.serviceName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Dịch vụ dọn dẹp nhà cửa chuyên nghiệp</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Thông tin đặt lịch</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span>{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span>{booking.timeSlotRange}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Diện tích:</span>
                          <span>{booking.areaSizeName}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Thông tin khác</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Ngày tạo: </span>
                          <span>{new Date(booking.createdAt).toLocaleString("vi-VN")}</span>
                        </div>
                        {booking.updatedAt && (
                          <div>
                            <span className="text-gray-600">Cập nhật lần cuối: </span>
                            <span>{new Date(booking.updatedAt).toLocaleString("vi-VN")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    Địa chỉ thực hiện
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Địa chỉ đầy đủ</h4>
                      <p className="text-gray-700">{booking.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Thông tin liên hệ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Người liên hệ</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Tên: </span>
                          <span>{booking.contactName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span>{formatPhoneNumber(booking.contactPhone)}</span>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div>
                        <h4 className="font-semibold mb-2">Ghi chú</h4>
                        <p className="text-sm text-gray-700">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cleaner Info */}
              {booking.cleanerName && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nhân viên thực hiện</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{booking.cleanerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{booking.cleanerName}</h4>
                        <p className="text-sm text-gray-600">Nhân viên dọn dẹp</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {booking.totalPrice.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phương thức:</span>
                        <span>Tiền mặt</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <Badge variant="default">
                          Đã thanh toán
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Đặt lịch</div>
                        <div className="text-gray-600">{new Date(booking.createdAt).toLocaleString("vi-VN")}</div>
                      </div>
                    </div>

                    {booking.status === "confirmed" && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                        <div>
                          <div className="font-medium">Đã xác nhận</div>
                          <div className="text-gray-600">Đơn hàng đã được xác nhận</div>
                        </div>
                      </div>
                    )}

                    {booking.status === "in_progress" && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <div className="font-medium">Đang thực hiện</div>
                          <div className="text-gray-600">Nhân viên đang thực hiện dịch vụ</div>
                        </div>
                      </div>
                    )}

                    {booking.status === "completed" && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <div>
                          <div className="font-medium">Hoàn thành</div>
                          <div className="text-gray-600">Dịch vụ đã hoàn thành</div>
                        </div>
                      </div>
                    )}

                    {booking.status === "cancelled" && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <div>
                          <div className="font-medium">Đã hủy</div>
                          <div className="text-gray-600">Đơn hàng đã bị hủy</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Section - Chỉ hiển thị khi đã đánh giá */}
              {hasReviewed && review && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Đánh giá của bạn
                      <Button size="sm" variant="outline" className="ml-auto" onClick={openEditDialog}>
                        Sửa đánh giá
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {review.rating}/5 sao
                        </span>
                      </div>
                      {review.comment && (
                        <div>
                          <p className="text-sm text-gray-700 italic">
                            "{review.comment}"
                          </p>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Đánh giá vào: {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Dialog sửa đánh giá */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Sửa đánh giá
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Rating */}
                    <div>
                      <Label className="text-base font-medium text-gray-900 mb-3 block">
                        Đánh giá của bạn:
                      </Label>
                      <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className="focus:outline-none transition-colors"
                          >
                            <Star
                              className={`w-10 h-10 ${star <= editRating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-300"}`}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-center mt-2 text-sm text-gray-600">
                        {editRating === 1 && "Rất không hài lòng"}
                        {editRating === 2 && "Không hài lòng"}
                        {editRating === 3 && "Bình thường"}
                        {editRating === 4 && "Hài lòng"}
                        {editRating === 5 && "Rất hài lòng"}
                      </p>
                    </div>
                    {/* Comment */}
                    <div>
                      <Label htmlFor="edit-comment" className="text-base font-medium text-gray-900 mb-2 block">
                        Nhận xét (không bắt buộc):
                      </Label>
                      <Textarea
                        id="edit-comment"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                        className="min-h-[120px] resize-none"
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {editComment.length}/500 ký tự
                      </p>
                    </div>
                    {/* Submit button */}
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        disabled={isEditSubmitting}
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleEditFeedback}
                        disabled={isEditSubmitting}
                      >
                        {isEditSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang lưu...
                          </>
                        ) : (
                          "Lưu thay đổi"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
