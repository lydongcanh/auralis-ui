import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectsApi, dataRoomsApi, usersApi } from '../lib/api'
import type {
  ProjectIn,
  DataRoomIn,
  UserIn,
  AddUserToProjectBody
} from '../types/api'

// Query Keys
export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
    dataRooms: (id: string) => ['projects', id, 'dataRooms'] as const,
    users: (id: string) => ['projects', id, 'users'] as const,
  },
  dataRooms: {
    all: ['dataRooms'] as const,
    detail: (id: string) => ['dataRooms', id] as const,
    ansarada: (accessToken: string) => ['dataRooms', 'ansarada', accessToken] as const,
    documentTree: (id: string) => ['dataRooms', id, 'documentTree'] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
    projects: (id: string) => ['users', id, 'projects'] as const,
  },
}

// Project Hooks
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => projectsApi.getById(projectId),
    enabled: !!projectId,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (project: ProjectIn) => projectsApi.create(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

export const useLinkDataRoom = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, dataRoomId }: { projectId: string; dataRoomId: string }) =>
      projectsApi.linkDataRoom(projectId, dataRoomId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.dataRooms(projectId) })
    },
  })
}

export const useUnlinkDataRoom = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, dataRoomId }: { projectId: string; dataRoomId: string }) =>
      projectsApi.unlinkDataRoom(projectId, dataRoomId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.dataRooms(projectId) })
    },
  })
}

export const useAddUserToProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      projectId, 
      userId, 
      body 
    }: { 
      projectId: string
      userId: string
      body: AddUserToProjectBody 
    }) =>
      projectsApi.addUser(projectId, userId, body),
    onSuccess: (_, { projectId, userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.users(projectId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.projects(userId) })
    },
  })
}

export const useRemoveUserFromProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectsApi.removeUser(projectId, userId),
    onSuccess: (_, { projectId, userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.users(projectId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.projects(userId) })
    },
  })
}

export const useProjectDataRooms = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.projects.dataRooms(projectId),
    queryFn: () => projectsApi.getDataRooms(projectId),
    enabled: !!projectId,
  })
}

export const useProjectUsers = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.projects.users(projectId),
    queryFn: () => projectsApi.getUsers(projectId),
    enabled: !!projectId,
  })
}

// Data Room Hooks
export const useDataRoom = (dataRoomId: string) => {
  return useQuery({
    queryKey: queryKeys.dataRooms.detail(dataRoomId),
    queryFn: () => dataRoomsApi.getById(dataRoomId),
    enabled: !!dataRoomId,
  })
}

export const useCreateDataRoom = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (dataRoom: DataRoomIn) => dataRoomsApi.create(dataRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dataRooms.all })
    },
  })
}

export const useAnsaradaDataRooms = (accessToken: string, first?: number) => {
  return useQuery({
    queryKey: queryKeys.dataRooms.ansarada(accessToken),
    queryFn: () => dataRoomsApi.getAnsaradaDataRooms(accessToken, first),
    enabled: !!accessToken,
  })
}

export const useDocumentTree = (dataRoomId: string) => {
  return useQuery({
    queryKey: queryKeys.dataRooms.documentTree(dataRoomId),
    queryFn: () => dataRoomsApi.getDocumentTree(dataRoomId),
    enabled: !!dataRoomId,
  })
}

export const useCreateFolder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      dataRoomId, 
      name, 
      parentFolderId 
    }: { 
      dataRoomId: string
      name: string
      parentFolderId: string | null
    }) =>
      dataRoomsApi.createFolder(dataRoomId, name, parentFolderId),
    onSuccess: (_, { dataRoomId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dataRooms.documentTree(dataRoomId) })
    },
  })
}

export const useCreateDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      dataRoomId, 
      name, 
      content, 
      folderId 
    }: { 
      dataRoomId: string
      name: string
      content: string
      folderId: string
    }) =>
      dataRoomsApi.createDocument(dataRoomId, name, content, folderId),
    onSuccess: (_, { dataRoomId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dataRooms.documentTree(dataRoomId) })
    },
  })
}

// User Hooks
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => usersApi.getById(userId),
    enabled: !!userId,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (user: UserIn) => usersApi.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}

export const useUserAccessibleProjects = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.users.projects(userId),
    queryFn: () => usersApi.getAccessibleProjects(userId),
    enabled: !!userId,
  })
}