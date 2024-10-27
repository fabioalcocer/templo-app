export async function GET(request: Request) {
	const data = {
		name: 'Templo',
		email: 'templo@templo.com',
		phone: '+56 999 999 999',
		city: 'Santiago',
		country: 'Chile',
		date: new Date().toLocaleDateString(),
	}

	return new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
