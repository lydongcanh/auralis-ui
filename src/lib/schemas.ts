import { z } from 'zod'

// Form validation schemas using Zod
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name is too long'),
  description: z.string().nullable().optional(),
})

export const dataRoomSchema = z.object({
  name: z.string().min(1, 'Data room name is required').max(100, 'Name is too long'),
  source: z.enum(['original', 'ansarada']),
})

export const userSchema = z.object({
  auth_provider_user_id: z.string().min(1, 'Auth provider user ID is required'),
})

export const addUserToProjectSchema = z.object({
  user_role: z.enum(['admin', 'editor', 'viewer']),
})

export const ansaradaDataRoomSchema = z.object({
  access_token: z.string().min(1, 'Access token is required'),
  first: z.number().min(1).max(100).optional(),
})

// Infer types from schemas
export type ProjectFormData = z.infer<typeof projectSchema>
export type DataRoomFormData = z.infer<typeof dataRoomSchema>
export type UserFormData = z.infer<typeof userSchema>
export type AddUserToProjectFormData = z.infer<typeof addUserToProjectSchema>
export type AnsaradaDataRoomFormData = z.infer<typeof ansaradaDataRoomSchema>