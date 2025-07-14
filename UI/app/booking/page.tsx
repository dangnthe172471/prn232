"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarDays, Clock, CheckCircle, Heart, Sparkles, MapPin, Search, Building2, Home } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { createBooking } from "@/app/api/services/bookingApi"
import { getServices, getAreaSizes, getTimeSlots } from "@/app/api/services/ReferenceData"
import {
  vietnamProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
  getFullAddressString,
  type District,
  type Ward,
} from "@/lib/vietnam-address"

export default function BookingPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    serviceType: "",
    timeSlot: "",
    address: "",
    detailedAddress: "",
    area: "",
    notes: "",
    contactName: "",
    contactPhone: "",
  })

  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedWard, setSelectedWard] = useState("")
  const [provinceSearch, setProvinceSearch] = useState("")
  const [districtSearch, setDistrictSearch] = useState("")
  const [wardSearch, setWardSearch] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const [services, setServices] = useState<any[]>([])
  const [areaSizes, setAreaSizes] = useState<any[]>([])
  const [timeSlots, setTimeSlots] = useState<any[]>([])

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(currentUser)
    setUser(userData)
    setFormData((prev) => ({
      ...prev,
      contactName: userData.name || "",
      contactPhone: userData.phone || "",
    }))

    const token = userData.token
    Promise.all([getServices(token), getAreaSizes(token), getTimeSlots(token)])
      .then(([servicesData, areasData, timesData]) => {
        setServices(servicesData)
        setAreaSizes(areasData)
        setTimeSlots(timesData)
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu:", error.message)
      })
  }, [router])

  useEffect(() => {
    calculatePrice()
  }, [formData.serviceType, formData.area])

  const calculatePrice = () => {
    const service = services.find((s) => s.id.toString() === formData.serviceType)
    const area = areaSizes.find((a) => a.id.toString() === formData.area)

    if (service && area) {
      setTotalPrice(service.basePrice * area.multiplier)
    } else {
      setTotalPrice(0)
    }
  }

  const handleProvinceChange = (provinceCode: string) => {
    setSelectedProvince(provinceCode)
    setSelectedDistrict("")
    setSelectedWard("")
    setDistrictSearch("")
    setWardSearch("")
    setWards([])
    updateFullAddress(provinceCode, "", "", formData.detailedAddress)

    // Load districts based on selected province
    const provinceDistricts = getDistrictsByProvince(provinceCode)
    setDistricts(provinceDistricts)
  }

  const handleDistrictChange = (districtCode: string) => {
    setSelectedDistrict(districtCode)
    setSelectedWard("")
    setWardSearch("")
    updateFullAddress(selectedProvince, districtCode, "", formData.detailedAddress)

    // Load wards based on selected district
    const districtWards = getWardsByDistrict(districtCode)
    setWards(districtWards)
  }

  const handleWardChange = (wardCode: string) => {
    setSelectedWard(wardCode)
    updateFullAddress(selectedProvince, selectedDistrict, wardCode, formData.detailedAddress)
  }

  const updateFullAddress = (provinceCode: string, districtCode: string, wardCode: string, detailedAddr: string) => {
    const fullAddress = getFullAddressString(provinceCode, districtCode, wardCode, detailedAddr)
    // Chỉ lấy phần từ phường/xã trở lên (bỏ địa chỉ chi tiết)
    const addressParts = fullAddress.split(", ")
    const addressWithoutDetail = detailedAddr ? addressParts.slice(1).join(", ") : addressParts.join(", ")
    handleInputChange("address", addressWithoutDetail)
  }

  const handleDetailedAddressChange = (value: string) => {
    handleInputChange("detailedAddress", value)
    if (selectedProvince && selectedDistrict && selectedWard) {
      updateFullAddress(selectedProvince, selectedDistrict, selectedWard, value)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getFullAddress = () => {
    return getFullAddressString(selectedProvince, selectedDistrict, selectedWard, formData.detailedAddress)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("TOKEN:", user?.token)

    if (!user) return

    try {
      setLoading(true)

      const payload = {
        serviceId: Number.parseInt(formData.serviceType),
        areaSizeId: Number.parseInt(formData.area),
        timeSlotId: Number.parseInt(formData.timeSlot),
        bookingDate: format(selectedDate!, "yyyy-MM-dd"),
        addressDistrict: formData.address,
        addressDetail: formData.detailedAddress,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        notes: formData.notes || "",
      }

      await createBooking(payload, user.token)

      setSuccess(true)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter functions
  const filteredProvinces = vietnamProvinces.filter((province) =>
    province.name.toLowerCase().includes(provinceSearch.toLowerCase()),
  )

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(districtSearch.toLowerCase()),
  )

  const filteredWards = wards.filter((ward) => ward.name.toLowerCase().includes(wardSearch.toLowerCase()))

  // Helper function to get icon for ward type
  const getWardIcon = (type: string) => {
    switch (type) {
      case "phuong":
        return "🏢"
      case "xa":
        return "🌾"
      case "thi-tran":
        return "🏘️"
      default:
        return "📍"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Đặt Lịch Thành Công!
              </span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Chúng tôi đã nhận được yêu cầu của bạn. Nhân viên sẽ liên hệ xác nhận trong vòng 30 phút.
            </p>
            <div className="space-y-4">
              <Button
                asChild
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <a href="/user/dashboard">Xem Lịch Đặt</a>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 border-gray-300 hover:border-blue-500">
                <a href="/">Về Trang Chủ</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Đặt Lịch Dọn Vệ Sinh
              </span>
            </h1>
            <p className="text-gray-600 text-lg">Chọn dịch vụ và thời gian phù hợp với bạn</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Thông tin đặt lịch</CardTitle>
              <CardDescription className="text-base">
                Vui lòng điền đầy đủ thông tin để chúng tôi phục vụ bạn tốt nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Service Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Loại dịch vụ</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => handleInputChange("serviceType", value)}
                  >
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Chọn loại dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{service.icon}</span>
                              <span>{service.name}</span>
                            </div>
                            <span className="text-sm text-blue-600 font-medium ml-4">
                              {service.basePrice.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area Size */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Diện tích khu vực</Label>
                  <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Chọn diện tích" />
                    </SelectTrigger>
                    <SelectContent>
                      {areaSizes.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          <div className="flex items-center">{area.name}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Ngày thực hiện</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 justify-start text-left font-normal border-gray-300 focus:border-blue-500"
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                        locale={vi}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Slot */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Khung giờ</Label>
                  <Select value={formData.timeSlot} onValueChange={(value) => handleInputChange("timeSlot", value)}>
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Chọn khung giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id.toString()}>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {slot.timeRange}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Address Selection */}
                <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <Label className="text-lg font-semibold text-blue-900">Địa chỉ dịch vụ</Label>
                  </div>

                  {/* Province Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Tỉnh/Thành phố
                    </Label>
                    <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                      <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {filteredProvinces.map((province) => (
                          <SelectItem key={province.code} value={province.code}>
                            <div className="flex items-center">
                              <span className="mr-2">{province.type === "thanh-pho" ? "🏙️" : "🏞️"}</span>
                              {province.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District Selection */}
                  {selectedProvince && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center">
                        <Home className="w-4 h-4 mr-2" />
                        Quận/Huyện
                      </Label>
                      <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {filteredDistricts.map((district) => (
                            <SelectItem key={district.code} value={district.code}>
                              <div className="flex items-center">
                                <span className="mr-2">
                                  {district.type === "quan" ? "🏢" : district.type === "thi-xa" ? "🏘️" : "🌾"}
                                </span>
                                {district.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Ward Selection */}
                  {selectedDistrict && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Phường/Xã
                      </Label>
                      <Select value={selectedWard} onValueChange={handleWardChange}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Chọn phường/xã" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {filteredWards.map((ward) => (
                            <SelectItem key={ward.code} value={ward.code}>
                              <div className="flex items-center">
                                <span className="mr-2">{getWardIcon(ward.type)}</span>
                                {ward.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Detailed Address */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Địa chỉ chi tiết</Label>
                    <Input
                      placeholder="Số nhà, tên đường, tòa nhà..."
                      value={formData.detailedAddress}
                      onChange={(e) => handleDetailedAddressChange(e.target.value)}
                      className="h-12 border-gray-300 focus:border-blue-500" required
                    />
                  </div>

                  {/* Address Preview */}
                  {(selectedProvince || selectedDistrict || selectedWard || formData.detailedAddress) && (
                    <div className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                      <Label className="text-sm font-medium text-blue-900 mb-2 block">Địa chỉ đầy đủ:</Label>
                      <p className="text-gray-700 font-medium">{getFullAddress() || "Chưa có thông tin địa chỉ"}</p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tên người liên hệ</Label>
                    <Input
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      className="h-12 border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Số điện thoại</Label>
                    <Input
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      className="h-12 border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Ghi chú (tùy chọn)</Label>
                  <Textarea
                    placeholder="Yêu cầu đặc biệt, ghi chú thêm..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="min-h-[100px] border-gray-300 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Price Display */}
                {totalPrice > 0 && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Sparkles className="w-6 h-6 text-green-600 mr-2" />
                        <span className="text-lg font-semibold text-green-900">Tổng chi phí dự kiến:</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{totalPrice.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      * Giá cuối cùng có thể thay đổi tùy theo tình trạng thực tế
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.serviceType ||
                    !formData.area ||
                    !formData.timeSlot ||
                    !selectedDate ||
                    !selectedProvince ||
                    !selectedDistrict ||
                    !selectedWard ||
                    !formData.contactName ||
                    !formData.contactPhone
                  }
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Xác nhận đặt lịch
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
