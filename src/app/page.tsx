import AddButton from '@/components/add-button'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Templo App</h1>
      <ModeToggle />
      <AddButton />
    </main>
  )
}
