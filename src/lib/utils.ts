import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CATEGORIES } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parsedPriceFromNumber = (price: number) => {
  const formattedPrice = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(price)

  return formattedPrice
}

export function getCategoryNameById(id: string): string | undefined {
  const category = CATEGORIES.find((category) => category.id === id)
  return category ? category.name : ''
}

export const calculateTotalFromSales = (sales: Sale[]) => {
  const total = sales.reduce((total, sale) => {
    return total + sale?.total
  }, 0)

  return parsedPriceFromNumber(total)
}


export const calculateTotalFromPurchases = (products: Product[] | Purchase[]) => {
  const productsWithCost = products.filter((product) => product?.cost > 0)
  const total = productsWithCost.reduce((total, product) => {
    return total + product?.cost
  }, 0)

  return parsedPriceFromNumber(total)
}
