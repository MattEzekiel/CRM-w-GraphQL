import Layout from "../components/Layout";
import H1 from "../components/H1";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { gql, useQuery } from "@apollo/client";
import Spinner from "../components/Spinner";
import {useEffect} from "react";

const MEJORES_CLIENTES = gql`
    query mejoresClientes{
        mejoresClientes {
            cliente {
                nombre,
                apellido,
                email,
                empresa,
                telefono
            },
            total
        }
    }
`;

function MejoresClientes() {
    const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);
    /*console.log(data);
    console.log(loading);
    console.log(error);*/

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    if (loading) return <Spinner />

    const clienteGrafica = [];

    data.mejoresClientes.map((cliente, index) => {
        clienteGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total
        };
    });

    return (
        <Layout>
            <H1>Mejores clientes</H1>
            <div className={"h-96 mt-10"}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={clienteGrafica}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nombre" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#3182ce" />
                        {/*<Bar dataKey="uv" fill="#82ca9d" />*/}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Layout>
    );
}

export default MejoresClientes;