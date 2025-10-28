// API Types based on OpenAPI specification

export type EntityStatus = 'active' | 'disabled' | 'deleted'
export type DataRoomSource = 'original' | 'ansarada'
export type UserRole = 'admin' | 'editor' | 'viewer'

export interface Project {
  id: string
  created_at: string
  updated_at: string
  status: EntityStatus
  name: string
  description: string | null
  data_room_ids: string[]
  accessible_user_project_ids: string[]
}

export interface ProjectIn {
  name: string
  description: string | null
}

export interface DataRoom {
  id: string
  created_at: string
  updated_at: string
  status: EntityStatus
  name: string
  source: DataRoomSource
  root_folder_id: string
}

export interface DataRoomIn {
  name: string
  source: DataRoomSource
}

export interface User {
  id: string
  created_at: string
  updated_at: string
  status: EntityStatus
  auth_provider_user_id: string
  accessible_user_project_ids: string[]
}

export interface UserIn {
  auth_provider_user_id: string
}

export interface UserAccessibleProjectOut {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  status: EntityStatus
  role: UserRole
}

export interface ProjectUserOut {
  user_id: string
  user_auth_provider_user_id: string
  user_role: UserRole
  user_status: EntityStatus
}

export interface AddUserToProjectBody {
  user_role: UserRole
}

// Document Tree Types
export interface Folder {
  id: string
  name: string
  data_room_id: string
  parent_folder_id: string | null
  created_at: string
  updated_at: string
}

export interface FolderIn {
  name: string
  data_room_id: string
  parent_folder_id: string | null
}

export interface Document {
  id: string
  name: string
  content: string
  data_room_id: string
  folder_id: string
  created_at: string
  updated_at: string
}

export interface DocumentIn {
  name: string
  content: string
  data_room_id: string
  folder_id: string
}

export interface DocumentTree {
  data_room_id: string
  folders: Folder[]
  documents: Document[]
}

export interface HTTPValidationError {
  detail: Array<{
    loc: Array<string | number>
    msg: string
    type: string
  }>
}

// API Response types
export type ApiResponse<T> = T
export type ApiError = HTTPValidationError