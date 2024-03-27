import { RegisterPurchaseProductForm } from './add-product-form'
import { DataProductsTable } from './data-table'
import { Button } from './ui/button'

function ProductsTableInventory({ products }: { products: Product[] }) {
  return (
    <>
      {products ? (
        <DataProductsTable />
      ) : (
        <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm'>
          <div className='flex flex-col items-center gap-1 text-center'>
            <h3 className='text-2xl font-bold tracking-tight'>
              No tienes productos
            </h3>
            <p className='text-sm text-muted-foreground'>
              Empieza agregando un nuevo producto a tu inventario
            </p>
            <div className='mt-4'>
              <RegisterPurchaseProductForm />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductsTableInventory
