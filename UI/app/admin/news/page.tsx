"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    FileText,
    Calendar,
    User,
    Tag,
    Loader2,
    AlertCircle,
    TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { newsApi, NewsArticleDto, NewsArticleDetailDto, NewsCategoryDto, NewsTagDto, CreateNewsArticleDto, UpdateNewsArticleDto } from "@/app/api/services/newsApi"
import Header from "@/components/header"
import Link from "next/link"

export default function AdminNewsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")

    // Data states
    const [articles, setArticles] = useState<NewsArticleDto[]>([])
    const [categories, setCategories] = useState<NewsCategoryDto[]>([])
    const [tags, setTags] = useState<NewsTagDto[]>([])

    // Pagination and filters
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState<NewsArticleDetailDto | null>(null)
    const [selectedArticleForDelete, setSelectedArticleForDelete] = useState<NewsArticleDto | null>(null)

    // Form states
    const [formData, setFormData] = useState<CreateNewsArticleDto>({
        title: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        categoryId: undefined,
        tagIds: [],
        isPublished: true,
    })

    // Loading states
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError("")

                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/login')
                    return
                }

                await Promise.all([
                    fetchArticles(),
                    fetchCategories(),
                    fetchTags()
                ])

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra'
                setError(errorMessage)
                toast.error(errorMessage)

                if (errorMessage.includes('token không hợp lệ')) {
                    localStorage.removeItem('token')
                    router.push('/login')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router])

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

    const fetchTags = async () => {
        try {
            const tagsData = await newsApi.getTags()
            setTags(tagsData)
        } catch (err) {
            console.error('Error fetching tags:', err)
        }
    }

    const handleCreateArticle = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error("Bạn chưa đăng nhập.")
            router.push('/login')
            return
        }

        if (!formData.title || !formData.content) {
            toast.error("Vui lòng điền tiêu đề và nội dung bài viết.")
            return
        }

        setIsSubmitting(true)
        try {
            const createData: CreateNewsArticleDto = {
                title: formData.title,
                excerpt: formData.excerpt || undefined,
                content: formData.content,
                imageUrl: formData.imageUrl || undefined,
                categoryId: formData.categoryId,
                tagIds: formData.tagIds,
                isPublished: formData.isPublished,
            }

            await newsApi.createArticle(token, createData)
            toast.success("Tạo bài viết thành công!")
            setIsCreateModalOpen(false)
            resetForm()
            fetchArticles()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo bài viết'
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateArticle = async () => {
        if (!selectedArticle) return

        const token = localStorage.getItem('token')
        if (!token) {
            toast.error("Bạn chưa đăng nhập.")
            router.push('/login')
            return
        }

        if (!formData.title || !formData.content) {
            toast.error("Vui lòng điền tiêu đề và nội dung bài viết.")
            return
        }

        setIsSubmitting(true)
        try {
            const updateData: UpdateNewsArticleDto = {
                title: formData.title,
                excerpt: formData.excerpt || undefined,
                content: formData.content,
                imageUrl: formData.imageUrl || undefined,
                categoryId: formData.categoryId,
                tagIds: formData.tagIds,
                isPublished: formData.isPublished,
            }

            await newsApi.updateArticle(token, selectedArticle.id, updateData)
            toast.success("Cập nhật bài viết thành công!")
            setIsEditModalOpen(false)
            resetForm()
            fetchArticles()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật bài viết'
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteArticle = async () => {
        if (!selectedArticleForDelete) return

        const token = localStorage.getItem('token')
        if (!token) {
            toast.error("Bạn chưa đăng nhập.")
            router.push('/login')
            return
        }

        setIsDeleting(true)
        try {
            await newsApi.deleteArticle(token, selectedArticleForDelete.id)
            toast.success("Xóa bài viết thành công!")
            setIsDeleteModalOpen(false)
            setSelectedArticleForDelete(null)
            fetchArticles()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa bài viết'
            toast.error(errorMessage)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleViewArticle = async (article: NewsArticleDto) => {
        try {
            const articleDetail = await newsApi.getArticleById(article.slug)
            setSelectedArticle(articleDetail)
            setIsViewModalOpen(true)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải chi tiết bài viết'
            toast.error(errorMessage)
        }
    }

    const handleEditArticle = async (article: NewsArticleDto) => {
        try {
            const articleDetail = await newsApi.getArticleById(article.slug)
            setSelectedArticle(articleDetail)
            setFormData({
                title: articleDetail.title,
                excerpt: articleDetail.excerpt || "",
                content: articleDetail.content || "",
                imageUrl: articleDetail.imageUrl || "",
                categoryId: articleDetail.category?.id,
                tagIds: articleDetail.tags.map(tag => tag.id),
                isPublished: true,
            })
            setIsEditModalOpen(true)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin bài viết'
            toast.error(errorMessage)
        }
    }

    const resetForm = () => {
        setFormData({
            title: "",
            excerpt: "",
            content: "",
            imageUrl: "",
            categoryId: undefined,
            tagIds: [],
            isPublished: true,
        })
        setSelectedArticle(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Đang tải trang quản lý tin tức...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải trang</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Thử lại
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Tin tức</h1>
                                <p className="text-gray-600">Quản lý bài viết và tin tức của hệ thống</p>
                            </div>
                            <Button asChild>
                                <Link href="/admin/dashboard">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Tìm kiếm bài viết..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64"
                            />
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Lọc theo danh mục" />
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
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tạo bài viết mới
                        </Button>
                    </div>

                    {/* Articles Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách bài viết</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Tiêu đề</TableHead>
                                        <TableHead>Danh mục</TableHead>
                                        <TableHead>Tác giả</TableHead>
                                        <TableHead>Ngày xuất bản</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {articles && articles.length > 0 ? articles.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell>#{article.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{article.title}</p>
                                                    {article.excerpt && (
                                                        <p className="text-sm text-gray-500 truncate max-w-xs">
                                                            {article.excerpt}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {article.category ? (
                                                    <Badge variant="outline">{article.category.name}</Badge>
                                                ) : (
                                                    <span className="text-gray-500">Không có</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {article.author ? (
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        <span>{article.author.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">Không có</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{new Date(article.publishDate).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewArticle(article)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditArticle(article)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedArticleForDelete(article)
                                                            setIsDeleteModalOpen(true)
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                Chưa có bài viết nào
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Create Article Modal */}
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Tạo bài viết mới</DialogTitle>
                                <DialogDescription>
                                    Điền thông tin để tạo bài viết mới.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Tiêu đề *</label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Nhập tiêu đề bài viết"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Tóm tắt</label>
                                    <Textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        placeholder="Nhập tóm tắt bài viết"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Nội dung *</label>
                                    <Textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Nhập nội dung bài viết"
                                        rows={10}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">URL hình ảnh</label>
                                    <Input
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="Nhập URL hình ảnh"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Danh mục</label>
                                    <Select
                                        value={formData.categoryId?.toString() || ""}
                                        onValueChange={(value) => setFormData({ ...formData, categoryId: value ? parseInt(value) : undefined })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <label key={tag.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.tagIds.includes(tag.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, tagIds: [...formData.tagIds, tag.id] })
                                                        } else {
                                                            setFormData({ ...formData, tagIds: formData.tagIds.filter(id => id !== tag.id) })
                                                        }
                                                    }}
                                                />
                                                <span>{tag.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Hủy</Button>
                                <Button onClick={handleCreateArticle} disabled={isSubmitting || !formData.title || !formData.content}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Tạo bài viết
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Article Modal */}
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                                <DialogDescription>
                                    Cập nhật thông tin bài viết.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Tiêu đề *</label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Nhập tiêu đề bài viết"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Tóm tắt</label>
                                    <Textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        placeholder="Nhập tóm tắt bài viết"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Nội dung *</label>
                                    <Textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Nhập nội dung bài viết"
                                        rows={10}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">URL hình ảnh</label>
                                    <Input
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="Nhập URL hình ảnh"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Danh mục</label>
                                    <Select
                                        value={formData.categoryId?.toString() || ""}
                                        onValueChange={(value) => setFormData({ ...formData, categoryId: value ? parseInt(value) : undefined })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <label key={tag.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.tagIds.includes(tag.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, tagIds: [...formData.tagIds, tag.id] })
                                                        } else {
                                                            setFormData({ ...formData, tagIds: formData.tagIds.filter(id => id !== tag.id) })
                                                        }
                                                    }}
                                                />
                                                <span>{tag.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
                                <Button onClick={handleUpdateArticle} disabled={isSubmitting || !formData.title || !formData.content}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Cập nhật
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* View Article Modal */}
                    <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{selectedArticle?.title}</DialogTitle>
                                <DialogDescription>
                                    Chi tiết bài viết #{selectedArticle?.id}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                {selectedArticle?.imageUrl && (
                                    <div>
                                        <img
                                            src={selectedArticle.imageUrl}
                                            alt={selectedArticle.title}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                {selectedArticle?.excerpt && (
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-600">Tóm tắt</h4>
                                        <p className="text-sm">{selectedArticle.excerpt}</p>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-600">Nội dung</h4>
                                    <div className="text-sm whitespace-pre-line">{selectedArticle?.content}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-600">Danh mục</h4>
                                        <p className="text-sm">{selectedArticle?.category?.name || 'Không có'}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-600">Tác giả</h4>
                                        <p className="text-sm">{selectedArticle?.author?.name || 'Không có'}</p>
                                    </div>
                                </div>
                                {selectedArticle?.tags && selectedArticle.tags.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-600">Tags</h4>
                                        <div className="flex gap-2 flex-wrap">
                                            {selectedArticle.tags.map((tag) => (
                                                <Badge key={tag.id} variant="outline">
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-600">Ngày xuất bản</h4>
                                    <p className="text-sm">{selectedArticle?.publishDate ? new Date(selectedArticle.publishDate).toLocaleString('vi-VN') : 'Chưa xuất bản'}</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Đóng</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Modal */}
                    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Xác nhận xóa</DialogTitle>
                                <DialogDescription>
                                    Bạn có chắc chắn muốn xóa bài viết &quot;{selectedArticleForDelete?.title}&quot;? Hành động này không thể hoàn tác.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Hủy</Button>
                                <Button variant="destructive" onClick={handleDeleteArticle} disabled={isDeleting}>
                                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Xóa
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    )
} 