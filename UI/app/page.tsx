"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Clock, Shield, Star, ArrowRight, Heart, Users, Loader2 } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useEffect, useState } from "react"
import { getServices } from "@/app/api/services/ReferenceData"

interface Service {
  id: number
  name: string
  description: string
  basePrice: number
  pricePerSquareMeter: number
  isActive: boolean
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch services
        const servicesData = await getServices("")
        setServices(servicesData)

      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Có lỗi xảy ra khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fallback services data if API fails
  const fallbackServices = [
    {
      id: 1,
      name: "Dọn Nhà Định Kỳ",
      description: "Dịch vụ dọn dẹp nhà cửa hàng tuần, hàng tháng với đội ngũ chuyên nghiệp",
      basePrice: 300000,
      pricePerSquareMeter: 5000,
      isActive: true,
    },
    {
      id: 2,
      name: "Dọn Văn Phòng",
      description: "Vệ sinh văn phòng chuyên nghiệp, tạo môi trường làm việc sạch sẽ",
      basePrice: 500000,
      pricePerSquareMeter: 8000,
      isActive: true,
    },
    {
      id: 3,
      name: "Dọn Sau Xây Dựng",
      description: "Dọn dẹp chuyên sâu sau khi sửa chữa, xây dựng hoặc cải tạo",
      basePrice: 800000,
      pricePerSquareMeter: 12000,
      isActive: true,
    },
    {
      id: 4,
      name: "Dọn Cuối Năm",
      description: "Dọn dẹp tổng thể, chuẩn bị đón Tết Nguyên Đán trọn vẹn",
      basePrice: 600000,
      pricePerSquareMeter: 10000,
      isActive: true,
    },
  ]

  const displayServices = services.length > 0 ? services : fallbackServices

  const serviceIcons = ["🏠", "🏢", "🔨", "🎊", "🧹", "✨"]
  const serviceGradients = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-orange-500 to-red-400",
    "from-green-500 to-emerald-400",
    "from-indigo-500 to-purple-400",
    "from-pink-500 to-rose-400"
  ]

  const testimonials = [
    {
      name: "Chị Lan Anh",
      location: "Thôn 1, Thạch Hòa, Thạch Thất, Hà Nội",
      rating: 5,
      comment: "Dịch vụ tuyệt vời! Nhân viên làm việc rất cẩn thận và chuyên nghiệp. Nhà tôi sạch sẽ như mới.",
      avatar: "👩‍💼",
    },
    {
      name: "Anh Minh Tuấn",
      location: "Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội",
      rating: 5,
      comment: "Đặt lịch dễ dàng, nhân viên đến đúng giờ. Giá cả hợp lý, chất lượng vượt mong đợi! Rất hài lòng!",
      avatar: "👨‍💻",
    },
    {
      name: "Chị Thu Hương",
      location: "Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội",
      rating: 5,
      comment: "Đã sử dụng dịch vụ nhiều lần, luôn hài lòng. Đội ngũ rất tận tâm và chu đáo. Sẽ còn tiếp tục sử dụng dịch vụ.",
      avatar: "👩‍🏫",
    },
  ]

  const features = [
    {
      icon: Clock,
      title: "Đúng Giờ",
      description: "Cam kết đến đúng giờ hẹn, không để bạn phải chờ đợi",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Shield,
      title: "Bảo Hiểm",
      description: "Toàn bộ nhân viên được bảo hiểm, đảm bảo an toàn tuyệt đối",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Star,
      title: "Chất Lượng",
      description: "Đánh giá 4.9/5 sao từ hơn 10,000 khách hàng tin tưởng",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Heart,
      title: "Tận Tâm",
      description: "Phục vụ với tình yêu nghề nghiệp và sự chăm sóc tận tình",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ]

  const formatPrice = (basePrice: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(basePrice)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Dịch vụ dọn vệ sinh #1 Việt Nam
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Ngôi Nhà Sạch Sẽ
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chỉ Với Vài Click
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Đặt lịch dọn vệ sinh chuyên nghiệp, nhanh chóng và tiện lợi.
            <br className="hidden md:block" />
            Đội ngũ nhân viên được đào tạo bài bản, cam kết chất lượng 100%.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/booking">
                <Sparkles className="w-5 h-5 mr-2" />
                Đặt Lịch Ngay
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-10 py-6 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
            >
              <Link href="/register">
                Đăng Ký Tài Khoản
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600">Khách hàng tin tưởng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-gray-600">Nhân viên chuyên nghiệp</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">50,000+</div>
              <div className="text-gray-600">Lượt đặt lịch thành công</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600">4.9/5</div>
              <div className="text-gray-600">Đánh giá trung bình</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Tại Sao Chọn CareU?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm dịch vụ tốt nhất với những giá trị cốt lõi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
                Dịch Vụ Của Chúng Tôi
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đa dạng dịch vụ dọn vệ sinh chuyên nghiệp, phù hợp với mọi nhu cầu
            </p>
          </div>

          <div className="flex justify-center">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
              {displayServices.map((service, index) => (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group w-full max-w-sm">
                  <div className={`h-2 bg-gradient-to-r ${serviceGradients[index % serviceGradients.length]}`}></div>
                  <CardContent className="p-8">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {serviceIcons[index % serviceIcons.length]}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Giá từ:</span>
                        <span className="font-semibold text-blue-600">{formatPrice(service.basePrice)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-green-900 bg-clip-text text-transparent">
                Cách Thức Hoạt Động
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Quy trình đơn giản, nhanh chóng chỉ với 4 bước</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Đặt Lịch",
                desc: "Chọn dịch vụ và thời gian phù hợp",
                color: "from-blue-500 to-cyan-400",
              },
              {
                step: "2",
                title: "Xác Nhận",
                desc: "Nhận xác nhận và thông tin nhân viên",
                color: "from-green-500 to-emerald-400",
              },
              {
                step: "3",
                title: "Thực Hiện",
                desc: "Nhân viên đến và thực hiện dịch vụ",
                color: "from-yellow-500 to-orange-400",
              },
              {
                step: "4",
                title: "Hoàn Thành",
                desc: "Thanh toán và đánh giá dịch vụ",
                color: "from-purple-500 to-pink-400",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Khách Hàng Nói Gì?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Sẵn Sàng Có Ngôi Nhà Sạch Sẽ?</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Đặt lịch ngay hôm nay và trải nghiệm dịch vụ dọn vệ sinh chuyên nghiệp
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/booking">
                <Sparkles className="w-5 h-5 mr-2" />
                Đặt Lịch Ngay
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-blue-500 hover:bg-white hover:text-blue-800 text-lg px-10 py-6 rounded-full transition-all duration-300"
            >
              <Link href="/register">
                <Users className="w-5 h-5 mr-2" />
                Tham Gia Ngay
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
