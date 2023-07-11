import Layout from "../components/Layout";
import H1 from "../components/H1";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { gql, useQuery } from "@apollo/client";
import Spinner from "../components/Spinner";
import {useEffect} from "react";

const MEJORES_VENDEDORES = gql`
    query mejoresVendedores {
        mejoresVendedores {
            vendedor {
                nombre,
                apellido,
                email
            },
            total
        }
    }
`;

function MejoresVendedores() {
    const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_VENDEDORES);
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

    const vendedorGrafica = [];

    data.mejoresVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total
        };
    });

    return (
        <Layout>
            <H1>Mejores vendedores</H1>
            <div className={"h-96 mt-10"}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={vendedorGrafica}
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

export default MejoresVendedores;