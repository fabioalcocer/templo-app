import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormDataType } from './create-users-form'
import { Button } from './ui/button'
import { Input } from './ui/input'

type Props = {
	form: UseFormReturn<FormDataType>
	loading: boolean
	setShowBasicForm: Dispatch<SetStateAction<boolean>>
	userId: string
}

function CustomUserForm({ form, loading, setShowBasicForm, userId }: Props) {
	return (
		<>
			<FormField
				control={form.control}
				name="injuries"
				render={({ field }) => (
					<FormItem className="flex flex-1 flex-col">
						<FormLabel>Lesiones</FormLabel>
						<FormControl>
							<Input placeholder="Lesiones.." {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="diseases"
				render={({ field }) => (
					<FormItem className="flex flex-1 flex-col">
						<FormLabel>Enfermedades</FormLabel>
						<FormControl>
							<Input placeholder="Enfermedades.." {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="operations"
				render={({ field }) => (
					<FormItem className="flex flex-1 flex-col">
						<FormLabel>Operaciones</FormLabel>
						<FormControl>
							<Input placeholder="Operaciones.." {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="allergies"
				render={({ field }) => (
					<FormItem className="flex flex-1 flex-col">
						<FormLabel>Alergias</FormLabel>
						<FormControl>
							<Input placeholder="Alergias.." {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="impediments"
				render={({ field }) => (
					<FormItem className="flex flex-1 flex-col">
						<FormLabel>Impedimentos</FormLabel>
						<FormControl>
							<Input placeholder="Impedimentos.." {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="flex flex-wrap items-center gap-5">
				<FormField
					control={form.control}
					name="age"
					render={({ field }) => (
						<FormItem className="min-w-[98px] flex-1">
							<FormLabel>Edad</FormLabel>
							<FormControl>
								<Input
									placeholder="24"
									{...field}
									type="number"
									onChange={(event) =>
										field.onChange(Number.parseFloat(event.target.value))
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="weight"
					render={({ field }) => (
						<FormItem className="min-w-[98px] flex-1">
							<FormLabel>Peso</FormLabel>
							<FormControl>
								<Input
									placeholder="75 kg"
									{...field}
									type="number"
									onChange={(event) =>
										field.onChange(Number.parseFloat(event.target.value))
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="height"
					render={({ field }) => (
						<FormItem className="min-w-[98px] flex-1">
							<FormLabel>Altura</FormLabel>
							<FormControl>
								<Input
									placeholder="1.80 m"
									{...field}
									type="number"
									onChange={(event) =>
										field.onChange(Number.parseFloat(event.target.value))
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="physicalCondition"
				render={({ field }) => (
					<FormItem className="flex flex-1 flex-col">
						<FormLabel>Condición física</FormLabel>
						<FormControl>
							<Input placeholder="Sedentario, muy activo..." {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="my-4 flex justify-end gap-2">
				<Button
					type="button"
					variant="secondary"
					onClick={() => setShowBasicForm(true)}
				>
					<ArrowLeft className="mr-2 h-5 w-5" />
					Regresar
				</Button>

				<Button type="submit">
					{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{userId ? 'Actualizar usuario' : 'Crear usuario'}
				</Button>
			</div>
		</>
	)
}

export default CustomUserForm
