import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">CareU</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Dịch vụ dọn vệ sinh chuyên nghiệp, uy tín và chất lượng hàng đầu Việt Nam. Chúng tôi chăm sóc ngôi nhà của
              bạn như chính ngôi nhà của chúng tôi.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 cursor-pointer transition-colors">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 cursor-pointer transition-colors">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-300 cursor-pointer transition-colors">
                <Twitter className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Dịch Vụ</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/services" className="hover:text-white transition-colors hover:underline">
                  Dọn Nhà Định Kỳ
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors hover:underline">
                  Dọn Văn Phòng
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors hover:underline">
                  Dọn Sau Xây Dựng
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors hover:underline">
                  Dọn Cuối Năm
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Công Ty</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors hover:underline">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors hover:underline">
                  Tuyển Dụng
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors hover:underline">
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors hover:underline">
                  Chính Sách Bảo Mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Liên Hệ</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span>0962 900 476</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span>support@careu.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Thôn 1, Thạch Hòa, Thạch Thất, Hà Nội</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 CareU. Tất cả quyền được bảo lưu. Made with ❤️ in Vietnam</p>
        </div>
      </div>
    </footer>
  )
}
