import { toast } from '@/components/ui/use-toast'
import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { twMerge } from 'tailwind-merge'
import { CATEGORIES, DISCIPLINES } from './constants'

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

export const calculateTotalFromPayments = (
  payments: Payment[],
  returnNumber?: boolean,
) => {
  const total = payments.reduce((total, sale) => {
    return total + sale?.finalPrice
  }, 0)

  if (returnNumber) return total

  return parsedPriceFromNumber(total)
}

export const calculateTotalFromSales = (
  sales: Sale[],
  returnNumber?: boolean,
) => {
  const total = sales.reduce((total, sale) => {
    return total + sale?.total
  }, 0)

  if (returnNumber) return total

  return parsedPriceFromNumber(total)
}

export const calculateTotalFromPurchases = (
  purchases: Purchase[],
  returnNumber?: boolean,
) => {
  const purchasesWithCost = purchases.filter((purchase) => purchase?.cost > 0)
  const total = purchasesWithCost.reduce((total, product) => {
    return total + product?.cost * product?.stock
  }, 0)

  if (returnNumber) return total

  return parsedPriceFromNumber(total)
}

export const getObjBySlug = (slug: string): Discipline | null => {
  for (const key in DISCIPLINES) {
    if (DISCIPLINES[key].slug === slug) {
      return DISCIPLINES[key]
    }
  }

  return null
}

export const calculateDiscount = (
  total: number,
  discount: number,
  discountType: string,
) => {
  if (discountType === 'percent') {
    const discountedTotal = total - total * (discount / 100)
    return discountedTotal
  }

  return total - discount
}

export const validateDiscountValue = (value: number, discountType: string) => {
  if (value < 0) return 0
  if (value > 100 && discountType === 'percent') return 100

  return value
}

export const showToastForCopyText = (userId: string) => {
  toast({
    title: 'Se copió el texto al portapapeles',
  })

  return navigator.clipboard.writeText(userId)
}

export const convertStringToDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function parsedTimestampDate(date: Date) {
  const parsedDate = (date as unknown as Timestamp)?.toDate()

  return format(parsedDate, 'P')
}
