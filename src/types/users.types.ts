interface User {
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
}
