import { useContext, useEffect } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";
import ProductoResumen from "./ProductoResumen";

function ResumenPedido() {
    const pedidoContext = useContext(PedidoContext);
    const { productos, actualizarTotal } = pedidoContext;

    useEffect(() => {
        actualizarTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productos])

    return (
        <>
            <p className={"mt-10 mb-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-medium"}>3.- Ajuste las cantidades del producto</p>
            { productos.length > 0 ? (
                <>
                    { productos.map(producto => (
                        <ProductoResumen
                            key={producto.id}
                            producto={producto}
                        />
                    )) }
                </>
            ) : (
                <p className={"mt-5 text-sm"}>Aún no hay productos</p>
            ) }
        </>
    );
}

export default ResumenPedido;