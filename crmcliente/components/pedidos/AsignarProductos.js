import Select from 'react-select';
import { gql, useQuery } from "@apollo/client";
import Spinner from "../Spinner";
import {useContext, useEffect, useState} from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

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

function AsignarProductos() {
    const [productos, setProductos] = useState([]);
    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto } = pedidoContext;

    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    useEffect(() => {
        agregarProducto(productos);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[productos]);

    const seleccionarProducto = producto => {
        setProductos(producto);
    }

    if (loading) return <Spinner />

    const { obtenerProductos } = data;

    return (
        <>
            <p className={"mt-10 mb-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-medium"}>2.- Selecciona o busque los productos</p>
            <Select
                className={"mt-3"}
                options={obtenerProductos}
                onChange={(opcion) => seleccionarProducto(opcion)}
                isMulti={true}
                noOptionsMessage={() => "No hay resultados"}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones => `${opciones.nombre} - ${opciones.existencia} Disponibles`}
                placeholder={"Seleccione el producto"}
            />
        </>
    );
}

export default AsignarProductos;