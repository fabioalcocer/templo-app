import { deleteItem } from '@/api'
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
import { Button } from './ui/button'

type Props = {
  itemId: string
  itemName: string
  collectionName: string
}

export function AlertDialogConfirm({ itemId, itemName, collectionName }: Props) {
  const handleDeleteItem = async () => {
    await deleteItem(itemId, collectionName)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className='relative w-full text-destructive flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-secondary focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
        Eliminar {itemName || 'item'}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro que deseas eliminar este item?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente los
            datos de este item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button variant='destructive' asChild>
            <AlertDialogAction onClick={handleDeleteItem}>Eliminar</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
