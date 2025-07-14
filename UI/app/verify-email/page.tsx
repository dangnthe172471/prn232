"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail, resendVerificationEmail } from "@/app/api/services/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/header";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error" | "expired">("idle");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [resendMsg, setResendMsg] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            setStatus("verifying");
            verifyEmail(token)
                .then(() => {
                    setStatus("success");
                    setMessage("Xác thực email thành công! Bạn có thể đăng nhập.");
                })
                .catch((err) => {
                    setStatus("expired");
                    setMessage(err.message || "Xác thực email thất bại hoặc link đã hết hạn.");
                });
        }
    }, [searchParams]);

    const handleResend = async () => {
        if (!email) {
            setResendMsg("Vui lòng nhập email để gửi lại xác thực.");
            setResendStatus("error");
            return;
        }
        setResendStatus("sending");
        setResendMsg("");
        try {
            await resendVerificationEmail(email);
            setResendStatus("sent");
            setResendMsg("Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư.");
        } catch (err: any) {
            setResendStatus("error");
            setResendMsg(err.message || "Gửi lại email xác thực thất bại.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
            <Header />
            <div className="pt-20 pb-16 px-4">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-3 text-blue-700">Xác Thực Email</h1>
                        <p className="text-gray-600 text-lg">Vui lòng kiểm tra email và nhấn vào link xác thực.<br />Link chỉ có hiệu lực trong 15 phút.</p>
                    </div>
                    {status === "verifying" && (
                        <Alert className="mb-6 border-blue-200 bg-blue-50">
                            <AlertDescription>Đang xác thực email...</AlertDescription>
                        </Alert>
                    )}
                    {status === "success" && (
                        <Alert className="mb-6 border-green-200 bg-green-50">
                            <AlertDescription className="text-green-800">{message}</AlertDescription>
                        </Alert>
                    )}
                    {(status === "error" || status === "expired") && (
                        <Alert className="mb-6 border-red-200 bg-red-50">
                            <AlertDescription className="text-red-800">{message}</AlertDescription>
                        </Alert>
                    )}
                    {(status === "expired" || status === "error") && (
                        <div className="mt-8">
                            <div className="mb-2 text-gray-700">Chưa nhận được email hoặc link đã hết hạn?</div>
                            <Input
                                type="email"
                                placeholder="Nhập email để gửi lại xác thực"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="mb-2"
                            />
                            <Button onClick={handleResend} disabled={resendStatus === "sending"} className="w-full">
                                {resendStatus === "sending" ? "Đang gửi..." : "Gửi lại email xác thực"}
                            </Button>
                            {resendMsg && (
                                <div className={`mt-2 text-sm ${resendStatus === "sent" ? "text-green-600" : "text-red-600"}`}>{resendMsg}</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 