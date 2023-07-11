import Layout from "../components/Layout";
import H1 from "../components/H1";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import PedidoContext from "../context/pedidos/PedidoContext";
import {useContext, useState} from "react";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import { useMutation, gql } from "@apollo/client";
import {mostrarMensaje} from "../helpers";
import {useRouter} from "next/router";

const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput) {
        nuevoPedido(input: $input) {
            id,
        }
    }
`;

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

function NuevoPedido() {
    const [mensaje, setMensaje] = useState("");
    const [success, setSuccess] = useState(false);

    const pedidoContext = useContext(PedidoContext);
    const { cliente, productos, total } = pedidoContext;

    const router = useRouter();

    const [ nuevoPedido ] = useMutation(NUEVO_PEDIDO, {
        update(cache, {data: {nuevoPedido} } ) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS
            });
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
                }
            })
        }
    });

    const validarPedido = () => {
        return !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? "opacity-50 cursor-not-allowed" : "";
    }

    const crearNuevoPedido = async () => {
        const { id } = cliente;
        const pedido = productos.map(({ existencia, nombre, precio, creado, __typename, ...producto }) => producto);

        try {
            const { data } = await nuevoPedido({
                variables: {
                    input: {
                        cliente: id,
                        total,
                        pedido,
                    }
                }
            });
            if (data) {
                setSuccess(true);
                setMensaje("El pedido se ha realizado correctamente");

                setTimeout(() => {
                    router.push("/pedidos");
                }, 5000)
            }
        } catch(e) {
            console.error(e);
            setSuccess(false);
            setMensaje(e.message);

            setTimeout(() => {
                setMensaje("");
            }, 5000)
        }
    }

    return (
        <Layout>
            <H1>Nuevo pedido</H1>
            <div className={"flex justify-center mt-5"}>
                <div className={"w-full max-w-lg"}>
                    { mensaje && success ? mostrarMensaje(true,mensaje) : mostrarMensaje(false,mensaje) }
                    <AsignarCliente />
                    <AsignarProductos />
                    <ResumenPedido />
                    <Total />
                    <button
                        type={"button"}
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
                        onClick={() => crearNuevoPedido()}
                    >Registrar pedido</button>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoPedido;