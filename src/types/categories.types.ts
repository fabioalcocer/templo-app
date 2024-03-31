interface Category {
  id: string
  name: string
  description: string
  available: boolean
  productsLength: number
  type: string
  img: string
  createdAt: Date
}

interface OptionCategory {
  label: string
  value: string
}
