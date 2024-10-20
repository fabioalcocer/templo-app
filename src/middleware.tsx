import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from './stack'

export async function middleware(request: NextRequest) {
	try {
		const user = await stackServerApp.getUser()
		if (!user) {
			return NextResponse.redirect(new URL('/handler/sign-in', request.url))
		}
		return NextResponse.next()
	} catch (error) {
		console.error('Error al obtener el usuario:', error)
	}
}

export const config = {
	matcher: '/admin/:path*',
}

//@ts-ignore
global.performance = global.performance || {
	now: () => new Date().getTime(),
}
