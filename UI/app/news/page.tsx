"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Calendar, Clock, User, Search, Filter, ArrowRight, Sparkles, Eye, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { newsApi, NewsArticleDto, NewsCategoryDto } from "@/app/api/services/newsApi"
import { toast } from "sonner"

export default function NewsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [articles, setArticles] = useState<NewsArticleDto[]>([])
  const [categories, setCategories] = useState<NewsCategoryDto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        await Promise.all([
          fetchArticles(),
          fetchCategories()
        ])

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [currentPage, searchTerm, categoryFilter])

  const fetchArticles = async () => {
    try {
      const result = await newsApi.getArticles(
        currentPage,
        pageSize,
        categoryFilter === 'all' ? undefined : categoryFilter
      )
      setArticles(result.items)
      setTotalCount(result.totalCount)
    } catch (err) {
      console.error('Error fetching articles:', err)
    }
  }

  const fetchCategories = async () => {
    try {
      const categoriesData = await newsApi.getCategories()
      setCategories(categoriesData)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const featuredArticles = filteredArticles.filter((article) => article.isActive)
  const regularArticles = filteredArticles.filter((article) => !article.isActive)

  const getCategoryInfo = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (!category) return { name: "Khác", color: "bg-gray-100 text-gray-700" }

    const colorMap: { [key: string]: string } = {
      "tips": "bg-blue-100 text-blue-700",
      "health": "bg-green-100 text-green-700",
      "technology": "bg-purple-100 text-purple-700",
      "company": "bg-orange-100 text-orange-700",
      "promotion": "bg-red-100 text-red-700"
    }

    return {
      name: category.name,
      color: colorMap[category.slug] || "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải tin tức...</h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải tin tức</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

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
            Tin tức & Mẹo hay
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Tin Tức
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CareU</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Cập nhật những tin tức mới nhất, mẹo vặt hữu ích và kiến thức chăm sóc nhà cửa
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-blue-500"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 border-gray-300 focus:border-blue-500">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge
              variant={categoryFilter === "all" ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${categoryFilter === "all"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "hover:bg-gray-100"
                }`}
              onClick={() => setCategoryFilter("all")}
            >
              Tất cả
            </Badge>
            {categories.map((category) => {
              const categoryInfo = getCategoryInfo(category.id)
              return (
                <Badge
                  key={category.id}
                  variant={categoryFilter === category.slug ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${categoryFilter === category.slug
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "hover:bg-gray-100"
                    }`}
                  onClick={() => setCategoryFilter(category.slug)}
                >
                  {category.name}
                </Badge>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bài Viết Nổi Bật
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.slice(0, 2).map((article) => {
                const categoryInfo = article.category ? getCategoryInfo(article.category.id) : { name: "Khác", color: "bg-gray-100 text-gray-700" }
                return (
                  <Card
                    key={article.id}
                    className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={article.imageUrl || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${categoryInfo.color} border-0`}>{categoryInfo.name}</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-white border-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Nổi bật
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">{article.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {article.author?.name || "CareU"}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(new Date(article.publishDate), "dd/MM/yyyy", { locale: vi })}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.readTime || "5 phút đọc"}
                          </div>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Link href={`/news/${article.id}`}>
                          Đọc tiếp
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles */}
      <section className="pb-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Tất Cả Bài Viết
            </span>
          </h2>

          {filteredArticles.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy bài viết</h3>
                <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => {
                const categoryInfo = article.category ? getCategoryInfo(article.category.id) : { name: "Khác", color: "bg-gray-100 text-gray-700" }
                return (
                  <Card
                    key={article.id}
                    className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={article.imageUrl || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={`${categoryInfo.color} border-0 text-xs`}>{categoryInfo.name}</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {article.author?.name || "CareU"}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(article.publishDate), "dd/MM", { locale: vi })}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime || "5 phút đọc"}
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Link href={`/news/${article.id}`}>
                          Đọc tiếp
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Đăng Ký Nhận Tin Tức</h2>
          <p className="text-xl mb-8 opacity-90">Nhận những bài viết mới nhất và mẹo vặt hữu ích từ CareU</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Nhập email của bạn"
              className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8">Đăng Ký</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
