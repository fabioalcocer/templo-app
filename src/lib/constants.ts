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
  {
    name: 'Desayuno Fit',
    id: 'qkViBkm7HAGTz97H1X2r',
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

export const DAY_IN_MILLISECONDS = 86400000

export const DISCIPLINES: Record<string, Discipline> = {
  CALISTENIA: {
    slug: 'calistenia',
    name: 'Calistenia',
  },
  POWER_PLATE: {
    slug: 'power-plate',
    name: 'Power plate',
  },
  CUSTOM: {
    slug: 'custom',
    name: 'Personalizado',
  },
}

export const USER_DEFAULT_VALUES = {
  id: '',
  name: '',
  lastName: '',
  ci: '',
  phone: '',
  discipline: '',
  dateEntry: undefined,
  unitPrice: 0,
  discount: 0,
  finalPrice: 0,
  paymentType: undefined,
  finalDate: undefined,
}
