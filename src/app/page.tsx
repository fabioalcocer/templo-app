import AddButton from '@/components/add-button'
import { DataTableDemo } from '@/components/data-table'
import { TableDemo } from '@/components/demo-table'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-16'>
      <h1 className='text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl'>
        Templo App <br className='hidden sm:inline' />
        built with Radix UI and Tailwind CSS.
      </h1>
      <ModeToggle />
      <AddButton />

      <DataTableDemo />
      <TableDemo />
    </main>
  )
}
