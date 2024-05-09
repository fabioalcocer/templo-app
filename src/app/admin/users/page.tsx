'use client'
import { File, ListFilter } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'

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
import { getAllUsers } from '@/api'

type Checked = DropdownMenuCheckboxItemProps['checked']

export default function UsersPage() {
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true)
  const [showArchived, setShowArchived] = useState<Checked>(false)
  const [showPanel, setShowPanel] = useState<Checked>(false)
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    const users = await getAllUsers()
    return setUsers(users)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
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
                <Button variant='outline' size='sm' className='h-8 gap-1 py-4'>
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
            <Button size='sm' variant='outline' className='h-8 gap-1 py-4'>
              <File className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Export
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value='all'>
          <UsersTable users={users} />
        </TabsContent>
        <TabsContent value='active'>
          <UsersTable users={(users || []).filter((user) => user.active)} />
        </TabsContent>
        <TabsContent value='draft'>
          <UsersTable users={(users || []).filter((user) => !user.active)} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

UsersPage.requireAuth = true
