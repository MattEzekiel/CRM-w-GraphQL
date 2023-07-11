import {useContext} from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

function Total() {
    const pedidoContext = useContext(PedidoContext)
    const { total } = pedidoContext;

    return (
        <div className={"flex items-center mt-10 justify-between bg-white p-3 shadow-md"}>
            <h2 className={"text-gray-800 text-lg font-medium"}>Total a pagar:</h2>
            <p className={"text-gray-800 mt-0 font-bold"}>$ {total}</p>
        </div>
    );
}

export default Total;