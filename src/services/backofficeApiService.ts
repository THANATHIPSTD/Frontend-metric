import apiClient from './AxiosClient'
import {
  type Category,
  type UserReporter,
  type UserOrder,
  type PaginatedGamesResponse,
  type Game,
  type GameCard,
} from './apiService'

export interface CategoryPayload {
  name: string
  categoryImage?: string
}
export interface GamePayload {
  title: string
  price: number
  promotionPrice?: number | null
  description: string
  mainImageUrl: string
  icongameUrl: string
  trailerUrl: string
  categoryIds: string[]
}

async function fetchAllCategories(): Promise<Category[]> {
  const response = await apiClient.get('/categories')
  return response.data
}

async function createCategory(payload: CategoryPayload): Promise<Category> {
  const response = await apiClient.post('/categories', payload)
  return response.data
}

async function updateCategory(id: string, payload: CategoryPayload): Promise<Category> {
  const response = await apiClient.put(`/categories/${id}`, payload)
  return response.data
}

async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`)
}

async function fetchAllUsers(): Promise<UserReporter[]> {
  const response = await apiClient.get('/users')
  return response.data
}

async function updateUserRoles(id: string, roles: string[]): Promise<UserReporter> {
  const response = await apiClient.put(`/users/${id}/roles`, roles)
  return response.data
}

async function fetchAllOrdersForAdmin(): Promise<UserOrder[]> {
  const response = await apiClient.get('/orders/all')
  return response.data
}

async function fetchAdminGames(
  page: number = 1,
  limit: number = 16,
  title: string = '',
): Promise<PaginatedGamesResponse> {
  const params: { _page: number; _limit: number; title?: string } = { _page: page, _limit: limit }
  if (title.trim() !== '') {
    params.title = title.trim()
  }
  const response = await apiClient.get('/games', { params })
  const totalCount = parseInt(response.headers['x-total-count'] || '0', 10)
  return {
    total: totalCount,
    data: response.data,
  }
}
async function setGamePosition(
  id: string,
  type: 'feature' | 'new-release',
  position: number | null,
): Promise<void> {
  const endpoint = `/games/${id}/${type}`
  if (position === null) {
    await apiClient.delete(endpoint)
  } else {
    await apiClient.put(endpoint, { position: position })
  }
}
async function fetchGameById(id: string): Promise<Game> {
  const response = await apiClient.get(`/games/${id}`)
  return response.data
}

async function createGame(payload: GamePayload): Promise<Game> {
  const response = await apiClient.post('/games', payload)
  return response.data
}

async function updateGame(id: string, payload: GamePayload): Promise<Game> {
  const response = await apiClient.put(`/games/${id}`, payload)
  return response.data
}

async function deleteGame(id: string): Promise<void> {
  await apiClient.delete(`/games/${id}`)
}

async function fetchAllGamesUnpaginated(): Promise<Game[]> {
  const response = await apiClient.get('/games', { params: { _page: 1, _limit: 1000 } })
  return response.data
}

async function fetchFeaturedGamesForManagement(): Promise<GameCard[]> {
  const response = await apiClient.get('/homePage')
  return response.data.featuredGames
}

async function fetchNewReleaseGamesForManagement(): Promise<GameCard[]> {
  const response = await apiClient.get('/homePage')
  return response.data.newReleaseGames
}

export default {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchAllUsers,
  updateUserRoles,
  fetchAllOrdersForAdmin,
  fetchAdminGames,
  setGamePosition,
  fetchGameById,
  createGame,
  updateGame,
  deleteGame,
  fetchAllGamesUnpaginated,
  fetchFeaturedGamesForManagement,
  fetchNewReleaseGamesForManagement,
}
