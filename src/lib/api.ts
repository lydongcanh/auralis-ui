import axios, { type AxiosResponse } from 'axios'
import type { 
  Project, 
  ProjectIn, 
  DataRoom, 
  DataRoomIn, 
  User, 
  UserIn, 
  UserAccessibleProjectOut,
  AddUserToProjectBody
} from '../types/api'

const API_BASE_URL = 'http://127.0.0.1:8000'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.detail) {
      // Format validation errors
      const validationErrors = error.response.data.detail
      const errorMessage = validationErrors
        .map((err: { loc: Array<string | number>; msg: string }) => `${err.loc.join('.')}: ${err.msg}`)
        .join(', ')
      throw new Error(errorMessage)
    }
    throw error
  }
)

// Projects API
export const projectsApi = {
  create: async (project: ProjectIn): Promise<Project> => {
    const response: AxiosResponse<Project> = await apiClient.post('/projects', project)
    return response.data
  },

  getById: async (projectId: string): Promise<Project | null> => {
    const response: AxiosResponse<Project | null> = await apiClient.get(`/projects/${projectId}`)
    return response.data
  },

  linkDataRoom: async (projectId: string, dataRoomId: string): Promise<void> => {
    await apiClient.post(`/projects/${projectId}/data-rooms/${dataRoomId}`)
  },

  unlinkDataRoom: async (projectId: string, dataRoomId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/data-rooms/${dataRoomId}`)
  },

  addUser: async (projectId: string, userId: string, body: AddUserToProjectBody): Promise<void> => {
    await apiClient.post(`/projects/${projectId}/users/${userId}`, body)
  },

  removeUser: async (projectId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/users/${userId}`)
  },
}

// Data Rooms API
export const dataRoomsApi = {
  create: async (dataRoom: DataRoomIn): Promise<DataRoom> => {
    const response: AxiosResponse<DataRoom> = await apiClient.post('/data-rooms', dataRoom)
    return response.data
  },

  getById: async (dataRoomId: string): Promise<DataRoom | null> => {
    const response: AxiosResponse<DataRoom | null> = await apiClient.get(`/data-rooms/${dataRoomId}`)
    return response.data
  },

  getAnsaradaDataRooms: async (accessToken: string, first?: number): Promise<DataRoom[]> => {
    const params = new URLSearchParams({ access_token: accessToken })
    if (first) params.append('first', first.toString())
    
    const response: AxiosResponse<DataRoom[]> = await apiClient.get(
      `/ansarada/data-rooms?${params.toString()}`
    )
    return response.data
  },
}

// Users API
export const usersApi = {
  create: async (user: UserIn): Promise<User | null> => {
    const response: AxiosResponse<User | null> = await apiClient.post('/users', user)
    return response.data
  },

  getById: async (userId: string): Promise<User | null> => {
    const response: AxiosResponse<User | null> = await apiClient.get(`/users/${userId}`)
    return response.data
  },

  getAccessibleProjects: async (userId: string): Promise<UserAccessibleProjectOut[]> => {
    const response: AxiosResponse<UserAccessibleProjectOut[]> = await apiClient.get(
      `/users/${userId}/projects`
    )
    return response.data
  },
}

export { apiClient }