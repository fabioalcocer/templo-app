'use client'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOpenPanel } from '@openpanel/nextjs'
import * as seline from '@seline-analytics/web'
import { User2Icon, UserIcon } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

seline.init()

const FormSchema = z.object({
	email: z
		.string({
			required_error: 'Please select an email to display.',
		})
		.email({
			message: 'Por favor ingresa un correo válido.',
		}),
	password: z.string().min(5, {
		message: 'La contraseña debe tener más de 5 caracteres.',
	}),
})

function LoginPage() {
	const session = useSession()
	const op = useOpenPanel()

	if (session.status === 'authenticated') {
		redirect('/admin/dashboards')
	}

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		signIn('credentials', {
			email: data.email,
			password: data.password,
			redirect: true,
			callbackUrl: '/admin/dashboards',
		}).then(() => {
			op.track('success_login', { userEmail: data?.email })
			seline.track('user: signed up', {
				email: data?.email,
			})
		})
		// toast({
		//   title: 'You submitted the following values:',
		//   description: (
		//     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
		//       <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
		//     </pre>
		//   ),
		// })
	}

	return (
		<div suppressHydrationWarning className="py-12">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto w-full max-w-lg space-y-7  rounded-md border-2 border-secondary p-8"
				>
					<div className="flex items-center gap-3">
						<User2Icon />
						<h2 className="text-center text-2xl font-semibold">
							Iniciar sesión
						</h2>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Correo electrónico</FormLabel>
								<FormControl>
									<Input placeholder="admin@gmail.com" {...field} />
								</FormControl>
								{/* <FormDescription>This is your public email.</FormDescription> */}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contraseña</FormLabel>
								<FormControl>
									<Input placeholder="*****" {...field} type="password" />
								</FormControl>
								{/* <FormDescription>This is your password.</FormDescription> */}
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">
						<UserIcon className="mr-2 h-4 w-4" /> Ingresar
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default LoginPage
