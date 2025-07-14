"use client";
import { useState } from "react";
import { sendForgotPasswordPin, verifyForgotPasswordPin, resetPasswordWithPin, resendForgotPasswordPin } from "@/app/api/services/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [resendMsg, setResendMsg] = useState("");

    // Bước 1: Gửi mã PIN
    const handleSendPin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await sendForgotPasswordPin(email);
            setSuccess("Đã gửi mã PIN về email. Vui lòng kiểm tra hộp thư!");
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Bước 2: Xác thực mã PIN
    const handleVerifyPin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await verifyForgotPasswordPin(email, pin);
            setSuccess("Mã PIN hợp lệ. Vui lòng nhập mật khẩu mới!");
            setStep(3);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Bước 3: Đặt lại mật khẩu
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải từ 6 ký tự trở lên.");
            setLoading(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            setLoading(false);
            return;
        }
        try {
            await resetPasswordWithPin(email, pin, newPassword);
            setSuccess("Đặt lại mật khẩu thành công! Bạn sẽ được chuyển về trang đăng nhập.");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Gửi lại mã PIN
    const handleResendPin = async () => {
        setResendStatus("sending");
        setResendMsg("");
        try {
            await resendForgotPasswordPin(email);
            setResendStatus("sent");
            setResendMsg("Đã gửi lại mã PIN. Vui lòng kiểm tra email!");
        } catch (err: any) {
            setResendStatus("error");
            setResendMsg(err.message || "Không thể gửi lại mã PIN");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
            <Header />
            <div className="pt-20 pb-16 px-4">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span className="text-white text-3xl font-bold">?</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Quên Mật Khẩu
                        </h1>
                        <p className="text-gray-600 text-lg">Khôi phục mật khẩu tài khoản CareU</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        {error && (
                            <Alert className="mb-6 border-red-200 bg-red-50">
                                <AlertDescription className="text-red-800">{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="mb-6 border-green-200 bg-green-50">
                                <AlertDescription className="text-green-800">{success}</AlertDescription>
                            </Alert>
                        )}

                        {step === 1 && (
                            <form onSubmit={handleSendPin} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Nhập email đã đăng ký
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-12 border-gray-300 focus:border-blue-500"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg"
                                    disabled={loading}
                                >
                                    {loading ? "Đang gửi mã PIN..." : "Gửi mã PIN"}
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyPin} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="pin" className="text-sm font-medium">
                                        Nhập mã PIN đã gửi về email
                                    </label>
                                    <Input
                                        id="pin"
                                        type="text"
                                        placeholder="Nhập mã PIN 6 số"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        required
                                        maxLength={6}
                                        className="h-12 border-gray-300 focus:border-blue-500 tracking-widest text-xl text-center"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg"
                                    disabled={loading}
                                >
                                    {loading ? "Đang xác thực..." : "Xác thực mã PIN"}
                                </Button>
                                <div className="mt-4 text-center">
                                    <Button type="button" variant="ghost" onClick={handleResendPin} disabled={resendStatus === "sending"}>
                                        {resendStatus === "sending" ? "Đang gửi lại..." : "Gửi lại mã PIN"}
                                    </Button>
                                    {resendMsg && (
                                        <div className={`mt-2 text-sm ${resendStatus === "sent" ? "text-green-600" : "text-red-600"}`}>{resendMsg}</div>
                                    )}
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="text-sm font-medium">
                                        Nhập mật khẩu mới
                                    </label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Mật khẩu mới"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="h-12 border-gray-300 focus:border-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Nhập lại mật khẩu mới"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="h-12 border-gray-300 focus:border-blue-500"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg"
                                    disabled={loading}
                                >
                                    {loading ? "Đang đặt lại mật khẩu..." : "Đặt lại mật khẩu"}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 