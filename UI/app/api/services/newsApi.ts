const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface NewsArticleDto {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    imageUrl?: string;
    publishDate: string;
    readTime?: string;
    category?: NewsCategoryDto;
    author?: AuthorDto;
    isActive?: boolean;
}

export interface NewsArticleDetailDto extends NewsArticleDto {
    content?: string;
    tags: NewsTagDto[];
    relatedArticles: NewsArticleDto[];
}

export interface NewsCategoryDto {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface NewsTagDto {
    id: number;
    name: string;
    slug: string;
}

export interface AuthorDto {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

export interface CreateNewsArticleDto {
    title: string;
    excerpt?: string;
    content: string;
    imageUrl?: string;
    categoryId?: number;
    tagIds: number[];
    isPublished?: boolean;
}

export interface UpdateNewsArticleDto {
    title?: string;
    excerpt?: string;
    content?: string;
    imageUrl?: string;
    categoryId?: number;
    tagIds?: number[];
    isPublished?: boolean;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export const newsApi = {
    // Public APIs
    getArticles: async (page: number = 1, pageSize: number = 10, category?: string, tag?: string): Promise<PagedResult<NewsArticleDto>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });
        if (category) params.append('category', category);
        if (tag) params.append('tag', tag);

        const response = await fetch(`${API_BASE_URL}/api/news?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi lấy danh sách bài viết.');
        }

        return response.json();
    },

    getFeaturedArticles: async (): Promise<NewsArticleDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/news/featured`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi lấy bài viết nổi bật.');
        }

        return response.json();
    },

    getCategories: async (): Promise<NewsCategoryDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/news/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi lấy danh mục.');
        }

        return response.json();
    },

    getTags: async (): Promise<NewsTagDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/news/tags`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi lấy tags.');
        }

        return response.json();
    },

    getArticleById: async (idOrSlug: string): Promise<NewsArticleDetailDto> => {
        const response = await fetch(`${API_BASE_URL}/api/news/${idOrSlug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Không tìm thấy bài viết.');
            }
            throw new Error('Có lỗi xảy ra khi lấy chi tiết bài viết.');
        }

        return response.json();
    },

    // Admin APIs
    createArticle: async (token: string, data: CreateNewsArticleDto): Promise<NewsArticleDetailDto> => {
        const response = await fetch(`${API_BASE_URL}/api/news`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Bạn chưa đăng nhập hoặc token không hợp lệ.');
            }
            throw new Error('Có lỗi xảy ra khi tạo bài viết.');
        }

        return response.json();
    },

    updateArticle: async (token: string, id: number, data: UpdateNewsArticleDto): Promise<NewsArticleDetailDto> => {
        const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Bạn chưa đăng nhập hoặc token không hợp lệ.');
            }
            if (response.status === 404) {
                throw new Error('Không tìm thấy bài viết.');
            }
            throw new Error('Có lỗi xảy ra khi cập nhật bài viết.');
        }

        return response.json();
    },

    deleteArticle: async (token: string, id: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Bạn chưa đăng nhập hoặc token không hợp lệ.');
            }
            if (response.status === 404) {
                throw new Error('Không tìm thấy bài viết.');
            }
            throw new Error('Có lỗi xảy ra khi xóa bài viết.');
        }
    },
}; 