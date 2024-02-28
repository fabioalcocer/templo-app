'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

function AddButton() {
  const { toast } = useToast()

  return (
    <div className='flex items-center gap-4'>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='outline'>Eliminar</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estas seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              asChild
              onClick={() => {
                toast({
                  title: 'Producto eliminado con éxito',
                  description: 'Puedes verlo en tu inventario',
                })
              }}
            >
              <AlertDialogAction>Eliminar</AlertDialogAction>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        onClick={() => {
          toast({
            title: 'Producto agregado con éxito',
            description: 'Puedes verlo en tu inventario',
          })
        }}
      >
        Agregar
      </Button>
{/* 
      <Button disabled>
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        Please wait
      </Button> */}
    </div>
  )
}

export default AddButton
