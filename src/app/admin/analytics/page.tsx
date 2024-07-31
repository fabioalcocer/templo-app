'use client'
import { AreaChartComponent } from '@/components/area-chart'
import { BarsChartComponent } from '@/components/bar-chart'
import { LineChartComponent } from '@/components/line-chart'
import { LineChart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function SalesPage() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  if (!session) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold'>
        <LineChart width={36} height={36} />
        Analíticas
      </h2>

      <AreaChartComponent />
      <section className='mt-3 flex flex-wrap gap-5 md:gap-4'>
        <div className='w-full max-w-none md:max-w-sm'>
          <BarsChartComponent />
        </div>
        <div className='w-full max-w-none md:max-w-sm'>
          <LineChartComponent />
        </div>
      </section>
    </div>
  )
}

SalesPage.requireAuth = true
