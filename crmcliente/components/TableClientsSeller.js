import TrashIcon from "./TrashIcon";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import EditIcon from "./EditIcon";
import Router from "next/router";

const ELIMINAR_CLIENTE = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;


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

function TableClientsSeller({clients}) {
    let idSelected = '';
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        update(cache, { data }) {
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO });

            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(
                        clienteActual => clienteActual.id !== idSelected
                    ),
                },
            });
        },
    });
    const confirmarEliminarCliente = id => {
        Swal.fire({
            title: '¿Está seguro que desea eliminar este cliente?',
            text: "No habrá forma de volver atrás",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminarlo',
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                idSelected = id;
                try {
                    const { data } = await eliminarCliente({
                        variables: {
                            id
                        }
                    });

                    Swal.fire(
                        '¡Eliminado!',
                        data.eliminarCliente,
                        'success'
                    )
                } catch(e) {
                    console.error(e)
                }
            }
        })
    }

    const editarCliente = id => {
        Router.push({
            pathname: "/editar-cliente/[id]",
            query: { id }
        });
    }

    return (
        <div className={"overflow-x-auto"}>
            <table className={"table-auto shadow-md mt-10 w-full w-lg"}>
                <thead className={"bg-gray-800"}>
                <tr className={"text-white"}>
                    <th className={"w-1/5 py-2"}>Cliente</th>
                    <th className={"w-1/5 py-2"}>Empresa</th>
                    <th className={"w-1/5 py-2"}>Email</th>
                    <th className={"w-1/5 py-2"}>Eliminar</th>
                    <th className={"w-1/5 py-2"}>Editar</th>
                </tr>
                </thead>
                <tbody className={"bg-white"}>
                { clients?.length > 0 ?
                    clients.map(client => (
                        <tr key={client.id}>
                            <td className={"border px-4 py-2"}>{ client.nombre } { client.apellido }</td>
                            <td className={"border px-4 py-2"}>{client.empresa}</td>
                            <td className={"border px-4 py-2"}>{client.email}</td>
                            <td className={"border px-4 py-2"}>
                                <button
                                    type={"button"}
                                    className={"flex justify-center items-center bg-red-600 rounded text-white py-2 px-4 w-fit mx-auto uppercase text-sm"}
                                    onClick={() => confirmarEliminarCliente(client.id)}
                                >Eliminar <TrashIcon />
                                </button>
                            </td>
                            <td className={"border px-4 py-2"}>
                                <button
                                    type={"button"}
                                    className={"flex justify-center items-center bg-yellow-400 rounded py-2 px-4 w-fit mx-auto uppercase text-sm"}
                                    onClick={() => editarCliente(client.id)}
                                >Editar <EditIcon />
                                </button>
                            </td>
                        </tr>
                    ))
                    :
                    (
                        <tr>
                            <td colSpan={"100%"} className={"border p-5 text-xl text-center font-medium"}>No tiene clientes registrados</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    );
}

export default TableClientsSeller;