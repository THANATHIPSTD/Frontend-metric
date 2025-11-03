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

export interface UserReporter {
  id: string
  firstname: string
  lastname: string
  username: string
  email: string
  profileImage: string
  roles: string[]
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: UserReporter
}

export interface RegisterRequest {
  firstname: string
  lastname: string
  email: string
  password: string
  image?: string[]
}
export interface OrderItemResponse {
  game: Game
  priceAtPurchase: number
  platform: string
  quantity: number
  title: string
  mainImageUrl: string
}

export interface UserOrder {
  id: string
  user: UserReporter
  items: OrderItemResponse[]
  orderDate: string
  status: string
  totalAmount: number
}

export interface CartItemDTO {
  gameId: string
  platform: string
  quantity: number
}

export interface CartItemResponseDTO {
  gameId: string
  title: string
  mainImageUrl: string
  icongameUrl: string
  price: number
  promotionPrice?: number
  platform: string
  quantity: number
}

export interface CartDTO {
  id: string
  user: UserReporter
  items: CartItemResponseDTO[]
  totalPrice: number
}

export interface OrderItemResponse {
  game: Game
  priceAtPurchase: number
  platform: string
  quantity: number
  title: string
  mainImageUrl: string
}

export interface UserOrder {
  id: string
  user: UserReporter
  items: OrderItemResponse[]
  orderDate: string
  status: string
  totalAmount: number
}

export interface GameCard  {
  id: string
  title: string
  price: number
  promotionPrice?: number | null
  mainImageUrl: string
  iconGameUrl: string
  description?: string | null
}

export interface HomePageResponse {
  featuredGames: GameCard[]
  newReleaseGames: GameCard[]
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
  async fetchGameById(id: string): Promise<Game> {
    const response = await apiClient.get(`/games/${id}`)
    return response.data
  },
  async fetchHomePageData(): Promise<HomePageResponse> {
    const response = await apiClient.get('/homePage')
    return response.data
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v1/auth/authenticate', {
      username: username,
      password: password,
    })
    return response.data
  },
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v1/auth/register', data)
    return response.data
  },
  async logout(): Promise<void> {
    await apiClient.post('/api/v1/auth/logout')
  },
  async checkout(): Promise<UserOrder> {
    const response = await apiClient.post('/orders/checkout')
    return response.data
  },
  async getMyCart(): Promise<CartDTO> {
    const response = await apiClient.get('/cart/me')
    return response.data
  },

  async addToCart(itemData: CartItemDTO): Promise<CartDTO> {
    const response = await apiClient.post('/cart/add', itemData)
    return response.data
  },

  async removeItem(gameId: string, platform: string): Promise<CartDTO> {
    const response = await apiClient.delete('/cart/item', {
      params: { gameId, platform },
    })
    return response.data
  },
}

export default apiService
