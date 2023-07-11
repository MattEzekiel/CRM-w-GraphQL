import Layout from "../components/Layout";
import H1 from "../components/H1";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import Spinner from "../components/Spinner";
import Pedido from "../components/pedidos/Pedido";

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id,
            pedido {
                id,
                cantidad,
            },
            total,
            cliente {
                id,
                nombre,
                apellido,
                email,
                telefono
            },
            vendedor,
            fecha,
            estado,
        }
    }
`;

function Pedidos() {
    const { data, loading, error } = useQuery(OBTENER_PEDIDOS);

    if(loading) return <Spinner />

    if (error) {
        console.error(error);
        return (
            <Layout>
                <H1>Pedidos</H1>
                <Link href={"/nuevo-pedido"}>
                    <span className={"bg-sky-800 py-2 px-5 my-3 inline-block text-white hover:bg-sky-900 rounded uppercase font-medium text-sm"}>Crear un nuevo pedido</span>
                </Link>
                <h2 className={"text-3xl text-center mt-5"}>Ocurrió un error</h2>
            </Layout>
        );
    }

    const { obtenerPedidosVendedor } = data;

    return (
        <Layout>
            <H1>Pedidos</H1>
            <Link href={"/nuevo-pedido"}>
                <span className={"bg-sky-800 py-2 px-5 my-3 inline-block text-white hover:bg-sky-900 rounded uppercase font-medium text-sm"}>Crear un nuevo pedido</span>
            </Link>
            { obtenerPedidosVendedor.length === 0 ?
                (
                    <p className={"mt-5 text-center  text-2xl"}>No hay pedidos aún</p>
                ) : (
                    obtenerPedidosVendedor.map(pedido => (
                        <Pedido
                            key={pedido.id}
                            pedido={pedido}
                        />
                    ))
                )}
        </Layout>
    );
}

export default Pedidos;