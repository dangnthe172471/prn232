"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Award, Target, Shield, Clock, Star, Phone, Mail, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  const stats = [
    { number: "10,000+", label: "Khách hàng hài lòng", icon: Users, color: "text-blue-600" },
    { number: "500+", label: "Nhân viên chuyên nghiệp", icon: Users, color: "text-green-600" },
    { number: "50,000+", label: "Lượt đặt lịch thành công", icon: Target, color: "text-purple-600" },
    { number: "4.9/5", label: "Đánh giá trung bình", icon: Star, color: "text-yellow-600" },
  ]

  const values = [
    {
      icon: Heart,
      title: "Tận Tâm",
      description:
        "Chúng tôi làm việc với tình yêu và sự chăm sóc tận tình, coi ngôi nhà của bạn như chính ngôi nhà của chúng tôi.",
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      icon: Shield,
      title: "Tin Cậy",
      description: "Đội ngũ nhân viên được kiểm tra kỹ lưỡng, có bảo hiểm và cam kết bảo mật thông tin khách hàng.",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      icon: Award,
      title: "Chất Lượng",
      description: "Cam kết mang đến dịch vụ chất lượng cao nhất với quy trình làm việc chuyên nghiệp và hiện đại.",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      icon: Clock,
      title: "Đúng Hẹn",
      description: "Luôn đến đúng giờ hẹn và hoàn thành công việc trong thời gian cam kết với khách hàng.",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ]

  const team = [
    {
      name: "Nguyễn Danh Huấn",
      position: "CEO",
      avatar: "👨‍💼",
      description: "Lãnh đạo chiến lược, điều hành và phát triển toàn diện công ty."
    },
    {
      name: "Nguyễn Tiến Đăng",
      position: "CFO",
      avatar: "👨‍💼",
      description: "Quản lý ngân sách, tư vấn tài chính và định hướng đầu tư."
    },
    {
      name: "Nguyễn Tùng Lâm",
      position: "CTO",
      avatar: "👨‍💻",
      description: "Xây dựng chiến lược công nghệ và quản lý đội ngũ kỹ thuật."
    },
    {
      name: "Đỗ Thanh Kim Hiền",
      position: "COO",
      avatar: "👩‍💼",
      description: "Điều phối vận hành, giám sát quy trình và triển khai sản phẩm."
    },
    {
      name: "Trần Thảo Linh",
      position: "CMO",
      avatar: "👩‍🎨",
      description: "Xây dựng thương hiệu, quản lý truyền thông và chiến lược marketing."
    },
    {
      name: "Trương Vĩnh Hào",
      position: "CIO",
      avatar: "👨‍💻",
      description: "Phát triển hạ tầng CNTT và dẫn dắt chuyển đổi số."
    }
  ]

  const milestones = [
    {
      year: "2025",
      title: "Thành lập CareU",
      description: "Bắt đầu với đội ngũ 6 nhân viên tại Hòa Lạc",
    },
    {
      year: "2025",
      title: "Ra mắt ứng dụng mobile",
      description: "Đạt 10,000+ lượt tải xuống trong 6 tháng",
    },
    {
      year: "2026",
      title: "Mở rộng toàn quốc",
      description: "Có mặt tại 10 tỉnh thành lớn",
    },
    {
      year: "2027",
      title: "Đạt 10,000+ khách hàng",
      description: "Trở thành thương hiệu dọn vệ sinh hàng đầu Việt Nam",
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
            Câu chuyện của chúng tôi
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Về Chúng Tôi
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CareU</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Chúng tôi tin rằng mỗi ngôi nhà đều xứng đáng được chăm sóc tận tình. CareU ra đời với sứ mệnh mang đến dịch
            vụ dọn vệ sinh chuyên nghiệp, giúp bạn có thêm thời gian cho những điều quan trọng trong cuộc sống.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="pt-6">
                  <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sứ Mệnh Của Chúng Tôi
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                CareU được thành lập với mong muốn mang đến cho mọi gia đình Việt Nam một không gian sống sạch sẽ, thoải
                mái và hạnh phúc. Chúng tôi hiểu rằng thời gian là tài sản quý giá nhất, vì vậy chúng tôi muốn giúp bạn
                tiết kiệm thời gian để dành cho gia đình và những điều yêu thích.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Với đội ngũ nhân viên được đào tạo chuyên nghiệp và trang thiết bị hiện đại, chúng tôi cam kết mang đến
                dịch vụ dọn vệ sinh chất lượng cao nhất, an toàn và thân thiện với môi trường.
              </p>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <div className="text-8xl">🏠</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Giá Trị Cốt Lõi
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-16 h-16 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    <value.icon className={`w-8 h-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
                Hành Trình Phát Triển
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Từ những bước đầu khiêm tốn đến thương hiệu uy tín hàng đầu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{milestone.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-green-900 bg-clip-text text-transparent">
                Đội Ngũ Lãnh Đạo
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những con người tài năng và tận tâm đứng sau thành công của CareU
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="pt-6">
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Liên Hệ Với Chúng Tôi</h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Hotline</h3>
              <p className="opacity-90">1900 1234</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="opacity-90">support@careu.vn</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Địa chỉ</h3>
              <p className="opacity-90">Hòa Lạc</p>
            </div>
          </div>

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
              <Link href="/services">Xem Dịch Vụ</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
