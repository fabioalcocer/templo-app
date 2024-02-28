import { database } from '@/firebase/config'
import { collection, getDocs } from 'firebase/firestore'

export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(database, 'products'))
    const productsData = querySnapshot.docs.map((doc) => doc.data())
    console.log(productsData)
    return productsData as Product[]
  } catch (err) {
    console.error(err)
    return []
  }
}
