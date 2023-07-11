import Link from "next/link";
import { useRouter } from "next/router";

function Sidebar() {
    const router = useRouter();

    return (
        <aside className={"bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5"}>
            <div>
                <h2 className={"text-white text-2xl font-medium"}>CRM Clientes</h2>
            </div>
            <nav className={"mt-5 list-none"}>
                <ul>
                    <li className={`text-white font-medium mb-2 p-2 ${router.pathname === '/' ? "bg-sky-800" : null}`}>
                        <Link href={"/"}>Inicio</Link>
                    </li>
                    <li className={`text-white font-medium mb-2 p-2 ${router.pathname === '/pedidos' ? "bg-sky-800" : null}`}>
                        <Link href={"/pedidos"}>Pedidos</Link>
                    </li>
                    <li className={`text-white font-medium mb-2 p-2 ${router.pathname === '/productos' ? "bg-sky-800" : null}`}>
                        <Link href={"/productos"}>Productos</Link>
                    </li>
                </ul>
            </nav>
            <div className={"sm:mt-10"}>
                <h2 className={"text-white text-2xl font-medium"}>Otras opciones</h2>
            </div>
            <nav className={"mt-5 list-none"}>
                <li className={`text-white font-medium mb-2 p-2 ${router.pathname === '/mejores-vendedores' ? "bg-sky-800" : null}`}>
                    <Link href={"/mejores-vendedores"}>Mejores vendedores</Link>
                </li>
                <li className={`text-white font-medium mb-2 p-2 ${router.pathname === '/mejores-clientes' ? "bg-sky-800" : null}`}>
                    <Link href={"/mejores-clientes"}>Mejores clientes</Link>
                </li>
            </nav>
        </aside>
    );
}

export default Sidebar;