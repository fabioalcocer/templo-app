import { auth } from '@/firebase/config'
import { OpenPanel } from '@openpanel/nextjs'
import { signInWithEmailAndPassword } from 'firebase/auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const op = new OpenPanel({
  clientId: '870c92d4-d23b-49c2-a77d-3aeffd830e98',
  clientSecret: process.env.OPEN_PANEL_SECRET,
})

export const authOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials): Promise<any> {
        return await signInWithEmailAndPassword(
          auth,
          (credentials as any).email || '',
          (credentials as any).password || '',
        )
          .then((userCredential) => {
            if (userCredential.user) {
              op.identify({
                profileId: userCredential.user.uid,
                email: userCredential.user.email || '',
              })
              return userCredential.user
            }
            return null
          })
          .catch((error) => console.log(error))
          .catch((error) => {
            console.log(error)
          })
      },
    }),
  ],
}
export default NextAuth(authOptions)
