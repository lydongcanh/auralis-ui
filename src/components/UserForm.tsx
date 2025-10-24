import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useCreateUser } from '../hooks/api'
import { userSchema, type UserFormData } from '../lib/schemas'

interface UserFormProps {
  readonly onSuccess: () => void
}

export function UserForm({ onSuccess }: UserFormProps) {
  const createUserMutation = useCreateUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = async (data: UserFormData) => {
    try {
      await createUserMutation.mutateAsync(data)
      reset()
      onSuccess()
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="auth_provider_user_id">Auth Provider User ID</Label>
        <Input
          id="auth_provider_user_id"
          {...register('auth_provider_user_id')}
          placeholder="Enter auth provider user ID"
        />
        {errors.auth_provider_user_id && (
          <p className="text-sm text-red-500 mt-1">{errors.auth_provider_user_id.message}</p>
        )}
      </div>

      {createUserMutation.error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
          Error: {createUserMutation.error.message}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isSubmitting || createUserMutation.isPending}
        >
          {isSubmitting || createUserMutation.isPending ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  )
}