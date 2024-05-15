interface User {
  createdAt: Date
  id: string
  active: boolean
  name: string
  lastName: string
  ci: string
  email: string
  phone: string
  discipline: string
  dateEntry: Date
  unitPrice: number
  discount: number
  finalPrice: number
  paymentType: string
  finalDate: Date
  socialMedia: {
    facebook: string
    instagram: string
    tiktok: string
  }
  plan: string
  sessions: number
  injuries: string
  diseases: string
  operations: string
  allergies: string
  impediments: string
  age: number
  weight: number
  height: number
}
