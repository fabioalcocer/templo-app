import { PaymentsTable } from "@/components/payments-table"

export default function UsersPage() {
  return (
    <main className='flex h-full flex-1 flex-col gap-4'>
      <PaymentsTable />
    </main>
  )
}

UsersPage.requireAuth = true
