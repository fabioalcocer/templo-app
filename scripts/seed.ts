import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno necesarias')
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface Product {
  cost: number
  price: number
  name: string
  description: string
  img: string
  stock: number
  totalSales: number
  categoryId: string
}

async function seedProducts() {
  try {
    console.log('Verificando categorías existentes...')

    // Primero, obtener las categorías existentes
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(1)

    if (categoriesError) {
      throw new Error(`Error al obtener categorías: ${categoriesError.message}`)
    }

    if (!categories || categories.length === 0) {
      console.log(
        'No se encontraron categorías. Creando una categoría por defecto...',
      )

      const { data: newCategory, error: newCategoryError } = await supabase
        .from('categories')
        .insert([{ name: 'Bebidas' }])
        .select()

      if (newCategoryError) {
        throw new Error(`Error al crear categoría: ${newCategoryError.message}`)
      }

      console.log('Categoría creada:', newCategory)
      categories.push(newCategory[0])
    }

    const categoryId = categories[0].id
    console.log(`Usando categoryId: ${categoryId}`)

    const productsSeedData: Product[] = [
      {
        cost: 6,
        price: 8,
        name: 'Powerade (473 ml)',
        description: '',
        img: 'https://www.fidalga.com/cdn/shop/products/7771609000496.jpg?v=1656732160',
        stock: 2,
        totalSales: 3,
        categoryId: categoryId,
      },
      // Puedes agregar más productos aquí
    ]

    console.log('Iniciando inserción de productos...')

    const { data, error } = await supabase
      .from('products')
      .insert(productsSeedData)
      .select()

    if (error) {
      throw error
    }

    console.log('Productos insertados exitosamente:', data)
  } catch (error) {
    console.error('Error al procesar:', error)
    process.exit(1)
  }
}

seedProducts().then(() => {
  console.log('Proceso de seed completado')
  process.exit(0)
})
