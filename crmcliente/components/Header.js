import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import {useEffect} from "react";

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
      obtenerUsuario {
        id,
        nombre,
        apellido,
        email
      }
    }
`;
function Header() {
    const { data, loading, client, error, refetch } = useQuery(OBTENER_USUARIO);
    /*console.log(data);
    console.log(loading);
    console.log(error);*/
    /**
     * @typedef {Object} obtenerUsuario
     * @typedef {Object} data
     * @property {obtenerUsuario} obtenerUsuario
     */
    const router = useRouter();

    const cerrarSession = () => {
        sessionStorage.removeItem('token');
        client.clearStore();
        router.push("/iniciar-sesion")
    }
    
    useEffect(() => {
        if (!data && !loading) {
            refetch();
        }
    }, [data, loading, refetch])

    return (
        <header className={"sm:flex justify-end mb-3"}>
            { !loading ?
                (<p className={"mr-5 mt-1 mb-5 lg:mb-0"}>Hola: { data.obtenerUsuario?.nombre } { data.obtenerUsuario?.apellido }</p>)
                :
                (
                    <div role={"status"} className={"max-w-sm animate-pulse"}>
                        <div className={"h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-48 mt-2 mr-5"}></div>
                        <span className={"sr-only"}>Cargando...</span>
                    </div>
                )
            }
            <button
                onClick={() => cerrarSession()}
                type={"button"}
                className={"bg-sky-800 w-full sm:w-auto text-white font-medium uppercase text-xs rounded p-2 shadow-md w-full"}
            >Cerrar Sesión</button>
        </header>
    );
}

export default Header;