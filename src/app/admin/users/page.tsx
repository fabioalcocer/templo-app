'use client'
import { File, ListFilter, PlusCircle, Users2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense, useEffect, useState } from 'react'
import Loading from './loading'
import { getAllProducts } from '@/api'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { UsersTable } from '@/components/users-table'
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'

type Checked = DropdownMenuCheckboxItemProps['checked']

export default function UsersPage() {
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true)
  const [showArchived, setShowArchived] = useState<Checked>(false)
  const [showPanel, setShowPanel] = useState<Checked>(false)
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    // const users = await getAllProducts()
    const users: User[] = [
      {
        id: '1',
        fullName: 'Juan Pérez',
        nit: 'LP123456',
        phone: '60012345',
        email: 'juan.perez@example.com',
        socialMedia: {
          facebook: 'juanperezfb',
          instagram: 'juanperezinsta',
          tiktok: 'juanpereztik',
        },
        discipline: 'Jiu-Jitsu',
        plan: 'Monthly',
        sessions: 12,
        price: 350,
        admissionDate: new Date('2024-01-15'),
      },
      {
        id: '2',
        fullName: 'María López',
        nit: 'SC654321',
        phone: '70123456',
        email: 'maria.lopez@example.com',
        socialMedia: {
          facebook: 'marialopezfb',
          instagram: 'marialopezinsta',
          tiktok: 'marialopeztik',
        },
        discipline: 'Muay Thai',
        plan: 'Annual',
        sessions: 36,
        price: 1000,
        admissionDate: new Date('2024-02-20'),
      },
    ]

    return setUsers(users)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

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
    <Suspense fallback={<Loading />}>
      <div className='flex h-full flex-col gap-4'>
        <h2 className='mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold'>
          <Users2 width={36} height={36} />
          Usuarios
        </h2>
        <main className='flex h-full flex-1 flex-col gap-4'>
          <Tabs defaultValue='all'>
            <div className='flex items-center'>
              <TabsList>
                <TabsTrigger value='all'>All</TabsTrigger>
                <TabsTrigger value='active'>Active</TabsTrigger>
                <TabsTrigger value='draft'>Draft</TabsTrigger>
                <TabsTrigger value='archived' className='hidden sm:flex'>
                  Archived
                </TabsTrigger>
              </TabsList>
              <div className='ml-auto flex items-center gap-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm' className='h-8 gap-1'>
                      <ListFilter className='h-3.5 w-3.5' />
                      <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-56'>
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={showStatusBar}
                      onCheckedChange={setShowStatusBar}
                    >
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={showPanel}
                      onCheckedChange={setShowPanel}
                    >
                      Drafts
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={showArchived}
                      onCheckedChange={setShowArchived}
                    >
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size='sm' variant='outline' className='h-8 gap-1'>
                  <File className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Export
                  </span>
                </Button>
                <Button size='sm' className='h-8 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Registrar usuario
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value='all'>
              <UsersTable users={users} />
            </TabsContent>
            <TabsContent value='active'>
              <h3>Active</h3>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </Suspense>
  )
}

UsersPage.requireAuth = true
