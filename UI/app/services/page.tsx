"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, Users, CheckCircle, Star, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ServicesPage() {
  const services = [
    {
      id: "home-regular",
      title: "Dọn Nhà Định Kỳ",
      description: "Dịch vụ dọn dẹp nhà cửa định kỳ hàng tuần, hàng tháng với đội ngũ chuyên nghiệp",
      icon: "🏠",
      gradient: "from-blue-500 to-cyan-400",
      price: "300.000đ - 800.000đ",
      duration: "2-4 giờ",
      features: [
        "Lau dọn toàn bộ phòng khách, phòng ngủ",
        "Vệ sinh nhà bếp và thiết bị",
        "Dọn dẹp phòng tắm, toilet",
        "Hút bụi, lau sàn nhà",
        "Sắp xếp đồ đạc gọn gàng",
      ],
      popular: true,
    },
    {
      id: "office",
      title: "Dọn Văn Phòng",
      description: "Vệ sinh văn phòng chuyên nghiệp, tạo môi trường làm việc sạch sẽ và thoải mái",
      icon: "🏢",
      gradient: "from-purple-500 to-pink-400",
      price: "500.000đ - 1.200.000đ",
      duration: "3-5 giờ",
      features: [
        "Vệ sinh bàn làm việc, ghế ngồi",
        "Lau dọn thiết bị văn phòng",
        "Dọn dẹp phòng họp, khu vực chung",
        "Vệ sinh toilet, pantry",
        "Đổ rác và thay túi rác mới",
      ],
    },
    {
      id: "post-construction",
      title: "Dọn Sau Xây Dựng",
      description: "Dọn dẹp chuyên sâu sau khi sửa chữa, xây dựng hoặc cải tạo nhà cửa",
      icon: "🔨",
      gradient: "from-orange-500 to-red-400",
      price: "800.000đ - 2.000.000đ",
      duration: "4-8 giờ",
      features: [
        "Dọn dẹp bụi bẩn, mảnh vụn xây dựng",
        "Lau chùi tường, trần nhà",
        "Vệ sinh cửa sổ, cửa ra vào",
        "Làm sạch sàn nhà, gạch ốp",
        "Kiểm tra và dọn dẹp toàn diện",
      ],
    },
    {
      id: "year-end",
      title: "Dọn Cuối Năm",
      description: "Dọn dẹp tổng thể, chuẩn bị đón Tết Nguyên Đán một cách trọn vẹn",
      icon: "🎊",
      gradient: "from-green-500 to-emerald-400",
      price: "600.000đ - 1.500.000đ",
      duration: "4-6 giờ",
      features: [
        "Dọn dẹp tổng thể toàn bộ ngôi nhà",
        "Vệ sinh kỹ lưỡng mọi góc nhà",
        "Lau chùi đồ đạc, trang trí",
        "Sắp xếp lại không gian sống",
        "Chuẩn bị đón năm mới",
      ],
    },
  ]

  const whyChooseUs = [
    {
      icon: Users,
      title: "Đội Ngũ Chuyên Nghiệp",
      description: "Nhân viên được đào tạo bài bản, có kinh nghiệm lâu năm trong lĩnh vực dọn vệ sinh",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: CheckCircle,
      title: "Cam Kết Chất Lượng",
      description: "Đảm bảo chất lượng dịch vụ 100%, hoàn tiền nếu không hài lòng",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Clock,
      title: "Linh Hoạt Thời Gian",
      description: "Phục vụ 7 ngày trong tuần, có thể đặt lịch theo yêu cầu của khách hàng",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Star,
      title: "Đánh Giá Cao",
      description: "Được hàng nghìn khách hàng tin tưởng với đánh giá 4.9/5 sao",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  const process = [
    {
      step: "1",
      title: "Đặt Lịch Online",
      description: "Chọn dịch vụ và thời gian phù hợp trên website",
      color: "from-blue-500 to-cyan-400",
    },
    {
      step: "2",
      title: "Xác Nhận Thông Tin",
      description: "Nhân viên liên hệ xác nhận chi tiết và thời gian",
      color: "from-green-500 to-emerald-400",
    },
    {
      step: "3",
      title: "Thực Hiện Dịch Vụ",
      description: "Đội ngũ chuyên nghiệp đến và thực hiện công việc",
      color: "from-yellow-500 to-orange-400",
    },
    {
      step: "4",
      title: "Hoàn Thành & Thanh Toán",
      description: "Kiểm tra chất lượng, thanh toán và đánh giá dịch vụ",
      color: "from-purple-500 to-pink-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>

          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Dịch vụ đa dạng & chuyên nghiệp
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Dịch Vụ Của
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CareU</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Đa dạng dịch vụ dọn vệ sinh chuyên nghiệp, phù hợp với mọi nhu cầu của bạn
          </p>

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
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Các Dịch Vụ Của Chúng Tôi
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Lựa chọn dịch vụ phù hợp với nhu cầu của bạn</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group relative"
              >
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white">Phổ biến</Badge>
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${service.gradient}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base">{service.description}</CardDescription>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Giá từ:</span>
                      <div className="font-bold text-blue-600 text-lg">{service.price}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Thời gian:</span>
                      <div className="font-medium">{service.duration}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-900">Bao gồm:</h4>
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Link href="/booking">
                      Đặt Lịch Ngay
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
                Tại Sao Chọn CareU?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những lý do khiến hàng nghìn khách hàng tin tưởng lựa chọn chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card
                key={index}
                className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-green-900 bg-clip-text text-transparent">
                Quy Trình Làm Việc
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Quy trình đơn giản, minh bạch và chuyên nghiệp</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Sẵn Sàng Trải Nghiệm?</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Đặt lịch ngay hôm nay và để CareU chăm sóc ngôi nhà của bạn
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
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-10 py-6 rounded-full transition-all duration-300"
            >
              <Link href="/about">
                Tìm Hiểu Thêm
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
