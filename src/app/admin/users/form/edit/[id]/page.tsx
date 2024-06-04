import CreateUsersForm from '@/components/create-users-form'

function UserTypePage({ params }: { params: { id: string } }) {
  return <CreateUsersForm params={params} />
}

export default UserTypePage
