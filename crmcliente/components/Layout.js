import Head from "next/head";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import Header from "./Header";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";

export default function Layout({children}) {
    const router = useRouter();
    const { cargando } = useAuth();

    if (cargando) {
        return (
            <>
                <Head>
                    <title>CRM - Administra tus clientes</title>
                </Head>
                <div className={"bg-gray-800 min-h-screen flex flex-col justify-center"}>
                    <Spinner />
                </div>
            </>
        )
    }

    return (
        <>
            <Head>
                <title>CRM - Administra tus clientes</title>
            </Head>
                { router.pathname === '/iniciar-sesion' || router.pathname === '/registro' ?
                    (
                        <main className={"bg-gray-800 min-h-screen flex flex-col justify-center"}>
                            <div>
                                {children}
                            </div>
                        </main>
                    )
                    :
                    (
                        <div className={"bg-gray-200 min-h-screen"}>
                            <div className={"sm:flex min-h-screen"}>
                                <Sidebar />
                                <main className={"sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5"}>
                                    <Header />
                                    {children}
                                </main>
                            </div>
                        </div>
                    )
                }
        </>
    )
}