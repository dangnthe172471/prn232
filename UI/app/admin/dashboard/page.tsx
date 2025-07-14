"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Users,
    UserCheck,
    Calendar,
    DollarSign,
    TrendingUp,
    Eye,
    Edit,
    Loader2,
    AlertCircle,
    FileText,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { adminApi, AdminDashboardStatsDto, BookingDto, CustomerDto, CleanerDto, BillDto } from "@/app/api/services/adminApi"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import Header from "@/components/header"
import Link from "next/link"
import { formatPhoneNumber } from "@/lib/utils"

export default function AdminDashboardPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")

    // Dashboard stats
    const [stats, setStats] = useState<AdminDashboardStatsDto | null>(null)

    // Data for tabs
    const [bookings, setBookings] = useState<BookingDto[]>([])
    const [customers, setCustomers] = useState<CustomerDto[]>([])
    const [cleaners, setCleaners] = useState<CleanerDto[]>([])
    const [bills, setBills] = useState<BillDto[]>([])

    // Pagination and filters
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // State for managing cleaner status update
    const [selectedCleaner, setSelectedCleaner] = useState<CleanerDto | null>(null)
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
    const [newCleanerStatus, setNewCleanerStatus] = useState("")
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

    // State for managing booking detail view
    const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null)
    const [isBookingDetailModalOpen, setIsBookingDetailModalOpen] = useState(false)
    const [isLoadingBookingDetail, setIsLoadingBookingDetail] = useState(false)

    // State cho tổng số đơn hàng và tổng số trang
    const [totalBookings, setTotalBookings] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                setError("")

                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/login')
                    return
                }

                // Fetch dashboard stats
                const dashboardStats = await adminApi.getDashboardStats(token)
                setStats(dashboardStats)

                // Fetch initial data
                await Promise.all([
                    fetchBookings(token),
                    fetchCustomers(token),
                    fetchCleaners(token),
                    fetchBills(token)
                ])

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra'
                setError(errorMessage)
                toast.error(errorMessage)

                if (errorMessage.includes('token không hợp lệ')) {
                    localStorage.removeItem('token')
                    router.push('/login')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [router])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            fetchBookings(token)
        }
    }, [currentPage, searchTerm, statusFilter])

    const fetchBookings = async (token: string) => {
        try {
            const result = await adminApi.getAllBookings(token, currentPage, pageSize, searchTerm, statusFilter === 'all' ? undefined : statusFilter)
            setBookings(result.bookings)
            setTotalBookings(result.totalCount)
            setTotalPages(result.totalPages)
        } catch (err) {
            console.error('Error fetching bookings:', err)
        }
    }

    const fetchCustomers = async (token: string) => {
        try {
            const customersData = await adminApi.getAllCustomers(token)
            setCustomers(customersData)
        } catch (err) {
            console.error('Error fetching customers:', err)
        }
    }

    const fetchCleaners = async (token: string) => {
        try {
            const cleanersData = await adminApi.getAllCleaners(token)
            setCleaners(cleanersData)
        } catch (err) {
            console.error('Error fetching cleaners:', err)
        }
    }

    const fetchBills = async (token: string) => {
        try {
            const billsData = await adminApi.getAllBills(token)
            setBills(billsData)
        } catch (err) {
            console.error('Error fetching bills:', err)
        }
    }

    const handleOpenStatusModal = (cleaner: CleanerDto) => {
        setSelectedCleaner(cleaner)
        setNewCleanerStatus(cleaner.status)
        setIsStatusModalOpen(true)
    }

    const handleUpdateCleanerStatus = async () => {
        if (!selectedCleaner || !newCleanerStatus) return

        const token = localStorage.getItem('token')
        if (!token) {
            toast.error("Bạn chưa đăng nhập.")
            router.push('/login')
            return
        }

        setIsUpdatingStatus(true)
        try {
            await adminApi.updateCleanerStatus(token, selectedCleaner.id, newCleanerStatus)
            toast.success("Cập nhật trạng thái nhân viên thành công!")
            // Refresh cleaner list
            fetchCleaners(token)
            setIsStatusModalOpen(false)
            setSelectedCleaner(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật'
            toast.error(errorMessage)
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const handleViewBookingDetail = async (booking: BookingDto) => {
        setSelectedBooking(booking)
        setIsBookingDetailModalOpen(true)

        const token = localStorage.getItem('token')
        if (!token) {
            toast.error("Bạn chưa đăng nhập.")
            router.push('/login')
            return
        }

        setIsLoadingBookingDetail(true)
        try {
            const bookingDetail = await adminApi.getBookingById(token, booking.id)
            setSelectedBooking(bookingDetail)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải chi tiết'
            toast.error(errorMessage)
            setIsBookingDetailModalOpen(false)
        } finally {
            setIsLoadingBookingDetail(false)
        }
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Đang tải dashboard...</p>
                </div>
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải dashboard</h2>
                    <p className="text-gray-600 mb-4">{error || 'Có lỗi xảy ra'}</p>
                    <Button onClick={() => window.location.reload()}>
                        Thử lại
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
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                                <p className="text-gray-600">Quản lý hệ thống dịch vụ dọn dẹp</p>
                            </div>
                            <Button asChild>
                                <Link href="/admin/news">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Quản lý Tin tức
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
                                <Users className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{stats.totalCustomers}</div>
                                <p className="text-xs text-gray-600">Khách hàng đã đăng ký</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
                                <UserCheck className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{stats.totalCleaners}</div>
                                <p className="text-xs text-gray-600">
                                    {stats.activeCleaners} đang hoạt động, {stats.pendingCleaners} chờ duyệt
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
                                <Calendar className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">{stats.totalBookings}</div>
                                <p className="text-xs text-gray-600">
                                    {stats.recentBookings} đơn hàng mới
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                                <DollarSign className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">
                                    {stats.totalRevenue.toLocaleString('vi-VN')} VNĐ
                                </div>
                                <p className="text-xs text-gray-600">
                                    {stats.recentRevenue.toLocaleString('vi-VN')} VNĐ
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Booking Status Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    Trạng thái đơn hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {stats.bookingsByStatus && Object.entries(stats.bookingsByStatus).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={getStatusColor(status)}>
                                                    {getStatusText(status)}
                                                </Badge>
                                            </div>
                                            <span className="font-semibold">{count}</span>
                                        </div>
                                    ))}
                                    {(!stats.bookingsByStatus || Object.keys(stats.bookingsByStatus).length === 0) && (
                                        <p className="text-gray-500 text-center py-4">Chưa có dữ liệu trạng thái đơn hàng</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Revenue by Service */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    Doanh thu theo dịch vụ
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {stats.revenueByService && Object.entries(stats.revenueByService).map(([service, revenue]) => (
                                        <div key={service} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">{service}</span>
                                            <span className="font-semibold text-green-600">
                                                {revenue.toLocaleString('vi-VN')} VNĐ
                                            </span>
                                        </div>
                                    ))}
                                    {(!stats.revenueByService || Object.keys(stats.revenueByService).length === 0) && (
                                        <p className="text-gray-500 text-center py-4">Chưa có dữ liệu doanh thu theo dịch vụ</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Tables */}
                    <Tabs defaultValue="bookings" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="bookings">Đơn hàng</TabsTrigger>
                            <TabsTrigger value="customers">Khách hàng</TabsTrigger>
                            <TabsTrigger value="cleaners">Nhân viên</TabsTrigger>
                            {/* <TabsTrigger value="bills">Hóa đơn</TabsTrigger> */}
                        </TabsList>

                        {/* Bookings Tab */}
                        <TabsContent value="bookings" className="space-y-4">
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Tìm kiếm đơn hàng..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Lọc theo trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                        <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                                        <SelectItem value="completed">Hoàn thành</SelectItem>
                                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Danh sách đơn hàng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Khách hàng</TableHead>
                                                <TableHead>Dịch vụ</TableHead>
                                                <TableHead>Ngày đặt</TableHead>
                                                <TableHead>Tổng tiền</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bookings && bookings.length > 0 ? bookings.map((booking) => (
                                                <TableRow key={booking.id}>
                                                    <TableCell>#{booking.id}</TableCell>
                                                    <TableCell>{booking.userName}</TableCell>
                                                    <TableCell>{booking.serviceName}</TableCell>
                                                    <TableCell>{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</TableCell>
                                                    <TableCell>{booking.totalPrice.toLocaleString('vi-VN')} VNĐ</TableCell>
                                                    <TableCell>
                                                        <Badge className={getStatusColor(booking.status)}>
                                                            {getStatusText(booking.status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" onClick={() => handleViewBookingDetail(booking)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                        Chưa có dữ liệu đơn hàng
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                    {/* PHÂN TRANG */}
                                    {bookings && bookings.length > 0 && (
                                        <div className="flex justify-end items-center mt-4 gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Trước
                                            </Button>
                                            <span className="mx-2 text-sm">
                                                Trang {currentPage} / {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages || totalPages === 0}
                                            >
                                                Sau
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Customers Tab */}
                        <TabsContent value="customers" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Danh sách khách hàng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Tên</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Số điện thoại</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {customers && customers.length > 0 ? customers.map((customer) => (
                                                <TableRow key={customer.id}>
                                                    <TableCell>#{customer.id}</TableCell>
                                                    <TableCell>{customer.name}</TableCell>
                                                    <TableCell>{customer.email}</TableCell>
                                                    <TableCell>{formatPhoneNumber(customer.phone)}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                                                            {customer.status === 'active' ? 'Hoạt động' :
                                                                customer.status === 'inactive' ? 'Không hoạt động' : customer.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                        Chưa có dữ liệu khách hàng
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Cleaners Tab */}
                        <TabsContent value="cleaners" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Danh sách nhân viên</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Tên</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Số điện thoại</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Kinh nghiệm</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cleaners && cleaners.length > 0 ? cleaners.map((cleaner) => (
                                                <TableRow key={cleaner.id}>
                                                    <TableCell>#{cleaner.id}</TableCell>
                                                    <TableCell>{cleaner.name}</TableCell>
                                                    <TableCell>{cleaner.email}</TableCell>
                                                    <TableCell>{formatPhoneNumber(cleaner.phone)}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={cleaner.status === 'active' ? 'default' : 'secondary'}>
                                                            {cleaner.status === 'active' ? 'Hoạt động' :
                                                                cleaner.status === 'inactive' ? 'Không hoạt động' : cleaner.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{cleaner.experience || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" onClick={() => handleOpenStatusModal(cleaner)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                        Chưa có dữ liệu nhân viên
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Bills Tab */}
                        <TabsContent value="bills" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Danh sách hóa đơn</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Bill ID</TableHead>
                                                <TableHead>Email khách hàng</TableHead>
                                                <TableHead>Số tiền</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Ngày thanh toán</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bills && bills.length > 0 ? bills.map((bill) => (
                                                <TableRow key={bill.id}>
                                                    <TableCell>#{bill.id}</TableCell>
                                                    <TableCell>{bill.billId}</TableCell>
                                                    <TableCell>{bill.customerEmail}</TableCell>
                                                    <TableCell>{bill.amount.toLocaleString('vi-VN')} VNĐ</TableCell>
                                                    <TableCell>
                                                        <Badge variant={bill.status === 'completed' ? 'default' : 'secondary'}>
                                                            {bill.status === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{new Date(bill.date).toLocaleDateString('vi-VN')}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                        Chưa có dữ liệu hóa đơn
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Cleaner Status Update Modal */}
                    <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Cập nhật trạng thái nhân viên</DialogTitle>
                                <DialogDescription>
                                    Chọn trạng thái mới cho nhân viên &quot;{selectedCleaner?.name}&quot;.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Select value={newCleanerStatus} onValueChange={setNewCleanerStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Hoạt động</SelectItem>
                                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>Hủy</Button>
                                <Button onClick={handleUpdateCleanerStatus} disabled={isUpdatingStatus}>
                                    {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Cập nhật
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Booking Detail Modal */}
                    <Dialog open={isBookingDetailModalOpen} onOpenChange={setIsBookingDetailModalOpen}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Chi tiết đơn hàng #{selectedBooking?.id}</DialogTitle>
                                <DialogDescription>
                                    Thông tin chi tiết về đơn hàng.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                {isLoadingBookingDetail ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                        <span>Đang tải chi tiết...</span>
                                    </div>
                                ) : selectedBooking ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-600">Thông tin khách hàng</h4>
                                                <p className="text-sm">Tên: {selectedBooking.userName}</p>
                                                <p className="text-sm">Liên hệ: {selectedBooking.contactName}</p>
                                                <p className="text-sm">SĐT: {formatPhoneNumber(selectedBooking.contactPhone)}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-600">Thông tin dịch vụ</h4>
                                                <p className="text-sm">Dịch vụ: {selectedBooking.serviceName}</p>
                                                <p className="text-sm">Diện tích: {selectedBooking.areaSizeName}</p>
                                                <p className="text-sm">Thời gian: {selectedBooking.timeSlotRange}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-600">Địa chỉ</h4>
                                            <p className="text-sm">{selectedBooking.address}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-600">Ngày đặt</h4>
                                                <p className="text-sm">{new Date(selectedBooking.bookingDate).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-600">Tổng tiền</h4>
                                                <p className="text-sm font-semibold text-green-600">
                                                    {selectedBooking.totalPrice.toLocaleString('vi-VN')} VNĐ
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-600">Trạng thái</h4>
                                            <Badge className={getStatusColor(selectedBooking.status)}>
                                                {getStatusText(selectedBooking.status)}
                                            </Badge>
                                        </div>

                                        {selectedBooking.cleanerName && (
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-600">Nhân viên phụ trách</h4>
                                                <p className="text-sm">{selectedBooking.cleanerName}</p>
                                            </div>
                                        )}

                                        {selectedBooking.notes && (
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-600">Ghi chú</h4>
                                                <p className="text-sm">{selectedBooking.notes}</p>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-600">Ngày tạo</h4>
                                            <p className="text-sm">{new Date(selectedBooking.createdAt).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">Không có thông tin chi tiết</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsBookingDetailModalOpen(false)}>Đóng</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    )
}