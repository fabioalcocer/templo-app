import { auth, clerkClient } from '@clerk/nextjs/server'
import Header from './header'

async function checkUserOrganization() {
	const { userId } = auth()
	if (!userId) return false

	const organizationMemberships =
		await clerkClient().users.getOrganizationMembershipList({
			userId: userId || '',
		})

	return organizationMemberships.totalCount > 0
}

async function ClerkServerWrapper() {
	const hasOrganization = await checkUserOrganization()
	return <Header hasOrganization={hasOrganization} />
}

export default ClerkServerWrapper
