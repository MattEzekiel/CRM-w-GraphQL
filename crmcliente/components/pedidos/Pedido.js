import {useEffect, useState} from "react";
import TrashIcon from "../TrashIcon";
import MailIcon from "../MailIcon";
import PhoneIcon from "../../PhoneIcon";
import {gql, useMutation} from "@apollo/client";
import Swal from "sweetalert2";

const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput) {
        actualizarPedido(id: $id, input: $input) {
            estado,
            id
        }
    }
`;

const ELIMINAR_PEDIO = gql`
    mutation eliminarPedido($id: ID!) {
        eliminarPedido(id: $id)
    }
`;

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id,
        }
    }
`;


function Pedido({pedido}) {
    const { id, total, cliente : { nombre, apellido, email, telefono }, estado } = pedido;

    const [estadoPedio, setEstadoPedido] = useState(estado);
    const [clase, setClase] = useState("");

    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIO, {
        update(cache) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS,
            });
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedido => pedido.id !== id)
                }
            })
        }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const clasePedido = () => {
        if (estadoPedio === 'PENDIENTE') {
            setClase('border-yellow-500');
        } else if(estadoPedio === 'COMPLETADO') {
            setClase('border-green-500');
        } else {
            setClase('border-red-800');
        }
    }

    const cambiarEstadoPedido = async nuevoEstado => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        estado: nuevoEstado,
                        cliente: pedido.cliente.id
                    }
                }
            });
            // console.log(data.actualizarPedido.estado);
        } catch(e) {
            console.error(e);
        }
    }

    const confirmarEliminarPedido = () => {
        Swal.fire({
            title: '¿Está seguro que desea eliminar este pedido?',
            text: "No habrá forma de volver atrás",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminarlo',
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await eliminarPedido({
                        variables: {
                            id
                        }
                    });
                    Swal.fire(
                        'Eliminado',
                        data.eliminarPedido,
                        'success'
                    );
                } catch(e) {
                    console.error(e);
                }
            }
        })
    }

    useEffect(() => {
        if (estadoPedio) {
            setEstadoPedido(estadoPedio);
        }
        clasePedido();
        cambiarEstadoPedido(estadoPedio);
        // eslint-disable-next-line
    }, [estadoPedio]);

    return (
        <div className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className={"font-bold text-gray-800"}>Cliente: { nombre } { apellido }</p>
                { email && (
                    <p className={"flex items-center my-2"}><MailIcon /> {email}</p>
                ) }
                { telefono && (
                    <p className={"flex items-center my-2"}><PhoneIcon /> {telefono}</p>
                ) }
                <h2 className={"text-gray-800 font-medium mt-10"}>Estado del pedido</h2>
                <select
                    name={"estado"}
                    id={"estado"}
                    className={"mt-2 appearance-none bg-sky-600 border border-sky-600 text-white p-2 text-center rounded leadling-tight focus:outline-none focus:bg-sky-600 focus: border-sky-500 uppercase font-medium text-xs"}
                    value={estadoPedio}
                    onChange={e => setEstadoPedido(e.target.value)}
                >
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>
            <div>
                <h2 className={"text-gray-800 font-medium mt-2"}>Resumen del Pedido</h2>
                { pedido.pedido.map(articulo => (
                    <div
                        key={articulo.id}
                        className={"mt-4"}
                    >
                        {/*<p className={"text-sm text-gray-600"}>Producto: { articulo.nombre }</p>*/}
                        <p className={"text-sm text-gray-600"}>Cantidad: { articulo.cantidad }</p>
                    </div>
                )) }
                <p className={"text-gray-800 mt-3 font-bold"}>Total a pagar: <span className={"font-light"}>$ { total }</span></p>
                <button
                    type={"button"}
                    className={"flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold"}
                    onClick={() => confirmarEliminarPedido()}
                >Eliminar pedido <TrashIcon /></button>
            </div>
        </div>
    );
}

export default Pedido;