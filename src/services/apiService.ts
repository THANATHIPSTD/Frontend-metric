import apiClient from './AxiosClient'

export interface Game {
  id: string
  title: string
  price: number
  promotionPrice?: number
  description: string
  mainImageUrl: string
  icongameUrl: string
  trailerUrl: string
  categoryIds: string[]
}

export interface Category {
  id: string
  name: string
  categoryImage: string
}

export interface PaginatedGamesResponse {
  total: number
  data: Game[]
}

const apiService = {
  async fetchGames(
    page: number = 1,
    limit: number = 16,
    categoryId?: string,
    title?: string,
    priceFilter?: string,
  ): Promise<PaginatedGamesResponse> {
    const params: {
      _page: number
      _limit: number
      categoryId?: string
      title?: string
      priceFilter?: string
    } = {
      _page: page,
      _limit: limit,
    }

    if (categoryId) {
      params.categoryId = categoryId
    }
    if (title && title.trim() !== '') {
      params.title = title
    }
    if (priceFilter && priceFilter.trim() !== '') {
      params.priceFilter = priceFilter
    }

    const response = await apiClient.get('/games', { params })

    const totalCount = parseInt(response.headers['x-total-count'] || '0', 10)

    return {
      total: totalCount,
      data: response.data,
    }
  },

  async fetchCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories')
    return response.data
  },
}

export default apiService
