'use client'
import { Users2 } from 'lucide-react'
import React, { Suspense } from 'react'
import Loading from './loading'

function UsersLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<Loading />}>
			<div className="flex h-full flex-col gap-4">
				<h2 className="mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold">
					<Users2 width={36} height={36} />
					Usuarios
				</h2>
				{children}
			</div>
		</Suspense>
	)
}

export default UsersLayout
