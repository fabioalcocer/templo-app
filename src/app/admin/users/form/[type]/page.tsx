import CreateUsersForm from '@/components/create-users-form'

function UserTypePage({ params }: { params: { type: string } }) {
  return <CreateUsersForm params={params} />
}

export default UserTypePage
