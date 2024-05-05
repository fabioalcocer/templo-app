interface User {
  id: string
  fullName: string
  nit: string
  phone: string
  email: string
  socialMedia: {
    facebook: string
    instagram: string
    tiktok: string
  }
  discipline: string
  plan: string
  sessions: number
  price: number
  admissionDate: Date
}
