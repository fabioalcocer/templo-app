import { createClient } from '@/utils/supabase/server'

export async function getProducts() {
  const supabase = createClient()

  try {
    const { data: productsSupabase, error } = await supabase
      .from('products')
      .select('*')

    if (error) {
      throw error
    }
    return productsSupabase as Product[]
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}
