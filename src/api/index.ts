import { database } from '@/firebase/config'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { cache } from 'react'

export const revalidate = 20

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

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!id) return null

  try {
    const docRef = doc(database, 'categories', id)
    const categoryData = await getDoc(docRef)
    const category = categoryData.data()
    return category as Category
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function createCategory({ data }: any) {
  try {
    const docRef = await addDoc(collection(database, 'categories'), {
      ...data,
      createdAt: Date.now(),
    })
    console.log('Document written with ID: ', docRef.id)
    return setDoc(docRef, { id: docRef.id }, { merge: true })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export async function updateInventoryItem(data: any, collectionName: string) {
  try {
    const docRef = doc(database, collectionName, data.id)
    await updateDoc(docRef, data)
    console.log('El documento fue actualizado')
    return
  } catch (e) {
    console.error('Error updating document: ', e)
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(database, 'products'))
    const categoriesData = querySnapshot.docs.map((doc) => doc.data())
    return categoriesData as Product[]
  } catch (err) {
    console.error(err)
    return []
  }
}
export const getProductsByCategoryId = cache(
  async (categoryId: string): Promise<Product[]> => {
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
  },
)

export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null

  try {
    const docRef = doc(database, 'products', id)
    const productData = await getDoc(docRef)
    const product = productData.data()
    return product as Product
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function registerProductSale({ productData }: any) {
  try {
    const docRef = await addDoc(collection(database, 'sales'), {
      ...productData,
    })
    console.log('Document written with ID: ', docRef.id)
    setDoc(docRef, { id: docRef.id }, { merge: true })
    return await discountProductStock(
      productData.productId,
      productData.quantity,
    )
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export async function registerProductPurchase({ data }: any) {
  try {
    const docRef = await addDoc(collection(database, 'products'), {
      ...data,
      createdAt: Date.now(),
    })
    console.log('Document written with ID: ', docRef.id)
    return setDoc(docRef, { id: docRef.id }, { merge: true })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export async function discountProductStock(
  productId: string,
  quantity: number,
) {
  try {
    const docRef = doc(database, 'products', productId)
    const productData = await getDoc(docRef)
    const product = productData.data()
    if (product?.stock < quantity || product?.stock <= 0) return

    updateDoc(docRef, {
      stock: product?.stock - quantity,
    })
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
