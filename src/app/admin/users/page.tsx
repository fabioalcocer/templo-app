'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { File, ListFilter } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UsersTable } from '@/components/users-table'
import { desactiveUsers, getAllUsersBySnapshot } from '@/services'
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { isBefore } from 'date-fns'
import { Timestamp } from 'firebase/firestore'

type Checked = DropdownMenuCheckboxItemProps['checked']

export default function UsersPage() {
	const [showStatusBar, setShowStatusBar] = useState<Checked>(true)
	const [showArchived, setShowArchived] = useState<Checked>(false)
	const [showPanel, setShowPanel] = useState<Checked>(false)
	const [users, setUsers] = useState<User[]>([])

	const checkInactiveUsersAndUpdate = async (users: User[]) => {
		const today = new Date()

		const activeUsersWithOverdueDate = users.filter(
			(user) => user?.discipline === 'calistenia' && user?.active,
		)

		const inactiveUsers = activeUsersWithOverdueDate.filter((user) => {
			const finalDate = user?.finalDate as Date
			const parsedDate = (finalDate as unknown as Timestamp)?.toDate()

			return user?.finalDate && isBefore(parsedDate, today)
		})

		if (inactiveUsers.length > 0) {
			await desactiveUsers(inactiveUsers)
		}
	}

	useEffect(() => {
		if (!users.length) return
		checkInactiveUsersAndUpdate(users)
	}, [users])

	useEffect(() => {
		getAllUsersBySnapshot(setUsers)
	}, [])

	return (
		<main className="flex h-full flex-1 flex-col gap-4">
			<Tabs defaultValue="all">
				<div className="flex items-center">
					<TabsList>
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="active">Active</TabsTrigger>
						<TabsTrigger value="inactive">Inactive</TabsTrigger>
						<TabsTrigger value="archived" className="hidden sm:flex">
							Archived
						</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="all">
					<UsersTable users={users} />
				</TabsContent>
				<TabsContent value="active">
					<UsersTable users={(users || []).filter((user) => user.active)} />
				</TabsContent>
				<TabsContent value="inactive">
					<UsersTable users={(users || []).filter((user) => !user.active)} />
				</TabsContent>
			</Tabs>
		</main>
	)
}
