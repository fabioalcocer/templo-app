'use client'
import { UserCheck2 } from 'lucide-react'
import React, { Suspense } from 'react'
import Loading from './loading'

function UsersLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<Loading />}>
			<div className="flex h-full flex-col gap-4">
				<h2 className="mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold">
					<UserCheck2 width={36} height={36} />
					Inscripciones
				</h2>
				{children}
			</div>
		</Suspense>
	)
}

export default UsersLayout
