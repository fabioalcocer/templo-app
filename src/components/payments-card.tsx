'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent } from '@/components/ui/card'
import { parsedPriceFromNumber } from '@/lib/utils'
import { getUserById } from '@/services'
import { User } from '@/types/users.types'
import { useEffect, useState } from 'react'

function PaymentCards({ payment }: { payment: Payment }) {
	const [userData, setUserData] = useState<User | null>(null)

	useEffect(() => {
		if (payment?.userId) {
			getUserById(payment?.userId).then((userData) => {
				setUserData(userData)
			})
		}
	}, [payment?.userId])

	return (
		<>
			{userData?.email && (
				<CardContent className="grid gap-8 overflow-hidden">
					<div className="flex items-center gap-4">
						<Avatar className="hidden h-9 w-9 md:flex">
							<AvatarImage src="/avatars/01.png" alt="Avatar" />
							<AvatarFallback>OM</AvatarFallback>
						</Avatar>
						<div className="grid gap-1">
							<p className="text-sm font-medium leading-none">
								{userData?.name}
							</p>
							<p className="text-xs text-muted-foreground max-w-[160px] truncate">
								{userData?.email}
							</p>
						</div>
						<div className="ml-auto text-sm font-medium">
							+{parsedPriceFromNumber(payment?.finalPrice)}
						</div>
					</div>
				</CardContent>
			)}
		</>
	)
}

export default PaymentCards
