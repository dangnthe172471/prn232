const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AdminDashboardStatsDto {
    totalCustomers: number;
    totalCleaners: number;
    totalBookings: number;
    totalRevenue: number;
    totalBills: number;
    bookingsByStatus: Record<string, number>;
    revenueByService: Record<string, number>;
    pendingCleaners: number;
    activeCleaners: number;
    recentBookings: number;
    recentRevenue: number;
}

export interface BookingDto {
    id: number;
    userName: string;
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
    cleanerName?: string;
    createdAt: string;
}

export interface CustomerDto {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    createdAt: string;
    totalBookings: number;
    totalSpent: number;
}

export interface CleanerDto {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    experience?: string;
    createdAt: string;
}

export interface BillDto {
    id: number;
    billId: string;
    customerEmail: string;
    amount: number;
    status: string;
    date: string;
    createdAt: string;
}

export interface ServiceDto {
    id: number;
    name: string;
    description?: string;
    basePrice: number;
    duration?: string;
    icon?: string;
    isActive: boolean;
    createdAt?: string;
}

export interface CreateServiceDto {
    name: string;
    description?: string;
    basePrice: number;
    duration?: string;
    icon?: string;
    isActive: boolean;
}

export interface UpdateServiceDto {
    name: string;
    description?: string;
    basePrice: number;
    duration?: string;
    icon?: string;
    isActive: boolean;
}

export const adminApi = {
    getDashboardStats: async (token: string): Promise<AdminDashboardStatsDto> => {
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Bạn chưa đăng nhập hoặc token không hợp lệ.');
            }
            throw new Error('Có lỗi xảy ra khi lấy thống kê dashboard.');
        }

        return response.json();
    },

    getAllBookings: async (
        token: string,
        page: number = 1,
        pageSize: number = 10,
        search?: string,
        status?: string
    ): Promise<{ bookings: BookingDto[]; totalCount: number; totalPages: number }> => {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        if (search) params.append('search', search);
        if (status) params.append('status', status);

        const response = await fetch(`${API_BASE_URL}/api/admin/bookings?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi lấy danh sách booking.');
        }

        const result = await response.json();
        return {
            bookings: result.items || [],
            totalCount: result.totalCount || 0,
            totalPages: Math.ceil((result.totalCount || 0) / pageSize)
        };
    },

    getBookingById: async (token: string, id: number): Promise<BookingDto> => {
        const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Không tìm thấy booking.');
            }
            throw new Error('Có lỗi xảy ra khi lấy thông tin booking.');
        }

        return response.json();
    },

    updateBookingStatus: async (token: string, id: number, status: string): Promise<BookingDto> => {
        const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${id}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Không tìm thấy booking.');
            }
            throw new Error('Có lỗi xảy ra khi cập nhật trạng thái booking.');
        }

        return response.json();
    },

    getAllCustomers: async (token: string): Promise<CustomerDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/admin/customers`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi lấy danh sách khách hàng.');
        }

        return response.json();
    },

    getAllCleaners: async (token: string): Promise<CleanerDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/admin/cleaners`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi lấy danh sách nhân viên.');
        }

        return response.json();
    },

    updateCleanerStatus: async (token: string, id: number, status: string): Promise<CleanerDto> => {
        const response = await fetch(`${API_BASE_URL}/api/admin/cleaners/${id}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Không tìm thấy nhân viên.');
            }
            throw new Error('Có lỗi xảy ra khi cập nhật trạng thái nhân viên.');
        }

        return response.json();
    },

    getAllBills: async (token: string): Promise<BillDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/admin/bills`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi lấy danh sách hóa đơn.');
        }

        return response.json();
    },

    // Service Management
    getAllServices: async (token: string): Promise<ServiceDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/referencedata/services/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi lấy danh sách dịch vụ.');
        }

        return response.json();
    },

    createService: async (token: string, serviceData: CreateServiceDto): Promise<ServiceDto> => {
        const response = await fetch(`${API_BASE_URL}/api/referencedata/services`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi tạo dịch vụ.');
        }

        return response.json();
    },

    updateService: async (token: string, id: number, serviceData: UpdateServiceDto): Promise<ServiceDto> => {
        const response = await fetch(`${API_BASE_URL}/api/referencedata/services/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Không tìm thấy dịch vụ.');
            }
            throw new Error('Có lỗi xảy ra khi cập nhật dịch vụ.');
        }

        return response.json();
    },


}; 