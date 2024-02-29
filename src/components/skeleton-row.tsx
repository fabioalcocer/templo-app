import { Skeleton } from './ui/skeleton'

function SkeletonRow() {
  return (
    <div className='flex flex-col items-center space-y-4'>
      <Skeleton className='h-20 w-full rounded-lg' />
      <div className='w-full space-y-2'>
        <Skeleton className='min-h-[70vh] w-full' />
      </div>
    </div>
  )
}

export default SkeletonRow
