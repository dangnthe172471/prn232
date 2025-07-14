"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  Calendar,
  Clock,
  User,
  Eye,
  ArrowLeft,
  Share2,
  BookmarkPlus,
  ThumbsUp,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { newsApi, NewsArticleDetailDto } from "@/app/api/services/newsApi"
import { toast } from "sonner"

export default function NewsDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState<NewsArticleDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        setError("")

        const articleId = params.id as string
        const articleData = await newsApi.getArticleById(articleId)
        setArticle(articleData)

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải bài viết'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchArticle()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải bài viết...</h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
            <h1 className="text-3xl font-bold mb-4">Không tìm thấy bài viết</h1>
            <p className="text-gray-600 mb-8">
              {error || "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}
            </p>
            <Button asChild>
              <Link href="/news">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại tin tức
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getCategoryColor = (categorySlug: string) => {
    const colors = {
      tips: "bg-blue-100 text-blue-700",
      health: "bg-green-100 text-green-700",
      technology: "bg-purple-100 text-purple-700",
      company: "bg-orange-100 text-orange-700",
      promotion: "bg-red-100 text-red-700",
    }
    return colors[categorySlug as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

  const getCategoryName = (categorySlug: string) => {
    const names = {
      tips: "Mẹo vặt",
      health: "Sức khỏe",
      technology: "Công nghệ",
      company: "Tin công ty",
      promotion: "Khuyến mãi",
    }
    return names[categorySlug as keyof typeof names] || "Khác"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Link href="/news">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại tin tức
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <div className="relative">
              <img
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-64 md:h-80 object-cover rounded-t-lg"
              />
              {article.category && (
                <div className="absolute top-4 left-4">
                  <Badge className={`${getCategoryColor(article.category.slug)} border-0`}>
                    {getCategoryName(article.category.slug)}
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{article.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium">{article.author?.name || "CareU"}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{format(new Date(article.publishDate), "dd MMMM yyyy", { locale: vi })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{article.readTime || "5 phút đọc"}</span>
                </div>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator className="mb-6" />

              {/* Social Actions */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    0
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    0
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              {article.content && (
                <div className="text-base whitespace-pre-line text-gray-800">
                  {article.content}
                </div>
              )}

              {!article.content && article.excerpt && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">{article.excerpt}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Articles */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Bài Viết Liên Quan
                </span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {article.relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="hover:shadow-lg transition-all duration-300 border-0">
                    <div className="relative">
                      <img
                        src={relatedArticle.imageUrl || "/placeholder.svg"}
                        alt={relatedArticle.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      {relatedArticle.category && (
                        <div className="absolute top-2 left-2">
                          <Badge className={`${getCategoryColor(relatedArticle.category.slug)} border-0 text-xs`}>
                            {getCategoryName(relatedArticle.category.slug)}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        <Link href={`/news/${relatedArticle.id}`}>{relatedArticle.title}</Link>
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{relatedArticle.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{format(new Date(relatedArticle.publishDate), "dd/MM", { locale: vi })}</span>
                        <span>{relatedArticle.readTime || "5 phút đọc"}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cần Dịch Vụ Dọn Vệ Sinh?</h3>
              <p className="text-lg mb-6 opacity-90">Để CareU chăm sóc ngôi nhà của bạn với dịch vụ chuyên nghiệp</p>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/booking">Đặt Lịch Ngay</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
