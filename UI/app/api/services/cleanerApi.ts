// src/app/api/services/bookingApi.ts

export async function getCleanerAvailableJobs(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cleaner/available-jobs`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
        },

    })
    if (!res.ok) throw new Error("Không thể tải danh sách công việc có sẵn.")
    return res.json()
}

export async function getCleanerMyJobs(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cleaner/my-jobs`, {
        headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true", },
    })
    if (!res.ok) throw new Error("Không thể tải danh sách công việc của tôi.")
    return res.json()
}

export async function acceptCleanerJob(jobId: number, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cleaner/accept-job/${jobId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true", },
    })
    if (!res.ok) throw new Error("Nhận việc thất bại.")
    return res.json()
}

export async function updateCleanerJobStatus(jobId: number, status: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cleaner/update-job-status/${jobId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error("Cập nhật trạng thái thất bại.")
    return res.json()
}

export async function getCleanerProfile(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cleaner/profile`, {
        headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
    })
    if (!res.ok) throw new Error("Không thể lấy thông tin hồ sơ.")
    return res.json()
}
