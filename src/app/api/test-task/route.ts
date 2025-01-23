import type { helloWorldTask } from '@/trigger/example'
import { tasks } from '@trigger.dev/sdk/v3'
import { NextResponse } from 'next/server'

export async function GET() {
	const handle = await tasks.trigger<typeof helloWorldTask>(
		'hello-world',
		'Manuel Vera',
	)

	return NextResponse.json(handle)
}
