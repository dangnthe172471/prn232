
export async function getServices(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ReferenceData/services`, {
        headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
    });
    if (!res.ok) throw new Error("Không lấy được danh sách dịch vụ");
    return res.json();
}

export async function getAreaSizes(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ReferenceData/areasizes`, {
        headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
    });
    if (!res.ok) throw new Error("Không lấy được danh sách diện tích");
    return res.json();
}

export async function getTimeSlots(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ReferenceData/timeslots`, {
        headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
    });
    if (!res.ok) throw new Error("Không lấy được danh sách khung giờ");
    return res.json();
}
