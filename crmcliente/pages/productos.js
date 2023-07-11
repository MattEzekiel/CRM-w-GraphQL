import Layout from "../components/Layout";
import H1 from "../components/H1";
import { gql, useQuery } from "@apollo/client";
import Spinner from "../components/Spinner";
import TableProducts from "../components/TableProducts";
import Link from "next/link";

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id,
            nombre,
            existencia,
            precio,
            creado,
        }
    }
`;
function Productos() {
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    /*console.log(data);
    console.log(loading);
    console.log(error);*/

    return (
        <Layout>
            <H1>Productos</H1>
            <Link href={"/nuevo-producto"}>
                <span className={"bg-sky-800 py-2 px-5 my-3 inline-block text-white hover:bg-sky-900 rounded uppercase font-medium text-sm"}>Crear un nuevo producto</span>
            </Link>
            { loading ?
                (<Spinner />)
                :
                (<TableProducts
                    products={data.obtenerProductos}
                />)
            }
        </Layout>
    );
}

export default Productos;