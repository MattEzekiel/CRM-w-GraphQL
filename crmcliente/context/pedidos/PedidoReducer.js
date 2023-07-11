import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTO,
    ACTUALIZAR_TOTAL,
} from "../../types";

// eslint-disable-next-line import/no-anonymous-default-export
export default ( state, action ) => {
    switch (action.type) {
        case SELECCIONAR_CLIENTE:
            return {
                ...state,
                cliente: action.payload,
            }
        case SELECCIONAR_PRODUCTO:
            return {
                ...state,
                productos: action.payload,
            }
        case CANTIDAD_PRODUCTO:
            return {
                ...state,
                productos: state.productos.map(producto => producto.id === action.payload.id ? producto = action.payload : producto)
            }
        case ACTUALIZAR_TOTAL:
            return {
                ...state,
                total: state.productos.reduce((nuevoTotal, articulo) => nuevoTotal += articulo.precio * articulo.cantidad, 0),
            }
        default:
            return state;
    }
};