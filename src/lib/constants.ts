export const CATEGORIES = [
  {
    name: 'Aguas',
    id: '6jIZznR3GdOIxfzKgEE1',
  },
  {
    name: 'Powerade',
    id: 'Z6C1qNbeHT7RazSxXQ5f',
  },
  {
    name: 'Energizantes',
    id: 'pTWkEmsf1ye6r78vUpS2',
  },
] as const

export const CATEGORY_DEFAULT_VALUES = {
  id: '',
  name: '',
  description: '',
  available: false,
  img: '',
}

export const DEFAULT_VALUES = {
  id: '',
  name: '',
  description: '',
  price: 0,
  cost: 0,
  stock: 0,
  img: '',
  categoryId: '',
}
