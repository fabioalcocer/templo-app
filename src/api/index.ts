import { database } from '@/firebase/config'
import { addDoc, collection, getDocs, setDoc } from 'firebase/firestore'

export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(database, 'products'))
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
