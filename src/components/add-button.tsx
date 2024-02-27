'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

function AddButton() {
  const { toast } = useToast()

  return (
    <div className="flex items-center gap-4">
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

      <Button
        variant="secondary"
        onClick={() => {
          toast({
            title: 'Producto eliminado con éxito',
            description: 'Puedes verlo en tu inventario',
          })
        }}
      >
        Eliminar
      </Button>

      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    </div>
  )
}

export default AddButton
