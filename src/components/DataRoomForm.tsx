import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useCreateDataRoom } from '../hooks/api'
import { dataRoomSchema, type DataRoomFormData } from '../lib/schemas'

interface DataRoomFormProps {
  readonly onSuccess: () => void
}

export function DataRoomForm({ onSuccess }: DataRoomFormProps) {
  const createDataRoomMutation = useCreateDataRoom()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<DataRoomFormData>({
    resolver: zodResolver(dataRoomSchema),
  })

  const source = watch('source')

  const onSubmit = async (data: DataRoomFormData) => {
    try {
      await createDataRoomMutation.mutateAsync(data)
      reset()
      onSuccess()
    } catch (error) {
      console.error('Error creating data room:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Data Room Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter data room name"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="source">Source</Label>
        <Select value={source} onValueChange={(value) => setValue('source', value as 'original' | 'ansarada')}>
          <SelectTrigger>
            <SelectValue placeholder="Select data room source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="original">Original</SelectItem>
            <SelectItem value="ansarada">Ansarada</SelectItem>
          </SelectContent>
        </Select>
        {errors.source && (
          <p className="text-sm text-red-500 mt-1">{errors.source.message}</p>
        )}
      </div>

      {createDataRoomMutation.error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
          Error: {createDataRoomMutation.error.message}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isSubmitting || createDataRoomMutation.isPending}
        >
          {isSubmitting || createDataRoomMutation.isPending ? 'Creating...' : 'Create Data Room'}
        </Button>
      </div>
    </form>
  )
}