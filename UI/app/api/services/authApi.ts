export interface LoginRequestDto {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    role: string
    name: string
    email: string
    phone: string
    address: string
}


export async function login(request: LoginRequestDto): Promise<LoginResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(request),
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Đăng nhập thất bại")
    }

    return res.json()
}

export interface RegisterRequestDto {
    name: string
    email: string
    password: string
    role: string
}

export async function register(request: RegisterRequestDto): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(request),
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Đăng ký thất bại")
    }

    return res.json()
}

export const changePassword = async (
    request: { email: string; oldPassword: string; newPassword: string },
    token: string
) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Đổi mật khẩu thất bại")
    }

    return response.json()
}
