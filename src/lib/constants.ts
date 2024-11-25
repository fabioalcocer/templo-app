export const CATEGORIES = [
	{
		name: 'Aguas',
		id: '6jIZznR3GdOIxfzKgEE1',
	},
	{
		name: 'Bebidas isotónicas',
		id: 'cWE4I2U4hwcV5su6Jvoy',
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
		slug: 'gym',
		name: 'Gimnasio',
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
	email: '',
	phone: '',
	discipline: undefined,
	plan: '',
	dateEntry: undefined,
	unitPrice: 0,
	discount: 0,
	finalPrice: 0,
	sessions: 0,
	paymentType: undefined,
	finalDate: undefined,
	injuries: '',
	diseases: '',
	operations: '',
	allergies: '',
	impediments: '',
	physicalCondition: '',
}

export const PAYMENT_TYPES = [
	{
		label: 'QR',
		value: 'qr',
	},
	{
		label: 'Efectivo',
		value: 'cash',
	},
	{
		label: 'Tarjeta de débito',
		value: 'card',
	},
]

export const CALISTENIA_PLANS = [
	{
		label: 'Calistenia',
		value: 'calistenia',
	},
	{
		label: 'Calistenia mujeres',
		value: 'women-calistenia',
	},
	{
		label: 'Calistenia personalizada',
		value: 'custom-calistenia',
	},
]

export const monthOrder = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
]
