import Layout from "../components/Layout";
import H1 from "../components/H1";
import { gql, useQuery } from "@apollo/client";
import Spinner from "../components/Spinner";
import TableClientsSeller from "../components/TableClientsSeller";
import Link from "next/link";
import {useEffect} from "react";

const OBTENER_CLIENTES_USUARIO = gql`
    query obtenerClientesVendedor {
      obtenerClientesVendedor {
        id,
        nombre,
        apellido,
        email,
        empresa
      }
    }
`;

export default function Home() {
    const { data, loading, error,client, refetch } = useQuery(OBTENER_CLIENTES_USUARIO);
    /**
     * @typedef {Object} obtenerClientesVendedor
     * @typedef {Object} Data
     * @property {obtenerClientesVendedor} obtenerClientesVendedor
     */
    useEffect(() => {
        if (!data && !loading) {
            refetch();
        }
    }, [data, loading, refetch])

  return (
      <Layout>
          <H1>Clientes</H1>
          <Link href={"/nuevo-cliente"}>
              <span className={"bg-sky-800 text-white py-2 px-5 mt-3 block lg:w-fit rounded text-sm hover:bg-sky-900 transition duration-300 mb-3 uppercase font-medium w-full text-center"}>Nuevo cliente</span>
          </Link>
          { loading ?
              (<Spinner />)
              :
              (data && (<TableClientsSeller
                  clients={data.obtenerClientesVendedor}
                  key={"tablahome"}
              />))
          }
      </Layout>
  )
}
