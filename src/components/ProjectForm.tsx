import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { useCreateProject } from '../hooks/api'
import { projectSchema, type ProjectFormData } from '../lib/schemas'

interface ProjectFormProps {
  readonly onSuccess: () => void
}

export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const createProjectMutation = useCreateProject()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  })

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData = {
        name: data.name,
        description: data.description || null,
      }
      await createProjectMutation.mutateAsync(projectData)
      reset()
      onSuccess()
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter project name"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter project description (optional)"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      {createProjectMutation.error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
          Error: {createProjectMutation.error.message}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isSubmitting || createProjectMutation.isPending}
        >
          {isSubmitting || createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}