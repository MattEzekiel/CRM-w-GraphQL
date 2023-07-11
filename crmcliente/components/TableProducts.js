import TrashIcon from "./TrashIcon";
import EditIcon from "./EditIcon";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import Router from "next/router";

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!) {
      eliminarProducto(id: $id)
    }
`;

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

function TableProducts({ products }) {
    let idSelected = '';
    const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS
            });

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter(
                        productoActual => productoActual.id !== idSelected
                    ),
                },
            });
        }
    });

    const confirmarEliminarProducto = async id => {
        Swal.fire({
            title: '¿Está seguro que desea eliminar este producto?',
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
                    const { data } = await eliminarProducto({
                        variables: {
                            id: idSelected,
                        }
                    });
                    Swal.fire(
                        'Correcto',
                        data.eliminarProducto,
                        'success'
                    )
                } catch(e) {
                    console.error(e);
                }
            }
        })
    }

    const editarProducto = id => {
        Router.push({
            pathname: "/editar-producto/[id]",
            query: { id }
        });
    }

    return (
        <div className={"overflow-x-auto"}>
            <table className={"table-auto shadow-md mt-10 w-full w-lg"}>
                <thead className={"bg-gray-800"}>
                <tr className={"text-white"}>
                    <th className={"w-1/5 py-2"}>Cliente</th>
                    <th className={"w-1/5 py-2"}>Existencia</th>
                    <th className={"w-1/5 py-2"}>precio</th>
                    <th className={"w-1/5 py-2"}>Eliminar</th>
                    <th className={"w-1/5 py-2"}>Editar</th>
                </tr>
                </thead>
                <tbody className={"bg-white"}>
                { products.map(producto => {
                    const { nombre, existencia, id, precio } = producto;
                    return(
                        <tr key={id}>
                            <td className={"border px-4 py-2"}>{ nombre }</td>
                            <td className={"border px-4 py-2"}>{ existencia } { existencia > 1 ? 'piezas' : 'pieza' }</td>
                            <td className={"border px-4 py-2"}>{ precio }</td>
                            <td className={"border px-4 py-2"}>
                                <button
                                    type={"button"}
                                    className={"flex justify-center items-center bg-red-600 rounded text-white py-2 px-4 w-fit mx-auto uppercase text-sm"}
                                    onClick={() => confirmarEliminarProducto(id)}
                                >Eliminar <TrashIcon />
                                </button>
                            </td>
                            <td className={"border px-4 py-2"}>
                                <button
                                    type={"button"}
                                    className={"flex justify-center items-center bg-yellow-400 rounded py-2 px-4 w-fit mx-auto uppercase text-sm"}
                                    onClick={() => editarProducto(id)}
                                >Editar <EditIcon />
                                </button>
                            </td>
                        </tr>
                    )
                }) }
                </tbody>
            </table>
        </div>
    );
}

export default TableProducts;