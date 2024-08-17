"use client";

import {
	BoxIcon,
	Calculator,
	Calendar,
	DollarSign,
	Home,
	LineChart,
	Smile,
	UserCogIcon,
	Users2,
} from "lucide-react";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Route = {
	path: string;
	label: string;
	keywords: string[];
	icon: React.ReactNode;
};

const ROUTES: Route[] = [
	{
		label: "Dashboards",
		path: "/admin/dashboards",
		icon: <Home className="mr-2 h-4 w-4" />,
		keywords: ["dashboards", "paneles", "panel", "vistas"],
	},
	{
		label: "Inventario",
		path: "/admin/inventory",
		icon: <BoxIcon className="mr-2 h-4 w-4" />,
		keywords: ["inventario", "productos", "producto", "categorias"],
	},
	{
		label: "Registro de ventas",
		path: "/admin/sales",
		icon: <DollarSign className="mr-2 h-4 w-4" />,
		keywords: ["ventas", "venta"],
	},
	{
		label: "Registro de compras",
		path: "/admin/purchases",
		icon: <UserCogIcon className="mr-2 h-4 w-4" />,
		keywords: ["compras", "compra", "pedidos", "pedido"],
	},
	{
		label: "Analíticas",
		path: "/admin/analytics",
		icon: <LineChart className="mr-2 h-4 w-4" />,
		keywords: ["analisis", "estadisticas", "graficas", "graficos", "grafico"],
	},
	{
		label: "Usuarios",
		path: "/admin/users",
		icon: <Users2 className="mr-2 h-4 w-4" />,
		keywords: ["usuarios", "usuario", "admin"],
	},
];

export function CommandDialogMenu() {
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const commandRef = useRef<HTMLDivElement>(null);

	const handleSelect = (path: string) => {
		setOpen(false);
		router.push(path);
	};

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			const keyPressed = e.key === "j";
			const modifierPressed = e.metaKey || e.ctrlKey;
			if (keyPressed && modifierPressed) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<p className="hidden py-2 text-sm text-muted-foreground md:inline">
				Presiona{" "}
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
					<span className="text-xs">⌘</span>J
				</kbd>
			</p>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Escribe un comando o búsqueda..." />
				<CommandList>
					<CommandEmpty>No se encontraron resultados.</CommandEmpty>
					<CommandGroup heading="Sugerencias">
						{ROUTES.map((route) => (
							<CommandItem
								asChild
								key={route.label}
								onSelect={() => handleSelect(route.path)}
								keywords={route.keywords}
							>
								<Link href={route.path} onClick={() => setOpen(false)}>
									{route.icon}
									<span className="text-muted-foreground">{route.label}</span>
								</Link>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
