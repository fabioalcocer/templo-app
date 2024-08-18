import next from 'next'

export const steps: any = [
	// Example steps
	{
		icon: <>👋</>,
		title: 'Welcome to Onborda!',
		content: <>Aquí encontrarás el total de tus ingresos!</>,
		selector: '#onborda-step1',
		side: 'bottom',
		showControls: true,
		pointerPadding: -1,
		pointerRadius: 24,
	},
	{
		icon: <>🪄</>,
		title: "It's like magic!",
		content: (
			<>
				Aquí puedes visualizar <b>tus ventas</b> más recientes de manera
				sencilla.
			</>
		),
		selector: '#onborda-step2',
		side: 'top',
		showControls: true,
		pointerPadding: -1,
		pointerRadius: 24,
	},
	{
		icon: <>🎩</>,
		title: 'Works across routes!',
		content: (
			<>
				También podrás visualizar las <b>inscripciones recientes</b> de tus
				usuarios <b>reactour</b> to handle the onboarding flow.
			</>
		),
		selector: '#onborda-step3',
		side: 'left',
		showControls: true,
		pointerPadding: -1,
		pointerRadius: 24,
		nextRoute: '/admin/inventory',
	},
	{
		icon: <>🌀</>,
		title: 'Customize your steps',
		content: <>Encuentra tu inventario dividido por categorías y productos!</>,
		selector: '#onborda-step4',
		side: 'bottom',
		showControls: true,
		pointerPadding: -1,
		pointerRadius: 24,
		prevRoute: '/admin/dashboards',
	},
	{
		icon: <>👉</>,
		title: 'Custom pointers',
		content: (
			<>
				Aquí encontrarás la opción de añadir un <b>producto o categoría</b> a tu
				inventario.
			</>
		),
		selector: '#onborda-step5',
		side: 'left',
		showControls: true,
		pointerPadding: -1,
		pointerRadius: 24,
		nextRoute: '/admin/analytics',
	},
	{
		icon: <>⭐️</>,
		title: 'Github',
		content: <>Visualiza tus gráficas y ten el control de tus usuarios!</>,
		selector: '#onborda-step6',
		side: 'top',
		showControls: true,
		pointerPadding: -1,
		pointerRadius: 24,
		prevRoute: '/admin/inventory',
		nextRoute: '/admin/payments',
	},
	{
		icon: <>🚀</>,
		title: 'Change routes',
		content: <>Por último, puedes exportar los datos de tus usuarios en CSV!</>,
		selector: '#onborda-step7',
		side: 'bottom',
		showControls: true,
		pointerPadding: 5,
		pointerRadius: 10,
		prevRoute: '/admin/analytics',
	},
]
