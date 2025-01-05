import { getObjBySlug } from '@/lib/utils'
import {
	decreaseSessionUserById,
	desactiveUser,
	getSessionLogsOnSnapshot,
	getUserById,
} from '@/services'
import { User } from '@/types/users.types'
import { differenceInCalendarDays, format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { Timestamp } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import {
	SheetClose,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from './ui/sheet'
import { Skeleton } from './ui/skeleton'

type Props = {
	userId: string
	setIsReinscription: Dispatch<SetStateAction<boolean>>
}

function ManageUserSessions({ userId, setIsReinscription }: Props) {
	const [sessionLogs, setSessionLogs] = useState<SessionLog[] | null>(null)
	const [userData, setUserData] = useState<User>()
	const [decreaseLoading, setDecreaseLoading] = useState(false)
	const [loading, setLoading] = useState(false)

	const dateEntry = userData?.dateEntry as Date
	const parsedDate = (dateEntry as unknown as Timestamp)?.toDate()
	const finalDate = userData?.finalDate as Date
	const finalParsedDate = (finalDate as unknown as Timestamp)?.toDate()
	const remaingDays = differenceInCalendarDays(finalParsedDate, Date.now()) ?? 0

	const decreaseSessions = async () => {
		if (userData?.sessions && userData?.sessions > 0) {
			setDecreaseLoading(true)
			setUserData({
				...userData,
				sessions: userData?.sessions - 1,
			})

			await decreaseSessionUserById(userId)
		}

		return setDecreaseLoading(false)
	}

	useEffect(() => {
		if (!userId) return
		const fetchUserById = async () => {
			try {
				setLoading(true)
				const user = await getUserById(userId)
				setUserData(user as User)
			} catch (err) {
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchUserById()
		getSessionLogsOnSnapshot(userId, setSessionLogs)
	}, [userId])

	useEffect(() => {
		if (isCalisteniaUser) return

		const checkInactiveUsersAndUpdate = async () => {
			if (userData?.active && userData?.sessions <= 0) {
				await desactiveUser(userData?.id as string)
				return console.log('Se desactivó el usuario')
			}
		}

		checkInactiveUsersAndUpdate()
	}, [userData])

	const sortedSessionLogs = sessionLogs?.sort(
		(a, b) => (b.createdAt as never) - (a.createdAt as never),
	)

	const isCalisteniaUser = userData?.discipline === 'gym'

	return (
		<div>
			<SheetHeader>
				<SheetTitle className="text-xl">Gestionar usuario</SheetTitle>
				<SheetDescription>
					Gestiona las sesiones y fechas de entrada del usuario.
				</SheetDescription>
			</SheetHeader>

			{loading ? (
				<div className="mt-10 flex items-start justify-between gap-6">
					<div className="flex flex-col items-start justify-start gap-6">
						<Skeleton className="h-[152px] w-48 rounded-lg" />
						<Skeleton className="h-12 w-48 rounded-lg" />
					</div>
					<div className="w-full">
						<Skeleton className="h-56 w-full" />
					</div>
				</div>
			) : (
				<div className="my-5 mt-10 grid grid-cols-[auto_1fr] gap-4 items-center justify-between px-5">
					{isCalisteniaUser ? (
						<div className="flex flex-col items-center justify-center gap-5 p-7">
							<span className="text-lg min-w-max">Días restantes</span>
							<p className="text-7xl font-bold">
								{remaingDays <= 0 ? 0 : remaingDays}
							</p>
						</div>
					) : (
						<div className="flex flex-col items-center justify-between gap-1">
							<span className="text-lg min-w-max">Sesiones restantes</span>
							<p className="text-7xl font-bold">{userData?.sessions || 0}</p>
							<Button
								type="button"
								variant="destructive"
								onClick={() => decreaseSessions()}
								className="mt-4 text-sm"
								disabled={!userData?.sessions || decreaseLoading}
							>
								{decreaseLoading && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Registrar sesión
							</Button>
						</div>
					)}

					<div className="px-4">
						<p className="text-lg text-secondary-foreground">
							{userData?.name} {userData?.lastName}
						</p>
						<p className="text-base text-muted-foreground max-w-[180px] truncate">
							{userData?.email}
						</p>
						<p className="text-muted-foreground">{userData?.phone}</p>
						<p className="mt-4 text-lg">
							{getObjBySlug(userData?.discipline as string)?.name}
						</p>
						<div className="text-muted-foreground text-sm flex flex-col">
							<p>
								Desde{' '}
								{parsedDate
									? format(parsedDate, 'PPP', {
											locale: es,
										})
									: 'Sin fecha'}
							</p>
							<p>
								hasta{' '}
								{finalParsedDate
									? format(finalParsedDate, 'PPP', {
											locale: es,
										})
									: 'Sin fecha'}
							</p>
						</div>
					</div>
				</div>
			)}

			{!isCalisteniaUser && (
				<ScrollArea className="mx-4 my-8 h-80 w-[calc(100%-20px)] rounded-lg border">
					<div className="p-4">
						<h4 className="mb-5 text-xl font-medium leading-none">
							Historial de sesiones
						</h4>
						{sortedSessionLogs?.map((sessionLog) => (
							<div key={sessionLog.id}>
								<div className="text-[15px]">
									{sessionLog?.createdAt
										? format(sessionLog?.createdAt, 'PPP - HH:mm', {
												locale: es,
											})
										: 'Fecha inválida'}
								</div>
								<Separator className="my-2" />
							</div>
						))}
					</div>
				</ScrollArea>
			)}

			<div className="mt-10 flex items-center justify-end space-x-2 py-4">
				<SheetClose asChild>
					<Button type="button" variant="secondary">
						Cancelar
					</Button>
				</SheetClose>

				<Button onClick={() => setIsReinscription(true)} type="button">
					Re inscribir usuario
				</Button>
			</div>
		</div>
	)
}

export default ManageUserSessions
