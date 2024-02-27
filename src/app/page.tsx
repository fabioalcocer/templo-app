import AddButton from '@/components/add-button'
import { ModeToggle } from '@/components/mode-toggle'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ModeToggle />
      <AddButton />
    </main>
  )
}