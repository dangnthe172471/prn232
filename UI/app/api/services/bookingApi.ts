export type CreateBookingRequestDto = {
    serviceId: number
    areaSizeId: number
    timeSlotId: number
    bookingDate: string
    addressDistrict: string
    addressDetail: string
    contactName: string
    contactPhone: string
    notes?: string
}

export async function createBooking(data: CreateBookingRequestDto, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        let message = "Tạo booking thất bại"
        try {
            const errorData = await res.json()
            message = errorData.message || message
        } catch (_) { }
        console.log("Sending token:", token)

        throw new Error(message)
    }

    return await res.json()
}

export async function getUserBookings(token: string, status: string = "all") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings?status=${status}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        let message = "Lấy booking thất bại"
        try {
            const errorData = await res.json()
            message = errorData.message || message
        } catch (_) { }
        throw new Error(message)
    }

    return await res.json()
}

export async function getDashboardStats(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/dashboard-stats`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        let message = "Lấy thống kê thất bại"
        try {
            const errorData = await res.json()
            message = errorData.message || message
        } catch (_) { }
        throw new Error(message)
    }
    return await res.json()
}

export async function getBookingById(id: number, token: string) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập.');
        }
        if (response.status === 401) {
            throw new Error('Bạn chưa đăng nhập hoặc token không hợp lệ.');
        }
        throw new Error('Có lỗi xảy ra khi lấy thông tin đơn hàng.');
    }

    return await response.json();
}

export async function cancelBooking(id: number, token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        let message = "Hủy đơn thất bại";
        try {
            const errorData = await response.json();
            message = errorData.message || message;
        } catch (_) { }
        throw new Error(message);
    }
    return await response.json();
}

