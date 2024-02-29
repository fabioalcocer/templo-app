import { database } from '@/firebase/config'
import {
  addDoc,
  collection,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'

export async function getCategories(): Promise<Category[]> {
  try {
    const querySnapshot = await getDocs(collection(database, 'categories'))
    const categoriesData = querySnapshot.docs.map((doc) => doc.data())
    return categoriesData as Category[]
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getProductsByCategoryId(
  categoryId: string,
): Promise<Product[]> {
  const colRef = collection(database, 'products')
  const queryRef = query(colRef, where('categoryId', '==', categoryId))

  try {
    const querySnapshot = await getDocs(queryRef)
    const productsData = querySnapshot.docs.map((doc) => doc.data())
    return productsData as Product[]
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function registerSaleProduct({ productData }: any) {
  try {
    const docRef = await addDoc(collection(database, 'sales'), {
      ...productData,
    })
    console.log('Document written with ID: ', docRef.id)
    return setDoc(docRef, { id: docRef.id }, { merge: true })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export async function getSales(): Promise<Sale[]> {
  try {
    const querySnapshot = await getDocs(collection(database, 'sales'))
    const salesData = querySnapshot.docs.map((doc) => doc.data())
    return salesData as Sale[]
  } catch (err) {
    console.error(err)
    return []
  }
}