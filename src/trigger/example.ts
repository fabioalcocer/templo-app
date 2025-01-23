import { logger, task, wait } from '@trigger.dev/sdk/v3'

export const helloWorldTask = task({
	id: 'hello-world',
	maxDuration: 300, // Stop executing after 300 secs
	run: async (payload: any, { ctx }) => {
		logger.log('Test task for Templo!', { payload, ctx })

		await wait.for({ seconds: 5 })

		return {
			message: 'Hello, Templo!',
		}
	},
})
